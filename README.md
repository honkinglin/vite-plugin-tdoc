# vite-plugin-tdoc

Transform markdown into anything for vite plugin

## Getting started

```js
// vite config
import vitePluginTdoc from 'vite-plugin-tdoc';

export default {
  plugins: [
    vitePluginTdoc({
      markdown: {
        container(md, container) {},  // markdown-it-container
        attrs: {}, // markdown-it-attrs
        anchor: {}, // markdown-it-anchor
        toc: {}, // markdown-it-toc-done-right
        config(md) {}, // custom md config
        lineNumbers: false, // highlight lineNumber
      },
      plugins: [], // other plugins for vite
      transforms: { // markdown transform progress
        before({ source, file, md }) {}, // before transform
        render({ source, file, md }) {}, // custom render or use default render
        after({ result, source, file, md }) {} // after render or default render
      }
    })
  ]
}
```

## License

[MIT](LICENSE).
