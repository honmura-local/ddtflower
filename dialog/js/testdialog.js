/* ファイル名:testdialog.js
 * 概要　　　:テスト用ダイアログ
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/testdialog.js
 */

/* クラス名:testdialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/testdialog.js
 */
function testdialog(dialog){
	baseDialog.call(this, dialog);
	
	//はい、いいえボタンの配列
	this.yes_no = [
					{
						text:'はい',
						click:function(){
							this.dialogBuilder.callTestChildDialog();
						}
					},
					{
						text:'いいえ',
						click:function(){
							$(this).dialog('close');
						}
					}
	           ];

	//子ダイアログ用オブジェクト
	this.dialogExOptionSampleChild = {
			argumentObj:{
				config:{
					//幅を自動設定する。
					width			: 300,
					//ダイアログを生成と同時に開く。
					autoOpen		: true,
					//リサイズ不可にする
					resizable:false,
					//Escキーを押してもダイアログが閉じないようにする。
					closeOnEscape	: false,
					//モーダル化する
					modal:true,
					//ダイアログタイトルを送信確認にする
					title:'タイトル',
					//画面上部にダイアログを表示する
					position :{my:'center top',at:'center top', of:window},
					create:function(){	//ダイアログが作られたときのイベントとコールバック関数
					},
					open:function(){	//ダイアログが開いたときのイベントとコールバック関数
					},
					close:function(){	//ダイアログが閉じたのイベントとコールバック関数
						
					},
					buttons:[]
				},
				data:{
					message:""
				}
			}
	}
	
	
	this.callAlert = function(){
		alert("I called.")
	}
	
	//タイトルの文字列
	this.alterTitle = '変更できました。';
	
	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContents = function(){
		this.setDialogButtons(this.yes_no);		//YES_NOボタンを配置する
		this.setDialogTitle(this.alterTitle);	//タイトルを入れ替える
		//ダイアログを閉じるときは破棄する
		dialog[0].instance.setCallbackCloseOnAfterOpen(dialog[0].instance.destroy);
		var creator = new createLittleContents();	//createLittleContentsクラスインスタンスを用意する
		creator.getJsonFile('dialog/source/testdialog.json');
		creator.getDomFile('dialog/template/testdialog.html');
		console.log(creator);
		creator.outputTag('notice1', 'notice1', '.dialog:last');
		creator.outputTag('table1', 'table1', '.dialog:last');
	}

	/* 関数名:callTestChildDialog
	 * 概要　:子ダイアログを開く
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.callTestChildDialog = function(){
		var childObj = $.extend(true, {}, this.dialogExOptionSampleChild.argumentObj);
		//このダイアログのdialogExクラスインスタンスを子へ渡すオブジェクトに追加する
		$.extend(true, childObj.data, {parentDialogEx:this.dialog[0].instance});
		//はいボタンのコールバック関数
		this.dialog[0].instance.createDialogEx('dialog/testdialogchild.html', childObj);
	}
}

//継承の記述
testdialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
testdialog.prototype.constructor = baseDialog;
