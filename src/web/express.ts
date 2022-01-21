import express from 'express';
import { history } from '../handlers/statsHandler.js';

const app = express();
app.use(express.static('public'));

app.get('/api/v1', (req, res) => {
	res.json(history);
});

app.listen(3000, () => {
	console.log('WebUI is running on port 3000');
});
