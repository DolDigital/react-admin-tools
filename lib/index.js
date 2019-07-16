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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var query_string_1 = require("query-string");
var react_admin_1 = require("react-admin");
var moment_1 = __importDefault(require("moment"));
var is_mongo_objectid_1 = __importDefault(require("is-mongo-objectid"));
var upload_1 = __importDefault(require("./upload"));
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
    var uploader = upload_1.default(apiUrl);
    var handleUploadForm = function (params) { return __awaiter(_this, void 0, void 0, function () {
        var upload, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    upload = null;
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < params.data.files.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, uploader(params.data.files[index].rawFile || params.data.files[index])];
                case 2:
                    upload = _a.sent();
                    if (upload) {
                        params.data.files[index] = Array.isArray(upload) ? upload[0].id : upload.id;
                    }
                    upload = null;
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, params.data.files];
            }
        });
    }); };
    var uploadFiles = function (params) { return __awaiter(_this, void 0, void 0, function () {
        var upload, param, paramName, child, keys, index, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    upload = null;
                    if (!params.data) return [3 /*break*/, 14];
                    param = void 0, paramName = void 0, child = void 0;
                    keys = Object.keys(params.data).slice();
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < keys.length)) return [3 /*break*/, 14];
                    upload = null;
                    paramName = keys[index];
                    param = params.data[paramName];
                    if (!param) return [3 /*break*/, 13];
                    if (!(param instanceof File)) return [3 /*break*/, 3];
                    return [4 /*yield*/, uploader(param)];
                case 2:
                    upload = _a.sent();
                    return [3 /*break*/, 12];
                case 3:
                    if (!(typeof param.rawFile !== "undefined" && param.rawFile instanceof File)) return [3 /*break*/, 5];
                    return [4 /*yield*/, uploader(param.rawFile)];
                case 4:
                    upload = _a.sent();
                    return [3 /*break*/, 12];
                case 5:
                    if (!Array.isArray(param)) return [3 /*break*/, 12];
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < param.length)) return [3 /*break*/, 12];
                    child = param[i];
                    if (!(child instanceof File)) return [3 /*break*/, 8];
                    return [4 /*yield*/, uploader(child)];
                case 7:
                    upload = _a.sent();
                    return [3 /*break*/, 10];
                case 8:
                    if (!(typeof child.rawFile !== "undefined" && child.rawFile instanceof File)) return [3 /*break*/, 10];
                    return [4 /*yield*/, uploader(child.rawFile)];
                case 9:
                    upload = _a.sent();
                    _a.label = 10;
                case 10:
                    if (upload) {
                        params.data[paramName][i] = Array.isArray(upload) ? upload[0].id : upload.id;
                    }
                    upload = null;
                    _a.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 6];
                case 12:
                    if (upload) {
                        params.data[paramName] = Array.isArray(upload) ? upload[0].id : upload.id;
                    }
                    _a.label = 13;
                case 13:
                    index++;
                    return [3 /*break*/, 1];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    var computeFilters = function (filters) {
        var q = filters.q, filter = __rest(filters, ["q"]);
        var flattened = react_admin_1.fetchUtils.flattenObject(filter);
        var returner = {};
        Object.keys(flattened).forEach(function (f) {
            if (moment_1.default(flattened[f]).isValid() || !isNaN(flattened[f])) {
                returner[f] = flattened[f];
            }
            else if (is_mongo_objectid_1.default(flattened[f])) {
                returner[f] = flattened[f];
            }
            else {
                returner[f + "_contains"] = flattened[f];
            }
        });
        if (q)
            returner['_q'] = q;
        return returner;
    };
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    var convertDataRequestToHTTP = function (type, resource, params) { return __awaiter(_this, void 0, void 0, function () {
        var url, options, _a, _b, page, perPage, _c, field, order, filters, query, _d, page, perPage, _e, field, order, query, query;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    url = '';
                    options = {};
                    _a = type;
                    switch (_a) {
                        case react_admin_1.GET_LIST: return [3 /*break*/, 1];
                        case react_admin_1.GET_ONE: return [3 /*break*/, 2];
                        case react_admin_1.GET_MANY_REFERENCE: return [3 /*break*/, 3];
                        case react_admin_1.UPDATE: return [3 /*break*/, 4];
                        case react_admin_1.CREATE: return [3 /*break*/, 6];
                        case react_admin_1.DELETE: return [3 /*break*/, 8];
                        case react_admin_1.GET_MANY: return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 10];
                case 1:
                    {
                        _b = params.pagination, page = _b.page, perPage = _b.perPage;
                        _c = params.sort, field = _c.field, order = _c.order;
                        filters = computeFilters(params.filter);
                        query = __assign({}, filters, { _sort: field + ':' + order, _start: (page - 1) * perPage, _limit: perPage });
                        url = apiUrl + "/" + resource + "?" + query_string_1.stringify(query);
                        return [3 /*break*/, 11];
                    }
                    _g.label = 2;
                case 2:
                    url = apiUrl + "/" + resource + "/" + params.id;
                    return [3 /*break*/, 11];
                case 3:
                    {
                        _d = params.pagination, page = _d.page, perPage = _d.perPage;
                        _e = params.sort, field = _e.field, order = _e.order;
                        query = __assign({}, react_admin_1.fetchUtils.flattenObject(params.filter), (_f = {}, _f[params.target] = params.id, _f._sort = field + ':' + order, _f._start = (page - 1) * perPage, _f._limit = perPage, _f));
                        url = apiUrl + "/" + resource + "?" + query_string_1.stringify(query);
                        return [3 /*break*/, 11];
                    }
                    _g.label = 4;
                case 4:
                    url = apiUrl + "/" + resource + "/" + params.id;
                    options.method = 'PUT';
                    return [4 /*yield*/, uploadFiles(params)];
                case 5:
                    _g.sent();
                    options.body = JSON.stringify(params.data);
                    return [3 /*break*/, 11];
                case 6:
                    url = apiUrl + "/" + resource;
                    options.method = 'POST';
                    return [4 /*yield*/, uploadFiles(params)];
                case 7:
                    _g.sent();
                    options.body = JSON.stringify(params.data);
                    return [3 /*break*/, 11];
                case 8:
                    url = apiUrl + "/" + resource + "/" + params.id;
                    options.method = 'DELETE';
                    return [3 /*break*/, 11];
                case 9:
                    {
                        query = {
                            _id_in: params.ids.map(function (id) { return typeof id === 'string' ? id : id.id; }),
                        };
                        url = apiUrl + "/" + resource + "?" + query_string_1.stringify(query);
                        return [3 /*break*/, 11];
                    }
                    _g.label = 10;
                case 10: throw new Error("Unsupported fetch action type " + type);
                case 11: return [2 /*return*/, { url: url, options: options }];
            }
        });
    }); };
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
                var filters = computeFilters(params.filter);
                return httpClient(apiUrl + "/" + resource + "/count?" + query_string_1.stringify(filters), {
                    method: 'GET'
                }).then(function (response) {
                    return {
                        data: json,
                        total: response.json.count || response.json //Some endpoints (like the upload plugin one) return total as a property "count"
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
    return function (type, resource, params) { return __awaiter(_this, void 0, void 0, function () {
        var upload, _a, filter, _b, url, options;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
                    if (type === react_admin_1.UPDATE_MANY) {
                        return [2 /*return*/, Promise.all(params.ids.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, uploadFiles(params)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, httpClient(apiUrl + "/" + resource + "/" + id, {
                                                    method: 'PUT',
                                                    body: JSON.stringify(params.data),
                                                })];
                                    }
                                });
                            }); })).then(function (responses) { return ({
                                data: responses.map(function (response) { return response.json; }),
                            }); })];
                    }
                    // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
                    if (type === react_admin_1.DELETE_MANY) {
                        return [2 /*return*/, Promise.all(params.ids.map(function (id) {
                                return httpClient(apiUrl + "/" + resource + "/" + id, {
                                    method: 'DELETE',
                                });
                            })).then(function (responses) { return ({
                                data: responses.map(function (response) { return response.json; }),
                            }); })];
                    }
                    if (resource === 'upload' && type === react_admin_1.CREATE) {
                        upload = handleUploadForm(params);
                        return [2 /*return*/, {
                                data: {
                                    files: upload,
                                    id: null
                                }
                            }];
                    }
                    if (resource === 'upload/files') {
                        _a = params.filter, filter = _a === void 0 ? {} : _a;
                        filter['basepath'] = 0;
                        params.filter = filter;
                        console.log(params);
                    }
                    return [4 /*yield*/, convertDataRequestToHTTP(type, resource, params)];
                case 1:
                    _b = _c.sent(), url = _b.url, options = _b.options;
                    return [2 /*return*/, httpClient(url, options).then(function (response) {
                            return convertHTTPResponse(response, type, resource, params);
                        })];
            }
        });
    }); };
});
