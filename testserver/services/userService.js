const db = require('../sql/db.js');
const jwt = require('../token.js');
exports.login = (req, res) => {
  let {
    username,
    password
  } = req.body;
  // 查询语句
  let sql = 'select * from user where username = ?'
  db.base(sql, username, (result) => {
    if (!result.length) {
      return res.json({
        status: -1,
        msg: '登录失败'
      })
    } else {
      if (result[0].password == password) {
        let token = jwt.creatToken({
          login: true,
          username: username
        });
        return res.json({
          status: 1,
          msg: '登录成功',
          token: token
        })
      }
      return res.json({
        status: -2,
        msg: '密码错误'
      })
    }
  })
}
exports.register = (req, res) => {
  let {
    username,
    password,
    token
  } = req.body;
  console.log(req.body);
}