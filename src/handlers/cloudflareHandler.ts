import { get, put } from './requestHandler.js';
import { ZONE_ID, RECORD_ID, API_KEY, SERVICE_HOST } from '../env_constants.js';

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

/**
 * Set the Cloudflare DNS record to the given IP.
 * @param ip The IP address to set.
 * @returns Whether the request was successful.
 */
export const setIp = async (ip: string): Promise<boolean> => {
	try {
		const resp = await put(
			`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${RECORD_ID}`,
			{
				'Authorization': `Bearer ${API_KEY}`,
				'Content-Type': 'application/json'
			},
			{
				'type': 'A',
				'name': SERVICE_HOST,
				'content': ip,
				'ttl': 1,
				'proxied': true
			}
		);

		const data = JSON.parse(resp);
		return !!data.success;
	} catch {
		return false;
	}
};
