import React from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileWord, faFileExcel, faFileAudio, faFileVideo, faFileAlt, faFilePowerpoint } from '@fortawesome/free-solid-svg-icons'

const mimeTypes = {
  word: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  excel: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  powerpoint: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
}

const Icon = ({ media }) => {
  if (media.mime === 'application/pdf') return <FontAwesomeIcon icon={faFilePdf} />
  if (mimeTypes.word.includes(media.mime)) return <FontAwesomeIcon icon={faFileWord} />
  if (mimeTypes.excel.includes(media.mime)) return <FontAwesomeIcon icon={faFileExcel} />
  if (mimeTypes.powerpoint.includes(media.mime)) return <FontAwesomeIcon icon={faFilePowerpoint} />
  if (/video(.*)/.test(media.mime)) return <FontAwesomeIcon icon={faFileVideo} />
  if (/audio(.*)/.test(media.mime)) return <FontAwesomeIcon icon={faFileAudio} />
  return <FontAwesomeIcon icon={faFileAlt} />
}

const FileIcon = props => {
  return <span style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: '3em' }}>
    <Icon {...props} />
  </span>
}

export default FileIcon