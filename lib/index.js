"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var query_string_1 = require("query-string");
var react_admin_1 = require("react-admin");
/**
 * Maps react-admin queries to a json-server powered REST API
 *
 * @see https://github.com/typicode/json-server
 * @example
 * GET_LIST     => GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts/123, GET http://my.api.url/posts/456, GET http://my.api.url/posts/789
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 */
exports.default = (function (apiUrl, httpClient) {
    if (httpClient === void 0) { httpClient = react_admin_1.fetchUtils.fetchJson; }
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    var convertDataRequestToHTTP = function (type, resource, params) {
        var _a;
        var url = '';
        var options = {};
        switch (type) {
            case react_admin_1.GET_LIST: {
                var _b = params.pagination, page = _b.page, perPage = _b.perPage;
                var _c = params.sort, field = _c.field, order = _c.order;
                var _d = params.filter, q = _d.q, filter = __rest(_d, ["q"]);
                var query = __assign({}, react_admin_1.fetchUtils.flattenObject(filter), { _sort: field + ':' + order, _start: (page - 1) * perPage, _limit: perPage });
                if (q)
                    query['_q'] = q;
                url = apiUrl + "/" + resource + "?" + query_string_1.stringify(query);
                break;
            }
            case react_admin_1.GET_ONE:
                url = apiUrl + "/" + resource + "/" + params.id;
                break;
            case react_admin_1.GET_MANY_REFERENCE: {
                var _e = params.pagination, page = _e.page, perPage = _e.perPage;
                var _f = params.sort, field = _f.field, order = _f.order;
                var query = __assign({}, react_admin_1.fetchUtils.flattenObject(params.filter), (_a = {}, _a[params.target] = params.id, _a._sort = field + ':' + order, _a._start = (page - 1) * perPage, _a._limit = perPage, _a));
                url = apiUrl + "/" + resource + "?" + query_string_1.stringify(query);
                break;
            }
            case react_admin_1.UPDATE:
                url = apiUrl + "/" + resource + "/" + params.id;
                options.method = 'PUT';
                options.body = JSON.stringify(params.data);
                break;
            case react_admin_1.CREATE:
                url = apiUrl + "/" + resource;
                options.method = 'POST';
                options.body = JSON.stringify(params.data);
                break;
            case react_admin_1.DELETE:
                url = apiUrl + "/" + resource + "/" + params.id;
                options.method = 'DELETE';
                break;
            case react_admin_1.GET_MANY: {
                var query = {
                    _id_in: params.ids.map(function (id) { return typeof id === 'string' ? id : id.id; }),
                };
                url = apiUrl + "/" + resource + "?" + query_string_1.stringify(query);
                break;
            }
            default:
                throw new Error("Unsupported fetch action type " + type);
        }
        return { url: url, options: options };
    };
    /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} Data response
     */
    var convertHTTPResponse = function (response, type, resource, params) {
        var headers = response.headers, json = response.json;
        switch (type) {
            case react_admin_1.GET_LIST:
            case react_admin_1.GET_MANY_REFERENCE:
                var _a = params.filter, q = _a.q, filter = __rest(_a, ["q"]);
                if (q)
                    filter['_q'] = q;
                return httpClient(apiUrl + "/" + resource + "/count?" + query_string_1.stringify(react_admin_1.fetchUtils.flattenObject(filter)), {
                    method: 'GET'
                }).then(function (response) {
                    return {
                        data: json,
                        total: response.json
                    };
                });
            case react_admin_1.CREATE:
                return { data: __assign({}, json, { id: json.id }) };
            default:
                return { data: json };
        }
    };
    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a data response
     */
    return function (type, resource, params) {
        // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
        if (type === react_admin_1.UPDATE_MANY) {
            return Promise.all(params.ids.map(function (id) {
                return httpClient(apiUrl + "/" + resource + "/" + id, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                });
            })).then(function (responses) { return ({
                data: responses.map(function (response) { return response.json; }),
            }); });
        }
        // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
        if (type === react_admin_1.DELETE_MANY) {
            return Promise.all(params.ids.map(function (id) {
                return httpClient(apiUrl + "/" + resource + "/" + id, {
                    method: 'DELETE',
                });
            })).then(function (responses) { return ({
                data: responses.map(function (response) { return response.json; }),
            }); });
        }
        var _a = convertDataRequestToHTTP(type, resource, params), url = _a.url, options = _a.options;
        return httpClient(url, options).then(function (response) {
            return convertHTTPResponse(response, type, resource, params);
        });
    };
});
