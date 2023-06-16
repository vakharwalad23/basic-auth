const mongoose = require("mongoose");

const connect_to_mongo = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected To Mongo Successfully"))
    .catch((error) => console.log(error.message));
};
module.exports = connect_to_mongo
