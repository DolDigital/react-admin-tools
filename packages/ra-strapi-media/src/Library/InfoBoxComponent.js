import React, { useState } from 'react'
import { useDataProvider } from 'react-admin'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ImageCropper from './ImageCropper'
import DeleteDialog from './DeleteDialog'
import CopyDialog from './CopyDialog'

const InfoBoxComponent = props => {
  const { item = false, onClose = null, onCrop = null, onDelete = null } = props
  const isOpen = item !== false
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [copyDialog, setCopyDialog] = useState(false)
  const dataProvider = useDataProvider()

  if (!isOpen) return null

  const handleClose = () => {
    if (onClose) onClose()
  }

  const handleCrop = image => {
    if (onCrop) onCrop(image)
  }

  const handleDelete = media => {
    dataProvider.delete('upload/files', { id: media.id }).then(r => {
      setDeleteDialog(false)
      if (onDelete) onDelete(media)
    })
  }

  return (
    <>
      <CopyDialog
        isOpen={copyDialog !== false}
        onClose={() => setCopyDialog(false)}
      />
      <DeleteDialog
        item={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onCancel={() => setDeleteDialog(false)}
        onConfirm={() => handleDelete(deleteDialog)}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Media information</Typography>
          <Button onClick={handleClose} startIcon={<ArrowBackIosIcon />} variant="outlined">back</Button>
        </Grid>
        <Grid item md={6}>
          <ImageCropper image={item} onChange={handleCrop} />
        </Grid>
        <Grid item md={6}>
          <Box xs={12} pb={5}>
            <FormControl fullWidth>
              <TextField label="Name" value={item.name} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth>
              <TextField label="URL" value={item.url} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth>
              <TextField label="MIME" value={item.mime} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth>
              <TextField label="Size" value={item.size} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth>
              <TextField label="Created at" value={item.created_at} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth>
              <TextField label="Updated at" value={item.updated_at} disabled variant="outlined" />
            </FormControl>
          </Box>
          <Box xs={12}>
            <Button onClick={() => setDeleteDialog(item)} variant="contained" startIcon={<DeleteForeverIcon />}>delete</Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default InfoBoxComponent