module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:perfectionist/recommended-natural',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports', 'perfectionist'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        selector: 'variableLike',
      },
      {
        format: ['PascalCase'],
        selector: ['typeLike', 'enumMember'],
      },
      {
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        selector: 'typeProperty',
        trailingUnderscore: 'allow',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    curly: 'error',
    // 아래 자동정렬은 런타임 동작에 영향을 줄 수 있는 것들이에요.
    'perfectionist/sort-enums': 'off',
    'perfectionist/sort-objects': 'off',
    'perfectionist/sort-maps': 'off',
    'perfectionist/sort-objects': 'off',
    'perfectionist/sort-imports': [
      'error',
      {
        groups: [
          'type',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
        ],
        'custom-groups': {
          value: {},
          type: {},
        },
        'newlines-between': 'always',
        'internal-pattern': ['~/**', '@/**'],
      },
    ],
    // perfectionist의 sorting과 겹칠 수 있어서 off해요.
    'sort-imports': 'off',
    'object-shorthand': ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
  settings: {
    'import/external-module-folders': ['node_modules'],
    'import/resolver': {},
  },
};
