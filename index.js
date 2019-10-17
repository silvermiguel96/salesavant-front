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
if (environment === "production") {
  app.use(
    history({
      index: "/index.html"
    })
  );
  app.use(express.static("dist"));
}

app.listen(port, () =>
  console.log(
    now,
    `SaleSavant app listening on port ${port}! environment = ${environment}`
  )
);
var fs = require("fs");
let path = "./dist";
console.log("path", path);
fs.readdir(path, function (err, items) {
  if (items) {
    console.log(items);
  } else {
    console.log("empty");
  }
});
