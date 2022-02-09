const mysql      = require('mysql2');
const dbconfig   = require('/Users/changjie.lin/work/gh/db_checker/dbconfig');

let conf = dbconfig.uatlogs;
let iCount = [];
for (let i = 0; i < 10; i++) {
  iCount[i] = 0;
}

const zeroPad = (num, places) => String(num).padStart(places, '0');

const countOneDB = async (idx) => {
  try {
    const padLen = 8;

    let dbName = 'shopee_incentive_trigger_log_db_' + zeroPad(idx, padLen);
    conf.database = dbName;
    const pool = mysql.createPool(conf);

    let tabName;
    for (let j = 0; j < 1000; j++) {
      let num = idx * 1000 + j;
      tabName = 'incentive_trigger_tab_' + zeroPad(num, padLen);
      const sql = `SELECT COUNT(*) as count FROM ${tabName} WHERE create_time > 1634090400 and create_time < 1634263200;`;
      const promisePool = pool.promise();
      let [result, fields] = await promisePool.query(sql);
      console.log("DB #" + idx + " Table #" + j);
      console.log(result[0].count);
      iCount[idx] += result[0].count;
    }
    await pool.end();
  } catch (error) {
    console.log("ERROR: ", error.message);
  }
}

async function main() {
  const promises = [];

  for (let i = 0; i < 10; i++) {
    promises.push(countOneDB(i));
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    console.log("ERROR: ", error.message);
  }

  let allCount = 0;
  for (let i = 0; i < iCount.length; i++) {
    allCount += iCount[i];
  }

  console.log("Total Count =", allCount);

}

main()