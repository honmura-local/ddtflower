/** ファイル名:windowEx.js
 * 概要　　　:ダイアログ内コンテンツ作成、要素操作のためのクラスのための基底クラスの定義ファイル
 * 設計者　:H.Kaneko
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/windowEx.js
 */

/** クラス名:windowEx
 * 概要　:ウィンドウ(ページ)を示すクラス
 * 引数	:なし
 * 設計者:H.Kaneko
 * 作成日:2015.0813
 * 作成者:T.Masuda
 */
function windowEx(url, argumentObj){
	//ウィンドウのHTMLのURLを格納するメンバ
	this.url = url;
	//ウィンドウのDOMを格納するメンバ
	this.dom = '';
	//ウィンドウ内のコンテンツ作成のためのパラメータをまとめたオブジェクト
	this.argumentObj = argumentObj !== void(0)? argumentObj : {};
	//設定用オブジェクトを格納するメンバ
	this.returnObj = returnObj !== void(0)? returnObj : {};
	
	//デフォルト設定のオブジェクト
	//argumentObjを作る際に参考にしてください。
	this.defaultArgumentObj = {
		//ダイアログの設定データオブジェクト
		config:{
			width: 'auto',		//幅を自動調整する
			autoOpen : true,	//作成時の自動オープンを無効にする
			modal : true,		//モーダル表示
			resizable : false,	//ドラッグでのリサイズ可否
			//表示位置の指定。
			position :{my:'center top',at:'center top', of:window},
			closeOnEscape : false,	//escキーを押して閉じるか
			create:function(){	//ダイアログ作成時のイベント
				
			},
			open:function(){	//ダイアログが開くときのイベント
				
			},
			close:function(){	//ダイアログが閉じられるときのイベント
				
			}
		},
		//インプット用データオブジェクト
		data:{
		}
	};
	
	//デフォルトのアウトプット用オブジェクト
	//returnObjを作る際に参考にしてください。
	this.defaultReturnObj = {
		//ダイアログのステータスオブジェクト
		statusObj:{
			buttonState:UNSELECTED	//押されたボタンの値。1→未選択 0→いいえ 1→はい 
		},
		//関数オブジェクト
		funcObj:{
			YES_NO:[	//「はい」ボタン、「いいえ」ボタン用コールバック関数
			        function(){	//「いいえ」ボタン
			        	//いいえ」ボタンの処理内容
			        },
			        function(){	//「はい」ボタン
			        	//「はい」ボタンの処理内容
			        }
			]
		},
			//アウトプット用データのオブジェクト
		data:{
		}
	};

	/* 関数名:load
	 * 概要　:URLのHTMLファイルを取得してメンバに保存する。
	 * 引数　:String: domUrl:取得するHTMLファイルのパス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.load = function(domUrl){
		//クラスインスタンスへの参照を変数に格納しておく。
		var tmpThis = this;
		
		//Ajax通信でURLからHTMLを取得する。
		$.ajax({
			url:domUrl,				//URLを設定する
			dataType:'HTML',		//HTMLデータを取得する
			async: false,			//同期通信を行う
			cache: true,			//通信結果をキャッシュする
			success:function(html){	//通信成功時
				//取得したhtmlデータをメンバに格納する。
				tmpThis.dom = html;
			},
			error:function(xhr, status, e){	//通信失敗時
				throw e;			//例外を投げる。エラーオブジェクトを渡す。
			}
		});
		
	}

	/* 関数名:run
	 * 概要　:ウィンドウを生成して表示する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.run = function(){
	}

	/* 関数名:setCallbackClose
	 * 概要　:ダイアログのcloseイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 * 変更日　:2015.0808
	 * 変更者　:T.Masuda
	 * 内容　　:セット先が変わりました。
	 */
	this.setCallbackClose = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function? this.argumentObj.config['close'] = func: console.log('setCallBackClose recieved enythingeles function');
	}

	/* 関数名:setCallbackCloseOnAfterOpen
	 * 概要　:ダイアログが開いた後にcloseイベントのコールバックを設定する
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 作成者　:T.Masuda
	 * 変更日　:2015.0813
	 * 変更者　:T.Masuda
	 * 内容　　:セット先が変わりました。
	 */
	this.setCallbackCloseOnAfterOpen = function(func){
		//引数が関数であれば
		if(func instanceof Function){
			//optionでcloseコールバック関数をセットする
			$(this.dom).dialog('option', 'close', func);
		//関数以外であれば
		} else {
			console.log("not a function");
		}
	}
	
	/* 関数名:setCallbackOpen
	 * 概要　:ダイアログのopenイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.setCallbackOpen = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function?  this.argumentObj.config['open'] = func: console.log('setCallBackOpen recieved enythingeles function');
	}

	/* 関数名:setCallbackCreate
	 * 概要　:ダイアログのcreateイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 * 変更日　:2015.0808
	 * 変更者　:T.Masuda
	 * 内容　　:セット先が変わりました。
	 */
	this.setCallbackCreate = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function?  this.argumentObj.config['create'] = func: console.log('setCallBackCreate recieved enythingeles function');
	}
	
	/* 関数名:destroy
	 * 概要　:ウィンドウをを破棄する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.destroy = function(){
	}

	/* 関数名:setAlertContents
	 * 概要　:ダイアログにアラートと閉じるボタンを表示する
	 * 引数　:String:alertMessage: アラートで表示するメッセージ文字列
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.08.07
	 * 作成者　:T.Yamamoto
	 */
	this.setAlertContents = function(alertMessage) {
	}

	/* 関数名:setConfirmContents
	 * 概要　:ダイアログに確認用テキストとはい、いいえのボタンを表示する
	 * 引数　:String:message:ダイアログのメッセージ
	 * 		:Function:func:ダイアログが閉じるときのコールバック関数
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.08.07
	 * 作成者　:T.Yamamoto
	 * 変更日　:2015.08.13
	 * 変更者　:T.Masudd
	 * 内容　　:内容を作りました。
	 */
	this.setConfirmContents = function(message, func) {
	}

	/* 関数名:getArgumentObject
	 * 概要　:argumentObjを返す
	 * 引数　:なし
	 * 返却値:Object:ダイアログのインプットデータオブジェクト
	 * 作成日　:015.08.09
	 * 作成者　:T.Masuda
	 */
	this.getArgumentObject = function() {
		return this.argumentObj;	//argumentオブジェクトを返す
	}
	
	/* 関数名:getConfigObject
	 * 概要　:configオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:ダイアログの設定用オブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getConfigObject = function() {
		return this.argumentObj.config;	//configオブジェクトを返す
	}
	
	/* 関数名:getArgumentDataObject
	 * 概要　:インプット用データオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:インプット用データオブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getArgumentDataObject = function() {
		return this.argumentObj.data;	//dataオブジェクトを返す
	}

	/* 関数名:getReturnObject
	 * 概要　:アウトプット用オブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用オブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getReturnObject = function() {
		return this.returnObj;		//アウトプット用オブジェクトを返す
	}

	/* 関数名:getReturnDataObject
	 * 概要　:アウトプット用データオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用データオブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getReturnDataObject = function() {
		return this.returnObj.data;		//アウトプット用データのオブジェクトを返す
	}
	
	/* 関数名:getReturnStatusObject
	 * 概要　:アウトプット用ステートオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用ステートオブジェクトを返す
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getReturnStatusObject = function() {
		return this.returnObj.statusObj;	//アウトプット用ステートのオブジェクトを返す
	}
	
	/* 関数名:createDialogEx
	 * 概要　:渡されたURLから新たなダイアログを開く
	 * 引数　:String url:ダイアログのURL
	 * 		:Object argumentObj:ダイアログのインプットデータ、設定データのオブジェクト
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.createDialogEx = function(url, argumentObj){
		var newDialog = new dialogEx(url, argumentObj);		//ダイアログクラスのインスタンスを作成する
		//openイベントのコールバック関数をセットする
		newDialog.setCallbackOpen({open:this.dialogBuilder.openDialog});	
		newDialog.run();									//ダイアログを開く
	}
}