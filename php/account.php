<?php

/*
 * ファイル名:account.php
 * 概要	:ログインのための関数を持ったクラスのファイル。
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.0728
 * パス	:/php/login.php
 */


//loginの親クラスのファイルを読み込む
require_once ('JSONDBManager.php');

/*
 * クラス名:account
 * 概要  :ログインのための関数を持ったクラス。JSONDBManagerクラスを継承する。
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.0728
 */
class account extends JSONDBManager{
	
	/*
	 * 関数名：init
	 * 概要  :初期化処理を行う。初期化としてセッションの開始とDBへの接続を行う。
	 * 引数  :なし
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function init(){
		
		//セッションを開始する
		session_start();
		//DBへの接続を開始する。
		$this->connect();
	}

	/*
	 * 関数名：login
	 * 概要  :ログイン処理を行う。
	 * 引数  :String $jsonString: JSON文字列。ログイン情報が入っている必要がある。
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function login($jsonString){

		//クライアントから送信されたJSONのキーとJSON文字列を取得する。
		$key = $_POST['key'];
		$this->getJSONMap($jsonString);
		
		//SQLによる例外の対処のためtryブロックで囲む
		try {
			// jsonを出力する
			$this->createJSON($this->json, $key, null);
			//SQL例外のcatchブロック
		} catch (PDOException $e) {
			// エラーメッセージを表示する
			echo $e->getMessage();
		}
		
		// 連想配列をjsonに変換して変数に入れる
		$jsonOut = json_encode($this->json, JSON_UNESCAPED_UNICODE);
				
		//セッションIDを更新する。
		session_regenerate_id();
		
		//会員番号(ユーザID)をセッションに入れる
		$_SESSION['userId'] = $this->json['id']['text'];
		
		// 作成したJSON文字列を出力する。
		print($jsonOut);
	}
	
	/*
	 * 関数名：logout
	 * 概要  :ログアウト処理を行う。
	 * 引数  :なし
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function logout(){
		//セッション変数をクリアする。
		$_SESSION = array();
		
		//セッションクッキーが存在するなら
		if (isset($_COOKIE[session_name()])) {
			//クッキーの有効期限を過去に設定して破棄する
    		setcookie(session_name(), '', time()-42000, '/');

		}
		
		//セッションそのものを破棄する
		session_destroy();
	}
	
	/*
	 * 関数名：loginCheck
	 * 概要  :ログインチェックを行う。
	 * 引数  :なし
	 * 戻り値:boolean:ログインしているか否かの真理値を返す
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function loginCheck(){
		$retBoo = false;	//返却値を格納する変数を宣言する
		//クラスにより例外でログインチェック時の失敗の処理を分岐させるため、try catch文を使う
		try{
			//セッション変数のユーザIDを参照し、値が存在するかどうかをチェックする。
			if(isset($_SESSION['userId'])){
				$retBoo = true;	//返却値の変数にtrueを格納する
			//セッションがない状態であれば
			} else {
				//ログインチェックエラーの例外を投げる
				throw new LoginCheckException();
			}
		//例外をキャッチした場合は以下のブロックに入る
		} catch (LoginCheckException $e){
			//未定義
		}

		//真理値を返す
		return $retBoo;
	}
}