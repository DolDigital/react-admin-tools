import React from 'react'
import Image from 'react-graceful-image'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'

import fixUploadUrl from '../helpers/fixUploadUrl'

const MediaList = props => {
  const { media = [], ...otherProps } = props
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
                <DescriptionIcon />
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

export default MediaList