import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'


const DeleteDialog = props => {
  const { item = false, onClose = null, onCancel = null, onConfirm = null } = props
  const isOpen = item !== false

  const handleClose = () => {
    if (onClose) onClose()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
  }

  if (!isOpen) return null

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle id="draggable-dialog-title">
        Delete media
        </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you shure you want to delete "{item.name}"?<br />
            The action is irreversible.
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
          </Button>
        <Button onClick={handleConfirm} color="primary">
          CONFIRM DELETION
          </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog