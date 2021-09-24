import * as https from 'https';
import * as http from 'http';

/**
 * Send an HTTPS GET request
 * @param {String} hostname Hostname of the requested server
 * @param {Number} port Targeted port of the server
 * @param {String} path Path on the server to request
 * @param {Object} headers Header data to send with the request
 * @param {Function} data A callback function to call whenever data has been recieved
 * @param {Function} error A callback function to call if an error occurs
 */
export const getSSL = (hostname, port, path, headers, data, error = e => console.error(e)) => {
    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'GET',
        headers: headers
    }
    
    const req = https.request(options, res => {
        //console.log('StatusCode:', res.statusCode);
        //console.log('Headers:', res.headers);
    
        res.on('data', d => {
            data(d.toString());
        });
    });
    
    req.on('error', e => error(e));
    req.end();
};

/**
 * Send an HTTPS GET request
 * @param {String} hostname Hostname of the requested server
 * @param {Number} port Targeted port of the server
 * @param {String} path Path on the server to request
 * @param {Object} headers Header data to send with the request
 * @param {Function} data A callback function to call whenever data has been recieved
 * @param {Function} error A callback function to call if an error occurs
 */
export const putSSL = (hostname, port, path, headers, raw, data, error = e => console.error(e)) => {
    const rawData = new TextEncoder().encode(JSON.stringify(raw));
    headers['Content-Length'] = rawData.length;

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'PUT',
        headers: headers
    }
    
    const req = https.request(options, res => {
        res.on('data', d => {
            data(d.toString());
        });
    });
    
    req.on('error', e => error(e));
    req.write(rawData);
    req.end();
};

/**
 * Send an HTTP GET request
 * @param {String} hostname Hostname of the requested server
 * @param {Number} port Targeted port of the server
 * @param {String} path Path on the server to request
 * @param {Object} headers Header data to send with the request
 * @param {Function} data A callback function to call whenever data has been recieved
 * @param {Function} error A callback function to call if an error occurs
 */
export const get = (hostname, port, path, headers, data, error = e => console.error(e)) => {
    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'GET',
        headers: headers
    }
    
    const req = http.request(options, res => {
        res.on('data', d => {
            data(d.toString());
        });
    });
    
    req.on('error', e => error(e));
    req.end();
};

export const checkHostStatus = (ip, port, host, contains, callback) => {
    let respond = s => { callback(s); respond = () => {};};
    if(port == 80) {
        get(
            ip, 80, '/', { host: host },
            data => {
                if(data.indexOf(contains) <= 0) respond(false);
                else respond(true);
            },
            e => {
                if(e.toString().indexOf('TIMEDOUT') > 0) respond(false);
            }
        );
    }
};