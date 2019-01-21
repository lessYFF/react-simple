function setAttribute(dom, name, value = '') {
    if (name === 'className') name = 'class'

    if (/on\w+/.test(name)) {
        name = name.toLowerCase()
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

export default setAttribute
