import { mergeOptions } from './utils';
import { createMarkdown } from './markdown';

function markdownPlugin(userOptions = {}) {
  const options = mergeOptions(userOptions);
  const mdRender = createMarkdown(options);

  return {
    name: 'vite-plugin-tdoc',
    enforce: 'pre',

    transform(raw, id) {
      if (!id.endsWith('.md')) return null;
      return mdRender(raw, id);
    },
  };
}

export default function vitePluginTdoc(options) {
	const { plugins = [] } = options;

	return [...plugins, markdownPlugin(options)];
}