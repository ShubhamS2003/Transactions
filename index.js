const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");


//Middleware
app.use(cors());
app.use(express.json());

//APIs POST /fee - will add a new entry
// GET /fee?cp=DESO will fetch the latest gas fee for a crypto saved as DESO
// GET /fee will get all
// PUT /fee?cp=DESO&fee=0.00064 will update the record for DESO

app.post("/fee", async(req,res) => {
    try {
        const {crypto_name, gas_fee, rate_timestamp} = req.body;
        const new_entry = await pool.query(
            "INSERT INTO fee_model (crypto_name, gas_fee, rate_timestamp) VALUES($1, $2, $3) RETURNING *",
            [crypto_name, gas_fee, rate_timestamp]
        );
        res.json(new_entry);
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/fee", async(req,res) => {
    try {
        const allEntries = await pool.query(
            "SELECT * FROM fee_model"
        );
        res.json(allEntries.rows);
    } catch (err) {
        console.log(err.message);
    }
})

app.get("/fee/:cp", async(req,res) => {
    try {
        const {cp} = req.params;
        const deso_fee = await pool.query(
            "SELECT gas_fee FROM fee_model WHERE crypto_name = $1 ORDER BY rate_timestamp DESC",
            [cp]
        );
        res.json(deso_fee.rows[0])
    } catch (err) {
        console.log(err.message);
    }
});

app.put("/fee/:cp/:fees", async(req,res) => {
    try {
        const {cp, fees} = req.params;
        const {gas_fees} = req.body;
        const updateEntry = await pool.query(
            "UPDATE fee_model SET gas_fee = $1 WHERE crypto_name = $2 AND gas_fee = $3", 
            [gas_fees, cp, fees]
        )
        res.json("Entry was updated.");
    } catch (err) {
        console.log(err.message);
    }
})



app.listen(5000, () => {
    console.log("Server has started on port 5000.");
})