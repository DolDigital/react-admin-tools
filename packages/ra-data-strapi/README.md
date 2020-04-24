# @doldigital/ra-data-strapi3
### A react-admin data provider for strapi using REST endpoints

## Installation
``` yarn add @doldigital/ra-data-strapi ```

Then configure the data provider by passing the apiUrl parameter

```
import React from 'react'
import { Admin, Resource } from 'react-admin'
import { buildDataProvider } from '@doldigital/ra-data-strapi3'

const apiUrl = 'http://localhost:1337'

const adminProps = {
  dataProvider: buildDataProvider(apiUrl)
}

const App = props => {
  return (
    <Admin {...adminProps}>
      // your resources here
    </Admin>
  );
}

export default App;
```

## Using the auth provider
You can use the Strapi authentication as the auth provider for react-admin

```
import React from 'react'
import { Admin, Resource } from 'react-admin'
import { buildDataProvider, buildAuthProvider } from '@doldigital/ra-data-strapi3'

const apiUrl = 'http://localhost:1337'

const adminProps = {
  dataProvider: buildDataProvider(apiUrl),
  authProvider: buildAuthProvider(apiUrl)
}

const App = props => {
  return (
    <Admin {...adminProps}>
      // your resources here
    </Admin>
  );
}

export default App;
```