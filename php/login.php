<?php

// JSONDBManagerクラスを読み込む
require_once('JSONDBManager.php');

// ユーザ名を変数に入れる
$userName = $_POST['userName'];
// パスワード入れる
$password = sha1($_POST['password']);

// DBに接続する。
$dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
// クエリをUTF8で設定する
$dbh->query('SET NAMES utf8');
// idとパスワードから一致するデータを取り出すためのクエリ
$sql = "SELECT id FROM user_inf WHERE login_id='$userName' AND password='$password';";
// クエリを実行する準備をする
$stmt = $dbh->prepare($sql);
// sqlを実行する
$stmt->execute();
// 結果を変数に入れる
$result = $stmt->fetch(PDO::FETCH_ASSOC);

// 結果を返す
print json_encode($result); 





