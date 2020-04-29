import React, { useState } from 'react'
import { useDataProvider } from 'react-admin'
import { useDropzone } from 'react-dropzone'
import Image from 'react-graceful-image'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import DescriptionIcon from '@material-ui/icons/Description'

import fixUploadUrl from '../helpers/fixUploadUrl'

const UploadComponent = props => {
  const {
    options: { inputProps: inputPropsOptions, ...options } = {},
    accept,
    maxSize,
    minSize,
    multiple,
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
      <GridList cellHeight={160} cols={5} spacing={6} style={{ margin: '2.2em 0 2em 0' }}>
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
export default UploadComponent