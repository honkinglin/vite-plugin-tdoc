import MarkdownIt from 'markdown-it';
import installMarkdownPlugins from './plugins';

export function createMarkdown(options) {
  const md = new MarkdownIt({ html: true, ...options.markdownItOptions });

  // 不使用默认 plugin
  if (!options.useCustomMdPlugin) {
    installMarkdownPlugins(md, options);
  }
  options.markdownItSetup(md, options);

  return (raw, id) => {
    let renderInfo = {};
    const { transforms, customRenderInfo } = options;

    if (transforms.before) raw = transforms.before(raw, id);

    // 自定义解析数据 after 钩子上使用
    if (customRenderInfo) renderInfo = customRenderInfo(raw, id, md);

    let html = md.render(`\${toc}\r\n${raw}`);

    if (transforms.after) html = transforms.after(html, id, renderInfo, md);

    return html;
  };
}
