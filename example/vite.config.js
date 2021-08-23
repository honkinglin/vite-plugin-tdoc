import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import vitePluginTdoc from '../dist/vite-plugin-tdoc.esm';
import { transformSync } from '@babel/core';
import markdownItContainer from 'markdown-it-container';

let demoImports = {};
let demoCodeImports = {};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    vitePluginTdoc({
      mdClassPrefix: 'x', 
      // plugins: [],
      markdownItSetup(md) {
        md.use(markdownItContainer, 'demo', {
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
      },
      transforms: {
        before(source) {
          demoImports = {};
          demoCodeImports = {};
    
          source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (demoStr, relativeDemoPath) => {
            const demoPathOnlyLetters = relativeDemoPath.replace(/[^a-zA-Z\d]/g, '');
            const demoDefName = `Demo${demoPathOnlyLetters}`;
            const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
            demoImports[demoDefName] = `import ${demoDefName} from './${relativeDemoPath}.jsx';`;
            demoCodeImports[demoCodeDefName] = `import ${demoCodeDefName} from './${relativeDemoPath}.jsx?raw';`;
          });
    
          return source;
        },
        after(source, _id, _renderInfo, _md) {
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
                  <div name="DEMO">${source.replace(/class=/g, 'className=')}</div>
                )
              }
            `;
          const result = transformSync(reactSource, {
            babelrc: false,
            configFile: false,
            sourceMaps: true,
            generatorOpts: {
              decoratorsBeforeExport: true,
            },
            presets: [require('@babel/preset-react')],
          });
    
          return { code: result.code, map: result.map };
        },
      }
    })
  ]
})
