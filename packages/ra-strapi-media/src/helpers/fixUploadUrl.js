import { getApiUrl } from '@doldigital/ra-data-strapi3'

const fixUploadUrl = media => {
  const apiUrl = getApiUrl()
  return {
    ...media,
    url: /(http:|https:)/.test(media.url) ? media.url : `${apiUrl}${media.url}`
  }
}

export default fixUploadUrl