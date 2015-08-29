/* ファイル名:dialogEx.js
 * 概要　　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 設計者　:H.Kaneko
 * 作成日　:2015.0729
 * 作成者　:T.Masuda
 * 場所　　:js/dialogEx.js
 */

/* クラス名:dialogEx
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 引数　　:String url:ダイアログのクラス名
 * 		　:Object argumentObj:インプット用データオブジェクト
 * 		　:Object returnObj:アウトプット用データオブジェクト
 * 設計者　:H.Kaneko
 * 作成日　:2015.0729
 * 作成者　:T.Masuda
 * 変更日　:2015.0731
 * 変更者　:T.Masuda
 * 内容　　:引数「argumentObj」を追加しました
 * 変更日　:2015.0813
 * 変更者　:T.Masuda
 * 内容　　:windowExクラスを継承するようにしました。
 */
function dialogEx(url, argumentObj, returnObj){
	//親クラスのコンストラクタを起動する
	windowEx.call(this, url, argumentObj, returnObj);

	//デフォルト設定のオブジェクト
	//argumentObjを作る際に参考にしてください。
	this.defaultArgumentObj = {
		//ダイアログの設定データオブジェクト
		config:{
			width: STR_AUTO,		//幅を自動調整する
			autoOpen : true,	//作成時の自動オープンを無効にする
			modal : true,		//モーダル表示
			resizable : false,	//ドラッグでのリサイズ可否
			//表示位置の指定。
			position :POSITION_CENTER_TOP,
			closeOnEscape : false,	//escキーを押して閉じるか
			create:function(){	//ダイアログ作成時のイベント
			},
			open://基本的にopen時はdispContentsが実行されるようにする
				function(){
				//dispContentsをコールしてダイアログの内容を作る
				commonFuncs.setCallbackToEventObject(this, 'dialogBuilder', 'dispContents');
			},
			close:function(){
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
			//アウトプット用データのオブジェクト
			data:{
			}
	};
	
	
	/* 関数名:run
	 * 概要　:ダイアログを生成して表示する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.run = function(){
		//ロード失敗時の例外処理を行うため、try-catch節を使う。
		try{
			//変更者:T.Yamamoto 変更指示者:H.Kaneko 日付2015.08.07 内容：loadの引数を
			//メンバのURLからHTMLデータを読み込む
			this.load(this.url);
			//returnObjが空オブジェクトであれば、デフォルト用に用意したオブジェクトをセットする
			//@mod 2015.0808 T.Masuda デフォルトでセットされるオブジェクトについて変更しました。
			//argumentObjも空であればデフォルトのオブジェクトをが入力されるようにしました。
			this.argumentObj = Object.keys(this.argumentObj).length? this.argumentObj: this.defaultArgumentObj;
			this.returnObj = Object.keys(this.returnObj).length? this.returnObj: this.defaultReturnObj;
			var form = $(this.dom)[0];	//ダイアログのDOMを取得する
			form.instance = this;		//ダイアログのDOMにクラスインスタンスへの参照を持たせる。
			this.dom = form;			//クラスインスタンスにDOMへの参照を持たせる
			$(form).dialog(this.argumentObj.config);	//configの設定を使ってダイアログを作成、表示する
		//例外をキャッチしたら
		} catch(e){
			console.log(e.stack);	//投げられたエラーオブジェクトをコンソールログに出す。
		}
	}

	
	/* 関数名:destroy
	 * 概要　:ダイアログの破棄する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.destroy = function(){
		//ダイアログのDOMを取得する。
		var $dialog = this.dom !== void(0)? $(this.dom) : $(this);
		var dialogRole = $dialog.attr(ROLE);	//ダイアログのrole属性を取得する
		//ダイアログが確認ダイアログであれば、その親の要素(=元のダイアログ)を取得して処理対象にする
		$dialog = dialogRole !== void(0) && dialogRole.indexOf(CONFIRM_DIALOG) != -1 
			? $(DOT + CONFIRM_DIALOG + SELECTOR_LAST).parent(): $dialog;
		
		//まずはダイアログを閉じる
		$dialog.dialog(CLOSE);
		//jQuery UIのダイアログを破棄する
		$dialog.dialog(DESTROY);
		$dialog.remove();	//DOMを消す
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
		var domtmp = this.dom;	//現在参照しているDOMが書き変わるため、退避する
		//アラートとして表示するためのdomを取得する
		this.load(DIALOG_DEFAULT_ALERT_CONTENTS);
		//アラートで表示するdomをセレクタとして変数に入れる
		var alertDom = $(this.dom)[0];
		//domをダイアログにセットする
		$(DOT + UI_DIALOG_CONTENT).append(alertDom);
		//メッセージを表示する
		$(DOT + UI_DIALOG_CONTENT + TAG_P).text(alertMessage);
		this.dom = domtmp;	//退避していたDOMの参照を戻す
	}

	/* 関数名:setConfirmContents
	 * 概要　:ダイアログに確認用テキストとはい、いいえのボタンを表示する
	 * 引数　:String:message:ダイアログのメッセージ
	 * 		:Function:func:ダイアログが閉じるときのコールバック関数
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.08.07
	 * 作成者　:T.Yamamoto
	 * 変更日　:2015.08.08
	 * 変更者　:T.Masuda
	 * 内容　　:内容を作りました。
	 */
	this.setConfirmContents = function(message, func) {
		var domtmp = this.dom;	//現在参照しているDOMが書き変わるため、退避する
		//アラートとして表示するためのdomを取得する
		this.load(CONFIRM_DIALOG_PATH);
		//アラートで表示するdomをセレクタとして変数に入れる
		var confirm = $(this.dom)[0];
		//domをダイアログにセットする
		//変更者:T.Yamamoto 変更日:2015．08.29 内容：domが重複してセットされるため、コメント化しました
		// $(CURRENT_DIALOG).filter(SELECTOR_LAST).append(confirm);
		//メッセージを表示する
		$(CURRENT_DIALOG + TAG_P).filter(SELECTOR_LAST).text(message);
		this.dom = domtmp;	//退避していたDOMの参照を戻す
		//ダイアログを閉じる時のクローズバック関数を登録する
		this.setCallbackCloseOnAfterOpen(func);
	}

	/* 関数名:removeDialogCloseBox
	 * 概要　:ダイアログのクローズボックスを消す
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0808
	 * 作成者　:T.Masuda
	 */
	this.removeDialogCloseBox = function(){
		$(UI_DIALOG_CLOSEBOX + SELECTOR_LAST).remove();
	}
	
	/* 関数名:removeDialogButtons
	 * 概要　:ダイアログの設定で表示するボタンを消す
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0808
	 * 作成者　:T.Masuda
	 */
	this.removeDialogButtons = function(){
		$(UI_DIALOG_BUTTON_PANEL, this.dom.parent()).remove();
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
		func instanceof Function? this.argumentObj.config[CLOSE] = func: console.log('setCallBackClose recieved enythingeles function');
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
			$(this.dom).dialog(OPTION, CLOSE, func);
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
		func instanceof Function?  this.argumentObj.config[STR_OPEN] = func: console.log('setCallBackOpen recieved enythingeles function');
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
	
	/* 関数名:setPushedButtonState
	 * 概要　:押されたボタンがどれかを表す値を更新するsetterメソッド
	 * 引数　:String buttonState:ボタンの値。ボタンが押された後にbuttonタグのvalueから値を取得することを想定しているため、文字列となっている
	 * 返却値:なし
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.setPushedButtonState = function(buttonState){
		//引数の値を押されたボタンの状態としてセットする
		this.returnObj.statusObj.buttonState = parseInt(buttonState);
	}
	
	/* 関数名:getPushedButtonState
	 * 概要　:押されたボタンを表す値を返すgetterメソッド
	 * 引数　:String:なし
	 * 返却値:int:ボタンを表す整数を返す
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getPushedButtonState = function() {
		return this.returnObj.statusObj.buttonState;
	}
	
}

//親クラスwindowExが読み込まれていなければ読み込むコード
//親クラスが読み込まれていなければ
if(windowEx === void(0)){
	//共通関数クラスが用意されていれば
	if(commonFuncs !== void(0)){
		//dialogExの親クラスwindowExの定義ファイルを読み込む
		commonFuncs.getScriptFile(WINDOW_EX_PATH);
	} else {
		//共通関数クラスが用意されていない旨を伝える
		console.log(COMMON_FUNCS_NOT_EXIST);
	}
}

//windowExクラスを継承する
dialogEx.prototype = new windowEx();
//サブクラスのコンストラクタを有効にする
dialogEx.prototype.constructor = windowEx;


/* 後で各ダイアログのJSに移す関数をここに置いておく */
function eachDialogTmp(){
	/* 本村さんのメール送信関数 */
	/* 関数名:sendMemberMail
	 * 概要　:会員ページ 会員メール/目安箱メールを送信する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.07xx
	 * 作成者　:A.Honmura
	 * 変更日　:2015.0812
	 * 変更者　:T.Masuda
	 * 内容　	:現行のdialogExクラス用に作り直しました。
	 */
	this.sendMemberMail = function() {
		var dialogClass = $(this)[0].instance;	//クラスインスタンス取得
		
		//はいボタンが押されていたら
		if(dialogClass.getPushedButtonState() == YES){
			var data = dialogClass.getArgumentDataObject();		//argumentObjのdataを取得する
			var resultwork = null;								//
			var sendUrl = SEND_MEMBERMAIL_PHP ;	//通常会員メールの送信先PHP
			var sendObject = {									//送信するデータのオブジェクト
					from:data.user_key				//送信元
					,subject:data.suggest_title		//タイトル
					,content:data.suggest_content	//本文
			};

			//メールのタイプの数値で送信先PHP、送信データの構成を変える
			switch(parseInt(data.suggestionRadio)){
			//通常会員メールの場合
			case MEMBER_MAIL:break;	//初期化内容が該当するのでなにもしない
			//目安箱メールの場合
			case SUGGESTION_MAIL:
					//目安箱メールならタイプの値を追加する
					$.extend(true, sendObject, {type:data.suggest_type});
					//目安箱メール送信用PHPにメールを処理させる
					sendUrl = SEND_SUGGEST_PHP;
					break;
			default:break;
			}
			
			$.ajax({					//PHPにメール用データを渡すAjax通信
					url:sendUrl			//PHPのURLを設定する
					,data:sendObject	//送信データのオブジェクト
					,dataType:"json"	//JSON形式でデータをもらう
					,type:"POST"		//POSTメソッドでHTTP通信する
					,success:function(result){		//通信成功時
						resultwork = result;		//通信結果から情報を取り出す
						//送信完了と共に入力ダイアログを消す
						alert(MESSAGE_SEND_SUCCESS_SIMPLE_NOTICE);	//送信完了のメッセージを出す
						//目安箱メールを送信していたら
						if(parseInt(data.suggestionRadio) == SUGGESTION_MAIL){
							//目安箱テーブルに新たにデータを挿入する
							data.creator.setDBdata(data.creator.json.insertSuggestionBox, data, EMPTY_STRING);
						}
					}
					//通信失敗時
					,error:function(xhr, status, error){
						//throw new (status + ":" + MESSAGE_FAILED_CONNECT);
						//送信完了と共に入力ダイアログを消す
						alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE);	//送信失敗のメッセージを出す
					}
				});
		}
	}

	/* 本村さんのメルマガ送信関数 改修中 */
	/* 関数名:sendMailmagazine
	 * 概要　:メルマガを送信する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.07xx
	 * 作成者　:A.Honmura
	 * 変更日　:2015.0812
	 * 変更者　:T.Masuda
	 * 内容　	:現行のdialogExクラス用に作り直しました。
	 */
	this.sendMailmagazine = function() {
		var dialogClass = $(this)[0].instance;	//クラスインスタンス取得
		
		//はいボタンが押されていたら
		if(dialogClass.getPushedButtonState() == YES){
			var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
			//メルマガをDBに新規登録する
			data.creator.setDBdata(data.creator.json.insertMailMagazine, data, '');
			var resultwork = null;
			alert(MAILMAGA_SEND_SUCCESS);
		}
	}
	
	//目安箱としてメールを送信する
	/* 								sendSuggest(
											sendData['user_key']
											,sendData['suggest_type']
											,sendData['suggest_content']
											,sendData['suggest_title']
	 							);
	 							*/	
									//通常メールとして送信する
	/* 								sendMemberMail(
											sendData['user_key']
											,sendData['suggest_content']
											,sendData['suggest_title']
	 */								
	
		
}



/* ログイン前の準備関数 */
function beforeLoginProcedure(){
	//ログインダイアログのJSONが用意されていなければ
	if(util.checkEmpty(creator)|| !(LOGIN_DIALOG in creator.json)){
		//ログインダイアログのJSONを取得する
		creator.getJsonFile(PATH_LOGIN_DIALOG_JSON);
	}
}
//ここまでログインダイアログの関数

//体験レッスン予約ダイアログ関連関数

//ダイアログのクローズするときにダイアログのdomを消去してリセットする
/* 関数名:disappear
 * 概要　:ダイアログをクローズするときにダイアログのdomを消去してリセットする
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function disappear(){
	//ダイアログをdomごと削除する
	this.instance.destroy();
}



/*
 * 関数名:getDialogTitleDate
 * 概要　:ハイフン形式の日付から日付を日本語表記にしたものを取得する
 * 引数　string: date:日付
 * 返却値:string:returnDate:日本語名にした結果の日付
 * 作成日　:2015.08.08
 * 作成者　:T.Yamamoto
 */
function getDialogTitleDate(date) {
	//日付のハイフンを置換前のスラッシュ区切りにする
	var date = date.replace(/-/g,"/");
	// 日付を日本語表示にする
	var titleDate = changeJapaneseDate(date);
	//日付を返す
	return titleDate;
}

/* 
 * 関数名:cancelDialogOpen
 * 概要  :予約キャンセルダイアログを開く
 * 引数  :object:dialogData:キャンセルダイアログを開くときに必要なデータ
 		string dialogTitleDate:ダイアログタイトルに使う日付
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function cancelDialogOpen(dialogData, dialogTitleDate) {
	//キャンセルダイアログ用のオプションを取得する
	var dialogOption = $.extend(true, {}, dialogExOption[CANCEL_LESSON_DIALOG].argumentObj);
	//ダイアログのタイトルをセットして予約日を分かりやすくする
	dialogOption.config[TITLE] = dialogTitleDate;

	$.extend(true, 							//dataオブジェクトを統合する
			dialogOption.data,				//新たにオブジェクトを作り、そこにまとめる
			dialogData		 				//選択された行データ
	);
	
	console.log(dialogOption);
	
	//予約キャンセルダイアログを作る
	var cancelLessonDialog = new dialogEx(
			DIALOG_CANCEL_LESSON, 
			dialogOption,
			dialogExOption[CANCEL_LESSON_DIALOG].returnObj
		);
	cancelLessonDialog.setCallbackClose(cancelLessonDialogClose);	//閉じるときのイベントを登録
	cancelLessonDialog.run();	//主処理を走らせる。

}

/* 
 * 関数名:cancelDialogOpenFromReservedTable
 * 概要  :予約キャンセルダイアログを予約済み授業から開くための関数
 * 引数  :int memberNumber:会員番号
 * 　　  :createLittleContents creator:createLittleContentsクラスインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.31
 * 変更者:T.Masuda
 * 変更日:2015.08.09
 * 内容	:改修したdialogExクラスに対応しました。
 */
function cancelDialogOpenFromReservedTable (memberNumber, creator) {
	//予約中授業テーブルの行がクリックされたときに予約キャンセルダイアログを出す処理
	$(STR_BODY).on(CLICK, DOT + RESERVED_LESSON_TABLE_RECORD , function(){
		var recordData = getClickTableRecordData(this, RESERVED_LESSON_TABLE, RESERVED_LESSON_TABLE_RECORD , creator);
		//ダイアログに送信するデータ(クリックしたテーブルのデータとユーザの会員番号を合わせた連想配列)を連想配列型変数に入れる
		//@mod 2015.0809 T.Masuda creatorもsendObjectに含む様にしました
		var sendObject = $.extend(true, {userId:memberNumber}, {'creator':creator}, recordData.data);
		//日付を日本語表示にする
		var titleDate = getDialogTitleDate(sendObject.lesson_date);
		//キャンセルダイアログを開く
		cancelDialogOpen(sendObject, titleDate);
	});
}


/* 関数名:memberReservedConfirmDialogClose
 * 概要　:会員top、予約確認ダイアログでokボタンが押された時の処理を登録する
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 * 変更日　:2015.08.09
 * 変更者　:T.Masuda
 * 内容	　:改修したdialogExクラスに対応しました。また、改名しました
 */
function memberReservedConfirmDialogClose() {
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する
	
	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
		
		if(!data.user_work_status) {
			//DBにデータを挿入して予約処理をする
			dialogClass.creator.setDBdata(dialogClass.creator.json.sendReservedData, data, MESSAGE_SUCCESS_RESERVED);
			//以前にキャンセルしたことがある授業の場合
		} else {
			//DBにデータの更新で予約処理をする
			dialogClass.creator.setDBdata(dialogClass.creator.json.updateReservedData, data, MESSAGE_SUCCESS_RESERVED);
		}
		
		//会員トップ画面、予約中授業一覧ダイアログをリロードして最新の状態にする
		data.creator.tableReload(RESERVED_LESSON_TABLE);
		//予約授業一覧ダイアログのテーブルをリロードして最新の状態にする
		data.reservedListCreator.tableReload(LESSON_TABLE);
	}
}

/* 関数名:cancelLessonDialogClose
 * 概要　:会員top、予約キャンセルダイアログでokボタンが押された時の処理を登録する
 * 引数　:sendObject:送信する連想配列データ
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 * 修正日　:2015.08.09
 * 修正者　:T.Masuda
 * 内容	　:改修したdialogExクラスに対応しました。また、改名しました
 */
function cancelLessonDialogClose() {
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する
	
	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
		//ダイアログの呼び出し元で違うcreateLittleContentsクラスインスタンスを利用する
		var creator = data.reservedListCreator !== void(0)?	data.reservedListCreator: data.creator;
		//変更者:T.Yamamoto 変更日:2015.06.27 内容:予約が完了する処理(DBのデータを更新する処理)を関数化しました。
		//変更者:T.Masuda 変更日:2015.08.09 ダイアログのクラスインスタンスに持たせたcreateLittleContentsクラスに関数をコールさせます。
		creator.setDBdata(creator.json.cancelReservedData, data, MESSAGE_SUCCESS_CANCELED);
	
		//予約可能授業一覧テーブルがあればテーブルをリロードする
		if(data.reservedListCreator !== void(0)) {
			//予約可能授業一覧テーブルをリロードする
			data.reservedListCreator.tableReload(LESSON_TABLE);
		}
		
		//予約がキャンセルされたことを分かりやすくするためにテーブルを再読み込みし、予約していた内容が消えることをすぐに確認できるようにする
		data.creator.tableReload(RESERVED_LESSON_TABLE);
	}
}


/* 
 * 関数名:getNewLessonData
 * 概要  :管理者、授業詳細タブで新規に授業を授業を登録するときに必要となる、授業日と時限idを取得する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.23
 */

function getNewLessonData() {
	var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
	//時限データを入れる変数を作り、すでにある時限についてはこの変数を使うようにする
	var timeTableDayKey = "";
	//授業一覧のデータを長さを取得し、ループが終わる回数として使う
	var loopEndCount = data[TABLE_DATA_KEY].length;
	//受け取った授業一覧データから時限データを探す
	for(var loopStartCount = 0; loopStartCount < loopEndCount; loopStartCount++) {
		//新規授業作成データの時限データが見つかった時の処理
		if(newLesoonData[COL_TIMETABLE_KEY] == data[TABLE_DATA_KEY][loopStartCount][COL_TIMETABLE_KEY] && data[TABLE_DATA_KEY][loopStartCount][COL_TIME_TABLE_DAY_KEY] != "") {
			//時限データを取得し、ループを終える
			timeTableDayKey = data[TABLE_DATA_KEY][loopStartCount][COL_TIME_TABLE_DAY_KEY];
			//ループを終わらせる
			break;
		}
	}
	
	//新しく授業データを作るために授業日を連想配列に入れる
	var lessonData = {
		lessonDate:data.lessonDate,				//受講日
		time_table_day_key:timeTableDayKey 	//授業時限キー
	};
	return lessonData;
}

/* 
 * 関数名:newLessonEntry
 * 概要  :管理者、授業詳細タブで新規に授業をDBに登録する処理
 * 引数  :
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.03
 * 修正日　:2015.08.09
 * 修正者　:T.Masuda
 * 内容	　:改修したdialogExクラスに対応しました。また、改名しました
 */
function newLessonEntry() {
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する
	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		//新しく授業データを作るために授業日を連想配列に入れる
		var lessonData = getNewLessonData();
		//授業の設定内容を首都kする
		var lessonConfig = getInputData(CLASS_LESSON_DATA);
		//新しく授業データを挿入するために日付データを含めて送信する
		var sendReplaceQuery = $.extend(true, {}, lessonData, lessonConfig);
		
		//時限データが空のときは新規時限データを作成し、そのあとに授業データを作成する
		if(timeTableDayKey == EMPTY_STRING) {
			//時限データテーブルに対してinsert処理を行い、次の授業データを新しく作るための準備をする
			var errorCount = dialogClass.creator.setDBdata(dialogClass.creator.json.insertTimeTableDay, sendReplaceQuery, EMPTY_STRING);
			//失敗件数が0でないなら授業データを新しく作るクエリを発行する
			if (errorCount != 0) {
				//新規に授業のデータをDBに登録する
				dialogClass.creator.setDBdata(dialogClass.creator.json.newClassWork, sendReplaceQuery, '新規授業の作成に成功しました。');
			}
		//予約する時限があった時にそれを使って新規授業を作成する
		} else {
			//すでにある時限データを使って授業データを作る
			dialogClass.creator.setDBdata(dialogClass.creator.json.normalInsertClasswork, sendReplaceQuery, '新規授業の作成に成功しました。');
		}
	}
}

/* 関数名:onCloseLessonDetailDialog
 * 概要　:管理者画面 授業詳細ダイアログが閉じたときのためのイベント。
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.09
 * 作成者　:T.Masuda
 */
function onCloseLessonDetailDialog(){
	//createLittleContentsクラスインスタンスを取り出すため、argumentObjectのdataを取り出す
	var data = this.instance.getArgumentDataObject();	
	//更新に合わせ、対象のテーブルの値を更新する
	data.creator.tableReload(ADMIN_LESSON_DETAIL_TABLE);
	this.instance.destroy();		//ダイアログを完全に破棄する
}


/* 関数名:dialogDestroy
 * 概要　:ダイアログを破棄する。コールバック関数用の構成。
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.09
 * 作成者　:T.Masuda
 */
function dialogDestroy() {
	//ダイアログをDOMごと破棄する
	$(this)[0].instance.destroy();
}


// 以下、本村さん作成部分
var SimpleConfirmDialog = function(yesFunc, message) {
	this.message = message;									// 確認メッセージ
	this.targetHtml = "dialog/simpleConfirmDialog.html";	// ダイアログ本体html
	this.noFunc = null;										// いいえの時のメソッド
	this.closeFunc = null;									// 閉じるためのメソッド
	this.yesCaption = "はい";								// はいボタンのキャプション
	this.noCaption = "いいえ";								// いいえボタンのキャプション

	var rapDestroy = function(){
		if(this.dialogCreator) {
			return this.dialogCreator.destroy();
		}
		return null;
	};
	
	this.yesFunc = function(){
		yesFunc();
		return rapDestroy();
	};
	
	// ダイアログ表示
	this._showDialog = function() {
		
		// 閉じる機能もいいえ機能もデフォルトは閉じるだけ
		if(!this.noFunc) {
			this.noFunc = function(){return rapDestroy();};
		}
		
		// パラメター設定
		var params = {
				yesFunc:this.yesFunc
				,noFunc:this.noFunc
				,yesCaption:this.yesCaption
				,noCaption:this.noCaption
				,message:this.message
		};
		
		dialogCreator = new dialogEx(this.targetHtml, params, dialogExOption[CONFIRM_DIALOG]);
		// 閉じる機能もいいえ機能もデフォルトは閉じるだけ
		if(!this.closeFunc) {
			this.closeFunc = function(){return rapDestroy();};
		}
		dialogCreator.setCallbackClose(this.closeFunc);
		
		// 表示実行
		dialogCreator.run();
	};
	
	this.setNoFunc = function(func) {
		this.noFunc = func;
	};
	
	this.setCloseFunc = function(func) {
		this.closeFunc = func;
	};
	
	this.setYesCaption = function(caption) {
		this.yesCaption = caption;
	};
	
	this.setNoCaption = function(caption) {
		this.noCaption = caption;
	};
};



/*
 * 関数名:submitArticle
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :記事を投稿する
 * 作成日 :2015.08.12
 * 作成者 :T.M
 */
function submitArticle(){
	//ダイアログのクラスインスタンスを取得する。コールバックか否かで取得方法が変わる。
	var dialogClass = this.instance !== void(0)? this.instance : this;

	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var dialogClass = $(this)[0].instance;				//ダイアログのクラスインスタンスを取得する
		var data = dialogClass.getArgumentDataObject();		//インプット用データを取得する
		postForm(data.form);								//フォームを送信する
		//alert(SEND_TO_SERVER_MESSAGE);					//メッセージを出す
	}
}

