require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');  // PostgreSQL client

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// PostgreSQL connection
const pool = new Pool({
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'clwcf',
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT || 5432,
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


// API route for team registration
app.post("/team-register", async (req, res) => {
	const data = req.body;
	try {

		await pool.query(
			`INSERT INTO walkathon.team_registrations
      (team_name, team_size, captain_firstname, captain_lastname, captain_email, captain_phone, captain_gender, captain_tshirt, emergency_name, emergency_relation, 
       emergency_phone, medical_conditions)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
			[
				data.team_name,
				data.team_size,
				data.captain_firstname,
				data.captain_lastname,
				data.captain_email,
				data.captain_phone,
				data.captain_gender,
				data.captain_tshirt,
				data.emergency_name,
				data.emergency_relation,
				data.emergency_phone,
				data.medical_conditions,
			]
		);

		res.json({ success: true, message: "Team registered successfully" });
	} catch (err) {
		console.error("Error saving team registration:", err);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

app.post("/donate", async (req, res) => {
  try {
    const {
      donorName,
      donorEmail,
      donationAmount,
      paymentMethod,
      transactionRef,
      donorMessage
    } = req.body;

    const query = `
      INSERT INTO walkathon.donations 
      (donor_name, donor_email, donation_amount, payment_method, transaction_ref, donor_message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [donorName, donorEmail, donationAmount, paymentMethod, transactionRef, donorMessage];
    const result = await pool.query(query, values);

    res.status(201).json({ message: "Donation saved successfully", donation: result.rows[0] });
  } catch (error) {
    console.error("Error saving donation:", error);
    res.status(500).json({ error: "Failed to save donation" });
  }
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
