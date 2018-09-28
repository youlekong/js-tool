;(function(factory) {
    if ( typeof module !== 'undefined' && typeof exports === 'object' ) {
        module.exports = factory();
    } else if ( typeof define === 'function' && define.amd ) {
        define(factory);
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g._errorLog = factory();
    }
})(function() {
    function Router() {
        if (!("onhashchange" in window)) {
            console.error("浏览器不支持onhashchange!");
            return ;
        }

        if ( !(this instanceof Router) )
            return new Router;

        window.addEventListener('hashchange', function(e) {
            // console.log(e)
            var r = this.__getRouter(window.location.hash);
            this.__run(r);
        }.bind(this));

        this.routes = [];   
    };
    Router.prototype = {
        init: function() {

        },
        add: function(path, callback) {
            var router = {};
            if (typeof path === 'string') 
                router = {path: path, callback: callback};
            
            if (router.path && !this.routes[path])
                this.routes[path] = router;
            else
                console.error('路由添加错误');
        },
        remove: function(path) {
            var router = {}, idx = -1;

            for (var k in this.routes) {
                var r = this.routes[k];
                if (router.path === path) {
                    router = r, idx = k;
                    break;
                }
            }

            if (idx === -1) {
                console.error('删除错误，该路由不存在');
                return ;
            }

            this.routes.splice(idx, 1);
        },
        __getRouter: function(path) {
            if (this.routes[path])
                return this.routes[path]
            else
                return null;
        },
        __run: function(router) {
            if (router && router.path) {
                typeof router.callback === 'function' && router.callback();
            } else {
                console.error('当前路由不存在');
            }
        }
    };

    return Router;
}