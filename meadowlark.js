var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var app = express();
var fortune = require('./lib/fortune');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

//测试用中间件设置，必须出现在所有路由之前
app.use((req, res, next) => {
  res.locals.showTests = app.get('env') !== 'production' && req.query.text === '1';
  next();
})

//关于表单
app.get('/headers', (req, res) => {
  res.set('content-type', 'text/plain');
  var s = '';
  for (var name in req.headers) {
    s += name + ' ' + req.headers[name] + '\n';
  }
  res.send(s);
})

app.get('/newsletter', (req, res) => {
  // CSRF 提供一些虚拟值
  res.render('newsletter', {csrf: 'CSRF token goes here'});
})

app.post('/process', (req, res) => {
  if(req.xhr || req.accepts('json,html') === 'json') {
    // 如果发生错误，发送error
    res.send({success: true});
  } else {
    // 如果发生错误，应该重定向到错误页面
    res.redirect(303, '/thank-you');
  }
})


app.get('/tours/hood-river', (req, res) => {
  res.render('tours/hood-river');
})

app.get('/tours/request-group-rate', (req, res) => {
  res.render('tours/request-group-rate');
})


app.get('/', (req, res) => {
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
})

app.use((req, res) => {
  res.status(404);
  res.render('404');
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
})

app.listen(app.get('port'), ()=> {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
})