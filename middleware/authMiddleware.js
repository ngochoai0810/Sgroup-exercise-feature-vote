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
  } catch (error) {
    return res.status(401).send("Token không hợp lệ");
  }
};


module.exports = authMiddleware;
//xác thực token JWT trước khi cho phép truy cập vào các API yêu cầu xác thựcc
