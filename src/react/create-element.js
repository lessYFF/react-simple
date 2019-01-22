const createElement = function(tag, attrs, ...children) {
    attrs = attrs || {}
    return {
        tag,
        attrs,
        key: attrs.key,
        children,
    }
}

export default createElement
