const JWT = require("jsonwebtoken");

module.exports = {
  authenticate: (req, res, next) => {
    const header = req.headers["authorization"];

    if (!header) {
      return res
        .status(400) // BAD_REQUEST
        .json({ error: "Authorization header missing!" });
    }

    if (header.startsWith("Bearer ")) {
      const token = header.split(" ")[1];
      JWT.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(403) // FORBIDDEN
            .json({ error: "Invalid Token!" });
        } else {
          req.id = decoded.id;
          next();
        }
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error:
          "Malformed auhthorization. Auth header was in bad format, JWT token missing!"
      });
    }
  },
  signToken: user => {
    const token = JWT.sign(
      {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      process.env.SECRET,
      {
        expiresIn: "1d"
      }
    );
    return token;
  }
};

//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjEyMWUxN2E5NGQ5MGFhZjI4YmYxNyIsImlhdCI6MTU4ODY2NzU5NywiZXhwIjoxNTg4NjY3ODk3fQ.gpLn6XOm4fbSKsf25MjeKACLTwKF1a3RoB7JfivTG_I
