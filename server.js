var express = require("express");
var bodyParser = require('body-parser');
var hbase = require('hbase-rpc-client');
var shortid = require('shortid');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var client = hbase({
    zookeeperHosts:['10.15.13.17:2222']
})

client.on('error',function(err){console.log(err)})

console.log("Zookepeer Connected")

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
   
    var Put = new hbase.Put(shortid.generate())

    Put.add("personal data", "name", name)
    Put.add("personal data", "email", email)
    Put.add("personal data", "phone", phone)

    client.put('promo', Put, function(err, res) {
       if(err) {
          console.log(err)
       }
    })

    res.sendFile(path + "index.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.redirect("http://st.jd.id/page/p/notfound.html");
});

app.listen(8000,function(){
  console.log("Live at Port 8000");
});
