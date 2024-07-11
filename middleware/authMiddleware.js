const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).send("Xảy ra lỗi");
  const token = header.split(" ")[1];
  if (!token) return res.status(401).send("Xảy ra lỗi");

  try {
    const coded = jwt.verify(token, "derd");
    req.user = coded;
    next();
  } catch {
    return res.status(401).send("token kh hợp lệ");
  }
};

const authorAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("bạn kh có quyền truy cập");
  }
};

module.exports = {
  authMiddleware,
  authorAdmin,
};
