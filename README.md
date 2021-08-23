# vite-plugin-tdoc

Transform markdown into anything for vite plugin

## Getting started

```js
// vite config
import vitePluginTdoc from 'vite-plugin-tdoc';

export default {
  plugins: [
    vitePluginTdoc({
      // useCustomMdPlugin: false, // default false
      mdClassPrefix: 'x', // markdown-it-anchor class prefix
      plugins: [], // other plugins
      customRenderInfo(source, md) {
        // return { content: '' }
      },
      markdownItSetup(md) {
        // md.use...
      },
      transforms: {
        before(_source, _id) {},
        after(_source, _id, _renderInfo, _md) {
          // _renderInfo is from customRenderInfo api
        }
      }
    })
  ]
}
```

## License

[MIT](LICENSE).
