const PORT = process.env.PORT;
const path = require('path');
const logger = require('./lib/log/logger.js');
const accessloger = require('./lib/log/accesslogger.js');
const applicationlogger = require('./lib/log/applicationlogger.js');
const express = require('express');
const favicon = require('serve-favicon');
const app = express();

/* 
  app.getは、ExpressアプリケーションにおけるHTTP GETリクエストを処理するためのメソッド
  res.endは、Node.jsのHTTPレスポンスオブジェクトのメソッドで、レスポンスの終了を示す。
  res.endを呼び出すと、サーバーはクライアントにレスポンスデータを送信し、レスポンスを終了。
  app.setでejs拡張子をもつテンプレエンジンと使用することを認識させる
  x-powerd-byをdisabledで非表示にする（サーバー情報）
  app.useは、全てのHTTPメソッド（GET, POST, PUT, DELETEなど）に対応するルートハンドラーを設定する
__dirname は、Node.js 環境で使用される特殊な変数で、現在実行中のスクリプトが存在するディレクトリの絶対パスを示します。
*/

// app.get('/', (req, res) => {
//   res.end('hello World');
// });

app.set('view engine', 'ejs');
app.disable('x-powered-by');

// 静的コンテンツの配信
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '/public')));

// access log
app.use(accessloger());

// 動的コンテンツ配信
app.use('/', require('./routes/index.js'));

/* 
/test へのリクエストが来たときに、指定されたミドルウェア関数が実行されます。
@garafu/mysql-fileloader モジュールをインポートしています。
　このモジュールは、SQLファイルを読み込んでその内容を処理する機能を提供します。

conでコネクションを作成している。
promisifyを使ってコールバック地獄を回避している
*/
app.use('/test', async (req, res, next) => {
  const { MySQLClient, sql } = require('./lib/database/client.js');
  var data;

  try {
    await MySQLClient.connect();
    // root配下の以下のファイルのsqlを実行する
    data = await MySQLClient.query(await sql('SELECT_SHOP_BASIC_BY_ID'), [1]);
    console.log(data);
  } catch (err) {
    next(err);
  } finally {
    await MySQLClient.end();
  }

  res.end('OK');
});

// application log
app.use(applicationlogger());

app.listen(PORT, () => {
  logger.application.info(`Application listening at ${PORT}`);
});
