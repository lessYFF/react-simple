import setAttribute from './dom'
import { Component } from '../react'

/**
 *@param {HTMLElement} dom 真实DOM
 *@param {vnode} vnode 虚拟DOM
 *@param {HTMLElement} container 容器
 *@return {HTMLElement} 更新后的DOM
 */
function diff(dom, vnode, container) {
    const newDOM = diffNode(dom, vnode)

    if (container && newDOM.parentNode !== container) {
        container.appendChild(newDOM)
    }
    return newDOM
}

function diffNode(dom, vnode) {
    let outer = dom

    // 异常情况:undefined、null、boolean类型
    if (!vnode) vnode = ''
    // 比较数值或者字符串
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
    }
    // 比较组件
    if (typeof vnode.tag === 'function') {
        return diffComponent(dom, vnode)
    }
    // 比较正常DOM
    if (!dom || !isSameNodeType(dom, vnode)) {
        outer = document.createElement(vnode.tag)

        if (dom) {
            // 将原来的子节点移到新节点下
            ;[...dom.childNodes].map(outer.appendChild)
            // 移除掉原来的DOM对象
            if (dom.perentNode) {
                dom.parentNode.replaceChild(outer, dom)
            }
        }
    }
    // 比较子节点
    if ((vnode.children && vnode.children.length) || (outer.childNodes && outer.childNodes.length)) {
        diffChildren(outer, vnode.children)
    }
    // 比较属性
    diffAttributes(outer, vnode)

    return outer
}

function diffChildren(dom, vchildren) {
    const keyed = {}
    const children = []
    const domChildren = Array.from(dom.childNodes)

    // 把带key和不带key的分开
    if (domChildren.length) {
        for (let child of domChildren) {
            const key = child.key
            if (key) {
                keyed[key] = child
            } else {
                children.push(child)
            }
        }
    }

    if (vchildren && vchildren.length) {
        let min = 0
        let childrenLen = children.length

        for (let i = 0; i < vchildren.length; i++) {
            let child
            const vchild = vchildren[i]
            const key = vchild.key

            if (key && keyed[key]) {
                child = keyed[key]
                keyed[key] = undefined
            } else if (min < childrenLen) {
                for (let j = min; j < childrenLen; j++) {
                    let _child = children[j]

                    if (_child && isSameNodeType(_child, vchild)) {
                        child = _child
                        children[j] = undefined

                        if (j === childrenLen - 1) childrenLen--
                        if (j === min) min++
                        break
                    }
                }
            }
            child = diffNode(child, vchild)

            const f = domChildren[i]
            if (child && child !== dom && child !== f) {
                if (!f) {
                    // 新增节点
                    dom.appendChild(child)
                } else if (child === f.nextSibling) {
                    // 移除节点
                    removeNode(f)
                } else {
                    // 插入节点
                    dom.insertBefore(child, f)
                }
            }
        }
    }
}

function diffComponent(dom, vnode) {
    let oldDOM = dom
    let comp = dom && dom._component

    // 组件类型没有变化,重置属性
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
    const old = {}
    const attrs = vnode.attrs

    for (let attr of Array.from(dom.attributes)) {
        old[attr.name] = attr.value
    }

    // 新属性中没有老属性, 移除之
    for (let name in old) {
        if (!(name in attrs)) {
            setAttribute(dom, name, undefined)
        }
    }
    // 更新新属性值
    for (let name in attrs) {
        if (old[name] !== attrs[name]) {
            setAttribute(dom, name, attrs[name])
        }
    }
}

// 设置组件属性
function setComponentProps(component, props) {
    if (!component.base && component.componentWillMount) {
        component.componentWillMount()
    } else if (component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props)
    }

    component.props = props

    renderComponent(component)
}

// 更新组件
function renderComponent(component) {
    const renderor = component.render()

    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate()
    }
    let base = diffNode(component.base, renderor)

    component.base = base
    base._component = component
    if (component.base && component.componentDidUpdate) {
        component.componentDidUpdate()
    } else if (component.componentDidMount) {
        component.componentDidMount()
    }
}

// 创建组件
function createComponent(component, props) {
    let newComponent

    if ('render' in component.prototype) {
        newComponent = new component(props)
    } else {
        newComponent = new Component(props)
        newComponent.constructor = component
        newComponent.render = function() {
            return this.constructor(props)
        }
    }

    return newComponent
}

// 卸载组件
function unmountComponent(component) {
    if (component.componentWillUnmount) component.componentWillUnmount()
    removeNode(component.base)
}

// 类型判断封装
function isSameNodeType(dom, vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return dom.nodeType === 3
    }
    if (typeof vnode.tag === 'string') {
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase()
    }

    return dom && dom._component && dom._component.constructor === vnode.tag
}

// 移除Node封装
function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom)
    }
}

export { diff, renderComponent }
