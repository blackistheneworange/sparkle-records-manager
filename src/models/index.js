const db = require("./db.js")

const createRecordModel = async (record) => {
    return new Promise((resolve,reject) => {
        var sql ='INSERT INTO records (name, email, age, gender) VALUES (?,?,?,?)'
        const params =[record.name, record.email, record.age, record.gender]
        db.run(sql, params, function(err, result) {
            if (err) {
                reject(err);
            }
            resolve({id:this.lastID});
        });
        
    })
}

const getRecordsModel = () => {
    return new Promise((resolve,reject) => {
        const sql = "select * from records"
        const params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
        
    })
}

const updateRecordModel = async (id,{name, email ,age, gender, gallery:images}) => {
    id=+id;
    return new Promise((resolve,reject) => {
        const sql ="UPDATE records SET name = ?, email = ?, age = ?, gender = ? where id = ?";
        const params =[name, email, age, gender, +id]
        db.run(sql, params, function (err, result){
            if (err) {
                reject(err);
            }
            resolve({id});
        });
        
    })
}

const deleteRecordsModel = async (id=null) => {
    return new Promise((resolve,reject) => {
        var sql ='DELETE from records where id = ?'
        const params =[id]
        db.all(sql, params, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve({id});
        });
        
    })
}

module.exports = {
    createRecordModel,
    getRecordsModel,
    updateRecordModel,
    deleteRecordsModel
}