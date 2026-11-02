import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.agents', '.claude', 'backups', 'design-reference', 'logs', 'temp-visuals', 'generated', 'read-*']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // scripts Node (sync, captures, QA) : globals Node
    files: ['scripts/**/*.{js,mjs}', '*.config.js'],
    languageOptions: { globals: globals.node },
    // code mort hérité dans les scripts de sync (interdits de modification) : signalé, pas bloquant
    rules: { 'no-unused-vars': 'warn', 'no-empty': 'warn' },
  },
])
