import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import * as _ from './util'

const typeMap = {createBrowserHistory, createHashHistory, createMemoryHistory}

const defaults = {
	type: 'createHashHistory',
	hashType: 'hashbang',   
}

export default function(options) {
	let finalOptions = Object.assign({}, defaults, options)
	let createHistory = typeMap[finalOptions.type]
	let isMatched = (
		createHistory === createBrowserHistory ||
		createHistory === createHashHistory ||
		createHistory === createMemoryHistory
	)
	if (!isMatched) {
		throw new Error(`${type} is an invalid type of history`)
	}
	
	return createHistory(finalOptions)
}
