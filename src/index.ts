import { default as ipGetter } from 'public-ip';
import { config } from 'dotenv';
import * as cloudflare from './handlers/cloudflareHandler.js';
import * as statusHandler from './handlers/statusHandler.js';
config();

const isMain = async () => {
	// Fetch client public IP
	const publicIp = await ipGetter.v4();
	console.log(`Public IP: ${publicIp}`);

	// Fetch Cloudflare IP
	const cloudflareIp = await cloudflare.getIp();
	console.log(`Cloudflare IP: ${cloudflareIp}`);

	// Check if Bitwarden is running
	const isUpLocally = await statusHandler.serviceContainsHTML(publicIp);
	console.log(`Bitwarden is running: ${isUpLocally}`);

	// TODO: If Running, change cloudflare IP to public IP
};

const isBackup = async () => {
	throw 'Not implemented';
};

try {
	if (process.env.TYPE === 'MAIN') {
		await isMain();
	} else if (process.env.TYPE === 'BACKUP') {
		await isBackup();
	} else {
		throw new Error('Invalid environmental variable TYPE');
		process.exit;
	}
} catch (error) {
	console.error(error);
}
