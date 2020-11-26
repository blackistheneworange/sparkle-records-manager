const {getRecordsModel, createRecordModel, updateRecordModel, deleteRecordsModel} = require('../models');

const createRecord = async (record) => {
    try{
        const data = await createRecordModel(record);
        return data;
    }
    catch(e){
        throw e;
    }
}

const getRecords = async () => {
    try{
        const data = await getRecordsModel();
        return data;
    }
    catch(e){
        throw e;
    }
}

const updateRecord = async (id,record) => {
    try{
        const data = await updateRecordModel(id,record);
        return data;
    }
    catch(e){
        throw e;
    }
}

const deleteRecords = async (id=null) => {
    try{
        await deleteRecordsModel(id);
    }
    catch(e){
        throw e;
    }
}

module.exports = {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecords
}