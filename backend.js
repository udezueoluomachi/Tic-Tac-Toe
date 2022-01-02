const http = require("http");
const url = require("url");
const mysql = require("mysql");
let playerid = "";
const multiid = {};

let con = mysql.createConnection({
  host: "localhost",
  user: "nodejspractice",
  password: "@200420052006%",
  database: "mydb"
});

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "https://udezueoluomachi.github.io",
      "Acess-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Max-Age": 2592000,
      "Access-Control-Request-Headers": "Content-Type",
      Accept: "application/x-www-form-urlencoded"
    });
    let body = "";
    if (req.method == "POST") {
      req.on("data", data => {
        body += data;
      });
      req.on("end", () => {
        let reqUrl = req.url + "?" + body;
        let q = url.parse(reqUrl, true);
        let qdata = q.query;
        let username = `${qdata.username}`;
        let password = `${qdata.password}`;
        let friendid = `${qdata.friendid}`;
        let yourid = `${qdata.yourid}`;
        let btnid = `${qdata.btnid}`;
        let lastChunkId = `${qdata.lastChunkId}`;
        let deletion1 = `${qdata.deletion1}`;
        let deletion2 = `${qdata.deletion2}`;
        let friendconfirmedid = "";
        con.connect(err => {
          if (err) console.log(err);
        });
        if ((friendid && yourid) != "undefined") {
          let idsearch = "SELECT id FROM useraccount WHERE id = ?";
          let fsearchid = [friendid];
          con.query(idsearch, fsearchid, (err, result, fields) => {
            if (err) console.log(err);
            if (result.length === 0) {
              res.write("Incorrect id.\nPlease type in the correct id");
              endcon();
              res.end();
            } else {
              friendconfirmedid = `${result[0].id}`;
              if (friendconfirmedid !== "") {
                let sql = `
                SELECT TABLE_NAME,
                CASE
                  WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "player${yourid}vsplayer${friendconfirmedid}") THEN "table exists"
                  ELSE "table does not exist"
                END AS existence
                FROM INFORMATION_SCHEMA.TABLES;
                `;
                con.query(sql, (err,result) => {
                  if(err) console.log(err);
                  if(result[0].existence === "table exists") {
                    let sql = `DROP TABLE player${yourid}vsplayer${friendconfirmedid}`;
                    con.query(sql, (err, result) => {
                      if(err) console.log(err);
                      endcon();
                    });
                    createPlayerTable();
                  } else {
                    createPlayerTable();
                  }
                  endcon();
                });
              }
              endcon();
              res.end();
            }
          });
        }
        function createPlayerTable() {
          let sql = `CREATE TABLE player${yourid}vsplayer${friendconfirmedid} (id INT AUTO_INCREMENT PRIMARY KEY, opponent VARCHAR(255))`;
          con.query(sql, (err,result) => {
            if(err) console.log(err);
            multiid.yourid = yourid;
            multiid.friendid = friendconfirmedid;
            res.write("Make sure your friend has also done the same");
            endcon();
          });
        }
        if ((username && password) != "undefined") {
          let sqlselection =
            "SELECT * FROM useraccount WHERE username = ? AND password = ?";
          let values = [username, password];
          con.query(sqlselection, values, (err, result, fields) => {
            if (err) console.log(err);
            if (result.length === 0) {
              let sqlinsertion =
                "INSERT INTO useraccount (username, password) VALUES (?, ?)";
              con.query(sqlinsertion, values, (err, result) => {
                if (err) console.log(err);
                con.query(sqlselection, values, (err, result, fields) => {
                  if (err) console.log(err);
                  playerid = result[0].id;
                });
                res.write(`${playerid}`);
                endcon();
                res.end();
              });
            } else {
              playerid = result[0].id;
              res.write(`${playerid}`);
              endcon();
              res.end();
            }
          });
        }
        if (btnid !== "undefined") {
          let sql = `INSERT INTO player${multiid.yourid}vsplayer${multiid.friendid} (opponent) VALUES (?)`;
          let value = [btnid];
          con.query(sql, value, (err, result) => {
            if (err) console.log(err);
            res.write("waiting for your friend to play");
            endcon();
            res.end();
          });
        }
        if (lastChunkId !== "undefined") {
          let sql = `SELECT * FROM player${multiid.friendid}vsplayer${multiid.yourid}`;
          con.query(sql, (err, result, fields) => {
            if (err) console.log(err);
            if (result.length !== 0) {
               if(result[result.length-1].id != lastChunkId) {
                  res.write(JSON.stringify(result[result.length-1]));
                } else {
                  res.write("retry");
                }
            }
            endcon();
            res.end();
          });
        }
        if(deletion1 !== "undefined") {
          let sql = 
          `INSERT INTO player${multiid.yourid}vsplayer${multiid.friendid} (opponent) VALUES ("Your friend quit the game.")`;
          con.query(sql,(err,result) => {
            if(err) console.log(err);
            res.write("Your friend has been notified");
            endcon();
            res.end();
          });
        }
        function endcon() {
          con.end(err => {
            if (err) console.log(err);
          });
          con = mysql.createConnection({
            host: "localhost",
            user: "nodejspractice",
            password: "@200420052006%",
            database: "mydb"
          });
        }
      });
    }
  })
  .listen(5000, () => console.log("Server is running"));