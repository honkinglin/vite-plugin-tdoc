import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginTdoc from '../dist/vite-plugin-tdoc.esm.js';
import { transformSync } from '@babel/core';
import matter from 'gray-matter';
import path from 'path'

let demoImports = {};
let demoCodeImports = {};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    open: '/',
    https: false,
  },
  plugins: [
    react(),
    vitePluginTdoc({
      markdown: {
        anchor: {
          tabIndex: false,
        },
        toc: {
          containerClass: `t-toc_container`,
          listClass: `t-toc_list`,
          itemClass: `t-toc_list_item`,
          linkClass: `t-toc_list_item_a`,
        },
        container(md, container) {
          md.use(container, 'demo', {
            validate(params) {
              return params.trim().match(/^demo\s+([\\/.\w-]+)(\s+(.+?))?(\s+--dev)?$/);
            },
            render(tokens, idx) {
              if (tokens[idx].nesting === 1) {
                const match = tokens[idx].info.trim().match(/^demo\s+([\\/.\w-]+)(\s+(.+?))?(\s+--dev)?$/);
                const [, demoPath, componentName = ''] = match;
                const demoPathOnlyLetters = demoPath.replace(/[^a-zA-Z\d]/g, '');
                const demoName = path.basename(demoPath).trim();
                const demoDefName = `Demo${demoPathOnlyLetters}`;
                const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
        
                const tpl = `
                  <div>
                    <${demoDefName} />
                    <code>{${demoCodeDefName}}</code>
                  </div>
                `;
        
                tokens.tttpl = tpl;
        
                return `<div className="${componentName.trim()}-${demoName}">`;
              }
              if (tokens.tttpl) return `${tokens.tttpl || ''}</div>`;
        
              return '';
            },
          })
        }
      },
      transforms: {
        before({ source, file, md}) {
          demoImports = {};
          demoCodeImports = {};
    
          source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (demoStr, relativeDemoPath) => {
            const demoPathOnlyLetters = relativeDemoPath.replace(/[^a-zA-Z\d]/g, '');
            const demoDefName = `Demo${demoPathOnlyLetters}`;
            const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
            demoImports[demoDefName] = `import ${demoDefName} from './${relativeDemoPath}.jsx';`;
            demoCodeImports[demoCodeDefName] = `import ${demoCodeDefName} from './${relativeDemoPath}.jsx?raw';`;
          });

          const { content, data: pageData } = matter(source);
          console.log('pageData', pageData)
    
          return content;
        },
        after({ result, file, source, md }) {
          const demoDefsStr = Object.keys(demoImports)
            .map((key) => demoImports[key])
            .join('\n');
          const demoCodesStr = Object.keys(demoCodeImports)
            .map((key) => demoCodeImports[key])
            .join('\n');
    
          const reactSource = `
              import React, { useEffect, useRef, useState } from 'react';\n
              ${demoDefsStr}
              ${demoCodesStr}
    
              export default function Doc(props) {

                return (
                  <div name="DEMO">${result.html.replace(/class=/g, 'className=')}</div>
                )
              }
            `;
          const reactResult = transformSync(reactSource, {
            babelrc: false,
            configFile: false,
            sourceMaps: true,
            generatorOpts: {
              decoratorsBeforeExport: true,
            },
            presets: [require('@babel/preset-react')],
          });
    
          return { code: reactResult.code, map: reactResult.map };
        },
      }
    })
  ]
})
