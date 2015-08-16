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
	
	//ログイン・閉じるボタンの配列
	this.login_close = [
					{	
						//ログインボタン
						text:LOGIN,
						//ログインボタンのクラスを付ける
			        	 class:LOGIN_BUTTON,
						//ログインボタンのコールバック関数をセットする
						click:this[DIALOG_BUILDER][VAR_CREATE_TAG].doLogin
					},
					//閉じるボタン
					{
						//ボタンテキスト
						text:STR_CLOSE_JP,
						//閉じるログインボタンのコールバック関数をセットする
						click:this[DIALOG_BUILDER].closeLoginDialog
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
			//ログインダイアログのHTML、jsonを読み込む
			this.getJson();
			this[VAR_CREATE_TAG].getDomFile(PATH_LOGIN_DIALOG_TEMPLATE);
		//例外時処理
		}catch(e){
			//接続エラー例外であれば
			if(e instanceof connectErrorException){
				throw new connectErrorException();	//該当する例外クラスを投げる
			//DB操作エラー例外であれば
			} else if(e instanceof failedToDBControleException){
				throw new failedToDBControleException();	//該当する例外クラスを投げる
			}
		}
	};

	/* 関数名:getJson
	 * 概要　:JSONを取得する(オーバーライドして内容を定義してください)
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.getJson = function(){
		//ログインダイアログのJSONファイルを読み込む
		this[VAR_CREATE_TAG].getJsonFile(PATH_LOGIN_DIALOG_JSON);
	};
	
	/* 関数名:dispContentsHeader
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsHeader = function(){
		//ダイアログのタイトルを変更する。
		//ログインエラー例外クラス生成時に設定されたタイトルを使う
		this.setDialogTitle(this.dialog[0].instance.getArgumentDataObject().title);
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
		//以下、createTagによる画面パーツの配置。
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
		//ログイン・閉じるボタンを配置する
		this.setDialogButtons(this.login_close);		
	}

	/* 関数名:setDialogEvents
	 * 概要　:ダイアログのイベントを設定する
	 * 引数　:なし(オーバーライド時に定義する)
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogEvents = function(){
		//ダイアログを閉じるときは破棄する
		this.dialog[0].instance.setCallbackCloseOnAfterOpen(dialog[0].instance.destroy);
	}

	/* 関数名:closeLoginDialog
	 * 概要　:ログインダイアログをキャンセルボタンで閉じる関数
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.closeLoginDialog = function(){
		//ダイアログを破棄する
		this.dialogClass.destroy();
		//トップページに戻る
		callPage(TOP_LOCATION);
		//画面をリロードする
		location.reload();
	}
	
	this.setLoginInformation = function(userId, password){
		//JsonDBManagerに接続するために送信するjsonにidをセットする
		this[VAR_CREATE_TAG].json.login.userName.value = userId;
	    //JsonDBManagerに接続するために送信するjsonにパスワードをセットする
	   	this[VAR_CREATE_TAG].json.login.password.value = password;
	}

	/* 関数名:getLoginInformation
	 * 概要　:ログイン情報をフォームから取得する
	 * 引数　:なし
	 * 返却値:Object:ユーザIDとパスワードを格納したオブジェクト
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.getLoginInformation(){
		//入力されたユーザID、パスワードをオブジェクトにまとめて返す
		return {userId: $(USERNAME_SELECTOR).val(), password:$(PASSWORD_SELECTOR).val()}
	}
	
	/* 関数名:getLoginInformation
	 * 概要　:ログイン処理を行い、その結果をオブジェクトで返す
	 * 引数　:なし
	 * 返却値:Object:ユーザIDと権限の値を格納したオブジェクトを返す
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.getLoginProcedureResult(){
		//※ログインダイアログ表示時に引数のJSONは取得されている
		//サーバにアクセスし、ログイン処理を行う
 		this[VAR_CREATE_TAG].getJsonFile(URL_GET_JSON_STRING_PHP, this[VAR_CREATE_TAG].json[login], LOGIN);
 		//DBから取得したログイン処理の結果をオブジェクトにまとめて返す
 		return {userId: this[VAR_CREATE_TAG].json.login.id.text, authority: this[VAR_CREATE_TAG].json.login.authority.text};
	}
	
	/* 関数名:afterLogin
	 * 概要　:ログイン成功後の処理
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.afterLogin = function(){
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
	
	/* 関数名:doLogin
	 * 概要　:ログイン処理
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.doLogin = function(){
		var loginInfo =  this.getLoginInformation();
		
		//入力された値が空白かどうかでログイン処理のエラーチェックを行う
		if(commonFuncs.checkEmpty(loginInfo[USER_ID]) ||
				commonFuncs.checkEmpty(loginInfo[PASSWORD])) {
			//ログイン情報をJSONにセットする
			this.setLoginInformation(userid, password);
			
			//ログイン処理を実行し、結果を取得する
			var loginResult = this.getLoginProcedureResult();
			//JSONDBManagerによるログイン処理を行う
		        	 		//ログイン成否チェックの分岐
		        	 		//会員IDが取得できていなかった場合
		        	 		if(loginResult[USER_ID] == EMPTY_STRING) {
		        	 			//エラーメッセージを表示して処理をそのまま終了する
		        				alert(MESSAGE_LOGIN_ERROR);
		        			//会員IDが取得できていればログイン成功
		        	 		} else {
		        	 			this.afterLogin();
		        	 		}
		        	 	//ログイン情報の入力を求めるアラートを出す
		        	 	} else {
							alert(errorMessages[3]);
		        	 	}
		        	 }
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
