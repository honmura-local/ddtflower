<?php
// データベースに接続するための値を定数として宣言する

// JSONDBManagerクラスファイルを読み込む
require_once("JSONDBManager.php");

//クライアントから送信されたJSON文字列を取得する。
$json = $_POST["json"];

//JSONDBManagerのインスタンスを生成する
$jdbm = new JSONDBManager();

//SQLによる例外の対処のためtryブロックで囲む
try {
	// データベースに接続する
	$jdbm->dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
	// データベースをUTF8で設定する
	$jdbm->dbh->query('SET NAMES utf8');
	//クライアントから送信されたJSON文字列を連想配列に変換する
	$jdbm->getJSONMap($json);
	//パスワードがkeyにあればハッシュ化する
	if (array_key_exists('password', $jdbm->json)) {
		//ハッシュ化する
		$jdbm->json['password']['value'] = sha1($jdbm->json['password']['value']);
	}
	//INSERT、またはUPDATE命令を実行する
	$jdbm->executeQuery($jdbm->json, DB_SETQUERY);
	//SQL例外のcatchブロック
} catch (PDOException $e) {
	// エラーメッセージを表示する
	error_log($e->getMessage());
	// プログラムをそこで止める
    echo 'データの更新に失敗しました';
	exit;
}
//最後に行う処理
$jdbm->dbh = null;

//クライアントへ返すメッセージを作成する。
$returnMessage = '{"message":"' . $jdbm->processedRecords . '"}';

// 作成したJson文字列を出力する
print($returnMessage);

