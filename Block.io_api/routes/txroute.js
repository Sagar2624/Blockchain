const express = require('express');
const router = express.Router();

const api = require('../controllers/txcontroller');

router.post('/sendAmount', api.sendAmount);
router.post('/transaction', api.transaction);
router.post('/getBalance', api.getBalance);
router.post('/getPage', api.getPage);
router.post('/getID', api.getID);
router.post('/getLabel', api.getLabel);
router.post('/getFeeEstimate', api.getFeeEstimate);
router.post('/getCurrentPrice', api.getCurrentPrice);
router.post('/getSendTransaction', api.getSendTransaction);
router.post('/getReceivedTransaction', api.getReceivedTransaction);
router.post('/getSendTx', api.getSendTx);
router.post('/getReceivedTx', api.getReceivedTx);
router.post('/getReceivedAddr', api.getReceivedAddr);
router.post('/getArchivedAddrress', api.getArchivedAddrress);
router.post('/getUnArchivedAddrress', api.getUnArchivedAddrress);
router.post('/getAllArchived', api.getAllArchived);
router.post('/getValidAddress', api.getValidAddress);
router.post('/getReceivedTxUserID',api.getReceivedTxUserID);
router.post('/getReceivedTxlabel',api.getReceivedTxlabel);

module.exports = router