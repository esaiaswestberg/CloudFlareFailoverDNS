import { default as ipGetter } from 'public-ip';
import * as cloudflare from './handlers/cloudflareHandler.js';
import * as statusHandler from './handlers/statusHandler.js';
import { registerStatus } from './handlers/statsHandler.js';
import { Status } from './enums/Status.js';
import './web/express.js';

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
	// Fetch Cloudflare IP
	const cloudflareIp = await cloudflare.getIp();
	console.log(`Cloudflare IP: ${cloudflareIp}`);

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

	// Register status
	if (cloudflareIp !== publicIp) {
		registerStatus(isUpCloudflare ? Status.main : Status.offline);
	} else if (cloudflareIp === publicIp) {
		registerStatus(isUpLocally ? Status.backup : Status.offline);
	}
};

// TODO: REMOVE
for (let d = 0; d < 30; d++) {
	const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
	registerStatus(
		Math.random() > 0.75
			? Status.main
			: Math.random() > 0.75
			? Status.backup
			: Status.offline,
		date
	);
}
console.log('Dev data generated');

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
