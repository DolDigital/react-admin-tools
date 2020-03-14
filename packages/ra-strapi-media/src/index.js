import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import TablePagination from '@material-ui/core/TablePagination'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import DescriptionIcon from '@material-ui/icons/Description'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { useGetList, useDataProvider, useInput } from 'react-admin'
import { useDropzone } from 'react-dropzone'

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    width: '80vw',
    maxHeight: '80vh',
    left: '10vw',
    top: '10vh',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const MediaGallery = props => {
  const {
    options: { inputProps: inputPropsOptions, ...options } = {},
    accept,
    maxSize,
    minSize,
    multiple,
    input,
    closeMediaLibrary
  } = props
  const [pagination, setPagination] = useState((({ page = 1, perPage = 15 }) => ({ page, perPage }))(props))
  const [sort, setSort] = useState((({ field = 'created_at', order = 'DESC' }) => ({ field, order }))(props))
  const { data, total, ids, loading, error } = useGetList('upload/files', pagination, sort)
  const [deleteDialog, setDeleteDialog] = useState(false)

  const dataProvider = useDataProvider()

  const selected = input.value ? (Array.isArray(input.value) ? input.value : [input.value]) : [];

  const onSelect = media => {
    if (!multiple) {
      selected.push(media)
      input.onChange(media)

      return
    }
    if (selected.filter(item => item.id === media.id).length) {
      input.onChange(selected.filter(item => item.id !== media.id))
    } else {
      input.onChange([...selected, media])
    }
  }

  const handleDelete = media => {
    setDeleteDialog(media)
  }

  const proceedWithDelete = media => {
    dataProvider.delete('upload/files', { id: media.id }).then(r => {
      if (!multiple) {
        if (selected.filter(item => item.id === media.id).length === 1) {
          input.onChange(null)
        }
      } else {
        input.onChange(selected.filter(item => item.id !== media.id))
      }
      setDeleteDialog(false)
      setPagination({ ...pagination, rnd: Math.random() })
    })
  }

  const onDrop = (newFiles, rejectedFiles, event) => {
    dataProvider._strapiUpload(newFiles).then(r => setPagination({ ...pagination, rnd: Math.random() }))
  };

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    accept,
    maxSize,
    minSize,
    multiple,
    onDrop,
  });

  if (loading) { return <div>Loading</div>; }
  if (error) { return <p>ERROR</p>; }
  return (
    <>
      {deleteDialog && <Dialog
        open={deleteDialog !== false}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title">
          Delete media
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you shure you want to delete "{deleteDialog.name}"?<br />
            The action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => proceedWithDelete(deleteDialog)} color="primary">
            CONFIRM DELETION
          </Button>
        </DialogActions>
      </Dialog>}
      <GridList cellHeight={160} cols={5}>
        {ids.map(key => {
          const tile = data[key]
          return (
            <GridListTile key={tile.id} cols={tile.cols || 1}>
              {/image(.*)/.exec(tile.mime) ? <img src={tile.url} alt={tile.name} />
                :
                <DescriptionIcon />
              }
              <GridListTileBar
                title={<>
                  <Checkbox
                    checked={selected.filter(item => item.id === tile.id).length === 1}
                    onChange={() => onSelect(tile)}
                    color="primary"
                  />
                  {tile.name}</>}
                subtitle={<span>type: {tile.mime}, size: {tile.size} KB</span>}
                actionIcon={
                  <IconButton aria-label={`delete ${tile.name}`} onClick={() => handleDelete(tile)}>
                    <DeleteForeverIcon color="secondary" />
                  </IconButton>
                }
              />
            </GridListTile>
          )
        })}
      </GridList>
      {total && <TablePagination
        rowsPerPageOptions={[15]}
        component="div"
        count={total}
        rowsPerPage={pagination.perPage}
        page={pagination.page - 1 || 0}
        onChangePage={(event, newPage) => setPagination({ ...pagination, page: newPage + 1 })}
      />}
      <div
        data-testid="dropzone"
        style={{ border: '3px dashed #ccc', padding: '2em', textAlign: 'center' }}
        {...getRootProps()}
      >
        <input
          {...getInputProps({
            ...inputPropsOptions,
          })}
        />
        Upload new files by clicking or dropping here.
      </div>
      <Button onClick={() => closeMediaLibrary()}>Close</Button>
    </>
  )
}

const MediaListItem = props => {
  const { item, input } = props
  const isSingle = !Array.isArray(input.value)
  const handleRemove = () => {
    if (isSingle) {
      input.onChange(null)
    } else {
      input.onChange(input.value.filter(d => d.id !== item.id))
    }
  }
  return <ListItem button>
    <ListItemIcon>
      <HighlightOffIcon onClick={() => handleRemove()} />
    </ListItemIcon>
    <ListItemText primary={<>{item.name}{/image(.*)/.exec(item.mime) ? <img src={item.url} alt={item.name} style={{ width: '2em' }} /> : null}</>} />
  </ListItem>
}

const StrapiMediaInput = props => {
  const { multiple = false } = props
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  const { input } = useInput({ ...props })
  let value
  if (multiple) {
    value = input.value ? Array.isArray(input.value) ? input.value : [input.value] : []
  } else {
    value = input.value || false
  }

  return (
    <>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Paper className={classes.modal}>
          <h2 id="simple-modal-title">Strapi Media</h2>
          {open && <MediaGallery input={input} multiple={multiple} closeMediaLibrary={() => setOpen(false)} />}
        </Paper>
      </Modal>
      <List component="nav">
        {
          multiple && value.map(media => <MediaListItem key={media.id} item={media} input={input} />)
        }
        {
          !multiple && value ? <MediaListItem item={value} input={input} /> : null
        }
      </List>
      <Button onClick={() => setOpen(true)}>Media Library</Button>
    </>
  )
}

export default StrapiMediaInput