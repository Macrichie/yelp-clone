require("dotenv").config();
const express = require("express");
const db = require("./db");

const morgan = require("morgan");

const app = express();

// environment
const port = process.env.PORT || 3000;

// middleware to make res.body available for use
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
app.post("/api/v1/restaurants", async (req, res) => {
  //using parameterized query
  try {
    const result = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    res.status(201).json({
      status: "success",
      data: {
        restaurant: result.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// update a Restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE restaurants
    SET name = $1, location = $2, price_range = $3
    WHERE id = ${req.params.id}
    RETURNING *`,
      [req.body.name, req.body.location, req.body.price_range]
    );

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

// Delete a Restaurant
app.delete("/api/v1/restaurants/:id", (req, res) => {
  res.status(204).json({
    status: "success",
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
