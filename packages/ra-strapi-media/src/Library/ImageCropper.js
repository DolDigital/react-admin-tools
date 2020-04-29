import React, { useState } from 'react'
import { useDataProvider } from 'react-admin'
import ReactCrop from 'react-image-crop'

import Button from '@material-ui/core/Button'

import 'react-image-crop/dist/ReactCrop.css'

const ImageCropper = props => {
  const { image, onChange = null } = props
  const [crop, setCrop] = useState({})
  const [cropImage, setCropImage] = useState({})
  const dataProvider = useDataProvider()

  const handleCrop = () => {
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
    <>
      <ReactCrop
        src={image.url}
        crop={crop}
        onChange={newCrop => setCrop(newCrop)}
        onImageLoaded={image => setCropImage(image)}
        crossorigin="anonymous"
      />
      <Button onClick={handleCrop}>CROP</Button>
    </>
  )
}

export default ImageCropper