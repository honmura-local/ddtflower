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
			this.getJson();//ログインダイアログのjsonを読み込む
			this.getDom();//ログインダイアログのHTML
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

	/* 関数名:getDom
	 * 概要　:createTag用テンプレートHTMLを取得する(オーバーライドして内容を定義してください)
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.getDom = function(){
		//ログインダイアログのテンプレートHTMLを取得する
		this[VAR_CREATE_TAG].getDomFile(PATH_LOGIN_DIALOG_TEMPLATE);		
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
		this.create_tag.outputTag(INPUT_AREA, INPUT_AREA, CURRENT_DIALOG);
	}
	
	/* 関数名:setConfig
	 * 概要　:ダイアログの設定を行う
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0823
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//ログイン・閉じるボタンを配置する
		this.setDialogButtons(this.login_close);		
	}

	/* 関数名:callbackClose
	 * 概要　:デフォルトのcloseイベントコールバック用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0823
	 * 作成者　:T.Masuda
	 */
	this.callbackClose = function(){
		//押されたボタンの判定を行う。returnObjに設定されたボタンの値を基準にする
		switch(this.dialogClass.getPushedButtonState()){
			//ログインボタンが押されていたら
			case LOGIN_BUTTON:
				//ログインボタンのコールバックで処理が終わっているので何もしない
				break;
			//閉じるボタンが押されていたら
			case CLOSE_BUTTON:
				//トップページに戻る
				callPage(TOP_LOCATION);
				break;
			//何も押されてないなら
			default:break;
		}
		//ダイアログを完全に消す
		dialogClass.destroy();
		//画面をリロードする
		location.reload();
	};
	
	/* 関数名:setCallback
	 * 概要　:ダイアログのコールバック関数を登録する
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setCallback = function(){
		//ログインダイアログの中にあるテキストボックスにフォーカスしているときにエンターキー押下でログインボタンを自動でクリックする
		commonFuncs.enterKeyButtonClick(SELECTOR_USERNAME_PASSWORD, SELECTOR_LOGIN_BUTTON);
	}

	/* 関数名:setLoginInformation
	 * 概要　:createTagのJSONにログイン情報をセットする
	 * 引数　:String userId:ユーザID
	 * 		:String password:パスワード
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setLoginInformation = function(userId, password){
		//JsonDBManagerに接続するために送信するjsonにidをセットする
		this[VAR_CREATE_TAG].json[KEY_LOGIN][KEY_LOGIN_ID][VALUE] = userId;
	    //JsonDBManagerに接続するために送信するjsonにパスワードをセットする
	   	this[VAR_CREATE_TAG].json[KEY_LOGIN][KEY_LOGIN_PASSWORD][VALUE] = password;
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
	 * 引数　:Object loginResult:ログイン処理で取得したユーザIDと権限のオブジェクト
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.afterLogin = function(loginResult){
		var data = this.dialogClass.getArgumentDataObject();	//インプット用データオブジェクトを取得する
		
		//通常ログインかつ、管理者のIDならば
		if(data.createTagState == STATE_NOT_LOGIN && loginResult.authority == ADMIN_AUTHORITY){
			//pushStateをサポートしているブラウザなら
			if(commonFuncs.isSupportPushState()){
				//管理者ページの画面遷移の履歴を追加する。
				history.pushState({url:CHAR_HASH + URL_ADMIN_PAGE}, EMPTY_STRING, location.href);
			//URLハッシュを利用する
			} else {
				//管理者ページへ移動する
				location.href = URL_ADMIN_PAGE; 
			}
		//通常ログインかつ、管理者のIDでなければ
		} else if(data.createTagState == STATE_NOT_LOGIN && loginResult.authority != ADMIN_AUTHORITY){
			//pushStateをサポートしているブラウザなら
			if(commonFuncs.isSupportPushState()){
				//会員トップページの画面遷移の履歴を追加する。
				history.pushState({url:CHAR_HASH + URL_MEMBER_PAGE}, EMPTY_STRING, location.href);
			//URLハッシュを利用する
			} else {
				//会員トップページへ移動する
				location.href = URL_MEMBER_PAGE; 
			}
		}

		this.dialogClass.destroy();	//ログイン成功につきダイアログを閉じる
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
		    	this.afterLogin(loginResult);	//ログイン後の処理を行う
		    }
		//ログイン情報の入力を求めるアラートを出す
		} else {
			alert(errorMessages[3]);
		}
	}

	/* 関数名:callbackLogin
	 * 概要　:ダイアログのログインボタンを押したときのコールバック関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:015.08.23
	 * 作成者　:T.Masuda
	 */
	this.callbackLogin = function(){
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
		    	this.afterLogin();	//ログイン後の処理を行う
				//ログインボタンが押されたという状態にする
				this.dialogClass.setPushedButtonState(LOGIN_BUTTON);
		    }
		//ログイン情報の入力を求めるアラートを出す
		} else {
			alert(errorMessages[3]);
		}
	};

	//ここまでクラス定義
}

//継承の記述
loginDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
loginDialog.prototype.constructor = baseDialog;
