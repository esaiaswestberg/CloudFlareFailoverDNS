import { get } from './utils/requestHandler';
import { default as ipGetter} from 'public-ip';
import { config } from 'dotenv';
config();

/**
 * For master:
 * 1. Get public IP.
 * 2. Get current Cloudflare IP.
 * 3. Check if local Bitwarden is running.
 * 4. If running, change Cloudflare IP to public IP.
 */

// Fetch client public IP
const publicIp = await ipGetter.v4();
console.log(`Client IP: ${publicIp}`);