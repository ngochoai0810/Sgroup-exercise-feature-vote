const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).send("Xảy ra lỗi");
  const token = header.split(" ")[1];
  if (!token) return res.status(401).send("Xảy ra lỗi");

  try {
    const coded = jwt.verify(token, "derd");
    req.users = coded;
    next();
  } catch {
    return res.status(401).send("token kh hợp lệ");
  }
};

const authorAdmin = (req, res, next) => {
  if ( req.users.role === "admin") {
    next();
  } else {
    res.status(403).send("Vous n’avez pas accès");
  }
};

module.exports = {
  authMiddleware,
  authorAdmin,
};
