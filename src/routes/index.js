const router = require('express').Router();
const multer = require('multer');
const { getRecordsController, createRecordController, updateRecordController , deleteRecordsController } = require('../controllers');

const upload = multer({});

router.route('/')
    .get(getRecordsController)
    .post(upload.array('images'), createRecordController)

router.route('/:id')
    .put(upload.array('images'), updateRecordController)
    .delete(deleteRecordsController)

module.exports = router;