
const apiService = require('../services/blockService');

const sendAmount = async (req, res) => {
  try {
    console.log('controller is working')
    let data = {
      'password': req.body.password,
      'amount': req.body.amount,
      'toAddress': req.body.toAddress.trim(),
      'key': req.body.key
    }
    const result = await apiService.sendAmount(data);
    console.log(result)
    if (!result) res.status(400).send("No Result found");
    res.status(200).send(result);
  }

  catch (Exception) {
    res.status(400).send({
      "message": Exception
    })
  }
}

const withdrawAmount = async (req, res) => {
  try {
    console.log('controller is working')
    let data = {
      'password': req.body.password,
      'amount': req.body.amount,
      'fromAddress': req.body.fromAddress.trim(),
      'toAddress': req.body.toAddress.trim(),
      'key': req.body.key
    }
    const result = await apiService.withdrawAmount(data);
    console.log(result)
    if (!result) res.status(400).send("No Result found");
    res.status(200).send(result);
  }

  catch (Exception) {
    res.status(400).send({
      "message": Exception
    })
  }
}

module.exports = {
  sendAmount,
  withdrawAmount
}
