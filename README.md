# React Admin Tools by DOL

React Admin Tools by DOL is a collection of packages made by DOL to add functionalities to the react-admin framework.

## Packages
### ra-data-strapi3
A react-admin (>=3.0.0) data & auth provider for the Strapi headless CMS.

**Installation**:
```
yarn add @doldigital/ra-data-strapi3
```

**Configuration**:
```
import React from 'react'
import { Admin, Resource } from 'react-admin'
import { buildDataProvider, buildAuthProvider } from '@doldigital/ra-data-strapi3'

const myStrapiUrl = 'http://localhost:1337'
const adminProps = {
  dataProvider: buildDataProvider(myStrapiUrl),
  authProvider: buildAuthProvider(myStrapiUrl)
}

const App = props => (
  <Admin {...adminProps}>
    // ....my resources
  </Admin>
)

export default App
```

Obviously you can use just the dataProvider if you don't need authentication.

### ra-ckeditor-adv-input
A react-admin (>=3.0.0) WYSIWYG editor using CKeditor 5 & Monaco Editor for HTML code editing

**Installation**:
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

**Utilization**:
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

## Developing
To install the development environment simply clone this repository.
In this repository you'll find a strapi test instance and a simple react-admin application.

1. Install dependencies using yarn
```
yarn
```
2. Start the strapi backend
```
yarn workspace strapi-backend develop
```
3. Start the example application
```
yarn workspace ra-example start
```
4. Start in watch mode the package you want to modify (eg: ra-data-strapi)
```
yarn workspace ra-data-strapi develop
```

