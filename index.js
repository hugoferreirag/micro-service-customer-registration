require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const api = require("express")();
const routers = require("./routers");

api.use(cors());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2000;
api.use(routers);

api.listen(port, () => {
  console.log(`Server on in port : ${port}`);
});
