import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import * as _ from './util'

const typeMap = {createBrowserHistory, createHashHistory, createMemoryHistory}

const defaults = {
	type: 'createHashHistory',
	hashType: 'hashbang',   
}

export default function(type, options) {
	let createHistory = typeMap[type]
	let isMatched = (
		createHistory === createBrowserHistory ||
		createHistory === createHashHistory ||
		createHistory === createMemoryHistory
	)
	if (!isMatched) {
		throw new Error(`${type} is an invalid type of history`)
	}
	let finalOptions = _.assign({}, defaults, options)
	return createHistory(finalOptions)
}
