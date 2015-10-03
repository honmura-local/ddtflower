/** ファイル名:baseWindow.js
 * 概要　　　:コンテンツを描画するウィンドウの基底クラスのファイル
 * 設計者　:H.Kaneko
 * 作成日　:2015.10.03
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/baseWindow.js
 */

/** クラス名:baseWindow
 * 概要　:コンテンツを描画するウィンドウの基底クラス
 * 引数	:なし
 * 設計者:H.Kaneko
 * 作成日:2015.10.03
 * 作成者:T.Masuda
 */
function baseWindow(url, argumentObj, returnObj){

	//ウィンドウのHTMLのURLを格納するメンバ
	this.url = url;
	//ウィンドウ自身のDOMを格納するメンバ
	this.dom = EMPTY_STRING;
	//インプット用データのオブジェクト
	this.argumentObj = argumentObj !== void(0)? argumentObj : {};
	//アウトプット用データのオブジェクト
	this.returnObj = returnObj !== void(0)? returnObj : {};
	
	//デフォルト設定のオブジェクト
	this.defaultArgumentObj = {
		//設定データオブジェクト。dialogEx(当クラスを継承したクラス)では必ず利用する
		config:{
		},
		//インプット用データオブジェクト
		data:{
		}
	};
	
	//デフォルト設定のreturnObj
	this.defaultReturnObj = {
			//状態設定のオブジェクト
			statusObj:{
			},
			//インプット用データオブジェクト
			data:{
			}
	};

	/* 関数名:load
	 * 概要　:URLのHTMLファイルを取得してメンバに保存する。
	 * 引数　:String: domUrl:取得するHTMLファイルのパス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.load = function(domUrl){
	}
	
	/* 関数名:run
	 * 概要　:ウィンドウを生成して表示する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.run = function(){
	}	
	
	/* 関数名:setUrl
	 * 概要　:URLをセットする
	 * 引数　:String url:URL文字列
	 * 返却値:なし
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.setUrl = function(url){
		this.url = url;	//URLをセットする
	}

	/* 関数名:destroy
	 * 概要　:ウィンドウをを破棄する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.destroy = function(){
	}

	/* 関数名:setAlertContents
	 * 概要　:警告コンテンツをセットする
	 * 引数　:String:alertMessage:警告メッセージ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.setAlertContents = function(alertMessage) {
	}

	/* 関数名:setConfirmContents
	 * 概要　:確認コンテンツをセットする
	 * 引数　:String:message:確認のメッセージ
	 * 		:Function:func:コールバック関数
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.setConfirmContents = function(message, func) {
	}

	/* 関数名:getArgumentObject
	 * 概要　:argumentObjを返す
	 * 引数　:なし
	 * 返却値:Object:ダイアログのインプットデータオブジェクト
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.getArgumentObject = function() {
		return this.argumentObj;	//argumentオブジェクトを返す
	}
	
	/* 関数名:getConfigObject
	 * 概要　:configオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:ダイアログの設定用オブジェクト
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.getConfigObject = function() {
		return this.argumentObj.config;	//configオブジェクトを返す
	}
	
	/* 関数名:getArgumentDataObject
	 * 概要　:インプット用データオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:インプット用データオブジェクト
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.getArgumentDataObject = function() {
		return this.argumentObj.data;	//dataオブジェクトを返す
	}
	
	/* 関数名:getReturnObject
	 * 概要　:アウトプット用オブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用オブジェクト
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.getReturnObject = function() {
		return this.returnObj;		//アウトプット用オブジェクトを返す
	}

	/* 関数名:getReturnDataObject
	 * 概要　:アウトプット用データオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用データオブジェクト
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.getReturnDataObject = function() {
		return this.returnObj.data;		//アウトプット用データのオブジェクトを返す
	}
	
	/* 関数名:getReturnStatusObject
	 * 概要　:アウトプット用ステートオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用ステートオブジェクトを返す
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.getReturnStatusObject = function() {
		return this.returnObj.statusObj;	//アウトプット用ステートのオブジェクトを返す
	}
	
	/* 関数名:setReturnStatusObject
	 * 概要　:アウトプット用ステートオブジェクトの状態オブジェクトをセットする
	 * 引数　:Object statusObj
	 * 返却値:なし
	 * 作成日　:2015.1003
	 * 作成者　:T.Masuda
	 */
	this.setReturnStatusObject = function(statusObj) {
		//statusObjをセットする
		this.returnObj.statusObj = statusObj;
	}
	
}