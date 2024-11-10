const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect = function (d) {
    const url = 'mongodb://localhost:27017'
    const dbname = 'cart'

    mongoClient.connect(url, (err, data) => {
        if (err) return done(err)
        state.db=data.db(dbname)
        d()
    })

    
}

module.exports.get=function(){
    return state.db
}