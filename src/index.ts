import { default as ipGetter } from 'public-ip';
import * as cloudflare from './handlers/cloudflareHandler.js';
import * as statusHandler from './handlers/statusHandler.js';

const isMain = async () => {
	// Fetch client public IP
	const publicIp = await ipGetter.v4();
	console.log(`Public IP: ${publicIp}`);

	// Fetch Cloudflare IP
	const cloudflareIp = await cloudflare.getIp();
	console.log(`Cloudflare IP: ${cloudflareIp}`);

	// Check if Bitwarden is running
	const isUpLocally = await statusHandler.serviceContainsHTML(publicIp);
	console.log(`Service is running: ${isUpLocally}`);

	// If Running, change cloudflare IP to public IP
	if (isUpLocally && publicIp !== cloudflareIp) {
		console.log('Setting Cloudflare IP to Public IP');
		const success = await cloudflare.setIp(publicIp);
		console.log(`Cloudflare IP set to Public IP: ${success}`);
	}
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
