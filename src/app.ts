import app from './api';
import './scheduledMessage';

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Absence bot listening on port ${port}!`));
