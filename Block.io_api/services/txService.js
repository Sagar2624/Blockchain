
///////////////////////////////////////////////////////////////////////////////
//                                                                           //
//    //////   //         ////      /////  //   //      //////     ////      //
//    //   //  //       //    //  //       //  //         //     //    //    //
//    //////   //       //    //  //       ////           //     //    //    //
//    //   //  //       //    //  //       //  //         //     //    //    //
//    //////   ///////    ////      /////  //   //  //  //////     ////      //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////


const BlockIo = require('block_io');
const version = 2; // API version


//Method to Send Amount to any address
const sendAmount = async (data) => {
    return new Promise(async(resolve,reject)=>{
       try{
        //var result="";
        const {
            coin_code,
            amount,
            toAddress,
        } = data;
        let key =await  getKey(coin_code);

        const block_io = new BlockIo(key, process.env.PASSWORD, version);
        await block_io.withdraw({'amounts': amount, 'to_addresses': toAddress}, function (err,res){
        resolve(res)
    });
   } 
    catch(Exception){
       reject(Exception)
       throw new Error(Exception)
    }
   })
}

//Method for Transaction Details
const transaction = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var result = "";
            const {
                coin_code,
                txID
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_raw_transaction({ 'txid': txID }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method for Get Balance
const getBalance = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                address
            } = data; BlockIo
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_address_balance({ 'address': address }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Balance by Page Number
const getPage = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                pageNumber
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_my_addresses({ 'page': pageNumber }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get balance by userID
const getID = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                userID
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_address_balance({ 'user_id': userID }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get address by label
const getLabel = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                label
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_address_by_label({ 'label': label }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to calculate Network Fee Estimate
const getFeeEstimate = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                amount,
                toAddress
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_network_fee_estimate({ 'amounts': amount, 'to_addresses': toAddress }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Current Price
const getCurrentPrice = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_current_price({}, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Send Transactions 
const getSendTransaction = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_transactions({ 'type': 'sent' }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Received Transaction
const getReceivedTransaction = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_transactions({ 'type': 'received' }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Send Transaction using TxID
const getSendTx = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                txID
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_transactions({ 'type': 'sent', 'before_tx': txID }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Received Transaction Using TxID
const getReceivedTx = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                txID
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_transactions({ 'type': 'received', 'before_tx': txID }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Received Transaction by address
const getReceivedAddr = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                address
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_transactions({ 'type': 'received', 'addresses': address }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to make Archived Address
const getArchivedAddrress = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                address
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.archive_addresses({ 'address': address }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to make UnArchived Address
const getUnArchivedAddrress = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                address
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.unarchive_addresses({ 'address': address }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get All Archived Address
const getAllArchived = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_my_archived_addresses({}, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to check Valid Address
const getValidAddress = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                address
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.is_valid_address({ 'address': address }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method to get Received Transaction by userID
const getReceivedTxUserID = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                userID
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_transactions({ 'type': 'received', 'user_ids': userID }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

////Method to get Received Transaction by label
const getReceivedTxlabel = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //var result="";
            const {
                coin_code,
                label
            } = data;
            let key = await getKey(coin_code);

            const block_io = new BlockIo(key, process.env.PASSWORD, version);
            await block_io.get_transactions({ 'type': 'received', 'labels': label }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })

}

//Method for API Key Selection
const getKey = async (coin_code) => {
    let key;
    switch (coin_code) {
        case "BTC": key = (process.env.LIVE == true) ? process.env.BITCOIN_MAINNET_API : process.env.BITCOIN_TESTNET_API; break;
        case "LTC": key = (process.env.LIVE == true) ? process.env.LITECOIN_MAINNET_API : process.env.LITECOIN_TESTNET_API; break;
        case "DOGE": key = (process.env.LIVE == true) ? process.env.DOGECOIN_MAINNET_API : process.env.DOGECOIN_TESTNET_API; break;
    }
    return "0e1a-11af-c677-8781";
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