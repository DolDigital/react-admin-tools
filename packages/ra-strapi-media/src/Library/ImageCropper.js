import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDataProvider } from 'react-admin'
import ReactCrop from 'react-image-crop'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import CropDialog from './CropDialog'

import 'react-image-crop/dist/ReactCrop.css'

const ImageCropper = props => {
  const { image, onChange, wrapperProps, actionProps, cropButtonProps, ...otherProps } = props
  const [crop, setCrop] = useState({})
  const [cropImage, setCropImage] = useState({})
  const [cropDialog, setCropDialog] = useState(false)
  const dataProvider = useDataProvider()

  const hasBeenCropped = () => !(crop.width === 0 && crop.height === 0)

  const handleCrop = () => {
    if(Object.keys(crop).length === 0) return null
    if(!hasBeenCropped()) return null
    const wratio = cropImage.naturalWidth / cropImage.width
    const hratio = cropImage.naturalHeight / cropImage.height
    const rx = Math.floor(crop.x * wratio)
    const ry = Math.floor(crop.y * hratio)
    const rw = Math.floor(crop.width * wratio)
    const rh = Math.floor(crop.height * hratio)

    const canvas = document.createElement('canvas')
    canvas.width = rw
    canvas.height = rh
    const context = canvas.getContext('2d')

    context.drawImage(
      cropImage,
      rx, ry,
      rw, rh,
      0, 0,
      rw, rh
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        const file = new File([blob], image.name, { type: image.mime })
        setCropDialog({new: file, current: image})
      })
    })
  }

  const makeCall = (file, data = null) => dataProvider._strapiUpload(file, data)
    .then(r => {
      if (onChange && Array.isArray(r.data) && r.data.length) return onChange(r.data[0])
      if (onChange && typeof r.data === 'object') return onChange(r.data)
    })

  const saveCrop = crop => {
    setCropDialog(false)
    const data = { id: image.id }
    return makeCall(crop.new, data)
  }

  const saveCopy = crop => {
    setCropDialog(false)
    return makeCall(crop.new)
  }

  const handleCropChange = data => {
    setCrop(data)
  }

  return (
    <>
    <CropDialog item={cropDialog} onClose={() => setCropDialog(false)} onCrop={saveCrop} onCopy={saveCopy} />
    <Box display="flex" flexDirection="column" style={{height: '100%', maxHeight: '100%'}}>
      <Box {...actionProps}>
        <Button onClick={handleCrop} {...cropButtonProps} disabled={!hasBeenCropped()}>CROP</Button>
      </Box>
      <Box flexGrow={1} {...wrapperProps}>
        <ReactCrop
          src={image.url}
          crop={crop}
          onChange={handleCropChange}
          onImageLoaded={image => setCropImage(image)}
          crossorigin="anonymous"
          {...otherProps}
        />
      </Box>
    </Box>
    </>
  )
}

ImageCropper.propTypes = {
  image: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  wrapperProps: PropTypes.object,
  actionProps: PropTypes.object,
  cropButtonProps: PropTypes.object
}

ImageCropper.defaultProps = {
  onChange: null,
  wrapperProps: {},
  actionProps: {},
  cropButtonProps: {}
}

export default ImageCropper