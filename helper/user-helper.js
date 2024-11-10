var db = require('../config/connection');
var cllect = require('../config/collections')
const bcrypt = require('bcrypt');
var objectId = require('mongodb').ObjectId;
const { response } = require('express');

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(cllect.UER_C).insertOne(userData).then((data) => {
                resolve(data.insertedId.toString())
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let lT = false
            let response = {}
            let user = await db.get().collection(cllect.UER_C).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((t) => {
                    if (t) {
                        console.log('lgged')
                        response.user = user
                        response.t = true
                        resolve(response)
                    } else {
                        console.log('failed')
                        resolve({ t: false })
                    }
                })
            } else {
                console.log('failed qp')
                resolve({ t: false })
            }
        })
    },
    addCart: (prdctId, userId) => {
        let prdctitem = {
            item: objectId(prdctId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(cllect.CARt_c).findOne({ user: objectId(userId) })
            if (userCart) {
                let prdctEx = userCart.prdct.findIndex(prdct => prdct.item == prdctId)
                if (prdctEx != -1) {
                    db.get().collection(cllect.CARt_c).updateOne({ 'prdct.item'})
                }
                db.get().collection(cllect.CARt_c).updateOne({ user: objectId(userId) },
                    {

                        $push: { prdct: prdctitem }

                    }).then((response) => {
                        resolve()
                    })
            } else {
                let Cart = {
                    user: objectId(userId),
                    prdct: [objectId(prdctitem)]
                }
                db.get().collection(cllect.CARt_c).insertOne(Cart).then((response) => {
                    resolve()
                })
            }
        })
    },
    getaddCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(cllect.CARt_c).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $lookup: {
                        from: cllect.PRDCT_C,
                        let: { prdctlt: '$prdct' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$prdctlt']
                                    }
                                }
                            }
                        ],
                        as: 'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },
    getcartCunt: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cunt = 0;
            let cart = await db.get().collection(cllect.CARt_c).findOne({ user: objectId(userId) })
            if (cart) {
                cunt = cart.prdct.length
            }
            resolve(cunt)
        })
    },
    deleteCart: (prdctId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(cllect.CARt_c).deleteOne({ _id: objectId(prdctId) }).then((response) => {
                resolve(response)
            })
        })
    },
}
