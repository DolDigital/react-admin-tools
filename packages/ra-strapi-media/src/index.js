import React, { useState } from 'react'
import { useInput } from 'react-admin'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import MediaList from './MediaList'
import TabbedMediaLibrary from './TabbedMediaLibrary'

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
  footer: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  mediaGridList: {
    flexWrap: 'nowrap',
    transform: 'translate(20)'
  }
}));

const StrapiMediaModal = props => {
  const {
    isOpen = false,
    input = null,
    multiple = false,
    allowedTypes = null,
    onClose = null
  } = props

  if(!isOpen) return null

  const classes = useStyles();

  const handleClose = () => {
    if(onClose) onClose()
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={isOpen}
      onClose={handleClose}
    >
      <Paper className={classes.modal}>
        <TabbedMediaLibrary
          onClose={handleClose}
          input={input}
          multiple={multiple}
          allowedTypes={allowedTypes}
          />
      </Paper>
    </Modal>
  )
}

const StrapiMediaInput = props => {
  const {
    multiple = false, 
    listProps = {},
    allowedTypes = null,
    basePath = null,
    gridCols = 4.5,
    ...otherProps
  } = props
  const { label = otherProps.source } = otherProps
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  const { input } = useInput({ ...props })
  const value = multiple ?
    input.value ? Array.isArray(input.value) ? input.value : [input.value] : []
    :
    input.value || false

  return (
    <>
      <StrapiMediaModal
        isOpen={open}
        input={input}
        multiple={multiple}
        allowedTypes={allowedTypes}
        onClose={() => setOpen(false)} 
        />
      <Box style={{padding: '1.2em 0 2em 0'}}>
        <Typography variant="subtitle1">{label}</Typography>
        <MediaList media={value} cellHeight={160} cols={gridCols} className={classes.mediaGridList} {...listProps} />
        <Button style={{marginTop: '1em'}} onClick={() => setOpen(true)} {...otherProps}>Media Library</Button>
      </Box>
    </>
  )
}

export default StrapiMediaInput