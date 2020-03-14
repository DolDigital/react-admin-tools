import { stringify } from 'query-string';
import { fetchUtils, HttpError } from 'ra-core';
import moment from 'moment';
import isValidObjectID from 'is-mongo-objectid';

const tokenKey = `strapi_token_${window.location.host}`
const roleKey = `strapi_role_${window.location.host}`

const getAuthHeader = () => {
  const strapiToken = localStorage.getItem(tokenKey)
  if (strapiToken) {
    return `Bearer ${strapiToken}`
  }

  return false
}

const computeFilters = filters => {
  const { q, ...filter } = filters;
  const flattened = fetchUtils.flattenObject(filter);
  const returner = {};
  Object.keys(flattened).forEach(f => {
    if (moment(flattened[f]).isValid() || !isNaN(flattened[f])) {
      returner[f] = flattened[f];
    } else if (isValidObjectID(flattened[f])) {
      returner[f] = flattened[f];
    } else {
      returner[`${f}_contains`] = flattened[f];
    }
  });

  if (q) returner['_q'] = q;

  return returner;
}

const _httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const authHeader = getAuthHeader()
  if (authHeader) {
    options.headers.set('Authorization', authHeader);
  }
  const requestHeaders = fetchUtils.createHeadersFromOptions(options)


  return fetch(url, { ...options, headers: requestHeaders })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      }))
    )
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
      }
      if (status < 200 || status >= 300) {
        let { message = null } = json
        if (message && Array.isArray(message)) {
          const { messages } = message.pop()
          message = messages.map(m => m.message).join('; ')
        }
        return Promise.reject(
          new HttpError(
            message || statusText,
            status,
            json
          )
        );
      }
      return Promise.resolve({ status, headers, body, json });
    });
}

export const buildDataProvider = (apiUrl, httpClient = _httpClient) => {
  // const uploadUrlFixer = upload => {
  //   const { url = null } = upload
  //   if (!url) return upload
  //   if (/(http:|https:)/.test(url)) return upload

  //   return {
  //     ...upload,
  //     url: `${apiUrl}${url}`
  //   }
  // }
  return {
    _strapiUpload: files => {
      let formData = new FormData();
      files.forEach(file => formData.append('files', file))
      return fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData
      }).then(
        res => res.json()
      ).then(r => Promise.resolve({ data: r }));
    },
    getList: (resource, params = {}) => {
      const { page = 1, perPage = 20 } = (params.pagination || {})
      const { field = null, order = 'asc' } = (params.sort || {})
      const filters = params.filter ? computeFilters(params.filter) : {}
      const query = {
        _start: (page - 1) * perPage,
        _limit: perPage,
        ...filters
      }
      if (field) {
        query._sort = `${field}:${order}`
      }

      const url = `${apiUrl}/${resource}?${stringify(query)}`
      return httpClient(url).then(({ json }) => {
        let data = json
        // if(resource == 'upload/files') {
        //   data = data.map(uploadUrlFixer)
        //   console.log('UPLOAD_LIST', data)
        // }
        return httpClient(`${apiUrl}/${resource}/count?${stringify(filters)}`).then(countResponse => ({
          data,
          total: countResponse.json.count || countResponse.json
        }))
      })
    },

    getOne: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
        data: json,
      })),

    getMany: (resource, { ids }) => {
      const _ids = ids.map(i => typeof i === 'string' ? i : i.id)
      const query = _ids.length ? `_id_in=${_ids.join('&_id_in=')}` : ''
      const url = `${apiUrl}/${resource}?${query}`
      return httpClient(url).then(({ json }) => ({ data: json }))
    },

    getManyReference: (resource, params) => {
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const filters = computeFilters(params.filter)
      const query = {
        _sort: `${field}:${order}`,
        _start: (page - 1) * perPage,
        _limit: perPage,
        ...filters,
        [params.target]: params.id
      }
      const url = `${apiUrl}/${resource}?${stringify(query)}`
      return httpClient(url).then(({ json }) => {
        return httpClient(`${apiUrl}/${resource}/count?${stringify(filters)}`).then(countResponse => ({
          data: json,
          total: countResponse.json.count || countResponse.json
        }))
      })
    },

    update: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) =>
      Promise.all(
        params.ids.map(id =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
          })
        )
      ).then(responses => ({ data: responses.map(({ json }) => json.id) })),

    create: (resource, params) =>
      httpClient(`${apiUrl}/${resource}`, {
        method: 'POST',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({
        data: { ...params.data, id: json.id },
      })),

    delete: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: 'DELETE',
      }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) =>
      Promise.all(
        params.ids.map(id =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: 'DELETE',
          })
        )
      ).then(responses => ({ data: responses.map(({ json }) => json.id) })),
  }
}

export const buildAuthProvider = (apiUrl, httpClient = _httpClient) => ({
  login: ({ username, password }) => {
    return httpClient(`${apiUrl}/auth/local`, {
      method: 'POST',
      body: JSON.stringify({ identifier: username, password })
    }).then(({ json }) => {
      localStorage.setItem(tokenKey, json.jwt)
      localStorage.setItem(roleKey, json.user.role.name)
    })
  },
  logout: () => {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(roleKey)

    return Promise.resolve()
  },
  checkAuth: () => localStorage.getItem(tokenKey) ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    const role = localStorage.getItem(roleKey)
    return role ? Promise.resolve(role) : Promise.reject()
  },
  checkError: error => {

  }
})