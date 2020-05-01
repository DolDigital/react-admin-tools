import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-admin'
import Image from 'react-graceful-image'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
// import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import DescriptionIcon from '@material-ui/icons/Description'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import TablePagination from '@material-ui/core/TablePagination'
import Typography from '@material-ui/core/Typography'

import fixUploadUrl from '../helpers/fixUploadUrl'
import InfoBoxComponent from './InfoBoxComponent'

const imageMimeTypes = [
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp'
]

const LibraryComponent = props => {
  const {
    search = '',
    selected = [],
    onCheck = null,
    allowedTypes = null,
    page = 1,
    perPage = 10,
    field = 'created_at',
    order = 'DESC',
    gridProps
  } = props
  const [pagination, setPagination] = useState({ page, perPage })
  const [sort, setSort] = useState({ field, order })
  const [infoView, setInfoView] = useState(false)
  
  const payload = {
    pagination,
    sort
  }

  const filter = {}

  if (allowedTypes) {
    if (allowedTypes === 'images') {
      filter.mime = imageMimeTypes
    }
    else if (allowedTypes === 'no-images') {
      filter.mime_nin = imageMimeTypes
    }
    else if (Array.isArray(allowedTypes)) {
      filter.mime = allowedTypes
    }
  }

  if (search !== '') {
    if (isNaN(search)) filter.name = search
    else filter.name_contains = search
  }

  if (Object.keys(filter).length) {
    payload['filter'] = filter
  }

  const { data, total, loading, error } = useQuery({
    type: 'getList',
    resource: 'upload/files',
    payload
  })

  const handleCheck = tile => event => {
    const { target: { checked } } = event
    if (onCheck) onCheck(tile, checked)
  }

  const handleInfoView = media => setInfoView(media)  

  if (loading) return <Typography variant="h2"><CircularProgress /></Typography>
  if (error) return <Typography variant="h5">an error occurred.</Typography>

  if (infoView) {
    return <InfoBoxComponent
      item={infoView}
      onClose={() => setInfoView(false)}
      onCrop={media => {
        console.log('on crop', media)
        setInfoView(fixUploadUrl(media))
        setPagination({ ...pagination, rnd: Math.random() })
      }}
      onDelete={media => {
        if (onCheck) onCheck(media, false)
        setInfoView(false)
        setPagination({ ...pagination, page: 1, rnd: Math.random() })
      }}
      />
  }

  return (
    <>
      {search !== '' && <Box><Typography variant="h6">Risultati per "{search}"</Typography></Box>}
      {data.length > 0 && <GridList cellHeight={160} {...gridProps}>
        {data.map(file => {
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
                title={<>
                  <Checkbox
                    checked={selected.filter(item => item.id === tile.id).length === 1}
                    //onChange={() => onSelect(tile)}
                    onChange={handleCheck(tile)}
                    color="primary"
                  />
                  {tile.name}</>}
                // subtitle={<span>type: {tile.mime}, size: {tile.size} KB</span>}
                actionIcon={
                  <IconButton
                    aria-label={`${tile.name} info`}
                    // onClick={() => handleDelete(tile)}
                    onClick={() => handleInfoView(tile)}
                  >
                    <InfoIcon color="secondary" />
                  </IconButton>
                }
              />
            </GridListTile>
          )
        })}
      </GridList>}
      {data.length === 0 && <Box><Typography variant="h4">Nessun risultato trovato</Typography></Box>}
      {(data.length > 0 && total) && <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={total}
        rowsPerPage={pagination.perPage}
        page={pagination.page - 1 || 0}
        onChangePage={(event, newPage) => setPagination({ ...pagination, page: newPage + 1 })}
      />}
      <Typography variant="h6">Selected media</Typography>
      <Box bgcolor="#eee" style={{ marginBottom: '1em', borderBottom: '2px solid #ccc', paddingBottom: '0.5em' }}>
        <GridList cellHeight={160} {...gridProps}>
          {selected.map(tile => {
            return (
              <GridListTile key={tile.id} cols={tile.cols || 1}>
                {/image(.*)/.exec(tile.mime) ? <img src={tile.url} alt={tile.name} />
                  :
                  <DescriptionIcon />
                }
                <GridListTileBar
                  title={<>
                    <Checkbox
                      checked={true}
                      onChange={handleCheck(tile)}
                      color="primary"
                    />
                    {tile.name}</>}
                  // actionIcon={
                  //   <IconButton aria-label={`delete ${tile.name}`} onClick={() => handleDelete(tile)}>
                  //     <DeleteForeverIcon color="secondary" />
                  //   </IconButton>
                  // }
                />
              </GridListTile>
            )
          })}
        </GridList>
      </Box>
    </>
  )
}

LibraryComponent.propTypes = {
  selected: PropTypes.array,
  search: PropTypes.string ,
  onCheck: PropTypes.func,
  allowedTypes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  page: PropTypes.number,
  perPage: PropTypes.number,
  field: PropTypes.string,
  order: PropTypes.oneOf(['ASC', 'DESC']),
  gridProps: PropTypes.object
}

LibraryComponent.defaultProps = {
  selected: [],
  search: '',
  onCheck: null,
  allowedTypes: null,
  page: 1,
  perPage: 10,
  field: 'created_at',
  order: 'DESC',
  gridProps: {
    cols: 5,
    spacing: 6
  }
}

export default LibraryComponent
