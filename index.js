const httpProxy = require("http-proxy");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const proxy = httpProxy.createProxyServer({});
const environment = process.env.NODE_ENV || "local";
const history = require("connect-history-api-fallback");

const graphqlOptions = {
  target: "http://salesavant-1235521355.us-east-1.elb.amazonaws.com",
  auth: "alejandro@salesavant.com:qweqwe"
};

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.VUE", process.env.VUE);

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

if (environment !== "local") {
  if (environment !== "proxylocal") app.use(requireHTTPS);
  app.get("/jobs/:entityId", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
  app.use(express.static("dist"));
  app.use(
    history({
      index: "/index.html"
    })
  );
  app.use(express.static("dist"));
  app.post("/jobs", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
  app.all("/login", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
  app.all("/graphql", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
} else if (!!process.env.VUE) {
  app.get("/jobs/:entityId", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
  app.post("/jobs", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
  app.all("/login", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
  app.all("/graphql", (req, res) => {
    delete req.headers.authorization;
    proxy.web(req, res, graphqlOptions);
  });
} else {
  app.get("/", (req, res) =>
    res.status(200).json({ message: "everything ok" })
  );
}

app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! environment = ${environment}`
  )
);
