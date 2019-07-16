import { fetchUtils, AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export const buildAuthProvider = (apiUrl, httpClient = fetchUtils.fetchJson) => {
  return (type, params) => {
    if (type === AUTH_LOGIN) {
      const { username, password } = params;
      const request = new Request(`${apiUrl}/auth/local`, {
        method: 'POST',
        body: JSON.stringify({
          identifier: username,
          password
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      return fetch(request)
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(({jwt}) => {
          localStorage.setItem('strapi_token', jwt);
        });
    } else if(type === AUTH_LOGOUT) {
      localStorage.removeItem('strapi_token');
    } else if (type === AUTH_CHECK) {
      return localStorage.getItem('strapi_token') ? Promise.resolve() : Promise.reject();
    }
    return Promise.resolve();
  }
}

export default buildAuthProvider;