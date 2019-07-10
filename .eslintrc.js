module.exports = {
  // 告诉 eslint 找当前配置文件不能往父级查找
  root: true,
  // 指定环境的全局变量
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    chrome: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  rules: {
    eqeqeq: ['error', 'always'],
    'spaced-comment': ['error', 'always']
  }
}
