/* ファイル名:experienceReservedDialog.js
 * 概要　　　:体験レッスン予約希望ダイアログ用クラス
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/experienceReservedDialog.js
 */

/* クラス名:experienceReservedDialog.js
 * 概要　　:体験レッスン予約希望ダイアログ用クラス。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/experienceReservedDialog.js
 */
function experienceReservedDialog(dialog){
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
			this.getJson();	//体験レッスン予約希望ダイアログのJSONを読み込む
			this.getDom();	//体験レッスン予約希望ダイアログのテンプレートHTMLを読み込む
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
		//体験レッスン予約希望ダイアログのJSONを読み込む
		this[VAR_CREATE_TAG].getJsonFile(EXPERIENCE_RESERVED_CONFIRM_DIALOG_JSON);	//予約ダイアログのJSONをい読み込む
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
		//体験レッスン予約希望ダイアログのテンプレートHTMLを取得する
		this[VAR_CREATE_TAG].getDomFile('template/reserved.html');	//タグを作るためにテンプレートのDOMを取得する。
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
		this.setDialogTitle(this.dialogClass.getArgumentDataObject().title);
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
		this.insertDialogContents();
	}

	/* 関数名:insertDialogContents
	 * 概要　:ダイアログのメインのコンテンツを作る
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日:2015.0815
	 * 作成者:T.Masuda
	 */
	this.insertDialogContents = function(){
		//createTagでダイアログに必要なタグを生成する。
		//予約日時の隠しフォーム
		this.create_tag.outputTag(RESERVED_DATE, RESERVED_DATE, CURRENT_DIALOG);
		//注意書き
		this.create_tag.outputTag(RESERVED_SUMMARY, RESERVED_SUMMARY, CURRENT_DIALOG);
		//作品選択
		this.create_tag.outputTag(SPECIAL_CONTRUCT, SPECIAL_CONTRUCT, CURRENT_DIALOG);
		//時限選択
		this.create_tag.outputTag(SPECIAL_SCHEDULE, SPECIAL_SCHEDULE, CURRENT_DIALOG);
		//予約の予備情報
		this.create_tag.outputTag(SUBINFO, SUBINFO, CURRENT_DIALOG);
		//お客様の情報入力欄
		this.create_tag.outputTag(PERSON_INFORMATION, PERSON_INFORMATION, CURRENT_DIALOG);
		//メールの件名の値を格納する隠しフォーム
		this.create_tag.outputTag(MAIL_SUBJECT, MAIL_SUBJECT, CURRENT_DIALOG);
	}

	/* 関数名:setConfig
	 * 概要　:ダイアログの設定を行う
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//確認・キャンセルボタンを配置する
		this.setDialogButtons(this.confirm_cancel);		
		//ダイアログの位置を修正する
		this.setDialogPosition(POSITION_CENTER_TOP);
	}
	
	
	/* 関数名:setCallback
	 * 概要　:ダイアログのイベントコールバックを設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setCallback = function(){
		// 全ての曜日のチェックボックスにチェックする
		commonFuncs.allCheckbox(ALLDAY_CHECKBOX, CHECKBOX_DAYOFWEEK);
		// 全ての週のチェックボックスにチェックする
		commonFuncs.allCheckbox(ALLWEEK_CHECKBOX, CHECKBOX_WEEK);
		//ダイアログを閉じるときは破棄する
		this.dialogClass.setCallbackCloseOnAfterOpen(this.dialogClass.destroy);
	}

	
	/* 関数名:validationForm
	 * 概要　:入力フォームの入力チェックを行う
	 * 引数　:なし
	 * 返却値:Object:入力チェックの結果をオブジェクトにまとめて返す
	 * 作成日　:015.08.16
	 * 作成者　:T.Masuda
	 */
    this.validationForm = function(form){
    	var retObj = {};	//返却用オブジェクトを宣言、空オブジェクトで初期化する
	    //必須入力チェックを行う。
    	retObj[EMPTY_LIST] = commonFuncs.checkEmptyInput(EXPERIENCE_CHECK_FORMS);
        //アルファベット入力だけ行わせるテキストボックス名のリストを格納する配列を宣言する。
    	retObj[ONLY_ALPHABET_LIST] = commonFuncs.checkAllAlphabet(IS_ALPHABET_CHECK_ELEMS_RESERVED_DIALOG);
	    //メールアドレスの再入力が行われているかをチェックする。失敗なら配列に空文字を入れる。
    	retObj[EMAIL_CHECK] = $(SELECTOR_PERSON_MAIL).val() !== $(SELECTOR_PERSON_MAIL_CHECK).val()? true : null;
	    //カウントクラスのテキストボックス(人数)が0以下でないかをチェックする。
    	retObj[NUMBER_LIST] = commonFuncs.numberCheck(SELECTOR_COUNT);	//OKならname属性の値を配列で返す
	    
	    return retObj;
    }
	
	
	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する。
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.17
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		var $form = $(CURRENT_DIALOG);	//フォーム(このパターンではダイアログの本体)を取得する
		var argumentObj = $.extend(true, {}, this[DIALOG_CLASS].getArgumentObject());
		var checkResult = this.validationForm($form);	//フォームの入力チェックを行う
	    // 必須入力項目が皆入力済みであり、英数字しか入力してはいけない項目がOKなら
	    if(commonFuncs.nullCheckInObject(checkResult)) {	//checkResultルートのnull持ちキーがなければOK
	    	
		    //入力確認のものは送信すべきではないので、送信前に前持って無効化する。
	        //対象はメールチェックのテキストボックス
		    $(SELECTOR_PERSON_MAIL_CHECK, $form).attr(DISABLED, DISABLED);
		    //子ダイアログ(確認ダイアログ)に渡すオブジェクトのインプット用データ部分を作成する。以下のデータを結合する
		    $.extend(true, 
		    		argumentObj[DATA_KEY], 							//今のダイアログのargumentObjのdata
		    		//子ダイアログのcloseイベント用データを追加する
		    		{
		    			parentDialog:this.dialogClass.dom,			//今のダイアログのDOM
		    			callback:sendReservedMail,					//予約のメールを送る
		    			message:'入力した内容で体験レッスンの予約希望を送信します。'
		    		}			
		    	);
		    // このダイアログの入力要素を一時的に無効化する。
		    commonFuncs.disableInputs($form);
	    } else {
	        //警告のテキストを作る。
	        var alerts = commonFuncs.makeFailedAlertString(checkResult, EXPERIENCE_CHECK_FORMS_JP_NAME, EXPERIENCE_CHECK_FORMS_ERROR_TEXT);
	        //アラートを出す。
	    	 alert(alerts);
	    }
		
		return argumentObj;	//argumentObjを返してダイアログ作成時の引数にセットする。
	}
	
	/* 関数名:openDialog
	 * 概要　:渡されたURLから新たなダイアログを開く
	 * 引数　:String url:ダイアログのURL
	 * 		:Object argumentObj:ダイアログのインプットデータ、設定データのオブジェクト
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0817
	 * 作成者　:T.Masuda
	 */
	this.openDialog = function(url){
		//argumentObjを生成する
		var argumentObj = this.setArgumentObj();
		
		//フォームデータが取得されていたら体験レッスン希望送信確認ダイアログを開く
		if(commonFuncs.checkEmpty(argumentObj[DATA_KEY][FORM_DATA])){
			//ダイアログのクラスインスタンスを生成する。
			//openイベントはsetArgumentObjでセットしておく
			this.dialogEx = new dialogEx(url, argumentObj);
			//openイベントのコールバック関数をセットする
			this.dialogEx.run();	//ダイアログを開く
		}
	}

	/* 関数名:callbackConfirm
	 * 概要　:ダイアログの確認ボタンを押したときのコールバック関数用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:015.08.22
	 * 作成者　:T.Masuda
	 */
	this.callbackConfirm = function(){
		//確認ダイアログを開く
		this.openDialog(URL_CONFIRM_DIALOG);
	};
	
	/* 関数名:createExperienceReservedMail
	 * 概要　:体験レッスン予約希望メールの本文を作成する
	 * 引数　:Object formObj:フォームデータのオブジェクト
	 * 返却値:String:体験レッスン予約希望メールの本文を返す
	 * 作成日　:015.08.22
	 * 作成者　:T.Masuda
	 */
	this.createExperienceReservedMail = function(formObj){
		var retStr = EMPTY_STRING;	//返却する文字列の変数を宣言する
		
		//フォームのオブジェクトを走査する
		for(key in formObj){
			//日本語の項目名とデータを追加していく。毎回改行する
			retStr += EXPERIENCE_CHECK_FORMS_JP_NAME[key] + ':' + formObj[key] + ESCAPE_KAIGYOU;
		}
		
		return retStr;	//作成した文章を返す
	};

	/* 関数名:sendReservedMail
	 * 概要　:予約メールの送信を行うコールバック用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.22
	 * 作成者　:T.Masuda
	 */
	this.sendReservedMail = function(){
		//ダイアログのクラスインスタンスを取得する
		var dialogClass = this.instance;
		
		//押されたボタンの判定を行う。returnObjに設定されたボタンの値を基準にする
		switch(dialogClass.getPushedButtonState()){
		//はいボタンが押されていたら
			case YES:
				var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
				var formObj = commonFuncs.createFormObject($('form.dialog'));
				//メール本文を作成する
				var mailContent = this.createExperienceReservedMail(formObj);
				//送信するデータをまとめたオブジェクトを作る
				var sendObj = {content:mailContent, subject:formObj.lessonDate, from:formObj.email}
				//予約希望メールを送信する
				var isSend = commonFuncs.sendMail('php/mailSendEntryExperienceReserved.php', sendObj, EXPERIENCE_RESERVED_COMPLETE_MESSAGE);
				
				//メールの送信に成功していたら
				if(isSend){
					//送信完了と共に入力ダイアログを消す
					$(dialogClass.dom).dialog(CLOSE);
				}
				break;	//switch文を抜ける
			//処理を行うボタンが押されていなければ
			default:break;	//そのまま処理を終える
		}
	}
	
	
	//ここまでクラス定義
}

//継承の記述
experienceReservedDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
experienceReservedDialog.prototype.constructor = baseDialog;
