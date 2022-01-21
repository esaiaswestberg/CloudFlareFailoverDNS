import { config } from 'dotenv';
config();
import { get } from './requestHandler.js';

const SERVICE_CONTAINS = process.env.SERVICE_CONTAINS;
const SERVICE_HOST = process.env.SERVICE_HOST;

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
