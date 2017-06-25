import React, { PropTypes } from 'react'
import getCurrentHistory from '../../../src/getCurrentHistory'

class Link extends React.Component {
	static contextTypes = {
		history: PropTypes.object,
	}
	handleClick = event => {
		event.preventDefault()
		let { to, replace } = this.props
		let history = getCurrentHistory()
		if (replace) {
			history.replace(to)
		} else {
			history.push(to)
		}
	}
	render() {
		let { to, replace, ...props } = this.props
		if (to) {
			let history = getCurrentHistory()
			to = history.createHref(to)
		}
		return <a {...this.props} href={to || false} onClick={this.handleClick} />
	}
}