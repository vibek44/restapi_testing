import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylisticJs from '@stylistic/eslint-plugin'

export default defineConfig([
  js.configs.recommended,
  { files: ['**/*.{js,mjs,cjs}'],
    plugins: { js,
      '@stylistic/js':stylisticJs 
    }, 
    extends: ['js/recommended'], 
    languageOptions: { 
      sourceType:'commonjs',
      globals:{ ...globals.node },
      ecmaVersion:'latest', 
    },
    rules:{
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq:'error',
      'no-trailing-spaces':'error',
      'object-curly-spacing':['error','always'],
      'arrow-spacing':['error', { before:true, after:true }],
      'no-console':'off'
    }
  },
  {
    ignores:['dist/**','play.js'],
  },
 
]);
