import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

const CopyDialog = props => {
  const { isOpen = false, onClose = null } = props

  const handleClose = () => {
    if (onClose) onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogContent>
        <DialogContentText>
          The cropped image has been saved as a copy.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

CopyDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}

CopyDialog.defaultProps = {
  isOpen: false,
  onClose: null
}

export default CopyDialog