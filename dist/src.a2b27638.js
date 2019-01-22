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
        'src/react-dom/diff.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.diff = diff
                exports.renderComponent = renderComponent

                var _dom = _interopRequireDefault(require('./dom'))

                var _react = require('../react')

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                function _toConsumableArray(arr) {
                    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
                }

                function _nonIterableSpread() {
                    throw new TypeError('Invalid attempt to spread non-iterable instance')
                }

                function _iterableToArray(iter) {
                    if (
                        Symbol.iterator in Object(iter) ||
                        Object.prototype.toString.call(iter) === '[object Arguments]'
                    )
                        return Array.from(iter)
                }

                function _arrayWithoutHoles(arr) {
                    if (Array.isArray(arr)) {
                        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
                            arr2[i] = arr[i]
                        }
                        return arr2
                    }
                }

                /**
                 *@param {HTMLElement} dom 真实DOM
                 *@param {vnode} vnode 虚拟DOM
                 *@param {HTMLElement} container 容器
                 *@return {HTMLElement} 更新后的DOM
                 */
                function diff(dom, vnode, container) {
                    var newDOM = diffNode(dom, vnode)

                    if (container && newDOM.parentNode !== container) {
                        container.appendChild(newDOM)
                    }

                    return newDOM
                }

                function diffNode(dom, vnode) {
                    var outer = dom // 异常情况:undefined、null、boolean类型

                    if (!vnode) vnode = '' // 比较数值或者字符串

                    if (typeof vnode === 'string' || typeof vnode === 'number') {
                        // 当前就是文本节点,直接替换
                        if (dom && dom.nodeType === 3) {
                            if (dom.textContent !== vnode) {
                                dom.textContent = vnode
                            }
                        } else {
                            // 当前不是文本节点, 新建文本节点替换原来节点
                            outer = document.createTextNode(vnode)

                            if (dom && dom.parentNode) {
                                dom.parentNode.replaceChild(outer, dom)
                            }
                        }

                        return outer
                    } // 比较组件

                    if (typeof vnode.tag === 'function') {
                        return diffComponent(dom, vnode)
                    } // 比较正常DOM

                    if (!dom || !isSameNodeType(dom, vnode)) {
                        outer = document.createElement(vnode.tag)

                        if (dom) {
                            // 将原来的子节点移到新节点下
                            _toConsumableArray(dom.childNodes).map(outer.appendChild) // 移除掉原来的DOM对象

                            if (dom.perentNode) {
                                dom.parentNode.replaceChild(outer, dom)
                            }
                        }
                    } // 比较子节点

                    if ((vnode.children && vnode.children.length) || (outer.childNodes && outer.childNodes.length)) {
                        diffChildren(outer, vnode.children)
                    } // 比较属性

                    diffAttributes(outer, vnode)
                    return outer
                }

                function diffChildren(dom, vchildren) {
                    var keyed = {}
                    var children = []
                    var domChildren = Array.from(dom.childNodes) // 把带key和不带key的分开

                    if (domChildren.length) {
                        for (var _i = 0; _i < domChildren.length; _i++) {
                            var child = domChildren[_i]
                            var key = child.key

                            if (key) {
                                keyed[key] = child
                            } else {
                                children.push(child)
                            }
                        }
                    }

                    if (vchildren && vchildren.length) {
                        var min = 0
                        var childrenLen = children.length

                        for (var i = 0; i < vchildren.length; i++) {
                            var _child2 = void 0

                            var vchild = vchildren[i]
                            var _key = vchild.key

                            if (_key && keyed[_key]) {
                                _child2 = keyed[_key]
                                keyed[_key] = undefined
                            } else if (min < childrenLen) {
                                for (var j = min; j < childrenLen; j++) {
                                    var _child = children[j]

                                    if (_child && isSameNodeType(_child, vchild)) {
                                        _child2 = _child
                                        children[j] = undefined
                                        if (j === childrenLen - 1) childrenLen--
                                        if (j === min) min++
                                        break
                                    }
                                }
                            }

                            _child2 = diffNode(_child2, vchild)
                            var f = domChildren[i]

                            if (_child2 && _child2 !== dom && _child2 !== f) {
                                if (!f) {
                                    // 新增节点
                                    dom.appendChild(_child2)
                                } else if (_child2 === f.nextSibling) {
                                    // 移除节点
                                    removeNode(f)
                                } else {
                                    // 插入节点
                                    dom.insertBefore(_child2, f)
                                }
                            }
                        }
                    }
                }

                function diffComponent(dom, vnode) {
                    var oldDOM = dom
                    var comp = dom && dom._component // 组件类型没有变化,重置属性

                    if (comp && comp.constructor === vnode.tag) {
                        setComponentProps(comp, vnode.attrs)
                        dom = comp.base
                    } else {
                        // 组件类型变化,移除旧组件渲染新组件
                        if (comp) {
                            unmountComponent(comp)
                            oldDOM = null
                        }

                        comp = createComponent(vnode.tag, vnode.attrs)
                        setComponentProps(comp, vnode.attrs)
                        dom = comp.base

                        if (oldDOM && dom !== oldDOM) {
                            oldDOM._component = null
                            removeNode(oldDOM)
                        }
                    }

                    return dom
                }

                function diffAttributes(dom, vnode) {
                    var old = {}
                    var attrs = vnode.attrs

                    var _arr = Array.from(dom.attributes)

                    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
                        var attr = _arr[_i2]
                        old[attr.name] = attr.value
                    } // 新属性中没有老属性, 移除之

                    for (var name in old) {
                        if (!(name in attrs)) {
                            ;(0, _dom.default)(dom, name, undefined)
                        }
                    } // 更新新属性值

                    for (var _name in attrs) {
                        if (old[_name] !== attrs[_name]) {
                            ;(0, _dom.default)(dom, _name, attrs[_name])
                        }
                    }
                } // 设置组件属性

                function setComponentProps(component, props) {
                    if (!component.base && component.componentWillMount) {
                        component.componentWillMount()
                    } else if (component.componentWillReceiveProps) {
                        component.componentWillReceiveProps(props)
                    }

                    component.props = props
                    renderComponent(component)
                } // 更新组件

                function renderComponent(component) {
                    var renderor = component.render()

                    if (component.base && component.componentWillUpdate) {
                        component.componentWillUpdate()
                    }

                    var base = diffNode(component.base, renderor)
                    component.base = base
                    base._component = component

                    if (component.base && component.componentDidUpdate) {
                        component.componentDidUpdate()
                    } else if (component.componentDidMount) {
                        component.componentDidMount()
                    }
                } // 创建组件

                function createComponent(component, props) {
                    var newComponent

                    if ('render' in component.prototype) {
                        newComponent = new component(props)
                    } else {
                        newComponent = new _react.Component(props)
                        newComponent.constructor = component

                        newComponent.render = function() {
                            return this.constructor(props)
                        }
                    }

                    return newComponent
                } // 卸载组件

                function unmountComponent(component) {
                    if (component.componentWillUnmount) component.componentWillUnmount()
                    removeNode(component.base)
                } // 类型判断封装

                function isSameNodeType(dom, vnode) {
                    if (typeof vnode === 'string' || typeof vnode === 'number') {
                        return dom.nodeType === 3
                    }

                    if (typeof vnode.tag === 'string') {
                        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase()
                    }

                    return dom && dom._component && dom._component.constructor === vnode.tag
                } // 移除Node封装

                function removeNode(dom) {
                    if (dom && dom.parentNode) {
                        dom.parentNode.removeChild(dom)
                    }
                }
            },
            { './dom': 'src/react-dom/dom.js', '../react': 'src/react/index.js' },
        ],
        'src/react/component.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                var _diff = require('../react-dom/diff')

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
                                    ;(0, _diff.renderComponent)(this)
                                },
                            },
                        ])

                        return Component
                    })()

                var _default = Component
                exports.default = _default
            },
            { '../react-dom/diff': 'src/react-dom/diff.js' },
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

                    attrs = attrs || {}
                    return {
                        tag: tag,
                        attrs: attrs,
                        key: attrs.key,
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
        'src/react-dom/render.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                var _diff = require('./diff')

                function render(vnode, container, dom) {
                    return (0, _diff.diff)(dom, vnode, container)
                }

                var _default = render
                exports.default = _default
            },
            { './diff': 'src/react-dom/diff.js' },
        ],
        'src/react-dom/index.js': [
            function(require, module, exports) {
                'use strict'

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                })
                exports.default = void 0

                var _render = _interopRequireDefault(require('./render'))

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule ? obj : { default: obj }
                }

                var _default = {
                    render: _render.default,
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
                                        _react.default.createElement('h1', null, 'count: ', this.state.num),
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
                    var ws = new WebSocket(protocol + '://' + hostname + ':' + '61020' + '/')

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
