import querystring from 'querystring'
import {
	Router
} from './createRouter'
import match from './match'
import createHistory from './createHistory'
import dispatch from './dispatch'
import * as _ from './util'

const defaultRenderer = (view, container) => {
	// view = null means clear the view
	if (view === null) {
		container.innerHTML = ''
		return
	}
	// otherwise render view to container
	container.innerHTML = view
}

const defaults = {
	container: '#root',
	renderer: defaultRenderer,
	router: null,
	history: {},
}

let currentHistory
// export currentHistory for Link component
export function getCurrentHistory() {
	return currentHistory
}

export default function createApp(options = {}) {
	let finalOptions = Object.assign({}, defaults, options)
	let {
		router,
		renderer,
		container,
	} = finalOptions

	if (!(router instanceof Router)) {
		throw new Error(`[${router}] is an invalid router`)
	}

	let history = currentHistory = createHistory(finalOptions.history)
	let context = Object.assign({}, finalOptions.context, {
		isClient: true,
		isServer: false,
		history: history,
	})

	history.prependBasename = url => {
		if (finalOptions.history && finalOptions.history.basename) {
			return finalOptions.history.basename + url
		}
		return url
	}

	let finalContainer = null

	function getContainer() {
		if (finalContainer) {
			return finalContainer
		}
		if (typeof container === 'string') {
			return finalContainer = document.querySelector(container)
		} else {
			return finalContainer = container
		}
	}

	function renderToContainer(view, location) {
		if (currentLocation !== location) {
			return
		}
		renderer(view, getContainer())
	}

	let currentLocation
	function render(location) {
		let query = querystring.parse(location.search.substr(1))
		let currentContext = Object.assign({}, context, {
			location: currentLocation = location,
			query: query,
		})
		let view = dispatch(router.routes, currentContext)
		if (_.isThenable(view)) {
			view.then(view => renderToContainer(view, location))
			return
		}
		renderToContainer(view, location)
	}

	let unlisten = null

	function start(shouldRenderWithCurrentLocation) {
		unlisten = history.listen(render)
		if (shouldRenderWithCurrentLocation !== false) {
			render(history.location)
		}
		return unlisten
	}

	function stop() {
		if (unlisten) {
			unlisten()
			unlisten = null
		}
		renderer(null)
	}

	return {
		start,
		stop,
		getContainer,
		history,
		render,
	}
}