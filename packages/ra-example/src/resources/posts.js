import React from 'react'
import { List, Datagrid, TextField, DateField, Edit, SimpleForm, TextInput, DateInput } from 'react-admin'
import AdvancedInput from '@doldigital/ra-ckeditor-adv-input'
import StrapiMediaInput from '@doldigital/ra-strapi-media'

export const PostList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="Title" />
      <TextField source="Excerpt" />
      <TextField source="Content" />
      <TextField source="Slug" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
)

export const PostEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="Slug" />
      <DateInput source="created_at" />
      <DateInput source="updated_at" />
      <TextInput source="Title" fullWidth />
      <TextInput source="Excerpt" fullWidth />
      <AdvancedInput source="Content" />
      <StrapiMediaInput multiple={false} source="Thumbnail" fullWidth />
      <StrapiMediaInput multiple={true} source="Images" fullWidth />
    </SimpleForm>
  </Edit>
)