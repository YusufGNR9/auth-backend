const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    //authorization header ' dan token ' ı alıyoruz.
    const token = await request.headers.authorization.split(" ")[1];
    //alınan token ile orijinal token uyuşuyor mu kontrol et.
    const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

    //oturum açmış kullaıcının verilerini al.
    const user = await decodedToken;

    //kullanıcıyı burdaki uç noktalara yönlendiriyoruz. Yani erişim sağlayabileceği yer Sadece kullanıcılar için bir alan olacak.

    request.user = user;

    next();
  } catch (error) {
    response.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
