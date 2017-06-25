import { getCurrentHistory as getClientHistory } from './createApp'
import { getCurrentHistory as getServerHistory } from './createMiddleware'

let getCurrentHistory

if (typeof window !== 'undefined') {
	getCurrentHistory = getClientHistory
} else {
	getCurrentHistory = getServerHistory
}

export default getCurrentHistory