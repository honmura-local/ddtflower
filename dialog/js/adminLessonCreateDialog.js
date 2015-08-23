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

	/* 関数名:getJson
	 * 概要　:JSONを取得する(オーバーライドして内容を定義してください)
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.getJson = function(){
		//画面パーツ作成に必要なjsonを取得する
		this[VAR_CREATE_TAG].getJsonFile(ADMIN_LESSON_BASE_JSON);			//授業詳細、作成ダイアログ共通json
		this[VAR_CREATE_TAG].getJsonFile(ADMIN_LESSON_CREATE_DIALOG_JSON);	//授業作成ダイアログ個別json
	};
	
	/* 関数名:getDom
	 * 概要　:createTag用テンプレートHTMLを取得する(オーバーライドして内容を定義してください)
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.getDom = function(){
		//画面パーツ作成に必要なHTMLテンプレートを取得する 
		this[VAR_CREATE_TAG].getDomFile(ADMIN_LESSON_BASE_HTML);		//授業詳細、作成ダイアログ共通テンプレート
		this[VAR_CREATE_TAG].getDomFile(ADMIN_LESSON_CREATE_DIALOG_HTML);	//授業作成ダイアログ個別テンプレート
	};
	
	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContentsHeader = function(){
		//タイトルを入れ替える
		this.setDialogTitle(dialogClass.getArgumentDataObject().dateJapanese);
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

	/* 関数名:setConfig
	 * 概要　:ダイアログの設定を行う。
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//新規作成ボタンを使う
		this.setButtons(this.createNew);
		//ダイアログの位置調整を行う
		this.setDialogPosition(POSITION_CENTER_TOP);
	}

}

//継承の記述
adminLessonCreateDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
adminLessonCreateDialog.prototype.constructor = baseDialog;






