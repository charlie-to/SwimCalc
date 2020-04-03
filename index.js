var express = require('express');
var app = express();
const pug = require('pug');
const bodyParser = require("body-parser");
const calc = require('./lib/calc');
const mkteet = require('./lib/mktweet');
const PORT = process.env.PORT ||3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));
var router = express.Router();
app.use(bodyParser.json());

var timeData = {
  timeMin: [],
  timeSec: [],
  timeDeg: [],
  rapSec: [],
  rapDeg: [],
  secTime: []
};

//httpリクエスト受け取り、pugを渡す
app.get('/',(req,res)=>{
  res.end(pug.renderFile('./views/form.pug'));
  console.info('pug ok');
});


//ポストメゾッドの処理
app.post('/', (req, res)=>{
  var memo = req.body.content;
  console.info('memo get');
  timeData = calc.rapCalcutator(memo);
  console.info('calc ok');
  handleRedirectPosts(req, res);
  console.info('Redirected');
});

//ツイート文を表示
app.get('/post', (req, res)=>{
  var body = mkteet.makeTweet(timeData);
  console.info(body);
  res.end(pug.renderFile(('./views/tweet.pug'),{
    body : body
  }));
  console.log('normal ended');
});

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': './post'
  });
  res.end();
};

//サーバー起動
app.listen(PORT, () => {
  console.log('> unubo-poc - 0.0.1-alpha');
  console.log(`> Ready on http://localhost:${PORT}...`);
});