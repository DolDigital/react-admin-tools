# ra-data-strapi3
### A react-admin (>=3.0.0) data & auth provider for the Strapi headless CMS.

## Installation:
```
yarn add @doldigital/ra-data-strapi3
```

## Configuration:
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