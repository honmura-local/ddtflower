/* ファイル名:myBlogConfirmDialog.js
 * 概要　　　:マイブログ更新確認ダイアログ
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
	//はい、いいえボタンの配列
	this.yes_no = [
					{	//はいボタン
						text:TEXT_YES,
						//クリック時のコールバック関数
						click:
							//ダイアログのステータスをはいボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(YES)
					},
					//いいえボタン
					{	//ボタンテキスト
						text:TEXT_NO,
						//クリック時のコールバック関数
						click:
							//ダイアログのステータスをいいえボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(NO);
					}
	           ];

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
			this.create_tag.getJsonFile(PATH_MYBLOG_CONFIRM_DIALOG_JSON);
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
		this.setDialogTitle(PATH_MYBLOG_CONFIRM_DIALOG_TITLE);
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
	this.dispContentsFooter = function(){
		//ダイアログにボタンをセットする
		this.setDialogButtons(this.yes_no);
		//ダイアログの位置を修正する
		this.setDialogPosition({my:DIALOG_POSITION,at:DIALOG_POSITION, of:window});
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
		//ブログ記事の入力されたデータを取得する
		var data = this.dialogClass.getArgumentDataObject();
		//ブログ更新ステータスを取得する
		var blogUpdateStatus = data[BLOG_UPDATE_STATUS];
		//記事新規作成のクエリを作る
		var sendQueryObject = $.extend(true, {}, this[VAR_CREATE_TAG].json[INSERT_MYBLOG_QUERY_KEY], data);
		//ブログ記事が編集の場合、クエリを変える
		if(blogUpdateStatus == UPFDATE_MYBLOG_STATUS) {
			//更新クエリを入れる
			sendQueryObject = $.extend(true, {}, this[VAR_CREATE_TAG].json[UPDATE_MYBLOG_QUERY_KEY], data);
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
	 this.myBlogUpdate = function() {
	 	//ブログ記事を更新するためのデータを取得する
	 	var sendQueryObject = this.updateJson();
	 	//クエリを発行してブログを更新する
	 	this.sendQuery(PATH_SAVE_JSON_DATA_PHP, sendQueryObject);
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
	 		this.myBlogUpdate();
	 	}
	 }

}

//継承の記述
myBlogConfirmDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
myBlogConfirmDialog.prototype.constructor = baseDialog;
