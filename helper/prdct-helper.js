var db = require('../config/connection')
var cllect = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectId

module.exports = {

    addPrdct: (prdct, callback) => {
        
        db.get().collection('prdct').insertOne(prdct).then((data) => {

            callback(data.insertedId.toString())

        })
    },
    getAllPrdct: () => {
        return new Promise(async (resolve, reject) => {
            let prdct = await db.get().collection(cllect.PRDCT_C).find().toArray()
            resolve(prdct)
        })
    },
    deletePrdct: (prdctId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(cllect.PRDCT_C).deleteOne({ _id: objectId(prdctId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getPrdctDetail: (prdctId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(cllect.PRDCT_C).findOne({ _id: objectId(prdctId) }).then((prdct) => {
                resolve(prdct)
            })
        })
    },
    updatePrdct: (prdctId, prdctDetail) => {
        return new Promise((resolve, reject) => {
            db.get().collection(cllect.PRDCT_C)
                .updateOne({ _id: objectId(prdctId) }, {
                    $set: {
                        Name: prdctDetail.Name,
                        Detail: prdctDetail.Detail,
                        Price: prdctDetail.Price,
                        Cat: prdctDetail.Cat,
                    }
                }).then((response) => {
                    resolve()
                })
        })
    }

}
