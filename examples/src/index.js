import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import createApp from '../../src/createApp'
import createRouter from '../../src/createRouter'
import Link from './component/Link'

const Menu = () => {
	return (
		<ul>
			<li><Link to="/home">Home</Link></li>
			<li><Link to="/list">List</Link></li>
			<li><Link to="/detail">Detail</Link></li>
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

router.match('/detail', context => {
	return <View context={context} />
})

const app = createApp({
	router,
	renderer: ReactDOM.render,
})

app.start()