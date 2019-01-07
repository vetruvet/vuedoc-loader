# VueDoc Loader

This is a webpack loader for @vudeoc/parser.

**Why?**
Typically you would not want VueDoc output in your output bundle.
*However*, if your documentation is a living project, like Storybook.js output,
it may be useful to use VueDoc output in your code to generate some useful docs.

## Installation

` $ npm install --save-dev vuedoc-loader`

We will not be adding the loader to webpack's resolve config
because we still want to preserve the actual loading of `.vue` files.

## Usage

`.vue` files are loaded as normal.
When you want VueDoc output for a `.vue` file, prepend `!!vuedoc-loader!` to the import.

Example:

```js
// component as usual
import Btn from './components/Btn.vue';

// vuedoc output
import BtnDocs from '!!vuedoc-loader!./components/Btn.vue';

// require() style
const BtnDocs = require('!!vuedoc-loader!./components/Btn.vue');
```
