import querystring from 'querystring'
import * as _ from './util'
import dispatch from './dispatch'
import createHistory from './createHistory'
import {
	createLocation
} from 'history/LocationUtils'

import {
	Router
} from './createRouter'

let currentHistory
// export currentHistory for Link component
export function getCurrentHistory() {
	return currentHistory
}

export default function createMiddleware(options) {
	let finalOptions = Object.assign({}, options)
	let context = Object.assign({}, finalOptions.context, {
		isServer: true,
		isClient: false,
	})
	let basename = finalOptions.basename
	let router = finalOptions.router
	let renderer = finalOptions.renderer
	let layout = finalOptions.layout || 'layout'

	if (!(router instanceof Router)) {
		throw new Error(`[${router}] is an invalid router`)
	}

	let history = currentHistory = createHistory({
		type: 'createMemoryHistory',
		basename: basename,
	})

	history.prependBasename = url => {
		if (basename) {
			return basename + url
		}
		return url
	}

	return function(req, res, next) {
		let url = req.url.indexOf(basename) === 0 ? req.url.substr(basename.length) : req.url
		let location = createLocation(url)
		let currentContext = Object.assign({}, context, {
			req,
			res,
			history,
			location,
			query: req.query,
		})
		let render = view => {
			if (_.isThenable(view)) {
				view.then(render)
			}
			if (view != null) {
				res.render(layout, {
					view: renderer(view),
					context: currentContext,
				})
			}
		}
		try {
			let result = render(dispatch(router.routes, currentContext))
			if (_.isThenable(result)) {
				result.catch(next)
			}
		} catch (error) {
			next(error)
		}
	}
}