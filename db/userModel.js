const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Provide an Email!"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [true, "Please Provide a Password!"],
    unique: false,
  },
});
//eğer ki user adında bir tablo yoksa bu isimle bir user Tablosu kurmasını söylüyoruz bu kodla.

//kullanıcı verisi ona gelen veriyi almaya hazır. Ona veri geçiriliyor. Veriyi almak için hazır.

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
