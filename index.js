const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const environment = process.env.NODE_ENV || "local";

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.VUE", process.env.VUE);

app.get("/", (req, res) => res.status(200).json({ message: "everything ok" }));

app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! environment = ${environment}`
  )
);
