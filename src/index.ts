import { default as ipGetter } from 'public-ip';
import * as cloudflare from './handlers/cloudflareHandler.js';
import * as statusHandler from './handlers/statusHandler.js';

const isMain = async () => {
	try {
		// Fetch client public IP
		const publicIp = await ipGetter.v4();
		console.log(`Public IP: ${publicIp}`);

		// Fetch Cloudflare IP
		const cloudflareIp = await cloudflare.getIp();
		console.log(`Cloudflare IP: ${cloudflareIp}`);

		// In case of failure getting Cloudflare IP
		if (!cloudflareIp) {
			return console.error('Unable to get cloudflare IP');
		}

		// Check if Bitwarden is running
		const isUpLocally = await statusHandler.serviceContainsHTML(publicIp);
		console.log(`Service is running: ${isUpLocally}`);

		// If Running, change cloudflare IP to public IP
		if (isUpLocally && publicIp !== cloudflareIp) {
			console.log('Setting Cloudflare IP to Public IP');
			const success = await cloudflare.setIp(publicIp);
			console.log(`Cloudflare IP set to Public IP: ${success}`);
		}
	} catch (error) {
		console.log('Main mode failed, caught error:\n', error);
	}
};

const isBackup = async () => {
	try {
		// Fetch Cloudflare IP
		const cloudflareIp = await cloudflare.getIp();
		console.log(`Cloudflare IP: ${cloudflareIp}`);

		// In case of failure getting Cloudflare IP
		if (!cloudflareIp) {
			return console.error('Unable to get cloudflare IP');
		}

		// Is service up on cloudflare?
		const isUpCloudflare = await statusHandler.serviceContainsHTML(
			cloudflareIp
		);
		console.log(`Cloudflare service is running: ${isUpCloudflare}`);

		// Fetch client public IP
		const publicIp = await ipGetter.v4();
		console.log(`Public IP: ${publicIp}`);

		// If not, is it up locally?
		let isUpLocally = false;
		if (!isUpCloudflare) {
			isUpLocally = await statusHandler.serviceContainsHTML(publicIp);
			console.log(`Local service is running: ${isUpLocally}`);
		}

		// Change if up
		if (isUpLocally && publicIp !== cloudflareIp) {
			console.log('Setting Cloudflare IP to Public IP');
			const success = await cloudflare.setIp(publicIp);
			console.log(`Cloudflare IP set to Public IP: ${success}`);
		}
	} catch (error) {
		console.log('Backup mode failed, caught error:\n', error);
	}
};

try {
	if (process.env.TYPE === 'MAIN') {
		setInterval(async () => await isMain(), 10000);
	} else if (process.env.TYPE === 'BACKUP') {
		setInterval(async () => await isBackup(), 10000);
	} else {
		throw new Error('Invalid environmental variable TYPE');
		process.exit();
	}
} catch (error) {
	console.error(error);
}
