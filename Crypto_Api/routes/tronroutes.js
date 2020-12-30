const express= require('express');
const router = express.Router();
const tronroutes = require('../controller/troncontroller');


// =================Routes for the users=======================

router.get('/account', tronroutes.account);
router.get('/currentBlock', tronroutes.currentBlock);
router.get('/previousBlock', tronroutes.previousBlock);
router.get('/getTransactionByHash', tronroutes.getTransactionByHash);
router.get('/getTransactionInfo', tronroutes.getTransactionInfo);
router.get('/getTransactionsFromAddress', tronroutes.getTransactionsFromAddress);
router.get('/getAccountByAddress', tronroutes.getAccountByAddress);
router.get('/getBalanceByAddress', tronroutes.getBalanceByAddress);
router.get('/getBandwidthByAddress', tronroutes.getBandwidthByAddress);
router.get('/getTokensIssuedByAddress', tronroutes.getTokensIssuedByAddress);
router.get('/getTokenFromID', tronroutes.getTokenFromID);
router.get('/getNodeList', tronroutes.getNodeList);
router.post('/getBlockRange', tronroutes.getBlockRange);
router.get('/listSuperRepresentatives', tronroutes.listSuperRepresentatives);
router.get('/fullTokenList', tronroutes.fullTokenList);
router.get('/listTokensByLimit', tronroutes.listTokens);
router.get('/getContractByAddress', tronroutes.getContractByAddress);
router.post('/sendTransaction', tronroutes.sendTransaction);
router.post('/sendToken', tronroutes.sendToken);
router.post('/getTransactionFromBlock', tronroutes.getTransactionFromBlock);


module.exports= router




