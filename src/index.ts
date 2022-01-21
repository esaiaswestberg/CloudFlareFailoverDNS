import { default as ipGetter } from 'public-ip';
import { config } from 'dotenv';
import * as cloudflare from './utils/cloudflareHandler.js';
config();

try {
	/**
	 * For master:
	 * 1. Get public IP. X
	 * 2. Get current Cloudflare IP. X
	 * 3. Check if local Bitwarden is running.
	 * 4. If running, change Cloudflare IP to public IP.
	 */

	// Fetch client public IP
	const publicIp = await ipGetter.v4();
	console.log(`Public IP: ${publicIp}`);

	// Fetch Cloudflare IP
	const cloudflareIp = await cloudflare.getIp();
	console.log(`Cloudflare IP: ${cloudflareIp}`);
} catch (error) {
	console.error(error);
}
