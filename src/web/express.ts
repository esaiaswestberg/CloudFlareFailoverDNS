import express from 'express';
import compression from 'compression';
import { history } from '../handlers/statsHandler.js';

const app = express();
app.use(
	compression({
		level: 9
	})
);
app.use(express.static('public'));

app.get('/api/v1/history', (req, res) => {
	res.json(history);
});

app.listen(3000, () => {
	console.log('WebUI is running on port 3000');
});
