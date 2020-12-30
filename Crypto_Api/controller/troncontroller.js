
const TronWeb = require('tronweb');
const https = require('https');

// This provider is optional, you can just use a url for the nodes instead
const HttpProvider = TronWeb.providers.HttpProvider;
// main net
const fullNode = new HttpProvider('https://api.trongrid.io'); // Full node http endpoint
const solidityNode = new HttpProvider('https://api.trongrid.io'); // Solidity node http endpoint
const eventServer = new HttpProvider('https://api.trongrid.io');
//test net
// var fullNode = new HttpProvider('https://api.shasta.trongrid.io'); // Full node http endpoint
// var solidityNode = new HttpProvider('https://api.shasta.trongrid.io'); // Solidity node http endpoint
// var eventServer = new HttpProvider('https://api.shasta.trongrid.io'); // Contract events http endpoint

module.exports = {
    
    account:  async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        console.log("hello")
        tronWeb.setDefaultBlock('latest');
        // tronWeb.contract(dewew,false)
         await tronWeb.createAccount().then(account => {
            res.send(account)
        }).catch(err => {
            res.status(400);
            res.send({message: err});
        })
    },

    currentBlock: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        await tronWeb.trx.getCurrentBlock().then(currentBlock => {
            res.send(currentBlock)
        }).catch(err => {
            res.status(400);
            res.send({message: err});
        })
    },

    previousBlock: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
       await  tronWeb.trx.getBlock('0').then(previousBlock => {
            res.send(previousBlock)
        }).catch(err => {
            res.status(400);
            res.send({message: err});
        })

    },
    
    getTransactionByHash: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        console.log(req.query.hash)
        if (req.query.hash) {
          await  tronWeb.trx.getTransaction(req.query.hash).then(transaction => {
                res.send(transaction);
            }).catch(err => {
                    res.status(400)
                    res.send({message: err})
                }
            );
        } else {
            res.status(400);
            res.send({message: "Please send hash"})

        }
    },
    
    getTransactionInfo: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        console.log(req.query.hash)
        if (req.query.hash) {
          await  tronWeb.trx.getTransactionInfo(req.query.hash).then(transaction => {
              console.log(transaction)
                res.send(transaction);
            }).catch(err => {
                    res.status(400)
                    res.send({message: err})
                }
            );
        } else {
            res.status(400);
            res.send({message: "Please send hash"})

        }


    },
    getTransactionsFromAddress: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            
        );
        tronWeb.setDefaultBlock('latest');
        console.log(req.query.address)
        if (req.query.address) {
        https.get('https://apilist.tronscan.org/api/transaction?address=TKs5Bfao7HeUV4EfcHsxeyTBX2pcm6sB3d', (resp) => {
            let data = '';
          
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
              data += chunk;
            });
          
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
              console.log(JSON.parse(data));
              res.send(JSON.parse(data));
            });
          
          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });
        } else {
                res.status(400);
                res.json({"message": "Please send address"})
    
            }
    },
    getAccountByAddress: async (req, res) => {
        console.log(req.query.address);
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        if (req.query.address) {
            await  tronWeb.trx.getAccount(req.query.address).then(accountInfo => {
                res.send(accountInfo);

            }).catch(err => {
                res.status(400);
                res.send({"message": err})
            });
        } else {
            res.status(400);
            res.send({"message": "Please send address"})

        }


    },
    getBalanceByAddress:  async(req, res) => {
        console.log(req.query.address)
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        if (req.query.address) {
            await  tronWeb.trx.getBalance(req.query.address).then(balance => {
                console.group('Account balance');
                console.log('- Balance:', balance, '\n');
                res.status(200)
                res.send(balance.toString());
                console.groupEnd();
            }).catch(err => {
                res.status(400);
                res.send({"message": err})
            });
        } else {
            res.status(400);
            res.send({"message": "Please send address"})

        }


    },
    getBandwidthByAddress: async (req, res) => {
        console.log(req.query.address);
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        if (req.query.address) {
            await  tronWeb.trx.getBandwidth(req.query.address).then(bandwidth => {
                console.group('Account bandwidth');
                console.log('- Bandwidth:', bandwidth, '\n');
                console.groupEnd();
                res.send(bandwidth.toString());

            }).catch(err => {
                res.status(400);
                res.send({"message": err})
            });
        } else {
            res.status(400);
            res.send({"message": "Please send address"})

        }


    },
    getTokensIssuedByAddress: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        console.log(req.query.address);
        tronWeb.setDefaultBlock('latest');
        if (req.query.address) {
            await  tronWeb.trx.getTokensIssuedByAddress(req.query.address).then(tokens => {
                console.group('Account Token');
                console.log('- token:', tokens, '\n');
                console.groupEnd();
                res.send(tokens);

            }).catch(err => {
                res.status(400);
                res.send({"message": err})
            });
        } else {
            res.status(400);
            res.send({"message": "Please send address"})

        }
    },

    getTokenFromID: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        console.log(req.query.id)
        if (req.query.id) {
            await  tronWeb.trx.getTokenFromID(req.query.id).then(tokens => {
                res.send(tokens);
            }).catch(err => {
                res.status(400);
                res.send({"message": err})
            });
        } else {
            res.status(400);
            res.send({"message": "Please send id"})

        }
    },

    getNodeList: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');

        await tronWeb.trx.listNodes().then(nodes => {
            res.send(nodes);
        }).catch(err => {
            res.status(400);
            res.send({"message": err})
        })
    },
    
    listSuperRepresentatives: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        await tronWeb.trx.listSuperRepresentatives().then(superRepresentatives => {
            res.send(superRepresentatives);
        }).catch(err => {
            res.status(400);
            res.send({"message": err})
        })


    },
    fullTokenList: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        await tronWeb.trx.listTokens().then(listTokens => {
            res.send(listTokens);

        }).catch(err => {
            res.status(400);
            res.send({"message": err})
        })


    },
    listTokens: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        if (req.query.limit) {
            await  tronWeb.trx.listTokens(req.query.limit, (err, tokens) => {
                if (err) {
                    res.status(400);
                    res.send({"message": err});
                }
                res.send(tokens);
            });

        } else {
            res.status(400);
            res.send({"message": "Please send limit"});

        }


    },
    getContractByAddress:async  (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        if (req.query.address) {
            await  tronWeb.trx.getContract(req.query.address).then(contract => {
                res.send(contract);

            }).catch(err => {
                res.status(400);
                res.send({"message": err})
            });

        } else {
            res.status(400);
            res.send({"message": "Please send address"});

        }
    },
    getBlockRange: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        if (req.body.start && req.body.end) {
            await tronWeb.trx.getBlockRange(req.body.start, req.body.end).then(contract => {
                res.send(contract);

            }).catch(err => {
                res.status(400);
                res.send({"message": err})
            });

        } else {
            res.status(400);
            res.send({"message": "Please send start and end block number"});

        }


    },
    
    sendTransaction: async (req, res) => {
        if (req.body.privateKey) {
            const tronWeb = new TronWeb(
                fullNode,
                solidityNode,
                eventServer,
                req.body.privateKey
            );
            tronWeb.setDefaultBlock('latest');
            if (req.body.address && req.body.amount) {
                console.log(req.body)
                await  tronWeb.trx.sendTransaction(req.body.address, req.body.amount * 1000000,req.body.privateKey).then(transaction => {
                    res.send(transaction);
                }).catch(err => {
                    res.status(400);
                    res.send({"message": err})
                })
            } else {
                res.status(400);
                res.send({"message": "Please send address and amount"});

            }
        } else {
            res.status(400);
            res.send({"message": "Please send privateKey"});
        }

    },
    sendToken: async (req, res) => {
        if (req.body.privateKey) {
            const tronWeb = new TronWeb(
                fullNode,
                solidityNode,
                eventServer,
                req.body.privateKey
            );
            tronWeb.setDefaultBlock('latest');
            if (req.body.address && req.body.amount && req.body.tokenId) {
                console.log(req.body)
                await   tronWeb.trx.sendToken(req.body.address, req.body.amount, req.body.tokenId,req.body.privateKey).then( transaction=> {


                        res.send(transaction);

                }).catch(err => {
                    res.status(400);
                    res.send({"message": err})
                })

            } else {
                res.status(400);
                res.send({"message": "Please send address ,amount and tokenId"});

            }
        } else {
            res.status(400);
            res.send({"message": "Please send privateKey"});
        }

    },
    getTransactionFromBlock: async (req, res) => {
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            ""
        );
        tronWeb.setDefaultBlock('latest');
        if (req.body.block && req.body.index) {
            await tronWeb.trx.getTransactionFromBlock(req.body.block, req.body.index, (err, events) => {
                console.log(err, events)
                if (err) {
                    res.status(400);
                    res.send({"message": err})
                } else {
                    res.send(events);
                }


            });

        } else {
            res.status(400);
            res.send({"message": "Please send block and index"});

        }

    },
}