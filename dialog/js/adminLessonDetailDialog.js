/* ファイル名:adminLessonDetailDialog.js
 * 概要　　　:管理者、授業詳細ダイアログ
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonDetailDialog.js
 */

/* クラス名:adminLessonDetailDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonDetailDialog.js
 */
function adminLessonDetailDialog(dialog){
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
		this[VAR_CREATE_TAG].getJsonFile(ADMIN_LESSON_DETAIL_DIALOG_JSON);	//授業詳細ダイアログ個別json
		//jsonを取得する
		this.create_tag.getJsonFile(ADMIN_LESSON_DETAIL_DIALOG_JSON);
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
		//授業データを取得するのに必要なデータをargumentObjから取得してcreateLittleContetnsのJSONにセットする
		//画面パーツ作成に必要なHTMLテンプレートを取得する  
		this[VAR_CREATE_TAG].getDomFile(ADMIN_LESSON_BASE_HTML);			//授業詳細、作成ダイアログ共通テンプレート
		this[VAR_CREATE_TAG].getDomFile(ADMIN_LESSON_DETAIL_DIALOG_HTML);	//授業詳細ダイアログ個別テンプレート
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
		this.dispContentsHeader();		//ダイアログ上部
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
		//受け取った値をテキストボックスやセレクトボックスに入れるためにデータを取得する
		var data = dialogClass.getArgumentDataObject();
		//ダイアログのタイトルを変更する
		this.setDialogTitle(dialogClass);
		//受講する授業のテーマを入れる
		this.create_tag.json.lessonData.themeArea.themeDetailText.text = data['lesson_name'];
		//受講する授業の時間割を入れる
		this.create_tag.json.lessonData.timeTableArea.timeTableText.text = data['time_schedule'];

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
	this.dispContentsMain = function(dialogClass){
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
	
	/* 関数名:callbackYes
	 * 概要　:ダイアログの更新ボタンを押したときのコールバック関数用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0823
	 * 作成者　:T.Masuda
	 */
	this.callbackUpdate = function(){
		//授業の内容を更新する
		this.lessonDataUpdate();
	};

	/* 関数名:callbackStudents
	 * 概要　:ダイアログの受講者一覧ボタンを押したときのコールバック関数用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0823
	 * 作成者　:T.Masuda
	 */
	this.callbackStudents = function(){
	};

	/* 関数名:setConfig
	 * 概要　:ダイアログの設定を行う。
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//更新・受講者一覧ボタンを使う
		this.setButtons(this.update_students);
		//ダイアログの位置調整を行う
		this.setDialogPosition(POSITION_CENTER_TOP);
		//受け取った値をテキストボックスやセレクトボックスに入れるためにデータを取得する
		var data = dialogClass.getArgumentDataObject();
		//連想配列のデータをダイアログの各要素に配置していく
		commonFuncs.setObjectValue(data, DOT + LESSON_DATA);
	}
	
	/* 関数名:lessonDataUpdate
	 * 概要　:授業データを入力された値で更新する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Yamamoto
	 */
	this.lessonDataUpdate = function (dialogClass) {
		//ダイアログ生成時に渡されたインプット用データを取得する
		var data = dialogClass.getArgumentDataObject();
		//入力した値を取得し、データの更新に用いる
		var updateData = getInputData(LESSON_DATA);
		//授業idを取得する
		updateData[COLUMN_CLASSWORK_KEY] = data[COLUMN_CLASSWORK_KEY];
		//授業詳細テーブルを更新する
		this.create_tag.setDBdata(this.create_tag.json.lessonDetailUpdate, updateData, '授業情報の更新に成功しました。');
	}

}

//継承の記述
adminLessonDetailDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
adminLessonDetailDialog.prototype.constructor = baseDialog;
