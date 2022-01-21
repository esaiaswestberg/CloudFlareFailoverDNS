import { get } from './requestHandler.js';
import { SERVICE_CONTAINS, SERVICE_HOST } from '../env_constants.js';

/**
 * This function checks whether the service contains the html in the environment variable.
 * @param ip The IP address to check.
 * @returns Whether the service contains the html.
 */
export const serviceContainsHTML = async (ip: string) => {
	let html = '';
	try {
		html = await get(`http://${ip}`, {
			host: SERVICE_HOST
		});
	} catch (error) {
		return false;
	}

	if (SERVICE_CONTAINS) {
		if (html.includes(SERVICE_CONTAINS)) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new Error('Environment variable SERVICE_CONTAINS is not set');
	}
};
