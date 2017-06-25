import match from './match'
import * as _ from './util'

export default function dispatch(routes, context) {
	return matchRoutes(routes, context)
}

function matchRoutes(routes, context, index=0) {
	let next = view => {
		if (_.isThenable(view)) {
			return view.then(next)
		}
		if (view !== undefined) {
			return view
		}
		return matchRoutes(routes, context, index)
	}
	if (index < routes.length) {
		let route = routes[index++]
		let { path, handlers } = route
		let params = match(context.location.pathname, path)
		if (!params) {
			return next()
		}
		return next(invokeHandlers(handlers, context))
	}
	return null
}

function invokeHandlers(handlers, context, index=0) {
	let next = view => {
		if (_.isThenable(view)) {
			return view.then(next)
		}
		if (view !== undefined) {
			return view
		}
		return invokeHandlers(handlers, context, index)
	}
	if (index < handlers.length) {
		let handler = handlers[index++]
		return next(handler(context))
	}
}
