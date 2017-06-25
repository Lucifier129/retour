import { getCurrentHistory as getClientHistory } from './createApp'
import { getCurrentHistory as getServerHistory } from './createMiddleware'

export default function getCurrentHistory() {
	return getClientHistory() || getServerHistory()
}