import MarkdownIt from "markdown-it";
import { parseHeader } from "../utils/parseHeader";
import { highlight } from "./plugins/highlight";
import { slugify } from "./plugins/slugify";
import { highlightLinePlugin } from "./plugins/highlightLines";
import { lineNumberPlugin } from "./plugins/lineNumbers";
import { componentPlugin } from "./plugins/component";
import { containerPlugin } from "./plugins/containers";
import { snippetPlugin } from "./plugins/snippet";
import { hoistPlugin } from "./plugins/hoist";
import { preWrapperPlugin } from "./plugins/preWrapper";
import { linkPlugin } from "./plugins/link";
import { extractHeaderPlugin } from "./plugins/header";
import anchor from "markdown-it-anchor";
import attrs from "markdown-it-attrs";
import emoji from "markdown-it-emoji";
import toc from "markdown-it-toc-done-right";

export const createMarkdownRenderer = (options) => {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    highlight,
    ...options,
  });

  // custom plugins
  md.use(componentPlugin)
    .use(highlightLinePlugin)
    .use(preWrapperPlugin)
    .use(snippetPlugin)
    .use(hoistPlugin)
    .use(containerPlugin, options.container)
    .use(extractHeaderPlugin)
    .use(linkPlugin, {
      target: "_blank",
      rel: "noopener noreferrer",
      ...options.externalLinks,
    })
    // 3rd party plugins
    .use(attrs, options.attrs)
    .use(anchor, {
      slugify,
      permalink: anchor.permalink.ariaHidden({}),
      ...(options.anchor || {}),
      ...(options.anchor ? (options.anchor.config ? options.anchor.config(anchor) : {}) : {}),
    })
    .use(toc, {
      slugify,
      level: [2, 3],
      format: parseHeader,
      ...options.toc,
    })
    .use(emoji);

  // apply user config
  if (options.config) {
    options.config(md);
  }

  if (options.lineNumbers) {
    md.use(lineNumberPlugin);
  }

  // wrap render so that we can return both the html and extracted data.
  const render = md.render;
  const wrappedRender = (src) => {
    md.__data = {};
    const html = render.call(md, src);
    return {
      html,
      data: md.__data,
    };
  };
  md.render = wrappedRender;

  return md;
};
