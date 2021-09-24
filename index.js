//import { app_mode, api_key, zone_id, record_id, service_host, service_contains } from "./env.js";
import { getSSL, putSSL, get, checkHostStatus } from "./requests.js";

// Define All Environment Variables
const app_mode = process.env.app_mode;
const api_key = process.env.api_key;
const zone_id = process.env.zone_id;
const record_id = process.env.record_id;
const service_host = process.env.service_host;
const service_contains = process.env.service_contains;

let cloudflareIP = '', localIP = '';

const updateCloudflareIP = () => {
    getSSL(
        'api.cloudflare.com', 443, '/client/v4/zones/' + zone_id + '/dns_records/' + record_id,
        { 'Authorization': 'Bearer ' + api_key, 'Content-Type': 'application/json' },
        data => {
            data = JSON.parse(data);
            if(data.success) {
                cloudflareIP = data.result.content;
                console.info('Cloudflare IP:', cloudflareIP);
            }
        }
    );
};

const updateLocalIP = () => {
    get(
        'esaias.se', 80, '/jsonIP.php', {},
        data => {
            data = JSON.parse(data);
            if(data) {
                localIP = data;
                console.info('Local IP:', localIP);
            }
        }
    );
};

const switchToLocalDNS = () => {
    // Change DNS Record
    putSSL(
        'api.cloudflare.com', 443, '/client/v4/zones/' + zone_id + '/dns_records/' + record_id,
        { 'Authorization': 'Bearer ' + api_key, 'Content-Type': 'application/json' },
        { 'type': 'A', 'name': service_host, 'content': localIP, 'ttl': 1, 'proxied':true },
        data => {
            data = JSON.parse(data);
            if(data.success) {
                console.log('Changed to local server!');
            } else {
                console.error('Unable to change to local server!', data);
            }
        }
    );
};

const mainMode = () => {
    // Check If The Cloudflare IP Is Not The Same As The Local IP
    if(cloudflareIP != localIP) {
        // Check If Service Is Reachable
        checkHostStatus(localIP, 80, service_host, service_contains, status => {
            if(status == true) {
                switchToLocalDNS();
            } else console.log('Local IP service down!');
        });
    }
};

const backupMode = () => {
    checkHostStatus(cloudflareIP, 80, service_host, service_contains, status => {
        if(status != true) {
            console.log('Cloudflare IP service down!');
            checkHostStatus(localIP, 80, service_host, service_contains, localStatus => {
                if(localStatus == true) {
                    console.log('Local IP service up!')
                    switchToLocalDNS();
                } else console.log('Local IP service down!');
            });
        }
    });
};

const intervalFunc = () => {
    updateCloudflareIP();
    updateLocalIP();
    if(app_mode == 'MAIN') setTimeout(mainMode, 7500);
    if(app_mode == 'BACKUP') setTimeout(backupMode, 7500);
};
setInterval(intervalFunc, 45000);
intervalFunc();