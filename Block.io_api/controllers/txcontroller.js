

const txService = require('../services/txService');


const sendAmount = async (req, res) => {
    try {
        let data = {
            'coin_code': req.body.coin_code,
            'amount': req.body.amount,
            'toAddress': req.body.toAddress.trim(),
        }
      const result = await apiService.sendAmount(data);
      console.log(result)
      if(!result) res.status(400).send("No Result found");
      res.status(200).send(result);  
      }
      
    catch (Exception){
        res.status(400).send({
            "message": Exception
        })
      }
    }

const transaction = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'txID': req.body.txID.trim()
        }
        const result = await txService.transaction(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getBalance = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'address': req.body.address.trim()
        }
        const result = await txService.getBalance(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getPage = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'pageNumber': req.body.pageNumber
        }
        const result = await txService.getPage(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getID = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'userID': req.body.userID
        }
        const result = await txService.getID(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getLabel = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'label': req.body.label
        }
        const result = await txService.getLabel(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getFeeEstimate = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'amount': req.body.amount,
            'toAddress': req.body.toAddress
        }
        const result = await txService.getFeeEstimate(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getCurrentPrice = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code
        }
        const result = await txService.getCurrentPrice(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getSendTransaction = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code
        }
        const result = await txService.getSendTransaction(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getReceivedTransaction = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code
        }
        const result = await txService.getReceivedTransaction(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getSendTx = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'txID': req.body.txID
        }
        const result = await txService.getSendTx(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getReceivedTx = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'txID': req.body.txID
        }
        const result = await txService.getReceivedTx(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getReceivedAddr = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'address': req.body.address
        }
        const result = await txService.getReceivedAddr(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getArchivedAddrress = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'address': req.body.address
        }
        const result = await txService.getArchivedAddrress(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getUnArchivedAddrress = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'address': req.body.address
        }
        const result = await txService.getUnArchivedAddrress(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getAllArchived = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code
        }
        const result = await txService.getAllArchived(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getValidAddress = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'address': req.body.address
        }
        const result = await txService.getValidAddress(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getReceivedTxUserID = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'userID': req.body.userID
        }
        const result = await txService.getReceivedTxUserID(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}

const getReceivedTxlabel = async (req, res) => {

    try {
        let data = {
            'coin_code': req.body.coin_code,
            'label': req.body.label
        }
        const result = await txService.getReceivedTxlabel(data);
        console.log(result)
        if (!result) res.status(400).send("No Result found");
        res.status(200).send(result);
    }

    catch (Exception) {
        res.status(400).send({
            "message": Exception.toString()
        })
    }
}




module.exports = {
    sendAmount,
    transaction,
    getBalance,
    getPage,
    getID,
    getLabel,
    getFeeEstimate,
    getCurrentPrice,
    getSendTransaction,
    getReceivedTransaction,
    getSendTx,
    getReceivedTx,
    getReceivedAddr,
    getArchivedAddrress,
    getUnArchivedAddrress,
    getAllArchived,
    getValidAddress,
    getReceivedTxUserID,
    getReceivedTxlabel
}