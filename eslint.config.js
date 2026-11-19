import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['node_modules', 'dist']
  },
  {
    files: ['src/**/*.vue', 'src/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      parser: await import('vue-eslint-parser')
    },
    plugins: {
      vue
    },
    rules: {
      ...vue.configs['vue3-strongly-recommended'].rules,
      'vue/html-indent': ['error', 2],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'n/handle-callback-err': 'off',
      'no-useless-escape': 'off',
      'prefer-regex-literals': 'off',
      ...prettier.rules
    }
  }
]
