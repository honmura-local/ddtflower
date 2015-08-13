<?php
require_once "ModelMail.php";

$from = $_POST['from'];
$subject = $_POST['subject'];
$content = $_POST['content'];

$ADMIN_ID = '1';

try{
	//@mod 2015 0812 T.Masuda DBへの接続と切断の記述がなかったため、追記しました
	//ModelMysql::connect();	//DBへの接続を開始する
	//@mod 2015 0812 T.Masuda valueからではなく直接引数に値を渡す様にしました
	$sendResult = ModelMail::send_mail(array($ADMIN_ID), $subject, $content, $from);
	$jsonResult = json_encode(array(
			'sendCount'			=> $sendResult[0],
			'failCount'			=> $sendResult[1],
			'noAddressCount'	=> $sendResult[2],
	));
		//ModelMysql::disconnect();	//DBへの接続を閉じる
} catch(SendFailException $e) {
		//ModelMysql::disconnect();	//DBへの接続を閉じる
		// ajax的に500返して異常を伝える。
		error_log(e.getMessage());
		header('HTTP/1.1 500 Internal Server Error');
		echo e.getMessage();
		exit;
	}
	
header('Content-type: application/json');
echo $jsonResult;
exit;