import setAttribute from './dom'
import Component from '../react/component'

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

// 更新组件
function renderComponent(component) {
    const renderor = component.render()

    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate()
    }
    let base = _render(renderor)

    if (component.base && component.componentDidUpdate) {
        component.componentDidUpdate()
    } else if (component.componentDidMount) {
        component.componentDidMount()
    }

    if (component.base && component.base.parentNode) {
        component.base.parentNode.replaceChild(base, component.base)
    }

    component.base = base
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

function _render(vnode) {
    if (!vnode) vnode = ''

    if (typeof vnode === 'string' || typeof vnode === 'number') {
        const textNode = document.createTextNode(vnode)
        return textNode
    }

    if (typeof vnode.tag === 'function') {
        const component = createComponent(vnode.tag, vnode.attrs)
        setComponentProps(component, vnode.attrs)

        return component.base
    }

    const DOM = document.createElement(vnode.tag)
    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach(key => {
            const value = vnode.attrs[key]
            setAttribute(DOM, key, value)
        })
    }

    if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
            render(child, DOM)
        })
    }

    return DOM
}

function render(vnode, container) {
    return container.appendChild(_render(vnode))
}

export { render, renderComponent }
