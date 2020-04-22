import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
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
import { fade, makeStyles } from '@material-ui/core/styles'
import { useGetList, useDataProvider, useInput, useQuery } from 'react-admin'
import { useDropzone } from 'react-dropzone'
import { getApiUrl } from '@doldigital/ra-data-strapi3'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import CircularProgress from '@material-ui/core/CircularProgress'

import Image from 'react-graceful-image'

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    overflow: 'hidden',
    width: '80vw',
    height: '90vh',
    left: '10vw',
    top: '5vh',
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
     boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
  },
  appBar: {
    position: 'absolute'
  },
  modalScroll: {
    overflow: 'scroll',
    height: '100%',
    paddingTop: '3.7em !important',
    paddingBottom: '4.2em !important'
    // height: '70vh'
  },
  footer: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  }
}));

const fixUploadUrl = media => {
  const apiUrl = getApiUrl()
  return {
    ...media,
    url: /(http:|https:)/.test(media.url) ? media.url : `${apiUrl}${media.url}`
  }
}

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
          const tile = fixUploadUrl(data[key])
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
  const media = fixUploadUrl(item)
  return <ListItem button>
    <ListItemIcon>
      <HighlightOffIcon onClick={() => handleRemove()} />
    </ListItemIcon>
    <ListItemText primary={<>{media.name}{/image(.*)/.exec(media.mime) ? <img src={media.url} alt={media.name} style={{ width: '2em' }} /> : null}</>} />
  </ListItem>
}

const LibraryComponent = props => {
  const [pagination, setPagination] = useState((({ page = 1, perPage = 10 }) => ({ page, perPage }))(props))
  const [sort, setSort] = useState((({ field = 'created_at', order = 'DESC' }) => ({ field, order }))(props))

  const payload = {
    pagination,
    sort
  }

  const { search = '', selected = [], onCheck = null } = props
  if(search !== '') {
    payload['filter'] = isNaN(search) ? { name: search } : { name_contains: search }
  }

  const { data, total, loading, error } = useQuery({
    type: 'getList',
    resource: 'upload/files',
    payload
  })

  const handleCheck = tile => event => {
    const { target: { checked } } = event
    if(onCheck) onCheck(tile, checked)
  }

  if (loading) return <Typography variant="h2"><CircularProgress /></Typography>
  if(error) return <Typography variant="h5">an error occurred.</Typography>

  return (
    <>
      <GridList cellHeight={160} cols={5} spacing={6}>
        {data.map(file => {
          const tile = fixUploadUrl(file)
          return (
            <GridListTile key={tile.id} cols={tile.cols || 1}>
              {/image(.*)/.exec(tile.mime) ? <Image
                src={tile.url}
                alt={tile.name}
                width="100%"
                />
                :
                <DescriptionIcon />
              }
              <GridListTileBar
                title={<>
                  <Checkbox
                    checked={selected.filter(item => item.id === tile.id).length === 1}
                    //onChange={() => onSelect(tile)}
                    onChange={handleCheck(tile)}
                    color="primary"
                  />
                  {tile.name}</>}
                // subtitle={<span>type: {tile.mime}, size: {tile.size} KB</span>}
                // actionIcon={
                //   <IconButton aria-label={`delete ${tile.name}`} onClick={() => handleDelete(tile)}>
                //     <DeleteForeverIcon color="secondary" />
                //   </IconButton>
                // }
              />
            </GridListTile>
          )
        })}
      </GridList>
      {total && <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={total}
        rowsPerPage={pagination.perPage}
        page={pagination.page - 1 || 0}
        onChangePage={(event, newPage) => setPagination({ ...pagination, page: newPage + 1 })}
      />}
      <Typography variant="h6">Selected media</Typography>
      <Box bgcolor="#eee" style={{ marginBottom: '1em', borderBottom: '2px solid #ccc', paddingBottom: '0.5em' }}>
        <GridList cellHeight={160} cols={5} spacing={6}>
          {selected.map(tile => {
            return (
              <GridListTile key={tile.id} cols={tile.cols || 1}>
                {/image(.*)/.exec(tile.mime) ? <img src={tile.url} alt={tile.name} />
                  :
                  <DescriptionIcon />
                }
                <GridListTileBar
                  title={<>
                    <Checkbox
                      checked={true}
                      onChange={handleCheck(tile)}
                      color="primary"
                    />
                    {tile.name}</>}
                // subtitle={<span>type: {tile.mime}, size: {tile.size} KB</span>}
                // actionIcon={
                //   <IconButton aria-label={`delete ${tile.name}`} onClick={() => handleDelete(tile)}>
                //     <DeleteForeverIcon color="secondary" />
                //   </IconButton>
                // }
                />
              </GridListTile>
            )
          })}
        </GridList>
      </Box>
    </>
  )
}


const TabPanel = props => {
  const { children, tab, index, ...other } = props
  if(tab !== index) return null

  return <Box {...other}>{children}</Box>
}

const TabbedModalContent = props => {
  const classes = useStyles()
  
  const { onClose } = props

  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const onCheck = (file, checked) => {
    if (checked) {
      setSelected([
        ...selected,
        file
      ])
    } else {
      setSelected(selected.filter(t => t.id !== file.id))
    }
  }

  const libraryProps = { selected, onCheck, search }

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
            <Tab label="Libreria" />
            <Tab label="Carica" />
          </Tabs>
          {tab === 0 && <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>}
          <Button style={{ marginRight: '2em' }} variant="contained" color="primary" onClick={() => onClose()}>Close</Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.modalScroll}>
        <TabPanel tab={tab} index={0} id="library-tab" style={{ position: 'relative' }}>
          <Box style={{ padding: '1.5em' }}>
            <LibraryComponent {...libraryProps} />
          </Box>
        </TabPanel>
        <TabPanel tab={tab} index={1}>
          <Box style={{ padding: '1.5em' }}><Typography variant="h2">Carica</Typography></Box>
        </TabPanel>
      </Box>
    </>
  )
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
          {open && <TabbedModalContent onClose={() => setOpen(false)} />}
          {/*<Typography variant="h4">Strapi Media Library</Typography> */}
          {/* {open && <MediaGallery input={input} multiple={multiple} closeMediaLibrary={() => setOpen(false)} />} */}
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