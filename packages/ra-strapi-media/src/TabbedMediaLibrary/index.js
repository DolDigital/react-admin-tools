import React, { useState, useEffect } from 'react'

import { fade, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import fixUploadUrl from '../helpers/fixUploadUrl'
import LibraryComponent from '../Library'
import UploadComponent from '../Upload'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'absolute'
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
  modalScroll: {
    overflow: 'scroll',
    height: '100%',
    paddingTop: '3.7em !important',
    paddingBottom: '4.2em !important'
    // height: '70vh'
  }
}));

const TabPanel = props => {
  const { children, tab, index, ...other } = props
  if (tab !== index) return null

  return <Box {...other} style={{ height: '100%', padding: '1.5em', marginBottom: '1.5em' }}>{children}</Box>
}

const TabbedMediaLibrary = props => {
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
            <Box style={{ width: '50%' }}>
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

export default TabbedMediaLibrary