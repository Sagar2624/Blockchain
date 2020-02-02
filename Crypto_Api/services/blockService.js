const BlockIo = require('block_io');
const version = 2; // API version

const sendAmount = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                password,
                amount,
                toAddress,
                key
            } = data;

            const block_io = new BlockIo(key, password, version);
            await block_io.withdraw({ 'amount': amount, 'to_addresses': toAddress }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })
}
const withdrawAmount = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            const {
                password,
                amount,
                fromAddress,
                toAddress,
                key
            } = data;
            
            const block_io = new BlockIo(key, password, version);
            await block_io.withdraw_from_addresses({ 'amounts': amount, 'from_addresses': fromAddress, 'to_addresses': toAddress }, function (err, res) {
                resolve(res)
            });
        }
        catch (Exception) {
            reject(Exception)
            throw new Error(Exception)
        }
    })
}

module.exports = {
    sendAmount,
    withdrawAmount
}