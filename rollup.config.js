import { readFileSync } from 'node:fs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

/**
 * A banner naming the version, on every artefact.
 *
 * Without it a built file is anonymous: handed `domma-celebrate.min.js` there
 * is no way to tell which release it is, and a stale `dist/` looks exactly like
 * a fresh one. terser's `comments: 'some'` keeps a bang-comment through
 * minification. `scripts/verify-dist.mjs` asserts it matches package.json,
 * which is what turns the banner from a nicety into a check.
 */
const banner =
  `/*! domma-celebrate v${version} | MPL-2.0 | https://github.com/pinpointzero73/domma-celebrate */`;

const substituteVersion = () => replace({
  preventAssignment: true,
  values: { __VERSION__: JSON.stringify(version) }
});

/**
 * Two shapes, because the eight themes are 420 KB of source and how they are
 * delivered is the whole question.
 *
 *   - **ESM, code-split.** Each theme becomes its own chunk, fetched only when
 *     that celebration is actually in season. A visitor in July downloads the
 *     engine and nothing else. This is what a bundler and Domma's layout system
 *     both consume.
 *   - **UMD, everything inlined.** One `<script>` tag, no module support
 *     needed, no second request. Bigger, and deliberately so: a plain site that
 *     wants this working in one line should not have to think about chunk
 *     paths or CORS.
 *
 * `inlineDynamicImports` is what makes the second possible - UMD has no way to
 * express a code split, so the dynamic imports collapse into the bundle and the
 * `await` in front of them simply resolves immediately.
 */
export default [
  {
    input: 'src/index.js',
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: 'domma-celebrate.esm.js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      banner,
      // Minified like the UMD build, because this artefact is served straight
      // to browsers as often as it is handed to a bundler - Domma's layout
      // system imports it by URL, and so does any `<script type="module">`
      // site. A bundler that would rather minify it itself loses nothing; the
      // readable code is `src/`, one click away on GitHub.
      plugins: [terser({ format: { comments: 'some' } })]
    },
    plugins: [substituteVersion()]
  },
  {
    input: 'src/index.js',
    output: [
      {
        // Browser <script> - defines window.DommaCelebrate.
        file: 'dist/domma-celebrate.min.js',
        format: 'umd',
        name: 'DommaCelebrate',
        exports: 'named',
        inlineDynamicImports: true,
        banner,
        plugins: [terser({ format: { comments: 'some' } })]
      },
      {
        // Node require(). The `.cjs` extension is load-bearing: this package
        // declares "type": "module", so a UMD bundle named `.js` would be
        // parsed as ESM, find no `export` statements, and hand every CommonJS
        // consumer an empty namespace object instead of throwing.
        file: 'dist/domma-celebrate.cjs',
        format: 'umd',
        name: 'DommaCelebrate',
        exports: 'named',
        inlineDynamicImports: true,
        banner,
        plugins: [terser({ format: { comments: 'some' } })]
      }
    ],
    plugins: [substituteVersion()]
  }
];
