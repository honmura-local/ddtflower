/* ファイル名:memberSuggestionConfirmDialog.js
 * 概要　　　:テスト用ダイアログ
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/memberSuggestionConfirmDialog.js
 */

/* クラス名:memberSuggestionConfirmDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/memberSuggestionConfirmDialog.js
 */
function memberSuggestionConfirmDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	//はい、いいえボタンの配列
	this.yes_no = [
					{	//はいボタン
						text:TEXT_YES,
						//クリック時のコールバック関数
						click:function(){
							//ダイアログのステータスをはいボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(YES);
						}
					},
					//いいえボタン
					{	//ボタンテキスト
						text:TEXT_NO,
						//クリック時のコールバック関数
						click:function(){	//クリックのコールバック関数
							//ダイアログのステータスをいいえボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(NO);
						}
					}
	           ];

	/* 関数名:setUpdateStatus
	 * 概要　:ダイアログの記事更新のステータスをセットする。主にボタンがクリックされたときに変更する
	 * 引数　:setValue:ボタンがクリックされた時にsetするステータスの値
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	 this.setSuggestionStatus = function(setValue) {
	 	//記事更新ステータスをセットする
	 	this.suggestionStatus = setValue;
	 }

	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContents = function(){
		try{
			//画面を表示する準備をする
			this.constructionContent();
		//レコードが取得できていなければ
		}catch (e){
			//ダイアログをアラートのダイアログに変える
			this.showAlertNoReserve();
		}
		
		//ダイアログのタイトルをセットする
		this.dispContentsHeader();
		this.dispContentsMain();		//ダイアログ中部
		this.dispContentsFooter();	//ダイアログ下部
	}

	/* 関数名:constructionContent
	 * 概要　:JSONやHTMLをcreateLittleContentsクラスインスタンスにロードする。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.constructionContent = function(){
		//主に分岐処理を行うためにtry catchブロックを用意する
		try{
			//ブログ確認ダイアログのjsonデータを取得する
			this.create_tag.getJsonFile(SUGGESTION_CONFIRM_DIALOG_JSON);
			//記事更新ステータスを取得する
		//例外時処理
		}catch(e){
			//例外を投げ、dispContents内で処理する
			throw new cannotGetAnyRecordException();
		}
	};

	/* 関数名:dispContentsHeader
	 * 概要　:画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsHeader = function(dialogClass){
		//ダイアログのタイトルを変更する
		this.setDialogTitle(SUGGESTION_CONFIRM_DIALOG_TITLE);
	}

	/* 関数名:dispContentsMain
	 * 概要　:画面パーツ設定用関数のメイン部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsMain = function(){
		//確認ダイアログを作成する。送信タイプ別にメッセージ、コールバック関数を設定する
		this.dialogClass.setConfirmContents(SUGGESTION_CONFIRM_TEXT, dialogCloseFunc);
	}

	/* 関数名:dispContentsFooter
	 * 概要　:画面パーツ設定用関数のフッター部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsFooter = function(dialogClass){
		//ダイアログにボタンをセットする
		this.setDialogButtons(this.yes_no);
		//ダイアログの位置を修正する
		this.setDialogPosition({my:DIALOG_POSITION,at:DIALOG_POSITION, of:window});
	}
	
	/* 関数名:setDialogEvents
	 * 概要　:ダイアログのイベントを設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogEvents = function(){
		//ダイアログを閉じるときは破棄するように設定する
		dialogClass.setCallbackCloseOnAfterOpen(dialogClass.destroy);
	}
	
	/* 関数名:buttonCallBack
	 * 概要　:ダイアログのイエスノーボタンがクリックされた時に走るコールバック関数
	 * 引数　:string:buttonType:クリックされたボタンの種類
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	this.buttonCallBack = function(buttonType) {
		//ボタンがクリックされたステータスを登録する
		this.setPushedButtonState(buttonType);
		//ダイアログを閉じる
		$(this).dialog(CLOSE);
	}

	/* 関数名:updateJson
	 * 概要　:ブログ記事更新の更新データをjsonに入れる
	 * 引数　:なし
	 * 返却値:クエリを発行するためのクエリ
	 * 作成日　:2015.0815
	 * 作成者　:T.Yamamoto
	 */
	this.updateJson = function() {
		//入力されたメッセージのデータを取得する
		var data = this.dialogClass.getArgumentDataObject();
		//目安箱か普通のメールかを識別するためにステータスを取得する
		var blogUpdateStatus = data[SUGGESTION_STATUS];
		//入力された内容をクエリに入れる
		var sendQueryObject = $.extend(true, {}, data);
		//目安箱として送信する場合、クエリも送信データに含める
		if(blogUpdateStatus == SUGGESTION_STATUS_OWNER) {
			//更新クエリを入れる
			sendQueryObject = $.extend(true, {}, this[VAR_CREATE_TAG].json[SUGGESTION_QUERY_KEY], data);
		}
		//クエリを返す
		return sendQueryObject;
	}

	/* 関数名:myBlogUpdate
	 * 概要　:ブログ記事を更新する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	 this.sendSuggestion = function() {
	 	//ブログ記事を更新するためのデータを取得する
	 	var sendQueryObject = this.updateJson();
	 	//メール送信処理を行う
	 	var mailSendObject = new eachDialogTmp()
	 	//目安箱としてメッセージを送信する
	 	if(sendQueryObject[DB_SETQUERY]) {
	 		//クエリを発行して目安箱のDBを新しく作る
	 		this.sendQuery(URL_SAVE_JSON_DATA_PHP, sendQueryObject);
	 		//メール送信処理を行う
	 		// mailSendObject.mailsend();
	 		//そこで処理を行う
	 		return;
	 	}
 		//メール送信処理を行う
 		// mailSendObject.mailsend();
	 }

	/* 関数名:dialogCloseFunc
	 * 概要　:ブログ記事更新確認ダイアログが閉じるときに記事を更新するかを決める
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	 this.dialogCloseFunc = function() {
	 	//ボタンステータスを見て更新のステータスなら更新を行う
	 	if(this.getPushedButtonState() == YES) {
	 		//記事の更新を行う
	 		this.sendSuggestion();
	 	}
	 }

}

//継承の記述
memberSuggestionConfirmDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
memberSuggestionConfirmDialog.prototype.constructor = baseDialog;
