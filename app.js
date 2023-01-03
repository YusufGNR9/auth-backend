const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");

dbConnect();

//middleware ' imizi hazırlıyoruz.
//Access control allow origin ile her yerden servera istek atılabileceğini söylüyoruz.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

//register(kayıt ol) url ' ini ayarlıyoruz
//kullanıcı hatalı giriş yaptığında hata mesajı alacak , başarılı giriş yaptığında ise başarılı giriş yaptınız mesajı alacak.

app.post("/register", (request, response) => {
  //Şifreyi hash ' le.
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      //Yeni bir kullanıcı oluşturup verileri kaydedelim
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      console.log(user);

      //Kullanıcıyı kaydediyoruz.
      user
        .save()
        //eğer kullanıcı database ' e başarılı bir şekilde kaydedildiyse başar mesajı return et.
        .then((result) => {
          response.status(219).send({
            message: "User Created Successfully",
            result,
          });
        })
        //eğer kullanıcı database ' e başarılı bir şekilde eklenmediyse hata mesajını yakala.
        .catch((error) => {
          response.status(500).send({
            message: "Error Creating user",
            error,
          });

          console.log("THİS İS ", error);
        });
    })
    //şifre düzgün bir şekilde hash ' lenmediyse hata mesajı return et.
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully!",
        e,
      });
    });
});

//Login(giriş) url ' i. Kullanıcı başarılı bir şekilde biriş yaparsa başarılı giriş mesajı geri döndürecek , hatalı giriş yaparsa hata mesajı döndürecek.
app.post("/login", (request, response) => {
  //email databse ' ede kayıtlı kullanıcılarda var mı kontrol et.
  User.findOne({ email: request.body.email })
    //eğer ki email database ' de varsa
    .then((user) => {
      //şifre kontrol ' ü.
      bcrypt
        .compare(request.body.password, user.password)

        //şifrelerin uyuşup uyuşmadığına bak . Kontrol et.
        .then((passwordCheck) => {
          if (!passwordCheck) {
            response.status(400).send({
              message: "Passwords does not match!",
              error,
            });
          }

          //JWT token oluştur.
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //başarı mesajı return et.
          response.status(200).send({
            message: "Login Successfull",
            email: user.email,
            token,
          });
        })

        //eğer şifreler uyuşmuyorsa hata mesajı geri döndür.
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    //eğer böyle bir email database ' de yoksa bir hata mesajı geri döndür.
    .catch((e) => {
      response.status(404).send({
        message: "Email not Found",
      });
    });
});

// free url ' i.
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication url ' i .
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});
module.exports = app;
