const express = require("express");
const compression = require("compression");
const path = require("path");
const app = express();

// var fs = require('fs');
// var path = require('path');
// var key = fs.readFileSync(path.resolve(__dirname, "./config/private.key"));
// var cert = fs.readFileSync(path.resolve(__dirname, "./config/certificate.crt"));
// var ca = fs.readFileSync(path.resolve(__dirname, "./config/ca_bundle.crt"));
// const https = require("https");

app.use(compression());
app.use(express.static(path.join(__dirname, "build")));
// var server = https.createServer(
//  {
//    key: key,
//    cert: cert,
//    ca: ca,
//  },
//  app
// );


app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000 ;              //--> port  = 80

app.listen(PORT, () => {
  console.log(`gnVoltage is running on port ${PORT}`);
});
