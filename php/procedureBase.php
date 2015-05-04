<?php

/*
 * ファイル名:procedureBase.php
 * 概要	:procedure〜クラスの親クラスのファイル。
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.0728
 * パス	:/php/procedureBase.php
 */

//procedureBaseの親クラスのファイルを読み込む
require_once ('account.php');

/*
 * クラス名:procedureBase
 * 概要  :procedure〜クラスの親クラス
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.0728
 */
class procedureBase extends account{

	public $isLogin = false;	//ログイン状態の値を格納するメンバ
	
	/*
	 * 関数名：init
	 * 概要  :クラスの初期化関数。accountクラスの初期化関数とログインチェック関数をコールする。
	 * 引数  :なし
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function init(){
		//親クラスのinit関数をコールする。
		parent::init();
		//ログインチェックを行う。結果はメンバに保存する
		$this->isLogin = $this->loginCheck();
	}

	/*
	 * 関数名：job
	 * 概要  :クラス特有の処理を行う関数。JSON文字列から連想配列を取得してメンバに格納する。
	 * 引数  :String $jsonString:JSON文字列
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function job($jsonString){
		//JSON文字列から連想配列を取得し、自身のメンバに保存する。
		parent::getJSONMap($jsonString);
		//ログイン状態かつ、ユーザIDがJSONにあれば
		if(isset($_SESSION['userId']) && isset($this->json['user_key'])){
			//セッションからユーザIDを取り出しJSONに追加する
			$this->json['user_key']['value'] = $_SESSION['userId'];
		}
	}
	
	/*
	 * 関数名：run
	 * 概要  :クラスのinit、job関数をまとめて実行する。
	 * 引数  :なし
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function run(){
		//初期化処理とクラス独自の処理をまとめて実行する。
		$this->init();	//初期化関数
		$this->job();	//クラス特有の処理を行う
	}
}