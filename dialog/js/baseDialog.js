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
	//ダイアログの生成と操作に使うcreateLittleContentsインスタンスを用意する
	this.create_tag = new createLittleContents();
	
	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContents = function(){
		//小分けした画面作成用関数をコールする
		this.dispContentsHeader();
		this.dispContentsMain();
		this.dispContentsFooter();
	}
	
	/* 関数名:dispContentsHeader
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsHeader = function(){
		
	}
	
	/* 関数名:dispContentsMain
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のメイン部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsMain = function(){
		
	}
	
	/* 関数名:dispContentsFooter
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のフッター部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsFooter = function(){
		
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
	
	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する。暫定的に安全性を考えてreturnするようにしました。
	 * 		:ダイアログに渡すオブジェクトを生成する。暫定的に安全性を考えてreturnするようにしました。
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.14
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		return {};	//argumentObjをセットする。継承して各自定義すること。
	}
	
	/* 関数名:openDialog
	 * 概要　:渡されたURLから新たなダイアログを開く
	 * 引数　:String url:ダイアログのURL
	 * 		:Object argumentObj:ダイアログのインプットデータ、設定データのオブジェクト
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.openDialog = function(url){
		//ダイアログのクラスインスタンスを生成する。
		//openイベントはsetArgumentObjでセットしておく
		this.dialogEx = new dialogEx(url, this.setArgumentObj());
		console.log(this.setArgumentObj());
		//openイベントのコールバック関数をセットする
		this.dialogEx.run();	//ダイアログを開く
	}
	
	//画面パーツ生成用関数。現状createTagクラスで画面パーツを作っているので一旦定義だけ行う
	this.createTable = function(){};
	this.createTextbox = function(){};
	this.createDialog = function(){};
}

