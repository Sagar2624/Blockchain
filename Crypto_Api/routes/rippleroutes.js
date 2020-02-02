const express= require('express');
const router = express.Router();
const rippleroutes = require('../controller/ripplecontroller');

router.post('/generate', rippleroutes.generate);
router.post('/account', rippleroutes.account);
router.post('/balance', rippleroutes.balance);
router.post('/transaction', rippleroutes.transaction);
router.post('/transactionhash', rippleroutes.transactionhash);
router.post('/estimatedFee', rippleroutes.estimatedFee);
router.post('/convertDropsToXrp', rippleroutes.convertDropsToXrp);
router.post('/convertXrpToDrops', rippleroutes.convertXrpToDrops);
router.post('/transactionList', rippleroutes.transactionList);


module.exports= router