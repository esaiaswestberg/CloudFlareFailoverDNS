/**
 * 1. Fetch data from the API
 * 2. Map the data to the format we want
 * 3. Sort the data by timestamp
 */

// Fetch and map historical data from the API
const resp = await fetch('./api/v1/history');
const data = (await resp.json()).map((item) => {
	return {
		...item,
		timestamp: new Date(item.timestamp)
	};
});

// Sort the data by timestamp
data.sort((a, b) => b.timestamp - a.timestamp);

// Get current date
const currentTime = data[0].timestamp;
const startOfDay = new Date(
	currentTime.getFullYear(),
	currentTime.getMonth(),
	currentTime.getDate()
);

// Go through the last 7 days
const days = [];
let currentDate = startOfDay;
let currentWorst = 'main';
for (let i = 0; i < data.length; i++) {
	const item = data[i];
	const itemDayStart = new Date(
		item.timestamp.getFullYear(),
		item.timestamp.getMonth(),
		item.timestamp.getDate()
	);

	// Check that day hasn't changed
	if (currentDate === itemDayStart) {
	}
}
