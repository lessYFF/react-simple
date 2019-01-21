// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function(modules, cache, entry, globalName) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof parcelRequire === 'function' && parcelRequire
    var nodeRequire = typeof require === 'function' && require

    function newRequire(name, jumped) {
        if (!cache[name]) {
            if (!modules[name]) {
                // if we cannot find the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof parcelRequire === 'function' && parcelRequire
                if (!jumped && currentRequire) {
                    return currentRequire(name, true)
                }

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) {
                    return previousRequire(name, true)
                }

                // Try the node require function if it exists.
                if (nodeRequire && typeof name === 'string') {
                    return nodeRequire(name)
                }

                var err = new Error("Cannot find module '" + name + "'")
                err.code = 'MODULE_NOT_FOUND'
                throw err
            }

            localRequire.resolve = resolve
            localRequire.cache = {}

            var module = (cache[name] = new newRequire.Module(name))

            modules[name][0].call(module.exports, localRequire, module, module.exports, this)
        }

        return cache[name].exports

        function localRequire(x) {
            return newRequire(localRequire.resolve(x))
        }

        function resolve(x) {
            return modules[name][1][x] || x
        }
    }

    function Module(moduleName) {
        this.id = moduleName
        this.bundle = newRequire
        this.exports = {}
    }

    newRequire.isParcelRequire = true
    newRequire.Module = Module
    newRequire.modules = modules
    newRequire.cache = cache
    newRequire.parent = previousRequire
    newRequire.register = function(id, exports) {
        modules[id] = [
            function(require, module) {
                module.exports = exports
            },
            {},
        ]
    }

    for (var i = 0; i < entry.length; i++) {
        newRequire(entry[i])
    }

    if (entry.length) {
        // Expose entry point to Node, AMD or browser globals
        // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
        var mainExports = newRequire(entry[entry.length - 1])

        // CommonJS
        if (typeof exports === 'object' && typeof module !== 'undefined') {
            module.exports = mainExports

            // RequireJS
        } else if (typeof define === 'function' && define.amd) {
            define(function() {
                return mainExports
            })

            // <script>
        } else if (globalName) {
            this[globalName] = mainExports
        }
    }

    // Override the current require with this new one
    return newRequire
})(
    {
        'src/react-dom/dom.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                function _typeof(obj) {
                    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
                        _typeof = function _typeof(obj) {
                            return typeof obj
                        }
                    } else {
                        _typeof = function _typeof(obj) {
                            return obj &&
                                typeof Symbol === 'function' &&
                                obj.constructor === Symbol &&
                                obj !== Symbol.prototype
                                ? 'symbol'
                                : typeof obj
                        }
                    }
                    return _typeof(obj)
                }

                function setAttribute(dom, name) {
                    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ''
                    if (name === 'className') name = 'class'

                    if (/on\w+/.test(name)) {
                        name = name.toLowerCase()
                        dom[name] = value
                    } else if (name === 'style') {
                        if (!vaule || typeof value === 'string') {
                            dom.style.cssText = value
                        } else if (value && _typeof(value) === 'object') {
                            for (var key in value) {
                                dom.style[key] =
                                    typeof value[key] === 'number' ? ''.concat(value[key], 'px') : value[key]
                            }
                        }
                    } else {
                        if (dom.hasOwnPrototype(name)) {
                            dom[name] = value
                        }

                        if (value) {
                            dom.setAttribute(name, value)
                        } else {
                            dom.removeAttribute(name)
                        }
                    }
                }

                var _default = setAttribute
                exports.default = _default
            },
            {},
        ],
        'src/react-dom/render.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.render = render
                exports.renderComponent = renderComponent

                var _dom = _interopRequireDefault(require('./dom'))

                var _component = _interopRequireDefault(require('../react/component'))

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                // 创建组件
                function createComponent(component, props) {
                    var newComponent

                    if ('render' in component.prototype) {
                        newComponent = new component(props)
                    } else {
                        newComponent = new _component.default(props)
                        newComponent.constructor = component

                        newComponent.render = function() {
                            return this.constructor(props)
                        }
                    }

                    return newComponent
                } // 更新组件

                function renderComponent(component) {
                    var renderor = component.render()

                    if (component.base && component.componentWillUpdate) {
                        component.componentWillUpdate()
                    }

                    var base = _render(renderor)

                    if (component.base && component.componentDidUpdate) {
                        component.componentDidUpdate()
                    } else if (component.componentDidMount) {
                        component.componentDidMount()
                    }

                    if (component.base && component.base.parentNode) {
                        component.base.parentNode.replaceChild(base, component.base)
                    }

                    component.base = base
                } // 设置组件属性

                function setComponentProps(component, props) {
                    if (!component.base && component.componentWillMount) {
                        component.componentWillMount()
                    } else if (component.componentWillReceiveProps) {
                        component.componentWillReceiveProps(props)
                    }

                    component.props = props
                    renderComponent(component)
                }

                function _render(vnode) {
                    if (!vnode) vnode = ''

                    if (typeof vnode === 'string' || typeof vnode === 'number') {
                        var textNode = document.createTextNode(vnode)
                        return textNode
                    }

                    if (typeof vnode.tag === 'function') {
                        var component = createComponent(vnode.tag, vnode.attrs)
                        setComponentProps(component, vnode.attrs)
                        return component.base
                    }

                    var DOM = document.createElement(vnode.tag)

                    if (vnode.attrs) {
                        Object.keys(vnode.attrs).forEach(function(key) {
                            var value = vnode.attrs[key]
                            ;(0, _dom.default)(DOM, key, value)
                        })
                    }

                    if (Array.isArray(vnode.children)) {
                        vnode.children.forEach(function(child) {
                            render(child, DOM)
                        })
                    }

                    return DOM
                }

                function render(vnode, container) {
                    return container.appendChild(_render(vnode))
                }
            },
            { './dom': 'src/react-dom/dom.js', '../react/component': 'src/react/component.js' },
        ],
        'src/react/component.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                var _render = require('../react-dom/render')

                function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) {
                        throw new TypeError('Cannot call a class as a function')
                    }
                }

                function _defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i]
                        descriptor.enumerable = descriptor.enumerable || false
                        descriptor.configurable = true
                        if ('value' in descriptor) descriptor.writable = true
                        Object.defineProperty(target, descriptor.key, descriptor)
                    }
                }

                function _createClass(Constructor, protoProps, staticProps) {
                    if (protoProps) _defineProperties(Constructor.prototype, protoProps)
                    if (staticProps) _defineProperties(Constructor, staticProps)
                    return Constructor
                }

                var Component =
                    /*#__PURE__*/
                    (function() {
                        function Component() {
                            var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

                            _classCallCheck(this, Component)

                            this.state = {}
                            this.props = props
                        }

                        _createClass(Component, [
                            {
                                key: 'setState',
                                value: function setState(stateChange) {
                                    Object.assign(this.state, stateChange)
                                    ;(0, _render.renderComponent)(this)
                                },
                            },
                        ])

                        return Component
                    })()

                var _default = Component
                exports.default = _default
            },
            { '../react-dom/render': 'src/react-dom/render.js' },
        ],
        'src/react/create-element.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                var createElement = function createElement(tag, attrs) {
                    for (
                        var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2;
                        _key < _len;
                        _key++
                    ) {
                        children[_key - 2] = arguments[_key]
                    }

                    return {
                        tag: tag,
                        attrs: attrs,
                        children: children,
                    }
                }

                var _default = createElement
                exports.default = _default
            },
            {},
        ],
        'src/react/index.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                var _component = _interopRequireDefault(require('./component'))

                var _createElement = _interopRequireDefault(require('./create-element'))

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                var _default = {
                    Component: _component.default,
                    createElement: _createElement.default,
                }
                exports.default = _default
            },
            { './component': 'src/react/component.js', './create-element': 'src/react/create-element.js' },
        ],
        'src/react-dom/index.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                var _render = require('./render')

                var _default = {
                    render: _render.render,
                    renderComponent: _render.renderComponent,
                }
                exports.default = _default
            },
            { './render': 'src/react-dom/render.js' },
        ],
        'src/index.js': [
            function(require, module, exports) {
                'use strict'

                var _react = _interopRequireDefault(require('./react'))

                var _reactDom = _interopRequireDefault(require('./react-dom'))

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                function _typeof(obj) {
                    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
                        _typeof = function _typeof(obj) {
                            return typeof obj
                        }
                    } else {
                        _typeof = function _typeof(obj) {
                            return obj &&
                                typeof Symbol === 'function' &&
                                obj.constructor === Symbol &&
                                obj !== Symbol.prototype
                                ? 'symbol'
                                : typeof obj
                        }
                    }
                    return _typeof(obj)
                }

                function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) {
                        throw new TypeError('Cannot call a class as a function')
                    }
                }

                function _defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i]
                        descriptor.enumerable = descriptor.enumerable || false
                        descriptor.configurable = true
                        if ('value' in descriptor) descriptor.writable = true
                        Object.defineProperty(target, descriptor.key, descriptor)
                    }
                }

                function _createClass(Constructor, protoProps, staticProps) {
                    if (protoProps) _defineProperties(Constructor.prototype, protoProps)
                    if (staticProps) _defineProperties(Constructor, staticProps)
                    return Constructor
                }

                function _possibleConstructorReturn(self, call) {
                    if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
                        return call
                    }
                    return _assertThisInitialized(self)
                }

                function _assertThisInitialized(self) {
                    if (self === void 0) {
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
                    }
                    return self
                }

                function _getPrototypeOf(o) {
                    _getPrototypeOf = Object.setPrototypeOf
                        ? Object.getPrototypeOf
                        : function _getPrototypeOf(o) {
                              return o.__proto__ || Object.getPrototypeOf(o)
                          }
                    return _getPrototypeOf(o)
                }

                function _inherits(subClass, superClass) {
                    if (typeof superClass !== 'function' && superClass !== null) {
                        throw new TypeError('Super expression must either be null or a function')
                    }
                    subClass.prototype = Object.create(superClass && superClass.prototype, {
                        constructor: { value: subClass, writable: true, configurable: true },
                    })
                    if (superClass) _setPrototypeOf(subClass, superClass)
                }

                function _setPrototypeOf(o, p) {
                    _setPrototypeOf =
                        Object.setPrototypeOf ||
                        function _setPrototypeOf(o, p) {
                            o.__proto__ = p
                            return o
                        }
                    return _setPrototypeOf(o, p)
                }

                var Counter =
                    /*#__PURE__*/
                    (function(_React$Component) {
                        _inherits(Counter, _React$Component)

                        function Counter(props) {
                            var _this

                            _classCallCheck(this, Counter)

                            _this = _possibleConstructorReturn(this, _getPrototypeOf(Counter).call(this, props))
                            _this.state = {
                                num: 1,
                            }
                            return _this
                        }

                        _createClass(Counter, [
                            {
                                key: 'componentWillUpdate',
                                value: function componentWillUpdate() {
                                    console.log('update execute')
                                },
                            },
                            {
                                key: 'componentWillMount',
                                value: function componentWillMount() {
                                    console.log('mount execute')
                                },
                            },
                            {
                                key: 'onClick',
                                value: function onClick() {
                                    this.setState({
                                        num: this.state.num + 1,
                                    })
                                },
                            },
                            {
                                key: 'render',
                                value: function render() {
                                    var _this2 = this

                                    return _react.default.createElement(
                                        'div',
                                        null,
                                        _react.default.createElement('h1', null, ' count: ', this.state.num, ' '),
                                        _react.default.createElement(
                                            'button',
                                            {
                                                onClick: function onClick() {
                                                    return _this2.onClick()
                                                },
                                            },
                                            ' add '
                                        )
                                    )
                                },
                            },
                        ])

                        return Counter
                    })(_react.default.Component)

                _reactDom.default.render(_react.default.createElement(Counter, null), document.querySelector('#app'))
            },
            { './react': 'src/react/index.js', './react-dom': 'src/react-dom/index.js' },
        ],
        'node_modules/parcel-bundler/src/builtins/hmr-runtime.js': [
            function(require, module, exports) {
                var global = arguments[3]
                var OVERLAY_ID = '__parcel__error__overlay__'
                var OldModule = module.bundle.Module

                function Module(moduleName) {
                    OldModule.call(this, moduleName)
                    this.hot = {
                        data: module.bundle.hotData,
                        _acceptCallbacks: [],
                        _disposeCallbacks: [],
                        accept: function(fn) {
                            this._acceptCallbacks.push(fn || function() {})
                        },
                        dispose: function(fn) {
                            this._disposeCallbacks.push(fn)
                        },
                    }
                    module.bundle.hotData = null
                }

                module.bundle.Module = Module
                var parent = module.bundle.parent

                if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
                    var hostname = '' || location.hostname
                    var protocol = location.protocol === 'https:' ? 'wss' : 'ws'
                    var ws = new WebSocket(protocol + '://' + hostname + ':' + '56313' + '/')

                    ws.onmessage = function(event) {
                        var data = JSON.parse(event.data)

                        if (data.type === 'update') {
                            console.clear()
                            data.assets.forEach(function(asset) {
                                hmrApply(global.parcelRequire, asset)
                            })
                            data.assets.forEach(function(asset) {
                                if (!asset.isNew) {
                                    hmrAccept(global.parcelRequire, asset.id)
                                }
                            })
                        }

                        if (data.type === 'reload') {
                            ws.close()

                            ws.onclose = function() {
                                location.reload()
                            }
                        }

                        if (data.type === 'error-resolved') {
                            console.log('[parcel] ✨ Error resolved')
                            removeErrorOverlay()
                        }

                        if (data.type === 'error') {
                            console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack)
                            removeErrorOverlay()
                            var overlay = createErrorOverlay(data)
                            document.body.appendChild(overlay)
                        }
                    }
                }

                function removeErrorOverlay() {
                    var overlay = document.getElementById(OVERLAY_ID)

                    if (overlay) {
                        overlay.remove()
                    }
                }

                function createErrorOverlay(data) {
                    var overlay = document.createElement('div')
                    overlay.id = OVERLAY_ID // html encode message and stack trace

                    var message = document.createElement('div')
                    var stackTrace = document.createElement('pre')
                    message.innerText = data.error.message
                    stackTrace.innerText = data.error.stack
                    overlay.innerHTML =
                        '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
                        '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
                        '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
                        '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' +
                        message.innerHTML +
                        '</div>' +
                        '<pre>' +
                        stackTrace.innerHTML +
                        '</pre>' +
                        '</div>'
                    return overlay
                }

                function getParents(bundle, id) {
                    var modules = bundle.modules

                    if (!modules) {
                        return []
                    }

                    var parents = []
                    var k, d, dep

                    for (k in modules) {
                        for (d in modules[k][1]) {
                            dep = modules[k][1][d]

                            if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
                                parents.push(k)
                            }
                        }
                    }

                    if (bundle.parent) {
                        parents = parents.concat(getParents(bundle.parent, id))
                    }

                    return parents
                }

                function hmrApply(bundle, asset) {
                    var modules = bundle.modules

                    if (!modules) {
                        return
                    }

                    if (modules[asset.id] || !bundle.parent) {
                        var fn = new Function('require', 'module', 'exports', asset.generated.js)
                        asset.isNew = !modules[asset.id]
                        modules[asset.id] = [fn, asset.deps]
                    } else if (bundle.parent) {
                        hmrApply(bundle.parent, asset)
                    }
                }

                function hmrAccept(bundle, id) {
                    var modules = bundle.modules

                    if (!modules) {
                        return
                    }

                    if (!modules[id] && bundle.parent) {
                        return hmrAccept(bundle.parent, id)
                    }

                    var cached = bundle.cache[id]
                    bundle.hotData = {}

                    if (cached) {
                        cached.hot.data = bundle.hotData
                    }

                    if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
                        cached.hot._disposeCallbacks.forEach(function(cb) {
                            cb(bundle.hotData)
                        })
                    }

                    delete bundle.cache[id]
                    bundle(id)
                    cached = bundle.cache[id]

                    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
                        cached.hot._acceptCallbacks.forEach(function(cb) {
                            cb()
                        })

                        return true
                    }

                    return getParents(global.parcelRequire, id).some(function(id) {
                        return hmrAccept(global.parcelRequire, id)
                    })
                }
            },
            {},
        ],
    },
    {},
    ['node_modules/parcel-bundler/src/builtins/hmr-runtime.js', 'src/index.js'],
    null
)
//# sourceMappingURL=/src.a2b27638.map
