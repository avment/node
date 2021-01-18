var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

//设置handlebars视图引擎

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/about', (req, res) => {
  var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render('about', {fortune: randomFortune});
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

var fortunes = [
  "Conquer your fears or they will conquer you.",
  "Rivers need springs.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Whenever possible, keep it simple.",
];