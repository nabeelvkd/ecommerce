const { response } = require('express');
var express = require('express');
const { NetworkAuthenticationRequire } = require('http-errors');
var router = express.Router();
var prdctHelper = require('../helper/prdct-helper')

/* GET users listing. */
router.get('/', function (req, res, next) {

  prdctHelper.getAllPrdct().then((prdct) => {

    res.render('admin', { prdct, admin: true });

  })

});
router.get('/add-prdct', function (req, re) {
  re.render('add-prdct', { admin: true })
})
router.post('/add-prdct', (req, re) => {

  prdctHelper.addPrdct(req.body, (Id) => {
    let Image = req.files.Image;
    Image.mv('c:/Users/User/Desktop/file/c0ding/express/public/prdct-image/' + Id + '.jpg', (err, d) => {

      re.render('add-prdct', { admin: true });

    })
  })
})
router.get('/delete-prdct/:id', (req, re) => {
  let prdctId = req.params.id
  prdctHelper.deletePrdct(prdctId).then((response) => {
    re.redirect('/admin/')
  })

})
router.get('/edit-prdct/:id', async (req, re) => {
  let prdct = await prdctHelper.getPrdctDetail(req.params.id)
  re.render('edit-prdct',{prdct})
})
router.post('/edit-prdct/:id',(req,re)=>{
  prdctHelper.updatePrdct(req.params.id,req.body).then(()=>{
    re.redirect('/admin')
  })
})


module.exports = router;
