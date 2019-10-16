const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const environment = process.env.NODE_ENV || "local";
const history = require("connect-history-api-fallback");

var now = Date(Date.now()).toString();
console.log(now, "process.env.NODE_ENV", process.env.NODE_ENV);
console.log(now, "process.env.VUE", process.env.VUE);

function requireHTTPS(req, res, next) {
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV !== "local"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}
if (environment == "production") app.use(requireHTTPS);

app.use(express.static("dist"));
app.use(
  history({
    index: "/index.html"
  })
);

app.listen(port, () =>
  console.log(
    now,
    `SaleSavant app listening on port ${port}! environment = ${environment}`
  )
);
