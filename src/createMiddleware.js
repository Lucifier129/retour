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
	let finalOptions = _.assign({}, options)
	let context = _.assign({}, finalOptions.context, {
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

	let history = currentHistory = createHistory('createMemoryHistory', {
		basename
	})

	return function(req, res, next) {
		let location = createLocation(req.url)
		let currentContext = _.assign({}, context, {
			req,
			res,
			history,
		})
		let render = view => {
			if (_.isThenable(view)) {
				view.then(render)
			}
			if (view != null) {
				res.render(layout, {
					view: view,
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