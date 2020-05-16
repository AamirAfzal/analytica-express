var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
var passport = require("passport");
var mongoose =require('mongoose');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login',(req,res,next) => {
  passport.authenticate("local",{session:false}, (err,user,info) => {
    if (err|| !user) {
      res.status(400).json({status:"FAIL",data: "An Error Occurred"});
    }
    req.login(user,{session:false}, err => {
      if (err) {
        res.status(401).json({status:"FAIL",data:err});
      }
    });
    const token = jwt.sign(user.toJSON(),'abc123');
    return res.json({status: "OK",jwtToken:token,data:"Login Successful!"});
  })(req,res);
});

router.post('/register', (req,res,next) => {
  try {
    req.body.password = passwordHash.generate(req.body.password);
    console.log(mongoose.connection.readyState);
    User.create(req.body)
    .then(result => res.json({'status':'OK',data:result}),err => res.json({status:"FAIL",data:JSON.stringify(err)}))
    .catch(error => res.json({status:"FAIL",data:error}));
  } catch (err) {
    return res.json({status: "FAIL", data: err});
  }
});
module.exports = router;
