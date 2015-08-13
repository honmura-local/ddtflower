/** ファイル名:baseDialog.js
 * 概要　　　:ダイアログ内コンテンツ作成、要素操作のためのクラスのための基底クラスの定義ファイル
 * 設計者　:H.Kaneko
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/baseDialog.js
 */

//ひとまずクラスインスタンス用変数名はdialogBuilderに統一します。
/** クラス名:baseDialog
 * 概要　:ダイアログ内コンテンツ作成、要素操作のためのクラスのための基底クラス
 * 引数	:Element dialog:コンテンツを作る対象となるダイアログのDOM
 * 設計者:H.Kaneko
 * 作成日:2015.0813
 * 作成者:T.Masuda
 */

function baseDialog(dialog){
	//各コンストラクタ引数をメンバに格納する
	this.dialog = dialog;	//ダイアログのDOM

	/* 関数名:openDialog
	 * 概要　:open時にコールバックされる関数。現状ではグローバル領域の関数callOpenDialogでコールする必要がある
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.openDialog = function(){
		//コンテンツを表示する。
		this.dispContents();
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
		
	}
	
	//以下オプションセット関数はopenDialog関数内に記述する
	
	/* 関数名:setDialogOption
	 * 概要　:ダイアログのオプションを設定する
	 * 引数　:String optionName:オプション名
	 * 		:? value:オプションに設定する値
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.setDialogOption = function(optionName, value){
		//引数のダイアログのオプションをセットする
		$(this.dialog).dialog(OPTION, optionName, value);
	}
	
	/* 関数名:setDialogButtons
	 * 概要　:ダイアログにjQuery UI Dialogのボタンを配置する
	 * 引数　:Array buttons:ボタンの設定の配列
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.setDialogButtons = function(buttons){
		//ダイアログのbuttonsオプションを設定する
		this.setDialogOption(BUTTONS, buttons);
	}
	
	/* 関数名:setDialogTitle
	 * 概要　:タイトルをセットする
	 * 引数　:String title:タイトルの文字列
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.setDialogTitle = function(title){
		//ダイアログのbuttonsオプションを設定する
		this.setDialogOption(TITLE, title);
	}
	
	//画面パーツ生成用関数。現状createTagクラスで画面パーツを作っているので一旦定義だけ行う
	this.createTable = function(){};
	this.createTextbox = function(){};
	this.createDialog = function(){};
	
}

/* 関数名:callOpenDialog
 * 概要　:ダイアログが開いたときのコールバック関数openDialogをコールする。
 * 		:ダイアログのcloseイベントのコールバック関数には基本的にこれをセットする
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 */
function callOpenDialog(){
	//openDialog関数を実行する
	this.dialogBuilder.openDialog();
}