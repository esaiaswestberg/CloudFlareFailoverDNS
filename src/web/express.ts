import express from 'express';

const app = express();
app.use(express.static('public'));

app.listen(3000, () => {
	console.log('WebUI is running on port 3000');
});
