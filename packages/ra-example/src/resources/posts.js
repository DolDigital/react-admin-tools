import React from 'react'
import { List, Datagrid, TextField, DateField, Edit, SimpleForm, TextInput, DateInput } from 'react-admin'

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
      <TextInput source="Content" fullWidth />
    </SimpleForm>
  </Edit>
)