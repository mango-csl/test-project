var express = require('express');
var app = express();
app.get('/demo_test', function (req, res) {
res.redirect('./index.html');
//res.redirect('www.baidu.com');
//     res.redirect('index', 'index.html');
});
app.use('/*',function(req,res,next){
    if(req.hostname == 'meetqy.com') return res.redirect(302, 'http://www.meetqy.com/');
    next();
});
app.listen(3000);
console.log("http://localhost:3000");
