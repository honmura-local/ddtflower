/** ファイル名:common.js
 * 概要　　　:汎用関数クラス定義のファイル
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:js/common.js
 */

/** クラス名:common
 * 概要　:汎用関数クラス
 * 引数	:なし
 * 設計者:H.Kaneko
 * 作成日:2015.0813
 * 作成者:T.Masuda
 */
function common(){
	
	/** クラス名:theFunc
	 * 概要　:コピペ用関数
	 * 引数	:なし
	 * 作成日:2015.0813
	 * 作成者:T.Masuda
	 */
	this.theFunc = function(){
		
	}

	/*
	 * 関数名:checkEmpty
	 * 引数  :var target:空白チェックを行う対象
	 * 戻り値:boolean:判定結果を返す
	 * 概要  :引数に指定された変数やオブジェクトが空でないかをチェックする
	 * 作成日:2015.08.13
	 * 作成者:T.M
	 */
	this.checkEmpty = function(target){
		//判定対象の中身がundefined、null、空文字のいずれかであればfalseを返す。
		return target === void(0) || target == null || target == EMPTY_STRING ? false: true;
	}

	/*
	 * 関数名:getScriptFile
	 * 引数  :String scriptUrl:JSファイルのパス
	 * 戻り値:boolean:JSファイル取得の成否を返す
	 * 概要  :JSファイルを取得してそのまま展開する
	 * 作成日:2015.08.14
	 * 作成者:T.M
	 */
	this.getScriptFile = function(scriptUrl){
		$.ajax({							//Ajax通信でJSファイルを読み込む
			//以下、errorまでAjax通信の設定
			url:scriptUrl,					//ファイルパス
			dataTYpe:"script",				//JSファイルを取得する設定
			async:false,					//同期通信
			success:function(sc){			//通信成功時
				console.log("got script");	//成功判定を変数に入れる
			},
			error:function(a,b,c){			//通信失敗時
				//失敗のログを出す
				console.log(GET_SCRIPT_FAIL_MESSAGE_FRONT + scriptUrl + PARENTHESES_REAR);
			}
		});
	}

	/* 関数名:callOpenDialog
	 * 概要　:ダイアログが開いたときのコールバック関数openDialogをコールする。
	 * 		:ダイアログのcloseイベントのコールバック関数には基本的にこれをセットする
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.callOpenDialog = function(){
		//openDialog関数を実行する
		this.dialogBuilder.dispContents();
	}
}