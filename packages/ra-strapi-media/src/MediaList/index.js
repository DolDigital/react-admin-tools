import React from 'react'
import PropTypes from 'prop-types'
import Image from 'react-graceful-image'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'

import fixUploadUrl from '../helpers/fixUploadUrl'
import FileIcon from '../FileIcon'

const MediaList = props => {
  const { media, ...otherProps } = props
  const items = (Array.isArray(media) ? media : [media]).filter(i => typeof i.id !== 'undefined')

  if (media === false) return null

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
                <FileIcon media={_media} />
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

MediaList.propTypes = {
  media: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]).isRequired
}

export default MediaList