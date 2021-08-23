import uslug from 'uslug';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';

const uslugify = (s) => uslug(s);

export default function installMarkdownPlugins(md, options) {
  const { mdClassPrefix = '' } = options;

  const markdownItAnchorOps = {
    permalink: true,
    permalinkSymbol: '',
    permalinkClass: `${mdClassPrefix}-header-anchor`,
    slugify: uslugify,
  };
  const markdownItTocDoneRightOps = {
    level: [2, 3],
    containerClass: `${mdClassPrefix}-toc_container`,
    listClass: `${mdClassPrefix}-toc_list`,
    itemClass: `${mdClassPrefix}-toc_list_item`,
    linkClass: `${mdClassPrefix}-toc_list_item_a`,
    slugify: uslugify,
  };

  md.use(markdownItAnchor, markdownItAnchorOps)
    .use(markdownItTocDoneRight, markdownItTocDoneRightOps);

  // 全局替换渲染的 a 标签跳转新窗口
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {

    const aIndex = tokens[idx].attrIndex('target');
    const aHrefIndex = tokens[idx].attrIndex('href');

    // skip anchor
    const isAnchor = tokens[idx].attrs[aHrefIndex][1].indexOf('#') === 0;

    if (aIndex < 0) {
      !isAnchor && tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
      !isAnchor && (tokens[idx].attrs[aIndex][1] = '_blank'); // replace value of existing attr
    }

    // pass token to default renderer.
    return self.renderToken(tokens, idx, options, env, self);
  };
}
