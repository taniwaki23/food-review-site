const PORT = process.env.PORT;
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const app = express();

/* 
  app.getは、ExpressアプリケーションにおけるHTTP GETリクエストを処理するためのメソッド
  res.endは、Node.jsのHTTPレスポンスオブジェクトのメソッドで、レスポンスの終了を示す。
  res.endを呼び出すと、サーバーはクライアントにレスポンスデータを送信し、レスポンスを終了。
  app.setでejs拡張子をもつテンプレエンジンと使用することを認識させる
  x-powerd-byをdisabledで非表示にする（サーバー情報）
*/

// app.get('/', (req, res) => {
//   res.end('hello World');
// });

app.set('view engine', 'ejs');
app.disable('x-powered-by');

// 静的コンテンツの配信
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '/public')));

// 動的コンテンツ配信
app.use('/', require('./routes/index.js'));

app.listen(PORT, () => {
  console.log(`Application listening at ${PORT}`);
});
