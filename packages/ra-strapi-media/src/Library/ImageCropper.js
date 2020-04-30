import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDataProvider } from 'react-admin'
import ReactCrop from 'react-image-crop'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import 'react-image-crop/dist/ReactCrop.css'

const ImageCropper = props => {
  const { image, onChange, wrapperProps, actionProps, cropButtonProps, ...otherProps } = props
  const [crop, setCrop] = useState({})
  const [cropImage, setCropImage] = useState({})
  const dataProvider = useDataProvider()

  const handleCrop = () => {
    if(Object.keys(crop).length === 0) return null
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
        const file = new File([blob], image.name)
        dataProvider._strapiUpload(file, { id: image.id }).then(r => {
          if (onChange && r.data.length) onChange(r.data[0])
        })
      })
    })
  }
  return (
    <Box display="flex" flexDirection="column" style={{height: '100%', maxHeight: '100%'}}>
      <Box flexGrow={1} {...wrapperProps}>
        <ReactCrop
          src={image.url}
          crop={crop}
          onChange={newCrop => setCrop(newCrop)}
          onImageLoaded={image => setCropImage(image)}
          crossorigin="anonymous"
          {...otherProps}
        />
      </Box>
      <Box {...actionProps}>
        <Button onClick={handleCrop} {...cropButtonProps}>CROP</Button>
      </Box>
    </Box>
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