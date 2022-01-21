import { get } from './utils/requestHandler';
import { config } from 'dotenv';
config();

const main = async () => {
	const resp = await get('https://jsonplaceholder.typicode.com/todos/1');
	console.log(resp);
};
main();