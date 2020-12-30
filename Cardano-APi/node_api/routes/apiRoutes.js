const express= require('express');
const router = express.Router();
const controller = require('../controller/cardanoApi');

//-----------------------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------ROUTES FOR FUNCTIONS OF CARDANO------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------------------//                                             

    /**
    * @typedef createMnemonic
    */
    /**
    * @route GET /api/cardano/createMnemonic
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/createMnemonic', controller.createMnemonic); 

    /**
    * @typedef createWallet
    * @property {String} style.required - Add style - eg: random 
    * @property {String} name.required - Add name - eg: Wallet 
    * @property {String} passphrase.required - Add passphrase - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
    * @property {[object]} mnemonic_sentence.required - Add mnemonic_sentence - eg: AzP8n6XC9jESEw
    */
    /**
    * @route POST /api/cardano/createWallet
    * @param {createWallet.model} req.body
    * @group Cardano_API
    * @security Basic Auth
    */
router.post('/createWallet', controller.createWallet);

    /**
    * @typedef getWalletByWalletId
    * @property {String} walletId.required - Add walletId - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    */
    /**
    * @route GET /api/cardano/getWalletByWalletId
    * @param {getWalletByWalletId.model} walletId.query
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/getWalletByWalletId', controller.getWalletByWalletId);     

    /**
    * @typedef listWallets
    */
    /**
    * @route GET /api/cardano/listWallets
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/listWallets', controller.listWallets);

    /**
    * @typedef createAddressByWalletId
    * @property {String} walletId.required - Add walletId - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    * @property {String} passphrase.required - Add passphrase - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
    * @property {number} address_index.required - Add address_index - eg: 2147483652
    */
    /**
    * @route POST /api/cardano/createAddressByWalletId
    * @param {createAddressByWalletId.model} req.body
    * @group Cardano_API
    * @security Basic Auth
    */
router.post('/createAddressByWalletId', controller.createAddressByWalletId);

    /**
    * @typedef getAddressByWalletId
    * @property {String} walletId.required - Add walletId - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    */
    /**
    * @route GET /api/cardano/getAddressByWalletId
    * @param {getAddressByWalletId.model} walletId.query
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/getAddressByWalletId', controller.getAddressByWalletId); 

    /**
    * @typedef getbalanceOfAddress
    * @property {String} address.required - Add address - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    */
    /**
    * @route GET /api/cardano/getbalanceOfAddress
    * @param {getbalanceOfAddress.model} address.query
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/getbalanceOfAddress', controller.getbalanceOfAddress);

    /**
    * @typedef transfer
    * @property {String} walletId.required - Add walletId - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    * @property {String} address.required - Add address - eg: qwertyuioplkjhgfdsaaa
    * @property {number} amount.required - Add amount - eg: 12
    * @property {String} passphrase.required - Add passphrase - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
    */
    /**
    * @route POST /api/cardano/transfer
    * @param {transfer.model} req.body
    * @group Cardano_API
    * @security Basic Auth
    */
router.post('/transfer', controller.transfer);

    /**
    * @typedef getTransactionByAddress
    * @property {String} address.required - Add address - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    */
    /**
    * @route GET /api/cardano/getTransactionByAddress
    * @param {getTransactionByAddress.model} address.query
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/getTransactionByAddress', controller.getTransactionByAddress);

    /**
    * @typedef getTransactionByWalletId
    * @property {String} walletId.required - Add walletId - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    */
    /**
    * @route GET /api/cardano/getTransactionByWalletId
    * @param {getTransactionByWalletId.model} walletId.query
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/getTransactionByWalletId', controller.getTransactionByWalletId); 

    /**
    * @typedef getTransactionByTransactionId
    * @property {String} walletId.required - Add walletId - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    * @property {String} transactionId.required - Add transactionId - eg: qazwsxedrfvtgbyhn
    */
    /**
    * @route GET /api/cardano/getTransactionByTransactionId
    * @param {getTransactionByTransactionId.model} walletId.query
    * @param {getTransactionByTransactionId.model} transactionId.query
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/getTransactionByTransactionId', controller.getTransactionByTransactionId); 

    /**
    * @typedef getTransactionFee
    * @property {String} walletId.required - Add walletId - eg: 0e5b5bd747afd466dfdc3cdf105810903be5739b
    * @property {String} address.required - Add address - eg: qwertyuioplkjhgfdsaaa
    * @property {number} amount.required - Add amount - eg: 12
    * @property {String} passphrase.required - Add passphrase - eg: XdAUmwtig27HBG6WfYyHAzP8n6XC9jESEw
    */
    /**
    * @route POST /api/cardano/getTransactionFee
    * @param {getTransactionFee.model} req.body
    * @group Cardano_API
    * @security Basic Auth
    */
router.post('/getTransactionFee', controller.getTransactionFee);

    /**
    * @typedef Cardano_Status
    */
    /**
    * @route GET /api/cardano/getStatus
    * @group Cardano_API
    * @security Basic Auth
    */
router.get('/getStatus', controller.getStatus);


module.exports= router
