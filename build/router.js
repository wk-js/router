(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./router");
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = router_1.default;
}
if (typeof window !== 'undefined') {
    window.Router = router_1.default;
}

});
___scope___.file("router.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var route_1 = require("./route");
var stack_1 = require("./stack");
var resolver_1 = require("./resolver");
var Router = (function () {
    function Router() {
        this.concerns = {};
        this.extensions = [];
        this._extensions = {};
        this.root = new route_1.default('/', null);
        this.stack = new stack_1.default('/');
        // this.events = new EventEmitter
        this.currentScope = this.root;
    }
    Router.prototype.getRoutes = function () {
        var routes = resolver_1.default.getRoutes(this.root).map(function (route) {
            return route.getPath();
        });
        routes.unshift(this.root.getPath());
        return routes;
    };
    Router.prototype.route = function (path, closure, options) {
        options = options || {};
        var route;
        if (!path || path.length === 0 || path === '/') {
            this.currentScope.closure = closure;
            route = this.currentScope;
        }
        else {
            route = this.currentScope.findOrCreate(path, closure);
        }
        if (options.constraint)
            this.constraint(route, options.constraint);
        if (options.defaultValue)
            this.defaultValue(route, options.defaultValue);
        // Set extension parameters
        for (var i = 0, ilen = this.extensions.length; i < ilen; i++) {
            if (options[this.extensions[i].name])
                this.extensions[i].set(route, options[this.extensions[i].name]);
        }
        return route;
    };
    Router.prototype.scope = function (path, closure) {
        var current = this.currentScope;
        // Find or create scope
        var scope = this.currentScope.findOrCreate(path);
        this.currentScope = scope;
        closure.call(this.currentScope);
        this.currentScope = current;
        return scope;
    };
    Router.prototype.constraint = function (pathOrRoute, constraint) {
        var route;
        if (typeof pathOrRoute === 'string') {
            route = this.currentScope.findOrCreate(pathOrRoute);
        }
        else {
            route = pathOrRoute;
        }
        var c = constraint;
        var regex;
        if (typeof constraint != 'function') {
            if (constraint instanceof RegExp) {
                regex = c;
            }
            else if (typeof constraint === 'string') {
                regex = new RegExp(c);
            }
            constraint = function (value) {
                return !!value.match(regex);
            };
        }
        route.path.constraint = constraint;
    };
    Router.prototype.defaultValue = function (pathOrRoute, defaultValue) {
        var route;
        if (typeof pathOrRoute === 'string') {
            route = this.currentScope.findOrCreate(pathOrRoute);
        }
        else {
            route = pathOrRoute;
        }
        route.path.defaultValue = defaultValue;
    };
    Router.prototype.extension = function (extension) {
        // Getter
        if (typeof extension === 'string' && this._extensions[extension]) {
            return this._extensions[extension];
        }
        // Setter
        var ext = null, extension_class = null;
        if (typeof extension === 'string' && Router.Extensions[extension]) {
            extension_class = Router.Extensions[extension];
        }
        else if (typeof extension === 'function') {
            extension_class = extension;
        }
        if (extension_class) {
            ext = new extension_class(this);
            this._extensions[ext.name] = ext;
            this.extensions.push(ext);
            return ext;
        }
        return ext;
    };
    Router.prototype.go = function (path, options) {
        options = Object.assign({}, options || {});
        var result = resolver_1.default.resolve(path, this, options);
        if (result && ((options.replace ? this.stack.replace(result.path) : this.stack.go(result.path)) || options.force)) {
            var route = result.route;
            var args = result.args;
            if (!options.ignoreClosure)
                route.closure.call(route, args, result);
            return result;
        }
        return null;
    };
    Router.prototype.forward = function () {
        if (this.stack.forward())
            return this.go(this.stack.path, { force: true });
        return null;
    };
    Router.prototype.backward = function () {
        if (this.stack.backward())
            return this.go(this.stack.path, { force: true });
        return null;
    };
    Router.prototype.updatePath = function () {
        var valid = this.stack.updatePath();
        // this.plugins.forEach((plugin) => {
        //   if (plugin.update) plugin.update(this.stack.path)
        // })
        return valid;
    };
    return Router;
}());
Router.Extensions = {
    order: require('./extensions/order').default,
    concern: require('./extensions/concern').default,
    redirect: require('./extensions/redirect').default,
    reference: require('./extensions/reference').default
};
exports.default = Router;

});
___scope___.file("route.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("./node");
function NOOP() { console.log('NOOP'); }
var Route = (function (_super) {
    __extends(Route, _super);
    function Route(path, parent, closure) {
        var _this = _super.call(this, path, parent) || this;
        _this.closure = closure;
        if (!_this.closure)
            _this.closure = NOOP;
        return _this;
    }
    Route.prototype.create = function (path, closure) {
        var child = new Route(path, this, closure);
        this.addChild(child);
        return child;
    };
    Route.prototype.findOrCreate = function (path, closure) {
        var route = _super.prototype.findOrCreate.call(this, path);
        if (closure)
            route.closure = closure;
        return route;
    };
    return Route;
}(node_1.default));
exports.default = Route;

});
___scope___.file("node.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_1 = require("./utils/guid");
var path_1 = require("./path");
var Node = (function () {
    function Node(path, parent) {
        this.nodes = {};
        this.children = [];
        this.uuid = guid_1.guid();
        this.path = new path_1.default(path);
        if (parent)
            this.parent_uuid = parent.uuid;
    }
    Object.defineProperty(Node.prototype, "is_root", {
        get: function () {
            return !this.parent_uuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "root", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this.is_root ? null : (this.root.nodes[this.parent_uuid] ? this.root.nodes[this.parent_uuid] : this.root);
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.find = function (path) {
        var parts = path_1.default.split(path_1.default.clean(path));
        return this.resolveParts(this, parts);
    };
    Node.prototype.create = function (path) {
        var child = new Node(path, this);
        this.addChild(child);
        return child;
    };
    Node.prototype.findOrCreate = function (path) {
        var child = this.find(path);
        if (!child) {
            var parts = path_1.default.split(path_1.default.clean(path));
            for (var i = 0, ilen = parts.length; i < ilen; i++) {
                if (child) {
                    child = child.findOrCreate(parts[i]);
                }
                else {
                    child = this.find(parts[i]);
                    if (!child)
                        child = this.create(parts[i]);
                }
            }
        }
        return child;
    };
    Node.prototype.addChild = function (child) {
        // Define root property
        var root = this.is_root ? this : this.root;
        Object.defineProperty(child, 'root', {
            get: function () {
                return root;
            }
        });
        root.nodes[child.uuid] = child;
        this.children.push(child);
        return child;
    };
    Node.prototype.removeChild = function (child) {
        // Remove from parent
        var index = child.parent.children.indexOf(child);
        child.parent.children.splice(index, 1);
        // Remove from root
        delete child.root.nodes[child.uuid];
        Object.defineProperty(child, 'root', {
            get: function () {
                return null;
            }
        });
        return child;
    };
    Node.prototype.resolveParts = function (node, parts) {
        var part = parts.shift();
        var child = null;
        child = node.path.basename === part ? node : null;
        if (!child) {
            for (var i = 0, ilen = node.children.length; i < ilen; i++) {
                if (node.children[i].path.basename === part) {
                    child = node.children[i];
                    break;
                }
            }
        }
        if (child && parts.length !== 0)
            return this.resolveParts(child, parts);
        return child;
    };
    Node.prototype.getPaths = function () {
        var parts = [this.path];
        var next = true;
        var name;
        var current = this;
        while (next) {
            if (current.parent && !current.parent.is_root) {
                parts.unshift(current.parent.path);
                current = current.parent;
                continue;
            }
            next = false;
        }
        return parts;
    };
    Node.prototype.getPath = function () {
        var paths = this.getPaths().map(function (path) {
            return path.basename;
        });
        return path_1.default.slash(path_1.default.join(paths));
    };
    return Node;
}());
exports.default = Node;

});
___scope___.file("utils/guid.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
exports.s4 = s4;
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
exports.guid = guid;

});
___scope___.file("path.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TRIM_REGEX = /(^\/)|(\/$)/g;
var MULTIPLE_SLASH = /\/+/g;
var Path = (function () {
    function Path(path) {
        var split = path.split('?');
        this.slashname = Path.slash(split[0]);
        this.basename = Path.clean(split[0]);
        this.parameters = split[1];
    }
    Object.defineProperty(Path.prototype, "is_dynamic", {
        get: function () {
            return !this.is_root && !!this.basename.match(/^:/);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "has_parameter", {
        get: function () {
            return !this.is_root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "is_root", {
        get: function () {
            return this.basename.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Path.prototype.constraint = function (value) {
        return true;
    };
    Path.prototype.extractParameters = function () {
        var parameters = {};
        if (this.parameters) {
            this.parameters.split('&').forEach(function (key_value) {
                var kv = key_value.split('=');
                parameters[kv[0]] = kv[1];
            });
        }
        return parameters;
    };
    Path.trim = function (path) {
        return path.replace(TRIM_REGEX, '');
    };
    Path.clean = function (path) {
        return Path.trim(path).replace(MULTIPLE_SLASH, '/');
    };
    Path.slash = function (path) {
        return '/' + Path.clean(path);
    };
    Path.split = function (path) {
        return path.split('/');
    };
    Path.join = function (parts) {
        return parts.join('/');
    };
    return Path;
}());
exports.default = Path;

});
___scope___.file("stack.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("./path");
var Stack = (function () {
    function Stack(path) {
        this.path = path_1.default.slash(path);
        this.paths = [this.path];
        this.index = this.paths.length - 1;
    }
    Stack.prototype.go = function (path) {
        path = path_1.default.slash(path);
        if (path !== this.path) {
            var deleteCount = Math.max(this.paths.length - this.index - 1, 0);
            this.paths.splice(this.index + 1, deleteCount, path);
            this.index = this.paths.length - 1;
            this.updatePath();
            return true;
        }
        return false;
    };
    Stack.prototype.replace = function (path) {
        this.index = Math.max(this.index - 1, 0);
        return this.go(path);
    };
    Stack.prototype.forward = function () {
        this.index = Math.min(this.index + 1, this.paths.length - 1);
        return this.updatePath();
    };
    Stack.prototype.backward = function () {
        this.index = Math.max(this.index - 1, 0);
        return this.updatePath();
    };
    Stack.prototype.updatePath = function () {
        if (this.path === this.paths[this.index])
            return false;
        this.path = this.paths[this.index];
        return true;
    };
    return Stack;
}());
exports.default = Stack;

});
___scope___.file("resolver.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("./path");
var Resolver = (function () {
    function Resolver() {
    }
    Resolver.resolve = function (path, router, options) {
        var result, route;
        // Check with root
        result = Resolver._resolveByRoute(path, router.root, options);
        // Check with extensions resolve() method
        if (!result) {
            for (var i = 0, ilen = router.extensions.length; i < ilen; i++) {
                route = router.extensions[i].resolve(path, options);
                if (route) {
                    return Resolver._resolveByRoute(route.getPath(), route, options);
                }
            }
        }
        // Check with children
        if (!result) {
            route = router.root.find(path);
            if (route)
                result = Resolver._resolveByRoute(path, route, options);
        }
        // Check with every routes
        if (!result) {
            var routes = Resolver.getRoutes(router.root);
            for (var i = 0, ilen = routes.length; i < ilen; i++) {
                route = routes[i];
                result = Resolver._resolveByRoute(path, route, options);
                if (result)
                    break;
            }
        }
        return result;
    };
    Resolver.getRoutes = function (root) {
        var routes = [];
        routes = routes.concat(root.children);
        for (var i = 0, ilen = root.children.length; i < ilen; i++) {
            routes = routes.concat(Resolver.getRoutes(root.children[i]));
        }
        return routes;
    };
    Resolver.match = function (path, route) {
        var user_paths = path_1.default.split(path_1.default.clean(path)).map(function (str) {
            return new path_1.default(str);
        });
        var args = {};
        var route_paths = route.getPaths();
        var sameLength = user_paths.length === route_paths.length;
        var isValid = sameLength;
        if (isValid) {
            var rPath = void 0, uPath = void 0, basename = void 0, route_basename = void 0;
            for (var i = 0, ilen = user_paths.length; i < ilen; i++) {
                uPath = user_paths[i];
                rPath = route_paths[i];
                basename = uPath.basename;
                route_basename = rPath.basename;
                Object.assign(args, uPath.extractParameters());
                if (rPath.is_dynamic && route_basename !== basename) {
                    if (rPath.constraint(basename)) {
                        args[route_basename.slice(1)] = basename;
                        continue;
                    }
                }
                else if (!rPath.is_dynamic && rPath.has_parameter && route_basename === basename) {
                    continue;
                }
                else if (rPath.is_root && uPath.is_root) {
                    continue;
                }
                isValid = false;
            }
            return isValid ? { args: args, route: route, path: path_1.default.slash(path) } : null;
        }
        return null;
    };
    Resolver._resolveByRoute = function (path, route, options) {
        var parameters = options && options.parameters ? options.parameters : {};
        var paths = route.getPaths();
        for (var key in parameters) {
            path = path.replace(':' + key, parameters[key]);
        }
        for (var i = 0, ilen = paths.length; i < ilen; i++) {
            if (paths[i].is_dynamic && paths[i].defaultValue) {
                path = path.replace(paths[i].basename, paths[i].defaultValue);
            }
        }
        return Resolver.match(path, route);
    };
    return Resolver;
}());
exports.default = Resolver;

});
___scope___.file("extensions/order.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _extension_1 = require("./_extension");
var number_1 = require("../utils/number");
var Order = (function (_super) {
    __extends(Order, _super);
    function Order() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'order';
        return _this;
    }
    Order.prototype.set = function (pathOrRoute, index) {
        var route = _super.prototype.set.call(this, pathOrRoute);
        var len = route.parent.children.length - 1;
        var i = route.parent.children.indexOf(route);
        var ii = number_1.clamp(len - index, 0, len);
        route.parent.children.splice(i, 1);
        route.parent.children.splice(ii, 0, route);
        return route;
    };
    return Order;
}(_extension_1.default));
exports.default = Order;

});
___scope___.file("extensions/_extension.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Extension = (function () {
    function Extension(router) {
        this.router = router;
        this.name = '_extenstion';
    }
    Extension.prototype.set = function (pathOrRoute) {
        var route;
        if (typeof pathOrRoute === 'string') {
            route = this.router.currentScope.findOrCreate(pathOrRoute);
        }
        else {
            route = pathOrRoute;
        }
        return route;
    };
    Extension.prototype.resolve = function (path, options) { return null; };
    return Extension;
}());
exports.default = Extension;

});
___scope___.file("utils/number.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clamp(value, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return Math.max(min, Math.min(value, max));
}
exports.clamp = clamp;

});
___scope___.file("extensions/concern.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _extension_1 = require("./_extension");
var Concern = (function (_super) {
    __extends(Concern, _super);
    function Concern() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'concern';
        _this.concerns = {};
        return _this;
    }
    Concern.prototype.create = function (name, closure) {
        this.concerns[name] = closure;
    };
    Concern.prototype.set = function (pathOrRoute, concern) {
        var route = _super.prototype.set.call(this, pathOrRoute);
        if (typeof concern === 'string')
            concern = [concern];
        for (var i = 0, ilen = concern.length; i < ilen; i++) {
            var closure = this.concerns[concern[i]];
            if (closure) {
                var current = this.router.currentScope;
                this.router.currentScope = route;
                closure();
                this.router.currentScope = current;
            }
        }
        return route;
    };
    return Concern;
}(_extension_1.default));
exports.default = Concern;

});
___scope___.file("extensions/redirect.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _extension_1 = require("./_extension");
var Redirect = (function (_super) {
    __extends(Redirect, _super);
    function Redirect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'redirect';
        return _this;
    }
    Redirect.prototype.set = function (pathOrRoute, options) {
        var _this = this;
        var route = _super.prototype.set.call(this, pathOrRoute);
        var opts = { path: '' };
        if (typeof options === 'string') {
            opts.path = options;
        }
        else if (typeof options === 'object') {
            opts = options;
        }
        route.closure = function () {
            _this.router.go(opts.path, Object.assign(opts, {
                replace: true
            }));
        };
        return route;
    };
    return Redirect;
}(_extension_1.default));
exports.default = Redirect;

});
___scope___.file("extensions/reference.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _extension_1 = require("./_extension");
var Reference = (function (_super) {
    __extends(Reference, _super);
    function Reference() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.references = {};
        _this.name = 'reference';
        return _this;
    }
    Reference.prototype.set = function (pathOrRoute, name) {
        var route = _super.prototype.set.call(this, pathOrRoute);
        this.references[name] = route;
        return route;
    };
    Reference.prototype.resolve = function (path, options) {
        return this.references[path];
    };
    return Reference;
}(_extension_1.default));
exports.default = Reference;

});
});

FuseBox.import("default/index.js");
FuseBox.main("default/index.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=h[a];if(!s){if(d&&"electron"!==g.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:v}}function s(e,r,n){if(void 0===n&&(n={}),!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);g.dynamic(a,o),r(g.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=m[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=h[t.pkgName];if(u){var p={};for(var m in u.f)a.test(m)&&(p[m]=c(t.pkgName+"/"+m));return p}}if(!i){var g="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return g?r(e):null},r)}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},w.require.main={filename:d?"./":v.require.main.filename,paths:d?[]:v.require.main.paths};var j=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",j),i.fn.apply(0,j),l("after-import",j),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var h=p.p=p.p||{},m=p.e=p.e||{},g=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){m[e]=m[e]||[],m[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=h[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=h.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(h[e])return n(h[e].s);var t=h[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r}();return g.packages=h,g.isBrowser=d,g.isServer=!d,g.plugins=[],d||(v.FuseBox=g),e.FuseBox=g}(this))