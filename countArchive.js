const mysql      = require('mysql2');
const dbconfig   = require('/Users/changjie.lin/work/gh/db_checker/dbconfig');

let conf = dbconfig.archive
const connection = mysql.createConnection(conf);

connection.connect(function(err) {
  if (err) throw err;
  const sql = "SELECT COUNT(*) as count FROM `dev_shopee_incentive_archive_db`.`incentive_trigger_tab_00202108`";

  connection.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log(result);
    
    connection.end(function(err) {
      if (err) throw err;
    })
  });
});