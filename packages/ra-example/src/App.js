import React from 'react'
import { Admin, Resource } from 'react-admin'
import { buildDataProvider, buildAuthProvider } from '@doldigital/ra-data-strapi3'

import { PostList, PostEdit } from './resources/posts'

const apiUrl = 'http://localhost:1337'

const adminProps = {
  dataProvider: buildDataProvider(apiUrl),
  authProvider: buildAuthProvider(apiUrl)
}

const App = props => {
  return (
    <Admin {...adminProps}>
      <Resource name="posts" list={PostList} edit={PostEdit} />
    </Admin>
  );
}

export default App;
