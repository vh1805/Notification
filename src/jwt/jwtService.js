const jsonwebtoken = require("jsonwebtoken");

class JWTService {
  getSecretKey() {
    return process.env.JWT_SECRET;
  }

  generateToken(payload) {
    const secretKey = this.getSecretKey();
    const token = jsonwebtoken.sign(payload, secretKey, { expiresIn: "1h" });
    return token;
  }

  verifyToken(token) {
    const secretKey = this.getSecretKey();
    return jsonwebtoken.verify(token, secretKey);
  }
}

const jwtService = new JWTService();

module.exports = jwtService;
