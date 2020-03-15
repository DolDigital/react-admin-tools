# ra-ckeditor-adv-input
### A react-admin (>=3.0.0) WYSIWYG editor using CKeditor 5 & Monaco Editor for HTML code editing

## Installation
This package requires an SVG loader so setup your environment accordingly.
If you use CRA this package comes with a bundles configuration for @craco/craco

```
yarn add @doldigital/ra-ckeditor-adv-input
```

**Install craco**

```yarn add @craco/craco```

**Create craco.config.js in CRA root**
```
const { enableCKEWebpackConfigPlugin } = require('@doldigital/ra-ckeditor-adv-input/lib/craco.config')
module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      return enableCKEWebpackConfigPlugin(webpackConfig, { env, paths });
    }
  }
};
```

**Alter package.json to use craco instead of react-scripts**
```
...
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  },
...
```

## Utilization
```
import React from 'react'
import { Edit, SimpleForm } from 'react-admin'
import AdvancedInput from '@doldigital/ra-ckeditor-adv-input'

export const PostEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <AdvancedInput source="Content" />
      // ...other fields
    </SimpleForm>
  </Edit>
)
```