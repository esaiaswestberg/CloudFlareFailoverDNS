import { Status } from '../types/Status';
import StatusSnapshot from '../types/StatusSnapshot';

export const history: Array<StatusSnapshot> = [];

/**
 * Register a new status.
 * @param status Status to register.
 */
export const registerStatus = (status: Status) => {
	history.push({ status, timestamp: new Date() });

	// Keep for 6 months
	const cutoff = 6 * 30 * 24 * 60 * 6;
	if (history.length > cutoff) {
		history.splice(0, history.length - cutoff);
	}
};
