const { default: axios } = require("axios");
const express = require("express");
const connectDb = require("./db");
const commentsSchema = require("./models/comments");
const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();

app.use(bodyParser.json());

connectDb();

const Model = mongoose.model("Comment", commentsSchema);

app.get("/populate", async (req, res) => {
  const p1 = axios.get("https://jsonplaceholder.typicode.com/comments");

  let p2 = axios.get("http://cfte.mbwebportal.com/deepak/csvdata.csv");

  const promises = await Promise.all([p1, p2]);

  let [response, csvData] = promises;

  Model.insertMany(response.data);

  csvData = csvData.data;

  fs.writeFile("./csv.txt", csvData, (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
    }
  });

  const stream = fs.createReadStream("./csv.txt");
  stream.pipe(res);
});

app.post("/search", async (req, res) => {
  const body = req.body;
  const record = await Model.findOne(body);

  if (record) {
    res.status(200).json(record);
  } else {
    res.status(400).json({ Error: "Record not found" });
  }
});

app.listen(port, () => console.log(`Server is Running on Port ${port}...`));
