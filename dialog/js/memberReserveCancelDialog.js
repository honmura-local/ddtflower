/* ファイル名:memberReserveCancelDialog.js
 * 概要　　　:会員、予約キャンセルダイアログ
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/memberReserveCancelDialog.js
 */

/* クラス名:memberReserveCancelDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/memberReserveCancelDialog.js
 */
function memberReserveCancelDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	
	//はい、いいえボタンの配列
	this.yes_no = [
					{	//はいボタン
						text:TEXT_YES,
						//クリック時のコールバック関数
						click://ダイアログのステータスをはいボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(YES)
					},
					//いいえボタン
					{	//ボタンテキスト
						text:TEXT_NO,
						//クリック時のコールバック関数
						click://ダイアログのステータスをいいえボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(NO)
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
			//画面パーツ作成に必要なHTMLテンプレートを取得する
			this[VAR_CREATE_TAG].getDomFile(MEMBER_RESERVE_CONFIRM_DIALOG_HTML);
			//必要なデータのjsonを取得する
			this.getJson();	//取得したJSONを加工する
		//例外時処理
		}catch(e){
			//もう一度例外を投げ、dispContents内で処理する
			throw new cannotGetAnyRecordException();
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
		//データとなるjsonを読み込む
		this[VAR_CREATE_TAG].getJsonFile(MEMBER_RESERVE_CANCEL_DIALOG_JSON);
		//DBから値を読み込むためにデータをセットする
		setJsonDataFromArgumentObj(MEMBER_RESERVE_CANCEL_DIALOG_CONTENT);
		//DBからデータを読み込む
		this[VAR_CREATE_TAG].getJsonFile(URL_GET_JSON_STRING_PHP, this[VAR_CREATE_TAG][MEMBER_RESERVE_CANCEL_DIALOG_CONTENT], MEMBER_RESERVE_CANCEL_DIALOG_CONTENT);
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
		//ダイアログのタイトルを変更する
		this.setDialogTitle(this.dialogClass);
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
		creator.outputTag('cancelLessonContent', 'cancelLessonContent', '.cancelLessonDialogContent');
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

	/* 関数名:setDialogTitle
	 * 概要　:画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogTitle = function(dialogClass){
		//ダイアログ生成時に渡されたインプット用データを取得する
		var data = dialogClass.getArgumentDataObject();
		//タイトルを入れ替える
		this.setDialogTitle(data.dateJapanese);
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

	/* 
	 * 関数名:setJsonDataFromArgumentObj
	 * 概要  :受け取ったデータをダイアログのjsonにsetする
	 * 引数  :Object setToJson:値をセットする先のjson
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.16
	 */
	this.setJsonDataFromArgumentObj = function(setToJson){
		//値を格納するオブジェクトの、可能なまで深い参照を変数に格納する
		var setToObject = this[VAR_CREATE_TAG].json[targetJson];
		//ダイアログを作るクラスで受け取った値を扱いやすくするため変数に入れる
		var setFromObject = this.dialogClass.getArgumentDataObject();
		//順次オブジェクトから取り出したデータをJSONのしかるべき場所にセットしていく
		setToObject.lessonConfirm.lessonInfo.timeSchedule[STR_TEXT] 			= buildHourFromTo(setFromObject);	//受講時間
		setToObject.lessonConfirm.lessonInfo.store[STR_TEXT] 					= setFromObject[COLUMN_NAME_SCHOOL_NAME];				//店舗名
		setToObject.lessonConfirm.lessonInfo.course[STR_TEXT]					= setFromObject[COLUMN_NAME_LESSON_NAME];				//授業テーマ
		setToObject.lessonConfirm.lessonInfo.price[STR_TEXT] 					= sumCost(setFromObject);					//受講料
		setToObject.attention.cancelRateValue[COLUMN_NAME_LESSON_KEY][VALUE] 	= setFromObject[COLUMN_NAME_LESSON_KEY];			//受講授業id(キャンセル)
		setToObject.attention.addPointValue[COLUMN_NAME_LESSON_KEY][VALUE] 		= setFromObject[COLUMN_NAME_LESSON_KEY];			//受講授業id(加算ポイント)
	}

	/* 
	 * 関数名:setJsonDataFromArgumentObj
	 * 概要  :受け取ったデータをダイアログのjsonにsetする
	 * 引数  :Object setToJson:値をセットする先のjson
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.16
	 */
	this.dialogCloseFunc = function() {
		//クローズボタンがクリックされたときはDBの更新処理を行う
		if(this.dialogClass.getPushedButtonState() == YES){
			//ダイアログに送信された値を取得する
			var sendObject = this.dialogClass.getArgumentDataObject();
			//クエリを発行してキャンセル処理を行う
			this.sendQuery(URL_SAVE_JSON_DATA_PHP, sendObject);
		}

		//ダイアログを閉じるときは破棄するように設定する
		this.dialogClass.destroy();
	}

}

//継承の記述
memberReserveCancelDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
memberReserveCancelDialog.prototype.constructor = baseDialog;
