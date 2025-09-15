import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Example API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running correctly for Ballin-with-Ocie' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
