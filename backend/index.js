// Basic Express server for registration
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', (req, res) => {
	const userData = req.body;
	console.log('Received registration:', userData);
	// Here you would save to a database
	res.status(200).json({ message: 'Registration successful!' });
});

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
