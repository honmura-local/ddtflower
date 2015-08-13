/* ファイル名:testdialogchild.js
 * 概要　　　:テスト用ダイアログ
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/testdialogchild.js
 */

/* クラス名:testdialogchild.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/testdialogchild.js
 */
function testdialogchild(dialog){
	baseDialog.call(this, dialog);
	
	//とじるボタンの配列
	this.buttons = [
	              	{
	              		text:'開く',
	              		click:function(){
	              			//次の子ダイアログを開く
	              			this.dialogBuilder.callTestChildDialog();
	              		}
	              	},
					{
						text:'閉じる',
						click:function(){
							$(this).dialog(CLOSE);	//閉じる
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

	//タイトルの文字列
	this.alterTitle = '子ダイアログ。';
	
	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContents = function(){
		this.setDialogButtons(this.buttons);		//YES_NOボタンを配置する
		this.setDialogTitle(this.alterTitle);	//タイトルを入れ替える
		var data = dialog[0].instance.getArgumentDataObject();	//データのオブジェクトを取得する
		console.log(this);
		//ダイアログを閉じるときは親子共々破棄する
		dialog[0].instance.setCallbackCloseOnAfterOpen(this.michidure);
		var creator = new createLittleContents();	//createLittleContentsクラスインスタンスを用意する
		creator.getJsonFile('dialog/source/testdialogchild.json');
		creator.getDomFile('dialog/template/testdialogchild.html');
		console.log(creator);
		creator.outputTag('notice1', 'notice1', '.dialog:last');
	}

	/* 関数名:dispContents
	 * 概要　:自分と親のダイアログをまとめて消す
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.michidure = function(){
		//ダイアログのインプットパラメータ用オブジェクトを取得する
		data = this.instance.getArgumentDataObject();
		this.instance.destroy();					//自分を消す
		$(data.parentDialogEx.dom).dialog(CLOSE);	//親を消す
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
		this.dialog[0].instance.createDialogEx('dialog/testdialoggrandchild.html', childObj);
	}
}

//継承の記述
testdialogchild.prototype = new testdialog();
//サブクラスのコンストラクタを有効にする
testdialogchild.prototype.constructor = testdialog;
