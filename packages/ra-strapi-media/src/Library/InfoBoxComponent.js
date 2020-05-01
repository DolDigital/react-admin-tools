import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDataProvider } from 'react-admin'

import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import SaveIcon from '@material-ui/icons/Save'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ImageCropper from './ImageCropper'
import DeleteDialog from './DeleteDialog'
import CopyDialog from './CopyDialog'

const useStyles = makeStyles(theme => ({
  formControlWrapper: {
    padding: `${theme.spacing(1, 2, 1, 2)} !important`
  },
  viewWrapper: {
    // backgroundColor: 'green',
    width: '100%',
    height: '100%'
  },
  headerBox: {
    paddingBottom: `${theme.spacing(2)}px !important`
  },
  contentBox: {
    flexGrow: 1
  },
  previewBox: {
    flexGrow: 1,
    //paddingRight: `${theme.spacing(2)}px !important`,
    flex: '50%',
    [theme.breakpoints.down('sm')]: {
      flex: '100%'
    }
  },
  detailBox: {
    flexGrow: 1,
    //paddingLeft: `${theme.spacing(2)}px !important`,
    overflow: 'scroll',
    flex: '50%',
    [theme.breakpoints.down('sm')]: {
      flex: '100%'
    }
  },
  reactCrop: {
    maxHeight: '50vh',
    border: '1px solid #ccc',
    display: 'inline-table'
  },
  cropWrapper: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#eee'
  },
  actionsWrapper: {
    padding: `${theme.spacing(2, 3, 2, 3)} !important`,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#eee'
  },
  deleteButton: {
    color: theme.palette.error.main,
    marginRight: `${theme.spacing(2)}px !important`
  }
}))

const InfoBoxComponent = props => {
  const { item = false, onClose = null, onCrop = null, onDelete = null } = props
  const isOpen = item && typeof item === 'object'
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [copyDialog, setCopyDialog] = useState(false)
  const dataProvider = useDataProvider()

  const classes = useStyles()

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

      <Box display="flex" flexDirection="column" className={classes.viewWrapper}>
        <Box className={classes.headerBox} display="flex" flexDirection="row">
          {/* <Typography variant="h4">Media information</Typography> */}
          <Box flexGrow={1}>
            <Button onClick={handleClose} startIcon={<ArrowBackIosIcon />} variant="outlined">back</Button>
          </Box>
          <Box flexGrow={1} justifyContent="flex-end" display="flex">
            <Button onClick={() => setDeleteDialog(item)} className={classes.deleteButton} startIcon={<DeleteForeverIcon />}>delete</Button>
            <Button onClick={handleClose} variant="contained" color="primary" startIcon={<SaveIcon />}>save</Button>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" flexWrap="wrap" className={classes.contentBox} >
          <Box className={classes.previewBox}>
            <ImageCropper
              image={item}
              onChange={handleCrop}
              className={classes.reactCrop}
              imageStyle={{
                maxHeight: '50vh',
                width: 'auto'
              }}
              wrapperProps={{
                className: classes.cropWrapper
              }}
              actionProps={{
                className: classes.actionsWrapper
              }}
              cropButtonProps={{
                variant: 'contained',
                color: 'primary'
              }}
              />
          </Box>
          <Box className={classes.detailBox}>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Title" variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Alternative text" variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Caption" variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Tags" variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Name" value={item.name} disabled variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="URL" value={item.url} disabled variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="MIME" value={item.mime} disabled variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Size" value={item.size} disabled variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Created at" value={item.created_at} disabled variant="outlined" />
              </FormControl>
            </Box>
            <Box className={classes.formControlWrapper}>
              <FormControl fullWidth>
                <TextField label="Updated at" value={item.updated_at} disabled variant="outlined" />
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Media information</Typography>
          <Button onClick={handleClose} startIcon={<ArrowBackIosIcon />} variant="outlined">back</Button>
        </Grid>
        <Grid item md={6}>
          <ImageCropper image={item} onChange={handleCrop} />
        </Grid>
        <Grid item md={6}>
          <Box xs={12}>
            <FormControl fullWidth className={classes.formControl}>
              <TextField label="Name" value={item.name} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <TextField label="URL" value={item.url} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <TextField label="MIME" value={item.mime} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <TextField label="Size" value={item.size} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <TextField label="Created at" value={item.created_at} disabled variant="outlined" />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <TextField label="Updated at" value={item.updated_at} disabled variant="outlined" />
            </FormControl>
          </Box>
          <Box xs={12}>
            <Button onClick={() => setDeleteDialog(item)} variant="contained" startIcon={<DeleteForeverIcon />}>delete</Button>
          </Box>
        </Grid>
      </Grid> */}
    </>
  )
}

InfoBoxComponent.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]).isRequired,
  onClose: PropTypes.func,
  onCrop: PropTypes.func,
  onDelete: PropTypes.func
}

InfoBoxComponent.defaultProps = {
  onClose: null,
  onCrop: null,
  onDelete: null
}

export default InfoBoxComponent