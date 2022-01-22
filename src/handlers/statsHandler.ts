import { Status } from '../enums/Status.js';
import StatusSnapshot from '../types/StatusSnapshot';

export const history: Array<StatusSnapshot> = [];

/**
 * Register a new status.
 * @param status Status to register.
 */
export const registerStatus = (
	status: Status,
	timestamp: Date = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate()
	)
) => {
	if (
		history.length > 0 &&
		history[history.length - 1].timestamp === timestamp
	) {
	}
	history.push({ status, timestamp });

	// Keep for 6 months
	const cutoff = 6 * 30 * 24 * 60 * 6;
	if (history.length > cutoff) {
		history.splice(0, history.length - cutoff);
	}
};
