var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text NOT NULL, 
            email text NOT NULL,
            age number NOT NULL, 
            gender text NOT NULL
            )`,
        (err) => {
            if (err) {
                console.log(err)
            }
        });  
    }
});


module.exports = db