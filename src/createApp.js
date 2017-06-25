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
	let finalOptions = _.assign({}, defaults, options)
	let {
		router,
		renderer,
		container,
	} = finalOptions

	if (!(router instanceof Router)) {
		throw new Error(`[${router}] is an invalid router`)
	}

	let history = currentHistory = createHistory(type, finalOptions.history)
	let context = _.assign({}, finalOptions.context, {
		isClient: true,
		isServer: false,
		history: history,
	})

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

	function render(location) {
		let view = dispatch(location, context)
		if (_.isThenable(view)) {
			view.then(renderer)
			return
		}
		renderer(view)
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