import { Status } from '../types/Status';
import StatusSnapshot from '../types/StatusSnapshot';

const history: Array<StatusSnapshot> = [];

export const registerStatus = (status: Status) => {
	history.push({ status, timestamp: new Date() });
};
