const mongo = require('./connect');
const {ObjectID, Binary} = require('mongodb');

const createRecordModel = async (record) => {
    try{
        const client = await mongo.connect();
        const db = client.db('main');

        const result = await db.collection('records').insertOne(record);
        return result.ops[0];
    }
    catch(e){
        throw e;
    }
}

const getRecordsModel = async () => {
    try{
        const client = await mongo.connect();
        const db = client.db('main');

        const data = await db.collection('records').find({}).toArray();
        return data;
    }
    catch(e){
        throw e;
    }
}

const updateRecordModel = async (id,{name, email ,age, sex, gallery:images}) => {
    try{
        const client = await mongo.connect();
        const db = client.db('main');
        let record = await db.collection('records').findOne({_id:ObjectID(id)});
        record = {...record, name ,email, age, sex, gallery:[...record.gallery, ...images.map(i=>Binary(i))]}
        await db.collection('records').updateOne({_id:ObjectID(id)}, { $set: {name:name, email:email, age:age, sex:sex, gallery:record.gallery} });
        
        return record;
    }
    catch(e){
        throw e;
    }
}

const deleteRecordsModel = async (id=null) => {
    try{
        const client = await mongo.connect();
        const db = client.db('main');

        if(!id){
            await db.collection('records').deleteMany({});
        }
        else{
            await db.collection('records').deleteOne({_id:ObjectID(id)});
        }
    }
    catch(e){
        throw e;
    }
}

module.exports = {
    createRecordModel,
    getRecordsModel,
    updateRecordModel,
    deleteRecordsModel
}