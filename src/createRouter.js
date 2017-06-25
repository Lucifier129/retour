export default function createRouter() {
	return new Router()
}

export class Router {
	constructor() {
		this.routes = []
	}
	match(path, ...handlers) {
		if (!path) {
			throw new Error(`path is invalid:${path}`)
		}
		if (!handlers.length) {
			throw new Error(`missing handler argument`)
		}
		this.routes.push({ path, handlers })
		return this
	}
}