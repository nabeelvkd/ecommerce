const { response } = require('express');
var express = require('express');
var router = express.Router();
var prdctHelper = require('../helper/prdct-helper');
const userHelper = require('../helper/user-helper')
const { route } = require('./admin');
const verify = (req, re, next) => {
  if (req.session.logggedIn) {
    next()
  } else {
    re.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  let cartCunt = null
  if (req.session.user)
    cartCunt = await userHelper.getcartCunt(req.session._id)
  prdctHelper.getAllPrdct().then((prdct) => {
    res.render('vie-prdct', { prdct, admin: false, user, cartCunt });
  })
});

router.get('/login', function (req, re) {
  if (req.session.logggedIn) {
    re.redirect('/')
  } else {
    re.render('login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})
router.get('/signup', function (req, re) {
  re.render('signup')
})
router.post('/signup', (req, re) => {
  userHelper.doSignup(req.body).then((response) => {
    req.session.logggedIn = true;
    req.session.user = response
    re.redirect('/')
  })
})
router.post('/login', (req, re) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.t) {
      req.session.logggedIn = true
      req.session.user = response.user
      re.redirect('/')
    } else {
      req.session.loginErr = true
      re.redirect('/login')
    }
  })
})
router.get('/logout', (req, re) => {
  req.session.destroy()
  re.redirect('/')
})
router.get('/cart', verify, async (req, re) => {
  let prdct = await userHelper.getaddCart(req.session.user._id)
  console.log(prdct + "hll")
  re.render('cart', { prdct, user: req.session.user })
})
router.get('/add-cart/:id', verify, (req, re) => {
  userHelper.addCart(req.params.id, req.session.user._id).then(() => {
    re.json({ status: true })
  })
})
router.get('/cart/delete/:id', (req, re) => {
  let prdctId = req.params.id
  userHelper.deleteCart(prdctId).then((response) => {
    re.redirect('/cart/')
  })

})

module.exports = router;
