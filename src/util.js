// util
export function isThenable(obj) {
    return obj != null && typeof obj.then === 'function'
}

export function isFunction(obj) {
    return typeof obj === 'function'
}

export function identity(obj) {
    return obj
}

export let assign = Object.assign || function(to, from) {
    if (!from) {
        return to
    }

    if (arguments.length > 2) {
        let index = 1
        while (index < arguments.length) {
            extend(to, arguments[index++])
        }
        return to
    }

    var keys = Object.keys(from)
    var i = keys.length
    while (i--) {
        to[keys[i]] = from[keys[i]]
    }
    return to
}