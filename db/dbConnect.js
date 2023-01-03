//external imports
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  //.env dosyamızda sakladığımız DB_URL bağlantı string'imiz ile mongoose kullanarak mongoDB ' ye bağlantımızı sağlıyoruz.

  //Çıkan error'lardan kurtulmak için bu kodu ekledim.
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB_URL, {
      //Bağlantının düzgün bir şekilde yapılması için Option'lar.
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;
