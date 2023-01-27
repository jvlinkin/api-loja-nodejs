require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const routes = require("./routes/routes");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(routes);
app.use(errors());

app.listen(PORT, async () => {
  await mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => {
      console.log(`API and Database connected successfully on port ${PORT}.`);
    })
    .catch((err) => {
      console.log("An error ocurred:", err);
    });
});
