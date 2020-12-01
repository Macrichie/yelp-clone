require("dotenv").config();
const express = require("express");
const db = require("./db");

const morgan = require("morgan");

const app = express();

// environment
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());

// GET all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query("select * from restaurants");

    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        restaurants: results.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// GET a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    //using parameterized query
    const result = await db.query("select * from restaurants where id = $1", [
      req.params.id,
    ]);

    res.status(200).json({
      status: "success",
      data: {
        restaurant: result.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Create a new Restaurant
app.post("/api/v1/restaurants", (req, res) => {
  console.log(req.body);

  res.status(201).json({
    status: "success",
    data: {
      restaurant: "macdonalds",
    },
  });
});

// update a Restaurant
app.put("/api/v1/restaurants/:id", (req, res) => {
  console.log(req.params.id);
  console.log(req.body);

  res.status(200).json({
    status: "success",
    data: {
      restaurant: "macdonalds",
    },
  });
});

// Delete a Restaurant
app.delete("/api/v1/restaurants/:id", (req, res) => {
  res.status(204).json({
    status: "success",
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
