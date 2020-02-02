const express = require('express');
const router = express.Router();

const api = require('../controller/blockcontroller');

router.post('/sendAmount', api.sendAmount);
router.post('/withdrawAmount', api.withdrawAmount);

module.exports = router