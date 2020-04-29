import React, { useState, useEffect, createRef, forwardRef } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'

import HighlightOffIcon from '@material-ui/icons/HighlightOff'

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

import InputAdornment from '@material-ui/core/InputAdornment'
import ClearIcon from '@material-ui/icons/Clear'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import FormControl from '@material-ui/core/FormControl'

import Image from 'react-graceful-image'



import fixUploadUrl from './helpers/fixUploadUrl'
import LibraryComponent from './Library'

import 'react-image-crop/dist/ReactCrop.css'

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
  searchWrapper: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
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
      width: '90%',
      '&:focus': {
        width: '100%',
      },
    },
  },
  mediaGridList: {
    flexWrap: 'nowrap',
    transform: 'translate(20)'
  }
}));

const UploadComponent = props => {
  const {
    options: { inputProps: inputPropsOptions, ...options } = {},
    accept,
    maxSize,
    minSize,
    multiple,
    input,
    closeMediaLibrary
  } = props

  const dataProvider = useDataProvider()
  const [uploaded, setUploaded] = useState([])

  const onDrop = (newFiles, rejectedFiles, event) => {
    dataProvider._strapiUpload(newFiles).then(r => {
      setUploaded([...uploaded, ...r.data])
    })
  }

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    accept,
    maxSize,
    minSize,
    multiple,
    onDrop,
  })


  return (
    <>
      <GridList cellHeight={160} cols={5} spacing={6} style={{margin: '2.2em 0 2em 0'}}>
        {uploaded.map(file => {
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
                title={tile.name}
                />
            </GridListTile>
          )
        })}
      </GridList>
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
    </>
  )
}


const TabPanel = props => {
  const { children, tab, index, ...other } = props
  const containerRef = createRef()
  if(tab !== index) return null

  return <Box {...other} style={{height: '100%', padding: '1.5em', marginBottom: '1.5em'}}>{children}</Box>
}

const TabbedModalContent = props => {
  const classes = useStyles()
  
  const { onClose, input, multiple = false, allowedTypes = null } = props

  const _selected = (input.value !== false ? (Array.isArray(input.value) ? input.value : [input.value]) : [])
    .filter(f => typeof f.id !== 'undefined')
    .map(f => fixUploadUrl(f));

  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(_selected)
  const onCheck = (file, checked) => {
    const currentlySelected = multiple ? selected : checked ? [] : selected
    if (checked) {
      setSelected([
        ...currentlySelected,
        file
      ])
    } else {
      setSelected(currentlySelected.filter(t => t.id !== file.id))
    }
  }
  
  useEffect(() => input.onChange(selected.length === 0 ? false : selected.length === 1 ? selected[0] : selected), [selected])

  const libraryProps = {
    selected,
    onCheck,
    search,
    allowedTypes
  }

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
            <Tab label="Libreria" />
            <Tab label="Carica" />
          </Tabs>
          <Box className={classes.searchWrapper}>
            <Box style={{width: '50%'}}>
              {tab === 0 && <Box className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  fullWidth
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  endAdornment={search !== '' && <InputAdornment position="end">
                    <IconButton style={{ color: 'inherit' }} onClick={() => setSearch('')}><ClearIcon /></IconButton>
                    </InputAdornment>}
                />
              </Box>}
            </Box>
          </Box>
          <Button variant="contained" color="primary" onClick={() => onClose()}>Close</Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.modalScroll}>
        <TabPanel tab={tab} index={0} id="library-tab" style={{ position: 'relative' }}>
          <LibraryComponent {...libraryProps} />
        </TabPanel>
        <TabPanel tab={tab} index={1}>
          <Box style={{ padding: '1.5em' }}>
            <Typography variant="h2">Upload</Typography>
            <UploadComponent />
          </Box>
        </TabPanel>
      </Box>
    </>
  )
}

const MediaList = props => {
  const { media = [], ...otherProps } = props
  const items = (Array.isArray(media) ? media : [media]).filter(i => typeof i.id !== 'undefined')
  
  if(media === false) return null

  return (
    <GridList {...otherProps}>
      {
        items.map(items => {
          const _media = fixUploadUrl(items)
          return (
            <GridListTile key={_media.id} cols={1}>
              {/image(.*)/.exec(_media.mime) ? <Image
                src={_media.url}
                alt={_media.name}
                width="100%"
              />
                :
                <DescriptionIcon />
              }
              <GridListTileBar
                title={_media.name}
              />
            </GridListTile>
          )
        })
      }
    </GridList>
  )
}

const StrapiMediaInput = props => {
  const { multiple = false, listProps = {}, allowedTypes = null, basePath = null, ...otherProps } = props
  const { label = otherProps.source } = otherProps
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  const { input } = useInput({ ...props })
  let value
  if (multiple) {
    value = input.value ? Array.isArray(input.value) ? input.value : [input.value] : []
  } else {
    value = input.value || false
  }

  const gridCols = 4.5

  return (
    <>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Paper className={classes.modal}>
          {open && <TabbedModalContent onClose={() => setOpen(false)} input={input} multiple={multiple} allowedTypes={allowedTypes} />}
        </Paper>
      </Modal>
      <Box style={{padding: '1.2em 0 2em 0'}}>
        <Typography variant="subtitle1">{label}</Typography>
        <MediaList media={value} cellHeight={160} cols={gridCols} className={classes.mediaGridList} {...listProps} />
        <Button style={{marginTop: '1em'}} onClick={() => setOpen(true)} {...otherProps}>Media Library</Button>
      </Box>
    </>
  )
}

export default StrapiMediaInput