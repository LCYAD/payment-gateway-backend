module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "indent": ["error", 4],
        "comma-dangle": ["error", "never"],
        "camelcase": [0, {"properties": "never"}],
        "arrow-body-style": ["error", "always"],
        "no-await-in-loop": [0, "never"],
        "no-restricted-syntax": ["error", "never"]
    }
};