<?php

// ファイルが送信されていない時の処理
if (!isset($_FILES['imageFile']['tmp_name'])) {
	// 登録画面までページ遷移する
	//header("Location: imageUp.html");
	echo 'ファイルがありません';
	exit;					// プログラムを終了する
}
// アップロードされたファイルの情報を変数に入れる
$file_temp = $_FILES['imageFile']['tmp_name'];	// アップロードされたファイルが一時的に保存されたファイルパス
$file_name = mb_convert_encoding($_FILES['imageFile']['name'], "SJIS", "AUTO");		// アップロードファイル名
$file_type = $_FILES['imageFile']['type'];		// MIMEタイプ
$file_size = $_FILES['imageFile']['size'];		// ファイルのサイズ(大きさ)


// アップロードされたのが画像でなかったら画像をアップロードしない
if ($file_type == 'image/jpeg' || $file_type == 'image/png' ||$file_type == 'image/gif') {

	// ファイルをアップロードするディレクトリ
	//$temp_directory = "c:/xampp/htdocs/webkaihatsu/webAppTextPattern2/"; 

	// 本番環境でアップロードする場合
	//$temp_directory = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/flowerImage/'; 

	// ローカルでアップロードする場合(保存先のファイルを設定する)
	$temp_directory = "c:/xampp/htdocs/ddtflowers/uploadImage/flowerImage/"; 

	// ファイルがアップロードできているかを調べる
	if (is_uploaded_file($file_temp)) {
		// ファイルがアップロードできるかを調べ、可能ならアップロードする
		if (move_uploaded_file($file_temp, $temp_directory . $file_name)) {
			echo 'アップロードに成功しました';
	
		} else {
			// アップロードできなかったときのエラー処理を表示する
			echo "ファイルをアップロードできませんでした<br>";

		}
	}
} else {
	echo '画像でないものが送信されました。<input type="button" onClick="history.back()" value="戻る">';
	exit;
}
