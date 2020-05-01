import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

const CropDialog = props => {
  const { item, onClose, onCrop, onCopy } = props

  const isOpen = item !== false

  const handleClose = () => {
    if (onClose) onClose()
  }

  const handleCrop = () => {
    if(onCrop) onCrop(item)
  }

  const handleCopy = () => {
    if(onCopy) onCopy(item)
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
          How do you want to apply the crop?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCopy} color="primary">
          Make a copy
        </Button>
        <Button autoFocus onClick={handleCrop} color="secondary">
          Crop the original image
        </Button>
      </DialogActions>
    </Dialog>
  )
}

CropDialog.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]).isRequired,
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  onCrop: PropTypes.func
}

CropDialog.defaultProps = {
  onClose: null,
  onCopy: null,
  onCrop: null
}

export default CropDialog