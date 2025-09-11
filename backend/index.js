const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');  // PostgreSQL client

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'clwcf',
	password: 'chinelo',
	port: 5432,
});

app.get('/', (req, res) => {
	res.send('Backend is running');
});
// Registration endpoint
app.post('/register', async (req, res) => {
	const data = req.body;
	try {

		const query = `
	  INSERT INTO walkathon.registrationsindividual
    (first_name, last_name, email, phone, date_of_birth, gender, tshirt_size,
     emergency_name, emergency_phone, emergency_relation,
     medical_conditions, submission_date)
  VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
  RETURNING id;
`;

		const values = [
			data.firstName, data.lastName, data.email, data.phone, data.dateOfBirth,
			data.gender || null, data.tshirtSize, data.emergencyName,
			data.emergencyPhone, data.emergencyRelation, data.medicalConditions || null,
			data.submissionDate || new Date().toISOString()
		];

		const result = await pool.query(query, values);

		res.status(201).json({
			message: 'Registration saved successfully',
			registration: result.rows[0],
		});

	} catch (error) {
		console.error('Error saving registration:', error);
		res.status(500).json({ error: 'Database error' });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
