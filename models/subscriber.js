const mongoose = require("mongoose");
require("../config/db");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
    },
    dateBirthDay: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const connectDb = mongoose.model("subscriberModel", schema);

const modelKeys = [
  "name",
  "lastName",
  "document",
  "dateBirthDay",
  "email",
  "password",
];

module.exports = {
  modelKeys,
  connectDb,
};
