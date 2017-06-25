import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import querystring from 'querystring'
import { createApp, createRouter, createMiddleware } from 'retour'
import Link from './component/Link'

const Menu = () => {
	return (
		<ul>
			<li><Link to="/home">Home</Link></li>
			<li><Link to="/list">List</Link></li>
			<li><Link to="/detail">Detail</Link></li>
			<li><Link to="/detail?delay=1000">Detail(delay 1000)</Link></li>
		</ul>
	)
}

const View = props => {
	return (
		<div>
			<Menu />
			<div>
				<pre>{JSON.stringify(props, null, 2)}</pre>
			</div>
		</div>
	)
}

const router = createRouter()

router.match('/home', context => {
	return <View context={context} />
})

router.match('/list', context => {
	return <View context={context} />
})

const sleep = (timeout=1000) => new Promise(resolve => setTimeout(resolve, timeout))

router.match('/detail', context => {
	let delay = Number(context.query.delay)
	if (delay) {
		return sleep(delay)
	}
})

router.match('/detail', context => {
	return <View context={context} />
})


// 在浏览器端模拟一次 request 请求
if (window.location.search.includes('ssr')) {
	const middleware = createMiddleware({
		basename: '#!/test_basename',
		router: router,
		renderer: view => ReactDOMServer.renderToString(view),
	})
	let container = document.getElementById('root')
	let url = window.location.hash
	let req = {
		url: url,
		query: querystring.parse(url.split('?')[1] || '')
	}
	let res = {
		render: (layout, { view, context }) => {
			container.innerHTML = view
		}
	}
	let next = error => console.log('error', error)
	middleware(req, res, next)

	window.addEventListener('hashchange', () => {
		window.location.reload()
	})
} else {
	const app = createApp({
		container: '#root',
		history: {
			basename: '/test_basename',
		},
		router,
		renderer: (view, container) => {
			let finalView = view || <div>empty</div>
			ReactDOM.render(finalView, container)
		},
	})

	app.start()
}

