const express = require('express')
const {
     createIndex,
     getDomain,
     getText,
     getallDocuments,
     postDocument,
     updateDocument,
     deleteDocument,
     search,
     getCount,
     createapi,
     deletedomain,
     updatedomain,
     createsubindex,
     auth,
     signUp,
     getSpecificDocument,
     getEvent,  
     forgotpassword,
     livelocation,
     getReports
} = require('../controller/crudcontroller')
const router = express.Router()
router.get('/getdomain', getDomain);
router.get('/textsearch', getText);
router.get('/allsearch', getallDocuments);
router.get('/signup', signUp);
router.get('/getSpecificDocument', getSpecificDocument);
router.get('/search', search);
router.get('/operationcount', getCount);
router.get('/createapi', createapi);
router.get('/auth', auth);
router.get('/createsubdomain', createsubindex);
router.post('/event',getEvent);
router.post('/createindex', createIndex);
router.patch('/updatedomain', updatedomain);
router.patch('/update', updateDocument);
router.patch('/forgotpassword',forgotpassword);
router.patch('/livelocation',livelocation);
router.delete('/deletedocument', deleteDocument);
router.delete('/deletedomain', deletedomain);
router.get('/getReport',getReports);
module.exports = router 

