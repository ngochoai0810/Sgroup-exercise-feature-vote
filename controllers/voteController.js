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


  const createPoll= async (req, res) => {
    const { title, userid } = req.body;
    const create_date = new Date().toISOString().slice(0, 10); 
  
    if (!title || !userid) {
      return res.status(400).send("thieu title hoac userid");
    }
  
    try {
      const query = 'INSERT INTO poll (title, userid, create_date) VALUES (?, ?, ?)';
      const [result] = await pool.promise().query(query, [title, userid, create_date]);
      
      res.status(201).json({ id: result.insertId, title, userid, create_date });
    } catch  {
     
      res.status(500).send("khong tao duoc");
    }
};

const createOption = async (req, res)=> {
    const {pollid, option_text} = req.body;
    if (!pollid || !option_text ){
        return res.status(400).send("thieu pollid hoac option_text")
    }
    try {
        const query = 'INSERT INTO options(pollid, option_text) VALUE (?,?)';
       const [result] = await pool.promise().query(query,[pollid, option_text]);
       res.status(201).json({id: result.pollid,option_text});
    
    }
    catch {
        res.status(500).send("khong tao duoc")
    }
}
module.exports = {
  voteForCandidate,
  getVotes,
  createPoll,
  createOption,
};
