/* ファイル名:loginDialog.js
 * 概要　　　:ログインを行うためのダイアログを作るクラスのJSファイル
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/loginDialog.js
 */

/* クラス名:loginDialog
 * 概要　　:ログインを行うためのダイアログを作る
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/loginDialog.js
 */
function loginDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	
	this.url = EMPTY_STRING;		//ログイン後に表示する画面のURL		
	
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
	
	/* 関数名:dispContentsMain
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のメイン部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsMain = function(){
		//ログインに必要なテキストボックス、案内のラベルを出す
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
		
		//ダイアログを完全に消す
		this.dialogBuilder.dialogClass.destroy();
		
		//押されたボタンの判定を行う。returnObjに設定されたボタンの値を基準にする
		switch(this.dialogBuilder.dialogClass.getPushedButtonState()){
			//ログインボタンが押されていたら
			case LOGIN_NUM:
				//URLが設定されていたら
				if (this.dialogBuilder.url != EMPTY_STRING) {
					//pushStateをサポートしているブラウザなら
					if(commonFuncs.isSupportPushState()){
						//画面遷移を行う
						$(CURRENT_WINDOW)[0].instance.callPage(this.dialogBuilder.url);
					} else {
						//アドレスを直接入力して画面遷移を行う
						location.href = this.dialogBuilder.url; 
					}
				}
				break;
			//閉じるボタン、クローズボックスが押されていたら
			default:
				//セッション切れでのログインし直しでなければ
				if (!commonFuncs.GetCookies().userId) {
					//中途半端に表示されている会員画面ウィンドウを消す
					$(CURRENT_WINDOW)[0].instance.destroy();
				}
			
				break;	//switchを抜ける
		}
		
		//ウィンドウ同士の重なりを整理する(隠れていた通常ウィンドウを表示する)
		commonFuncs.showCurrentWindow()
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
		//ダイアログを完全に消す
		this.dialogClass.setCallbackCloseOnAfterOpen(this.callbackClose);
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
	this.getLoginInformation = function(){
		//入力されたユーザID、パスワードをオブジェクトにまとめて返す
		return {userId: $(USERNAME_SELECTOR).val(), password:$(PASSWORD_SELECTOR).val()}
	}
	
	/* 関数名:getLoginProcedureResult
	 * 概要　:ログイン処理を行い、その結果をオブジェクトで返す
	 * 引数　:なし
	 * 返却値:Object:ユーザIDと権限の値を格納したオブジェクトを返す
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.getLoginProcedureResult = function(){
		//サーバにアクセスし、ログイン処理を行う
 		this[VAR_CREATE_TAG].getJsonFile(URL_GET_JSON_STRING_PHP, this[VAR_CREATE_TAG].json[KEY_LOGIN], KEY_LOGIN);
 		//DBから取得したログイン処理の結果をオブジェクトにまとめて返す
 		return {userId: this[VAR_CREATE_TAG].json.login[ID][STR_TEXT], authority: this[VAR_CREATE_TAG].json.login.authority[STR_TEXT]};
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
		
		//通常ログインであれば
		if(data.createTagState == STATE_NOT_LOGIN) {
			//中途半端に表示されている会員画面ウィンドウを消す
			$(CURRENT_WINDOW)[0].instance.destroy();
			//ユーザが管理者権限ならば
			if(loginResult.authority == ADMIN_AUTHORITY){
				this.url = DIR_ADMIN_PAGE + URL_ADMIN_TOP;
			//通常ログインかつ、ユーザが管理者権限でなければ
			} else if(loginResult.authority != ADMIN_AUTHORITY){
				//会員トップページに遷移する様に設定する
				this.url = CHAR_HASH + DIR_MEMBER_PAGE + URL_MEMBER_TOP;
				//会員トップページへ移動する
				location.href = SHARP + URL_MEMBER_PAGE; 
			}
		}
		
		//ログインボタンが押されたという状態にする
		this.dialogClass.setPushedButtonState(LOGIN_NUM);
		$(this.dialogClass.dom).dialog(CLOSE);	//ログイン成功につきダイアログを閉じる
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
		//入力されたログイン情報を取得する
		var loginInfo = this.getLoginInformation();
		//入力された値が空白かどうかでログイン処理のエラーチェックを行う
		if(commonFuncs.checkEmpty(loginInfo[USER_ID]) ||
				commonFuncs.checkEmpty(loginInfo[KEY_LOGIN_PASSWORD])) {
			//ログイン情報をJSONにセットする
			this.setLoginInformation(loginInfo[USER_ID], loginInfo[KEY_LOGIN_PASSWORD]);
			
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
			//エラーメッセージをアラートで表示する
			alert(errorMessages[ERROR_LOGIN_EMPTY]);
		}
	};

	//ここまでクラス定義
}

//継承の記述
loginDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
loginDialog.prototype.constructor = baseDialog;
