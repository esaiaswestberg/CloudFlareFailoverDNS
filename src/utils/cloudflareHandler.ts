import { get } from './requestHandler.js';
import { config } from 'dotenv';
config();

const ZONE_ID = process.env.ZONE_ID;
const RECORD_ID = process.env.RECORD_ID;
const API_KEY = process.env.API_KEY;

/**
 * Gets the current IP address of the Cloudflare DNS record.
 * @returns The current Cloudflare IP.
 */
export const getIp = async (): Promise<string> => {
	const resp = await get(
		`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${RECORD_ID}`,
		{
			'Authorization': `Bearer ${API_KEY}`,
			'Content-Type': 'application/json'
		}
	);

	return JSON.parse(resp).result.content;
};
