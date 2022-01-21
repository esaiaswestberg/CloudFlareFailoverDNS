import fetch from 'node-fetch';

/**
 * Makes a request to the given url and returns the response.
 * @param url The url to GET.
 * @returns The response.
 * @throws An error if the request failed.
 */
export const get = async (url: string, headers: any) => {
	// @ts-ignore
	const response = await fetch(url, { headers });
	if (response.ok) {
		return await response.text();
	}

	throw `Error on get request to ${url}:\n${response.status} ${response.statusText}`;
};

/**
 * Makes a PUT request to the given url and returns the response.
 * @param url The url to PUT to.
 * @param headers The headers to send.
 * @param body The body to send.
 * @returns The response string.
 */
export const put = async (url: string, headers: any, body: any) => {
	const response = await fetch(url, {
		headers,
		method: 'PUT',
		body
	});

	if (response.ok) {
		return await response.text();
	}

	throw `Error on put request to ${url}:\n${response.status} ${response.statusText}`;
};
