const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");
const credentials = require("./service-account.json"); // Google API key file

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "YOUR_SHEET_ID"; // Replace with your actual Google Sheet ID
const RANGE = "Sheet1!A:A"; // Adjust based on your sheet name

app.post("/verify", async (req, res) => {
    try {
        const { qrCode } = req.body;
        const response = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: RANGE });
        const values = response.data.values.flat();

        res.json({ match: values.includes(qrCode) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
