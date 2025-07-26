// rollup.config.js
const replace = require('@rollup/plugin-replace');
const dotenv  = require('dotenv');

dotenv.config(); // loads OPENAI_API_KEY

module.exports = {
  input: 'ui.js',
  output: {
    file: 'dist/ui.bundle.js',
    format: 'iife',
    name: 'UiPlugin'
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY)
    })
  ]
};
