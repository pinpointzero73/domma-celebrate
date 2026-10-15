"""Build bundled Latin glyph outlines. Requires fonttools 4.60.1; no runtime dependency."""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen

ROOT = Path(__file__).resolve().parent.parent

def outlines(filename):
    font = TTFont(ROOT / 'assets/fonts' / filename)
    glyphs = font.getGlyphSet()
    scale = font['OS/2'].sCapHeight or font['head'].unitsPerEm

    class Pen(BasePen):
        def __init__(self):
            super().__init__(glyphs)
            self.commands = []
            self.first = None

        def point(self, point):
            return [round(point[0] / scale, 5), round(1 - point[1] / scale, 5)]

        def _moveTo(self, point):
            self.first = point
            self.commands.append(['M', *self.point(point)])

        def _lineTo(self, point):
            self.commands.append(['L', *self.point(point)])

        def _curveToOne(self, a, b, point):
            self.commands.append(['C', *self.point(a), *self.point(b), *self.point(point)])

        def _qCurveToOne(self, control, point):
            start = self._getCurrentPoint()
            a = tuple(start[i] + (control[i] - start[i]) * 2 / 3 for i in (0, 1))
            b = tuple(point[i] + (control[i] - point[i]) * 2 / 3 for i in (0, 1))
            self._curveToOne(a, b, point)

        def _closePath(self):
            if self.first is not None:
                self._lineTo(self.first)

    def glyph(name):
        pen = Pen()
        glyphs[name].draw(pen)
        return {'advance': round(font['hmtx'][name][0] / scale, 5), 'commands': pen.commands}

    # Latin, extended Latin, typographic punctuation and common currency signs.
    cmap = font.getBestCmap()
    selected = {chr(code): glyph(name) for code, name in cmap.items()
                if 32 <= code <= 591 or 0x2000 <= code <= 0x206F or 0x20A0 <= code <= 0x20CF}
    return {'glyphs': selected, 'fallback': glyph('.notdef')}

lines = ['// Built by scripts/build-sparkler-fonts.py. Font outlines remain under SIL OFL 1.1.',
         '// Copyright: Allura and ABeeZee Project Authors. See assets/fonts/*-OFL.txt.']
for export, filename in [('CURSIVE_FONT', 'Allura-Regular.ttf'), ('STROKE_FONT', 'ABeeZee-Regular.ttf')]:
    data = outlines(filename)
    lines.append(f'export const {export} = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';')
    print(f'{export}: {len(data["glyphs"])} glyphs')
(ROOT / 'src/themes/sparkler-font-data.js').write_text('\n'.join(lines) + '\n')
