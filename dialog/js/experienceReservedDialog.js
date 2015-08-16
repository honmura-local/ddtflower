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
	
	//送信・キャンセルボタンの配列
	this.send_cancel = [
					{	
						//送信ボタン
						text:STR_SEND_JP,
						//送信ボタンのコールバック関数をセットする
						//予約希望情報送信確認ダイアログを開く
						click:this[DIALOG_BUILDER].openDialog(EXPERIENCE_RESERVED_CONFIRM_DIALOG_URL)
					},
					{
						//閉じるボタン
						text:STR_CLOSE_JP,
						//閉じるボタンのコールバック関数をセットする
						click:$(this).dialog(CLOSE)
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
			create_tag.getDomFile('template/reserved.html');	//タグを作るためにテンプレートのDOMを取得する。
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
		//体験レッスン予約希望ダイアログのJSONを読み込む
		create_tag.getJsonFile(EXPERIENCE_RESERVED_CONFIRM_DIALOG_JSON);	//予約ダイアログのJSONをい読み込む
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

	/* 関数名:dispContentsFooter
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のフッター部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsFooter = function(){
		//送信・キャンセルボタンを配置する
		this.setDialogButtons(this.send_cancel);		
	}

	/* 関数名:setDialogEvents
	 * 概要　:ダイアログのイベントを設定する
	 * 引数　:なし(オーバーライド時に定義する)
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogEvents = function(){
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
	 * 概要　:ダイアログに渡すオブジェクトを生成する。暫定的に安全性を考えてreturnするようにしました。
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.14
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		var $form = $(CURRENT_DIALOG);	//フォーム(このパターンではダイアログの本体)を取得する
		var argumentObj = $.extend(true, {}, this[DIALOG_CLASS].getArgumentObject());
		var checkResult = this.validationForm($form);	//フォームの入力チェックを行う
		var existNull = commonFuncs.nullCheckInObject(checkResult);
	    // 必須入力項目が皆入力済みであり、英数字しか入力してはいけない項目がOKなら
	    if(existNull) {	//checkResultルートのnull持ちキーがなければOK
	    	
		    //入力確認のものは送信すべきではないので、送信前に前持って無効化する。
	        //対象はメールチェックのテキストボックス
		    $(SELECTOR_PERSON_MAIL_CHECK, $form).attr(DISABLED, DISABLED);
		    //フォームデータを生成し、argumentObjにセットする
		    argumentObj[DATA_KEY][FORM_DATA] = commonFuncs.createFormData($form);
		    // このダイアログの入力要素を一時的に無効化する。
		    commonFuncs.disableInputs($form);
		    
		    argumentObj
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
	 * 作成日　:2015.0814
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
	
	//ここまでクラス定義
}

//継承の記述
experienceReservedDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
experienceReservedDialog.prototype.constructor = baseDialog;
