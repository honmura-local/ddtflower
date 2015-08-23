/* ファイル名:memberReserveConfirmDialog.js
 * 概要　　　:会員、予約確認ダイアログ
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/memberReserveConfirmDialog.js
 */

/* クラス名:memberReserveConfirmDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/memberReserveConfirmDialog.js
 */
function memberReserveCancelDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	
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
			this.getDom()		//テンプレートHTMLを取得する
			this.getJson();		//JSONを取得する
		//例外時処理
		}catch(e){
			//もう一度例外を投げ、dispContents内で処理する
			throw e;
		}
	}

	/* 関数名:getJson
	 * 概要　:create_tagのインスタンスにデータのjsonをまとめるための処理
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.getJson = function(){
		//確認とキャンセルの共通jsonを読み込む
		this[VAR_CREATE_TAG].getJsonFile(MEMBER_LESSON_CONFIRM_DIALOG_JSON);
		//データとなるjsonを読み込む
		this[VAR_CREATE_TAG].getJsonFile(MEMBER_RESERVE_CONFIRM_DIALOG_JSON);
		//DBから値を読み込むためにデータをセットする
		setJsonDataFromArgumentObj();
		//DBからデータを読み込む
		this[VAR_CREATE_TAG].getJsonFile(URL_GET_JSON_STRING_PHP, this[VAR_CREATE_TAG].json[CLASS_LESSON_ACCORDION], CLASS_LESSON_ACCORDION);
	}

	/* 関数名:getDom
	 * 概要　:create_tagのインスタンスにテンプレートのHTMLをまとめるための処理
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.getDom = function(){
		//予約確認とキャンセルダイアログの共通テンプレートを読み込む
		this[VAR_CREATE_TAG].getDomFile(MEMBER_LESSON_CONFIRM_DIALOG_HTML);
		//予約確認ダイアログ個別テンプレートを取得する
		this[VAR_CREATE_TAG].getDomFile(MEMBER_RESERVE_CONFIRM_DIALOG_HTML);
	}
	
	/* 関数名:dispContentsHeader
	 * 概要　:画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsHeader = function(){
		//ダイアログのタイトルを変更する。日本語の日付を表示する
		this.setDialogTitle(this.dialogClass.argumentObj.data.dateJapanese);
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
		//ダイアログの中身のコンテンツを作る
		creator.outputTag(CLASS_LESSON_INFO, CLASS_LESSON_INFO, CURRENT_DIALOG_SELECTOR);
		//アコーディオンの表示のきっかけとなるキャンセル料率と加算ポイントについてのテキストを作る
		creator.outputTag(CLASS_INFO_ACCORDION, CLASS_INFO_ACCORDION, CLASS_LESSON_INFO);
		//アコーディオンの中身を作る
		creator.outputTag(CLASS_LESSON_ACCORDION, CLASS_LESSON_ACCORDION, CLASS_LESSON_INFO);
		//確認テキストを作る
		creator.outputTag(CLASS_MEMBER_CONFIRM, CLASS_MEMBER_CONFIRM, CLASS_LESSON_INFO);
	}
	
	/* 関数名:setConfig
	 * 概要　:コールバック関数をセットする
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//ダイアログにボタンをセットする
		this.setDialogButtons(this.yes_no);
		//ダイアログの位置を修正する
		this.setDialogPosition({my:DIALOG_POSITION,at:DIALOG_POSITION, of:window});
	}

	/* 関数名:setCallback
	 * 概要　:ダイアログのコールバックを設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setCallback = function(){
		//親ダイアログから渡されたクローズ用コールバック関数をセットする
		this.dialogClass.setCallbackCloseOnAfterOpen(this.dialogClass.getArgumentDataObject().callback);
	}

	/* 
	 * 関数名:customizeJson
	 * 概要  :表示する前にJSONを操作する
	 * 引数  :なし
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.08.22
	 */
	this.customizeJson = function(){
		//createTagのメンバJSONを取得し、これを加工する
		var thisJson = this[VAR_CREATE_TAG].json;
		//ダイアログを作るクラスで受け取った値を扱いやすくするため変数に入れる
		var argumentObj = this.dialogClass.getArgumentDataObject();
		//順次オブジェクトから取り出したデータをJSONのしかるべき場所にセットしていく
		thisJson.lessonConfirm.lessonInfo.timeSchedule[STR_TEXT] 			= buildHourFromTo(argumentObj);	//受講時間
		thisJson.lessonConfirm.lessonInfo.store[STR_TEXT] 					= argumentObj[COLUMN_NAME_SCHOOL_NAME];				//店舗名
		thisJson.lessonConfirm.lessonInfo.course[STR_TEXT]					= argumentObj[COLUMN_NAME_LESSON_NAME];				//授業テーマ
		thisJson.lessonConfirm.lessonInfo.price[STR_TEXT] 					= sumCost(argumentObj);					//受講料
		thisJson.attention.cancelRateValue[COLUMN_NAME_LESSON_KEY][VALUE] 	= argumentObj[COLUMN_NAME_LESSON_KEY];			//受講授業id(キャンセル)
		thisJson.attention.addPointValue[COLUMN_NAME_LESSON_KEY][VALUE] 		= argumentObj[COLUMN_NAME_LESSON_KEY];			//受講授業id(加算ポイント)
	}

	/* 関数名:setConfig
	 * 概要　:ダイアログの設定を行う。任意でオーバーライドして定義する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//はい・いいえボタンを使う
		this.setButtons(this.yes_no);
		//ダイアログの位置調整を行う
		this.setDialogPosition(POSITION_CENTER_TOP);
	}

}

//継承の記述
memberReserveConfirmDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
memberReserveConfirmDialog.prototype.constructor = baseDialog;
