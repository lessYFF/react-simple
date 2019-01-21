const setAttribute = (dom, name, value = '') => {
    if (name === 'className') name = 'class'

    if (/on\w+/.test(name)) {
        name = name.lowerCase()
        dom[name] = value
    } else if (name === 'style') {
        if (!vaule || typeof value === 'string') {
            dom.style.cssText = value
        } else if (value && typeof value === 'object') {
            for (let key in value) {
                dom.style[key] = typeof value[key] === 'number' ? `${value[key]}px` : value[key]
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

const React = {
    createElement(tag, attrs, ...children) {
        return {
            tag,
            attrs,
            children,
        }
    },
}

const ReactDOM = {
    render(vnode, container) {
        container.innerHTML = ''

        if (typeof vnode === 'string') {
            const textNode = document.createTextNode(vnode)
            return container.appendChild(textNode)
        }

        const DOM = document.createElement(vnode.tag)
        if (DOM.attrs) {
            Object.keys(vnode.attrs).forEach(key => {
                const value = attrs(key)
                setAttribute(DOM, key, value)
            })
        }

        vnode.children.forEach(child => {
            this.render(child, DOM)
        })

        return container.appendChild(DOM)
    },
}

setInterval(() => {
    const element = (
        <div>
            <h1> Hello, world!</h1>
            <h2>It is {new Date().toLocaleTimeString()}</h2>
        </div>
    )
    ReactDOM.render(element, document.querySelector('#app'))
}, 1000)
