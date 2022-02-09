const mysql      = require('mysql2');
const dbconfig   = require('/Users/changjie.lin/work/gh/db_checker/dbconfig');

let conf = dbconfig.logs;
let iCount = 0;

const init = async () => {
  try {

    const padLen = 8;
    let dbName;
    for (let i = 0; i < 10; i++) {
      dbName = 'shopee_incentive_trigger_log_db_' + zeroPad(i, padLen);
      conf.database = dbName;
      const pool = mysql.createPool(conf);
      
      let tabName;
      for (let j = 0; j < 1000; j++) {
        let num = i * 1000 + j;
        tabName = 'incentive_trigger_tab_' + zeroPad(num, padLen);
        console.log("DB #" + i + " Table #" + j);
        const sql = `SELECT COUNT(*) as count FROM ${tabName}`;
        const promisePool = pool.promise();
        let [result, fields] = await promisePool.query(sql);
        console.log(result[0].count);

        iCount += result[0].count;
      }
      await pool.end();
    }
    
    console.log("Count = ", iCount);
  } catch(err) {
    console.log("ERROR: ", err.message);
  }
}

const zeroPad = (num, places) => String(num).padStart(places, '0');

init();