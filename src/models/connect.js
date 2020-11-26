const {MongoClient} = require('mongodb');
const url = process.env.MONGO_URI || 'mongodb://localhost';

const connect = async () => {
    try{
        const client=new MongoClient(url,{useUnifiedTopology:true})
        await client.connect();
        return client;
    }
    catch(e){
        throw e;
    }
}

module.exports = {
    connect
}