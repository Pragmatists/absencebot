import * as express from 'express';
import * as bodyParser from 'body-parser';
import { commandsController } from './commandsController';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => res.send('Hi from absence bot'));
app.post('/absence', commandsController);

export default app;
