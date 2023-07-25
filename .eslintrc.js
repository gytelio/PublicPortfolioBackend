module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "project": "./tsconfig.json",
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "no-empty": ["error", { "allowEmptyCatch": true }],
    "indent": [ "error", 2, { "SwitchCase": 1 } ],
    "linebreak-style": "off",
    "quotes": [ "error", "double" ],
    "semi": [ "error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
    "arrow-parens": ["error", "as-needed"],
    "eol-last": "error",
    "curly": "error",
    "allowDeclarations": "off",
    "no-unused-vars": "off",
    "no-constant-condition" : "warn",
    "max-statements-per-line": ["error", { "max": 1 }],
    "semi-spacing": ["error", {"before": false, "after": true}],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "array-bracket-spacing": ["error", "never"],
    "object-curly-spacing": ["error", "always", { "objectsInObjects": true }],
    "space-before-blocks": "error",
    "space-infix-ops": "error",
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "space-unary-ops": ["error", { "words": true, "nonwords": false }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "brace-style": ["error", "1tbs"],
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ],
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/member-delimiter-style": "error",
    "@typescript-eslint/no-non-null-assertion" : "off",
    "@typescript-eslint/no-base-to-string": "warn"
  }
}
