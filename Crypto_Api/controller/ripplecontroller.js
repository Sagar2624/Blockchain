
var RippleAPI = require('ripple-lib').RippleAPI;
//const https = require('https');
var request = require('request');
var RIPPLE_IP='wss://s.altnet.rippletest.net:51233';
var api = new RippleAPI({
    server: RIPPLE_IP
});


//     ____  _             __        ______                 __
//    / __ \(_)___  ____  / /__     / ____/   _____  ____  / /______
//   / /_/ / / __ \/ __ \/ / _ \   / __/ | | / / _ \/ __ \/ __/ ___/
//  / _, _/ / /_/ / /_/ / /  __/  / /___ | |/ /  __/ / / / /_(__  )
// /_/ |_/_/ .___/ .___/_/\___/  /_____/ |___/\___/_/ /_/\__/____/
//        /_/   /_/

api.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
    console.log('Connecting To Ripple Network');
});
api.on('disconnected', (code) => {
    console.log('Breaking Connection from Ripple Network');
});


//     ____  _             __        ___    ____  ____
//    / __ \(_)___  ____  / /__     /   |  / __ \/  _/
//   / /_/ / / __ \/ __ \/ / _ \   / /| | / /_/ // /
//  / _, _/ / /_/ / /_/ / /  __/  / ___ |/ ____// /
// /_/ |_/_/ .___/ .___/_/\___/  /_/  |_/_/   /___/
//        /_/   /_/

module.exports = {


    //Generates new address for a ripple account
    generate: async (req, res) => {
        try {
             var connection = await api.connect();
             var response = await api.generateAddress();
             api.disconnect();
              res.status(200).send(response);
        } catch (error) {
             res.status(404).send(error);
            }
    },


    //Get account information for an address
    //{
    //    "address": "rnYRMr1enTqouW1NGK5J3qkQbFsEBERKmZ"
    //}
    account: async (req, res) => {
        try {
            var connection = await api.connect();
            var response = await api.getAccountInfo(req.body.address);
            api.disconnect();
            res.status(200).send(response);
        } catch (error) {
            res.status(404).send(error);
        }
    },

    
    //Get balance information for an address
    //{
    //    "address": "rnYRMr1enTqouW1NGK5J3qkQbFsEBERKmZ"
    //}
    balance: async (req,res) => {
        try {
            var connection = await api.connect();
            var response = await api.getBalances(req.body.address);
            api.disconnect();
            res.status(200).send(response);
        } catch (error) {
            res.status(404).send(error);
        }
    },


    //Create a transaction to send Ripple to an address
    //     {
    //         "address": "rHgeSrUq5kYMa57nsEyRSJzCL7pvmjLk3m",
    //         "secret": "saaGc4VD1GbKz359R71V9LX1r68zx",
    //        "payment": {
    //            "source": {
    //                 "address": "rHgeSrUq5kYMa57nsEyRSJzCL7pvmjLk3m",
    //                "amount": {
    //                    "currency": "XRP",
    //                    "value": "20"
    //              }
    //            },
    //            "destination": {
    //                "address": "rPYsDpxm7zgtJZ6rxdjrGLwYUNS1jA4tWn",
    //                "tag":8782342,
    //                "minAmount": {
    //                   "currency": "XRP",
    //                   "value": "20"
    //                }
    //            }
    //        }
    //    }
    transaction: async(req,res) => {
        try {
            var connection = await api.connect();
            var preparedPayment = await api.preparePayment(req.body.address, req.body.payment);
            var signedHash = await api.sign(preparedPayment.txJSON, req.body.secret)
            var response = await api.submit(signedHash.signedTransaction);
            response.resultHash = signedHash.id;
            api.disconnect();
            res.status(200).send(response);
        } catch (error) {
            res.status(404).send(error);
        }
    },


    //Get transaction information by the transaction hash
    //     {
    //     "hash" : "8C252A8505F64B3F88E6B81621995CF320A4CA92BBA8C0B7A95C396C6E786386"
    //      }
    transactionhash: async(req,res) => {
        try {
            var connection = await api.connect();
            var response = await api.getTransaction(req.body.hash);
            api.disconnect();
            res.status(200).send(response);
        } catch (error) {
            res.status(404).send(error);
        }
    },


    estimatedFee: async(req,res) => {
        try {
            var connection = await api.connect();
            var response = await api.getFee();
            api.disconnect();
            res.status(200).send(JSON.parse('{"status": true,"data":"'+response+'"}'));
        } catch (error) {
            res.status(404).send(error);
        } 
    },

    // Convert drops to XRP
    // {
    //   "val" : "120000000"
    // }
    convertDropsToXrp: async(req,res) => {
        try {
            var connection = await api.connect();
            var response = await api.dropsToXrp(req.body.val);
            api.disconnect();
            res.status(200).send(response);
        } catch (error) {
            res.status(404).send(error);
        }
    },


    // Convert XRP to Drops
    // {
    //   "val" : "120000000"
    // }
    convertXrpToDrops: async(req,res) => {
        try {
            var connection = await api.connect();
            var response = await api.xrpToDrops(req.body.val);
            api.disconnect();
            res.status(200).send(JSON.parse(response));
        } catch (error) {
            res.status(404).send(error);
        }
    },


    //To get list of transaction
    transactionList: async(req,res) => {
        console.log(req.query);

        try {
            //var vr="";
            var query = "https://data.ripple.com/v2/accounts/"+req.query.address+"/transactions?type=Payment&result=tesSUCCESS";
            console.log(req.query.address);
            request(query,async (err,result)=>
            {

                    if(err){
                       console.log(err)
                        throw err;
                    }else
                    var json = JSON.parse(result.body)
                    var final='{"status": true, "data": [';
               for(index=0;index<json.transactions.length;index++){
                    if(json.transactions[index].tx.Destination==req.query.address)
                    var txid='{"txid" :"'+json.transactions[index].hash+'",'; 
                    final=final+txid;
                    final=final+'"type": "receive",';
                    //console.log(json.transactions[index].tx.Amount);  
                    
                    var amount = '"amount" :"'+json.transactions[index].tx.Amount+'",';
                    if(typeof(json.transactions[index].tx.Amount)=='object'){
                        var amount ='"amount" :"'+json.transactions[index].tx.Amount.value+''+json.transactions[index].tx.Amount.currency+'",';
                        final=final+amount;
                        api.disconnect();
                    }
                    else{ 
                    final=final+'"amount" :"'+api.dropsToXrp(json.transactions[index].tx.Amount)+'",';
                    console.log(amount.value)
                    }
                    if(index<json.transactions.length-1) {
                    var date = '"time" :"'+json.transactions[index].date+'"'+'},'; 
                    final=final+date;
                    }
                    else {
                        var date = '"time" :"'+json.transactions[index].date+'"'+'}'; 
                        final=final+date;
                    }
                }
                final=final+"] }";
               //req +=final;
               //return final;
               res.send(JSON.parse(final)) 
            })  
        } catch (error) {
            res.status(404).send(error);
        }
    }
}

