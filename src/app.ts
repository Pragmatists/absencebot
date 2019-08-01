import app from './api';
import './scheduledMorningMessage';
import './scheduledAfternoonMessage';

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Absence bot listening on port ${port}!`));
