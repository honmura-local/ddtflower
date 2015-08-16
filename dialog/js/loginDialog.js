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
function loginDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	
	//はい、いいえボタンの配列
	this.yes_no = [
					{	//はいボタン
						text:'はい',
						//クリック時のコールバック関数
						click:function(){
							//子のダイアログを開く
							this.dialogBuilder.openDialog(URL_TEST_DIALOG_CHILD);
						}
					},
					//いいえボタン
					{	//ボタンテキスト
						text:'いいえ',
						//クリック時のコールバック関数
						click:function(){	//クリックのコールバック関数
							//ダイアログを閉じる
							$(this).dialog('close');
						}
					}
	           ];

	
	//タイトルの文字列
	this.alterTitle = 'ログイン。';
	
	/* 関数名:dispContentsMain
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のメイン部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsMain = function(){
		var creator = new createLittleContents();	//createLittleContentsクラスインスタンスを用意する
		//以下、createTagによる画面パーツの配置。
		creator.getJsonFile('dialog/source/testdialog.json');
		creator.getDomFile('dialog/template/testdialog.html');
		creator.outputTag('notice1', 'notice1', '.dialog:last');
		creator.outputTag('table1', 'table1', '.dialog:last');
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
		this.setDialogButtons(this.yes_no);		//YES_NOボタンを配置する
		this.setDialogTitle(this.alterTitle);	//タイトルを入れ替える
		//ダイアログを閉じるときは破棄する
		this.dialog[0].instance.setCallbackCloseOnAfterOpen(dialog[0].instance.destroy);
	}
	
	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.13
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		//新たにオブジェクトを作り、親ダイアログから引き継いだargumentObjの内容をセットする
		var argumentObj = $.extend(true, {}, this.dialogExOptionSampleChild.argumentObj);
		//openイベントを設定する
		$.extend(true, argumentObj.config, {open:commonFuncs.callOpenDialog});
		//このダイアログのdialogExクラスインスタンスを子へ渡すオブジェクトに追加する
		$.extend(true, argumentObj.data, {parentDialogEx:this.dialog[0].instance});
		console.log(argumentObj);
		return argumentObj;	//生成したオブジェクトを返す
	}

	$('.loginDialogMessage', loginDialog.dom).html(this.message);	//ダイアログのメッセージ領域を書き換える	
	loginDialog.argumentObj.config[TITLE] = this.title;				//ダイアログのタイトルを変更する
	loginDialog.setCallbackCreate(whenLoginDialogCreate);			//ダイアログが作成されたときのコールバック関数を登録する。
	loginDialog.setCallbackClose(whenLoginDialogClose);				//ダイアログを閉じる時のコールバック関数を登録する。

	// ボタンの生成と設定を行う。
	var buttons = [
		         {
		        	 // OKボタンのテキスト。
		        	 text:LOGIN_TEXT,
		        	 //テキストボックスでエンターキーに対応するためにクラスを付ける
		        	 class:LOGIN_BUTTON,
		        	 // ボタン押下時の処理を記述する。
		        	 click:function(event, ui){
		        	 	//ログイン処理に使うために入力されたログインidを取得する
		        	 	var userLoginId = $(USERNAME_SELECTOR = '.userName').val();
		        	 	//ログイン処理に使うために入力されたログインパスワードを取得する
		        	 	var userLoginPassword = $('.password').val();
		        	 	//入力された値が空白かどうかでログイン処理のエラーチェックを行う
		        	 	if(userLoginId != EMPTY_STRING || userLoginPassword != EMPTY_STRING) {
		        	 		//JsonDBManagerに接続するために送信するjsonにidをセットする
		        	 		loginCreator.json.login.userName.value = userLoginId;
		        	 		//JsonDBManagerに接続するために送信するjsonにパスワードをセットする
		        	 		loginCreator.json.login.password.value = userLoginPassword;
		        	 		//JSONDBManagerによるログイン処理を行う
		        	 		loginCreator.getJsonFile(URL_GET_JSON_STRING_PHP, loginCreator.json.login, 'login');
		        	 		//会員IDをJSONから取得する
		        	 		var memberInfo = loginCreator.json.login.id.text;
		        	 		//会員の権限の数値を取得する
		        	 		var authority =  loginCreator.json.login.authority.text;
		        	 		//ログイン成否チェックの分岐
		        	 		//会員IDが取得できていなかった場合
		        	 		if(memberInfo == EMPTY_STRING) {
		        	 			//エラーメッセージを表示して処理をそのまま終了する
		        				alert(MESSAGE_LOGIN_ERROR);
		        			//会員IDが取得できていれば
		        	 		} else {
		        	 			//@mod 2015.0627 T.Masuda 既存のコンテンツを消去するコードを修正しました
	        					$(this).dialog(CLOSE);	//ログイン成功につきダイアログを閉じる
	        					var data = this.instance.getArgumentDataObject();	//インプット用データオブジェクトを取得する
	        					//通常ログインかつ、管理者のIDならば
	        					if(data.createTagState == STATE_NOT_LOGIN && authority == ADMIN_AUTHORITY){
	        						//pushStateをサポートしているブラウザなら
	        						if(isSupportPushState()){
	        							//管理者ページの画面遷移の履歴を追加する。
	        							history.pushState({'url':'#' + URL_ADMIN_PAGE}, '', location.href);
	        						//URLハッシュを利用する
	        						} else {
	        							//管理者ページへ移動する
	        							location.href = URL_ADMIN_PAGE; 
	        						}
	        					//通常ログインかつ、管理者のIDでなければ
	        					} else if(data.createTagState == STATE_NOT_LOGIN && authority != ADMIN_AUTHORITY){
	        						//pushStateをサポートしているブラウザなら
	        						if(isSupportPushState()){
	        							//会員トップページの画面遷移の履歴を追加する。
	        							history.pushState({'url':'#' + URL_MEMBER_PAGE}, '', location.href);
	        						//URLハッシュを利用する
	        						} else {
	        							//会員トップページへ移動する
	        							location.href = URL_MEMBER_PAGE; 
	        						}
	        					}
								
								//画面をリロードする。
								location.reload();
		        	 		}
		        	 	//ログイン情報の入力を求めるアラートを出す
		        	 	} else {
							alert(errorMessages[3]);
		        	 	}
		        	 }
		         },
		         {
		        	 // キャンセルボタンのテキスト。
		        	 text:CANCEL_TEXT,
		        	 // ボタン押下時の処理を記述する。
		        	 click:function(event, ui){
		        		 //トップページに戻る
		        		 callPage(TOP_LOCATION);
		        		 // ダイアログを消去する。
		        		 $(this).dialog(CLOSE);
		        	 }
		         }
	         ]
	/*
	 * 関数名:whenLoginDialogCreate
	 * 概要  :ログインダイアログが作られたときのコールバック関数
	 * 引数  :なし
	 * 戻り値:なし
	 * 作成日:2015.08.01
	 * 作成者:T.Masuda
	 */
	function whenLoginDialogCreate(){
		//ログインダイアログの中にあるテキストボックスにフォーカスしているときにエンターキー押下でログインボタンを自動でクリックする
		commonFuncs.enterKeyButtonClick('.userName, .password', '.loginButton');
		$('.loading').hide();	//例外で消えなかったローディング画面を消す。
	}
}

//継承の記述
loginDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
loginDialog.prototype.constructor = baseDialog;
