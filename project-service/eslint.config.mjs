import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import promisePlugin from 'eslint-plugin-promise';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import importPlugin from 'eslint-plugin-import';
import simpleSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      'simple-import-sort': simpleSortPlugin,
      'sort-destructure-keys': sortDestructureKeys,
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: ['**/dist'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      ...promisePlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      'import/no-unresolved': 'off',
      'import/no-cycle': ['error', { maxDepth: Infinity }],
      'import/order': 'off',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'error',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'sort-destructure-keys/sort-destructure-keys': 'error',

      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/sort-type-constituents': 'error',
      'arrow-body-style': 'error',
      'prefer-spread': 'error',
      'prefer-arrow-callback': 'error',
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts', 'test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);

