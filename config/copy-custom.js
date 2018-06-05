// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = {
  copyAssets: {
    src: ['{{SRC}}/assets/**/*'],
    dest: '{{WWW}}/assets'
  },
  copyIndexContent: {
    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
    dest: '{{WWW}}'
  },
  copyFonts: {
    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyPolyfills: {
    src: [`{{ROOT}}/node_modules/ionic-angular/polyfills/${process.env.IONIC_POLYFILL_FILE_NAME}`],
    dest: '{{BUILD}}'
  },
  copySwToolbox: {
    src: ['{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js'],
    dest: '{{BUILD}}'
  },
  copyPrimeng: {
    src: ['{{ROOT}}/node_modules/primeng/resources/themes/omega/theme.css', '{{ROOT}}/node_modules/primeng/resources/primeng.min.css', '{{ROOT}}/node_modules/font-awesome/css/font-awesome.min.css'],
    dest: '{{BUILD}}/assets/css'
  },
  copyFontAwesome: {
    src: ["{{ROOT}}/node_modules/font-awesome/fonts/**/*"],
    dest: "{{BUILD}}/assets/fonts"
  },
  copyFroalaEditorCss: {
    src: ['{{ROOT}}/node_modules/froala-editor/css/froala_editor.pkgd.min.css', '{{ROOT}}/node_modules/froala-editor/css/froala_style.min.css'],
    dest: '{{BUILD}}'
  },
  copyFontAwesome1: {
    src: '{{ROOT}}/node_modules/font-awesome/css/font-awesome.min.css',
    dest: '{{BUILD}}'
  },
  copyFontsAwesomeFonts: {
    src: '{{ROOT}}/node_modules/font-awesome/fonts/*',
    dest: '{{WWW}}/fonts'
  }
}
