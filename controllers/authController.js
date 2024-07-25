const { pool } = require("../db");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const mailService = require("../db").mailler;
const crypto = require("crypto");
const multer = require("multer");
const { getOne, updateOne } = require("../extra");

const register = async (req, res) => {
  const { username, password} = req.body;

  const [existingUser] = await pool
    .promise()
    .query("SELECT 1 FROM users WHERE username = ?", [username]);
  if (existingUser.length > 0) {
    return res.status(400).send("Username đã tồn tại");
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    pool.query(query, [username, hashedPassword], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send("TÀI KHOẢN ĐƯỢC TẠO THÀNH CÔNG");
    });
  } catch (error) {
    res.status(500).send("Lỗi server");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy tài khoản");
    }
    const users = rows[0];
    const hashedPassword = rows[0].password;
    const comparePass = await bcrypt.compare(password, hashedPassword);

    if (comparePass) {
      const token = jwt.sign({ id: users.id, username: users.username, role: users.role }, "derd");
      return res.status(200).send(token);
    } else {
      return res.status(400).send("Sai mật khẩu rồi");
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi khi xử lý đăng nhập:", error);
    return res.status(500).send(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.promise().query("SELECT username FROM users");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send("Lỗi server");
  }
};

const sendMail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getOne({
      query: "SELECT * FROM user WHERE email = ?",
      params: [email],
    });

    if (!user) {
      return res.status(400).json({
        message: "Email không tìm thấy",
      });
    }

    const secretKey = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(secretKey)
      .digest("hex");

    const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000);
    const updateStatus = await updateOne({
      query:
        "UPDATE user SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?",
      params: [passwordResetToken, passwordResetExpiration, email],
    });

    if (updateStatus) {
      await mailService.sendEmail({
        emailFrom: "rodrick.hills@ethereal.email",
        emailTo: email,
        emailSubject: "topic",
        emailText: " Mã đặt lại mật khẩu  " + passwordResetToken,
      });

      return res.status(200).json({
        message: "Yêu cầu đặt lại mk thành công",
      });
    }

    return res.status(400).json({
      message: "Khong thể đặt lại mật khẩu",
    });
  } catch (error) {
    console.error("Lỗi trong:", error);
    return res.status(500).json({
      message: "error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, passwordResetToken, newPassword } = req.body;
    const user = await getOne({
      db,
      query:
        "SELECT * FROM user WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ?",
      params: [email, passwordResetToken, new Date(Date.now())],
    });

    if (!user) {
      return res.status(400).json({
        message: "invalid token or token has expired",
      });
    }

    const salt = crypto.randomBytes(32).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(newPassword, salt, 10, 64, `sha512`)
      .toString(`hex`);

    const updateStatus = await updateOne({
      db,
      query:
        "update user set password = ?, salt = ?, passwordResetToken = null, passwordResetExpiration = null, passwordLastResetDate = ? where email = ?",
      params: [hashedPassword, salt, new Date(), email],
    });

    if (updateStatus) {
      return res.status(200).json({
        message: "reset password successfully",
      });
    }

    return res.status(400).json({
      message: "reset password failed",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error",
    });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  sendMail,
  resetPassword,
};
