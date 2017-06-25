import pathToRegexp from 'path-to-regexp'

export default function match(pathname, path) {
    let keys = []
    let regexp = pathToRegexp(path, keys)
    let matches = regexp.exec(cleanPath(pathname))
    return matches && getParams(matches, keys)
}

function getParams(matches, keys) {
    let params = {}
    for (let i = 1, len = matches.length; i < len; i++) {
        let key = keys[i - 1]
        if (key) {
            if (typeof matches[i] === 'string') {
                params[key.name] = decodeURIComponent(matches[i])
            } else {
                params[key.name] = matches[i]
            }
        }
    }
    return params
}

function cleanPath(path) {
    return path.replace(/\/\//g, '/')
}