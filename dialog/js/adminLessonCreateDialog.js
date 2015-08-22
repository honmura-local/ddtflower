/* ファイル名:adminLessonCreateDialog.js
 * 概要　　　:管理者、新規授業作成ダイアログ
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonCreateDialog.js
 */

/* クラス名:adminLessonCreateDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonCreateDialog.js
 */
function adminLessonCreateDialog(dialog){
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
			//授業データを取得するのに必要なデータをargumentObjから取得してcreateLittleContetnsのJSONにセットする
			//画面パーツ作成に必要なHTMLテンプレートを取得する 
			this[VAR_CREATE_TAG].getDomFile(ADMIN_LESSON_BASE_HTML);		//授業詳細、作成ダイアログ共通テンプレート
			this[VAR_CREATE_TAG].getDomFile(ADMIN_LESSON_CREATE_DIALOG_HTML);	//授業作成ダイアログ個別テンプレート
			//画面パーツ作成に必要なjsonを取得する
			this[VAR_CREATE_TAG].getJsonFile(ADMIN_LESSON_BASE_JSON);			//授業詳細、作成ダイアログ共通json
			this[VAR_CREATE_TAG].getJsonFile(ADMIN_LESSON_CREATE_DIALOG_JSON);	//授業作成ダイアログ個別json
		//例外時処理
		}catch(e){
			//ダイアログ生成エラー
			throw new failedToDisplayException();
		}
	};

	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContents = function(){
		var dialogClass = this.dialog[0].instance;		//ダイアログのクラスインスタンスを取得する

		//画面パーツ作成に必要なHTMLテンプレートを取得する
		this.create_tag.getDomFile(ADMIN_LESSON_CREATE_DIALOG_HTML);
		this.create_tag.getJsonFile(ADMIN_LESSON_CREATE_DIALOG_JSON);
		this.dispContentsMain();		//ダイアログ中部
		this.dispContentsFooter();	//ダイアログ下部
		//ダイアログの位置を修正する
		this.setDialogPosition({my:DIALOG_POSITION,at:DIALOG_POSITION, of:window});
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
	this.dispContentsHeader = function(dialogClass){
		//ダイアログのタイトルを変更する
		this.setDialogTitle(dialogClass);
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
		//授業データ入力領域を作る
		this[VAR_CREATE_TAG].outputTag(LESSON_DATA, LESSON_DATA, CURRENT_DIALOG_SELECTOR);
		//授業のテーマを設定する領域を出力する
		this[VAR_CREATE_TAG].outputTag(CLASS_LESSON_THEME, CLASS_LESSON_THEME, LESSON_DATA);
		//授業の時間割を設定する領域を出力する
		this[VAR_CREATE_TAG].outputTag(CLASS_LESSON_TIMETABLE, CLASS_LESSON_TIMETABLE, LESSON_DATA);
		//授業の最少人数を設定する領域を出力する
		this[VAR_CREATE_TAG].outputTag(CLASS_LESSON_MIN_STUDENTS, CLASS_LESSON_MIN_STUDENTS, LESSON_DATA);
		//授業の最大人数を設定する領域を出力する
		this[VAR_CREATE_TAG].outputTag(CLASS_LESSON_MAX_STUDENTS, CLASS_LESSON_MAX_STUDENTS, LESSON_DATA);
		//授業のステータスを設定する領域を出力する
		this[VAR_CREATE_TAG].outputTag(CLASS_LESSON_STATUS, CLASS_LESSON_STATUS, LESSON_DATA);
		//授業の教室を設定する領域を出力する
		this[VAR_CREATE_TAG].outputTag(CLASS_LESSON_CLASSROOM, CLASS_LESSON_CLASSROOM, LESSON_DATA);
		//授業のメモを設定する領域を出力する
		this[VAR_CREATE_TAG].outputTag(CLASS_LESSON_MEMO, CLASS_LESSON_MEMO, LESSON_DATA);
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
		this.button= [
			{	//はいボタン
				text:TEXT_LESSON_CREATE_BUTTON,
				//クリック時のコールバック関数
				click:function(){
					//returnObjに返す値をセットする
					//setReturnObj(xxxx);
					//ダイアログを閉じ、授業作成処理を開始する
					$(this).dialog(CLOSE);
				}
			}
		];
		this.setDialogButtons(this.button);		//授業作成ボタンを配置する
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
	
	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.14
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
	}
}

//継承の記述
adminLessonCreateDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
adminLessonCreateDialog.prototype.constructor = baseDialog;






