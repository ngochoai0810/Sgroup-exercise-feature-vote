const { pool, mailler } = require("../db");

const voteForCandidate = (req, res) => {
  const candidate = req.body.candidate;

  const query =
    "INSERT INTO votes (candidate, votes) VALUES (?, 1) ON DUPLICATE KEY UPDATE votes = votes + 1";
  pool.query(query, [candidate], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Đã xảy ra lỗi khi bỏ phiếu.");
    }
    try {
      await mailler.sendEmail({
        emailFrom: "rodrick.hills@ethereal.email",
        emailTo: "ngochoai0h1@gmail.com",
        emailSubject: "phiếu bầu mới",
        emailText: `một phiếu bầu cho ${candidate}`,
      });
    } catch (emailErr) {
      console.error("Lỗi khi gửi email:", emailErr);
    }

    res.status(200).send("Đã bầu thành công");
  });
};

const getVotes = (req, res) => {
  const query = "SELECT candidate, votes FROM votes";
  pool.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Đã xảy ra lỗii");
    }
    res.status(200).json(results);
  });
};
const readPoll = async (req, res) => {
  try {
    const [poll] = await pool.promise().query("SELECT * FROM poll");
    res.status(200).json(poll);
  } catch {
    res.status(500).send("Can't read it");
  }
};
const readPollbyid = async (req, res) => {
  const { id } = req.params;

  try {
    const [poll] = await pool
      .promise()
      .query("SELECT * FROM poll WHERE id = ?", [id]);
    if (poll.length === 0) {
      return res.status(404).send("This poll not appear");
    }
    res.status(200).json(poll[0]);
  } catch (error) {
    res.status(500).send("Can't read it");
  }
};
const createPoll = async (req, res) => {
  const { title, userid } = req.body;
  const create_date = new Date().toISOString().slice(0, 10);

  if (!title || !userid) {
    return res.status(400).send("Need to type title or userid");
  }

  try {
    const query =
      "INSERT INTO poll (title, userid, create_date) VALUES (?, ?, ?)";
    const [result] = await pool
      .promise()
      .query(query, [title, userid, create_date]);

    res.status(201).json({ id: result.insertId, title, userid, create_date });
  } catch {
    res.status(500).send("Can't create, please do it");
  }
};
const updatePoll = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).send("Need to type title");
  }

  try {
    const query = "UPDATE poll SET title = ? WHERE id = ?";
    const [result] = await pool.promise().query(query, [title, id]);

    if (result.length === 0) {
      return res.status(404).send("This poll not appear");
    }

    res.status(200).json({ id, title, userid });
  } catch {
    res.status(500).send("Can't update it");
  }
};
const deletePoll = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool
      .promise()
      .query("DELETE FROM poll WHERE id = ?", [id]);

    if (result.length === 0) {
      return res.status(404).send("This poll not appear");
    }

    res.status(200).send("Deleted");
  } catch {
    res.status(500).send("Can't delete it, sorry");
  }
};
const getOption = async (req, res) => {
  try {
    const [option] = await pool.promise().query("SELECT * FROM options");
    res.status(200).json(option);
  } catch {
    res.status(500).send("Server can't run");
  }
};
const getOptionbyid = async (req, res) => {
  const pollid = req.params.pollid;

  try {
    const [option] = await pool
      .promise()
      .query("SELECT * FROM options WHERE pollid = ?", [pollid]);

    if (option.length === 0) {
      return res.status(404).send(" Can't find this option");
    }

    res.status(200).json(option);
  } catch {
    res.status(500).send("Server can't run");
  }
};

const createOption = async (req, res) => {
  const { pollid, option_text } = req.body;
  if (!pollid || !option_text) {
    return res.status(400).send("Need to type title or userid");
  }
  try {
    const query = "INSERT INTO options(pollid, option_text) VALUE (?,?)";
    const [result] = await pool.promise().query(query, [pollid, option_text]);
    res.status(201).json({ id: result.pollid, option_text });
  } catch {
    res.status(500).send("Can't create it");
  }
};

const voting = async (req, res) => {
  const pollid = req.params.pollid;
  const { userid, optionid } = req.body;

  if (!userid || !optionid) {
    return res.status(400).send("Need to type title or userid");
  }

  try {
    const query = "INSERT INTO vote (userid, optionid) VALUE (?, ?)";
    await pool.promise().query(query, [userid, optionid, pollid]);
    res.status(201).send("Voted successfully!!!!");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send("Voted");
    } else {
      res.status(500).send("Can't vote it");
    }
  }
};
const unvoting = async (req, res) => {
  const pollid = req.params.pollid;
  const { userid, optionid } = req.body;

  if (!userid || !optionid) {
    return res.status(400).send("Need to type title or userid");
  }

  try {
    const query = "DELETE FROM vote WHERE userid = ? AND optionid = ?";
    const [result] = await pool
      .promise()
      .query(query, [userid, optionid, pollid]);

    if (result.length === 0) {
      return res.status(404).send("Vote no appear");
    }

    res.status(200).send("Unvote successfully");
  } catch (error) {
    res.status(500).send("Cant't unvote,");
  }
};
module.exports = {
  voteForCandidate,
  getVotes,
  createPoll,
  readPoll,
  readPollbyid,
  updatePoll,
  deletePoll,
  getOption,
  getOptionbyid,
  createOption,
  voting,
  unvoting,
};
