/* ファイル名:myBlogConfirmDialog.js
 * 概要　　　:テスト用ダイアログ
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/myBlogConfirmDialog.js
 */

/* クラス名:myBlogConfirmDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/myBlogConfirmDialog.js
 */
function myBlogConfirmDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	//ボタンが押されたときのステータス。0:未選択またはいいえ、1:はいボタンがクリックされたときのステータス
	this.dialogStatus = CONFIRM_DIALOG_DEFAULT_STATUS;
	//前のダイアログからブログ記事の編集か新規作成かのステータスを取得するための変数を作る
	this.updateStatus = INSERT_MYBLOG_STATUS;
	//はい、いいえボタンの配列
	this.yes_no = [
					{	//はいボタン
						text:TEXT_YES,
						//クリック時のコールバック関数
						click:function(){
							//ダイアログのステータスをはいボタンが押されたステータスに変更する
							setDialogStatus(CONFIRM_DAILOG_YES_BUTTON_STATUS);
							//ダイアログを閉じる
							$(this).dialog(CLOSE);
						}
					},
					//いいえボタン
					{	//ボタンテキスト
						text:TEXT_NO,
						//クリック時のコールバック関数
						click:function(){	//クリックのコールバック関数
							//ダイアログを閉じる
							$(this).dialog(CLOSE);
						}
					}
	           ];

	/* 関数名:setDialogStatus
	 * 概要　:ダイアログのステータスをセットする。主にボタンがクリックされたときに変更する
	 * 引数　:setValue:ボタンがクリックされた時にsetするステータスの値
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	 this.setDialogStatus = function(setValue) {
	 	//ステータスに値をセットする
	 	this.dialogStatus = setValue;
	 }

	/* 関数名:setUpdateStatus
	 * 概要　:ダイアログの記事更新のステータスをセットする。主にボタンがクリックされたときに変更する
	 * 引数　:setValue:ボタンがクリックされた時にsetするステータスの値
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	 this.setUpdateStatus = function(setValue) {
	 	//記事更新ステータスをセットする
	 	this.updateStatus = setValue;
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
			this.create_tag.getJsonFile(MYBLOG_CONFIRM_DIALOG_JSON);
			//記事更新ステータスを取得する
		//例外時処理
		}catch(e){
			//もう一度例外を投げ、dispContents内で処理する
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
		this.setDialogTitle(MYBLOG_CONFIRM_DIALOG_TITLE);
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
		this.dialogClass.setConfirmContents(MYBLOG_CONFIRM_TEXT, dialogCloseFunc);
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
	
	/* 関数名:getUpdateStatus
	 * 概要　:ブログ記事更新のステータスを取得する
	 * 引数　:なし
	 * 返却値:string:更新ステータス
	 * 作成日　:2015.0816
	 * 作成者　:T.Yamamoto
	 */
	this.getUpdateStatus = function() {
		//ダイアログに対して送信されたデータを取得する
		var data = this.dialogClass.getArgumentDataObject();
		//ダイアログの記事更新ステータスを返す
		return data[BLOG_UPDATE_STATUS];
	}

	/* 関数名:updateJson
	 * 概要　:ブログ記事更新の更新データをjsonに入れる
	 * 引数　:なし
	 * 返却値:クエリを発行するためのクエリ
	 * 作成日　:2015.0815
	 * 作成者　:T.Yamamoto
	 */
	this.updateJson = function() {
		//ブログ記事の入力されたデータを取得する
		var data = this.dialogClass.getArgumentDataObject();
		//ブログ更新ステータスを取得する
		var blogUpdateStatus = this.getUpdateStatus();
		//記事新規作成のクエリを作る
		var sendQuery = $.extend(true, {}, create_tag.json[INSERT_MYBLOG_QUERY_KEY], data);
		//ブログ記事が編集の場合、クエリを変える
		if(blogUpdateStatus == UPFDATE_MYBLOG_STATUS) {
			//更新クエリを入れる
			sendQuery = $.extend(true, {}, create_tag.json[UPDATE_MYBLOG_QUERY_KEY], data);
		}
		//クエリを返す
		return sendQuery;
	}

	/* 関数名:myBlogUpdate
	 * 概要　:ブログ記事を更新する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	 this.myBlogUpdate = function() {
	 	//ブログ記事を更新するためのデータを取得する
	 	var sendQueryData = this.updateJson();
	 	//クエリを発行してブログを更新する
	 	this.sendQuery(URL_SAVE_JSON_DATA_PHP, sendQueryData);
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
	 	if(this.dialogStatus == CONFIRM_DAILOG_YES_BUTTON_STATUS) {
	 		//記事の更新を行う
	 		this.myBlogUpdate();
	 	}
	 }

}

//継承の記述
myBlogConfirmDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
myBlogConfirmDialog.prototype.constructor = baseDialog;
