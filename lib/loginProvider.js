"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_admin_1 = require("react-admin");
exports.buildAuthProvider = function (apiUrl, httpClient) {
    if (httpClient === void 0) { httpClient = react_admin_1.fetchUtils.fetchJson; }
    return function (type, params) {
        if (type === react_admin_1.AUTH_LOGIN) {
            var username = params.username, password = params.password;
            var request = new Request(apiUrl + "/auth/local", {
                method: 'POST',
                body: JSON.stringify({
                    identifier: username,
                    password: password
                }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            return fetch(request)
                .then(function (response) {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
                .then(function (_a) {
                var jwt = _a.jwt;
                localStorage.setItem('strapi_token', jwt);
            });
        }
        else if (type === react_admin_1.AUTH_LOGOUT) {
            localStorage.removeItem('strapi_token');
        }
        else if (type === react_admin_1.AUTH_CHECK) {
            return localStorage.getItem('strapi_token') ? Promise.resolve() : Promise.reject();
        }
        return Promise.resolve();
    };
};
exports.default = exports.buildAuthProvider;
