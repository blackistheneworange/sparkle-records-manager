const { createRecord, deleteRecords, updateRecord, getRecords } = require("../services");

const createRecordController = async (req, res, next) => {
    try{
        const {name, email, age, gender} = req.body;
        if(!name || !email || !age || !gender) return res.status(422).send("Insufficient details");
        const gallery = req.files.map(f=>f.buffer);
        const data =await createRecord({name, email, age, gender, gallery});
        res.send(data);
    }
    catch(e){
        console.log(e)
        next(e);
    }
}

const getRecordsController = async (req, res, next) => {
    try{
        // const data = (await getRecords()).map(record=>({...record, gallery:record.gallery.map(g=>g.buffer)}));
        const data = await getRecords();
        res.send(data);
    }
    catch(e){
        next(e);
    }
}

const updateRecordController = async (req, res, next) => {
    try{
        const {name, email, age, gender} = req.body;
        const {id} = req.params;
        if(!id) return res.status(404).send("Bad request");
        if(!name || !email || !age || !gender) return res.status(422).send("Insufficient details");
        const gallery = (req.files && req.files.length>0) ? req.files.map(f=>f.buffer) : [];
        const data = await updateRecord(id,{name, email, age, gender, gallery});
        
        res.send(data);
    }
    catch(e){
        next(e);
    }
}

const deleteRecordsController = async (req, res, next) => {
    try{
        const {id} = req.params;
        if(!id) return res.status(422).send("Bad request");
        await deleteRecords(id);
        res.send();
    }
    catch(e){
        next(e);
    }
}


module.exports = {
    createRecordController,
    getRecordsController,
    updateRecordController,
    deleteRecordsController,
}