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
		try{
			//ダイアログ内コンテンツの準備を行う
			this.constructionContent();
			//小分けした画面作成用関数をコールする
			this.dispContentsHeader();	//上部
			this.dispContentsMain();	//メイン部分
			this.dispContentsFooter();	//下部
			this.setDialogEvents();		//ダイアログ内のイベントを設定する
		} catch(e){
			//
			throw new failedToDisplayException();
		}
	}

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
			this.customizeJson();	//取得したJSONを加工する
		//例外時処理
		}catch(e){
			//接続エラー例外であれば
			if(e instanceof connectErrorException){
			//DB操作エラー例外であれば
			} else if(e instanceof failedToDBControleException){
			}
		}
	};

	/* 関数名:customizeJson
	 * 概要　:constructionContentで取得したJSONの加工を行う。オーバーライドして定義されたし
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.customizeJson = function(){
		
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

	/* 関数名:setDialogEvents
	 * 概要　:ダイアログのイベントを設定する
	 * 引数　:なし(オーバーライド時に定義する)
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogEvents = function(){
		
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

	/* 関数名:setDialogPosition
	 * 概要　:ダイアログの位置をセットする
	 * 引数　:Object positionObj:位置設定の3つのキーが入ったオブジェクト
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogPosition = function(positionObj){
		//ダイアログの位置を設定する
		this.setDialogOption(POSITION, positionObj);
	}

	/* 関数名:updateJson
	 * 概要　:サーバへクエリを投げる前に、送信するJSONデータを加工する
	 * 引数　:なし(オーバーライド時に編集する)
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.updateJson = function(){
	};
	
	
	/* 関数名:sendQuery
	 * 概要　:DBヘテーブル操作のクエリを投げる
	 * 引数　:String sendUrl:DBへアクセスするアプリケーションのパス
	 * 		:Object sendObj:URLへ送信するデータのオブジェクト
	 * 返却値:Object:DBから取得したデータをオブジェクトで返す
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.sendQuery = function(sendUrl, sendObj){
		//引数のオブジェクトをパースしてJSON文字列にする
		var jsonString = JSON.stringify(sendObj);
		//JSONが無効なものであれば
		if(!commonFuncs.checkEmpty(jsonString)){
			//JSON解析エラー例外を投げる
			throw new jsonFailedToParseException(sendObj);
		}
		var retObj = {};	//返却用の変数を宣言する
		$.ajax({
			url:sendUrl			//PHPのURLを設定する
			,data:{json:JSON.stringify(sendObj)}	//送信データのオブジェクト
			,dataType:"json"	//JSON形式でデータをもらう
			,type:"POST"		//POSTメソッドでHTTP通信する
			//通信成功時の処理
			,success:function(json, status){	//オブジェクトに変換したJSONと通信状態をを返してもらう
				retObj = json;	//通信結果のJSONを取得する
			},
			//通信失敗時の処理
			error:function(xhr, status, error){	//通信結果を返してもらう
				//通信エラー例外を投げる
				throw new connectErrorException(xhr, status, error);
			}
		});
		
		return retObj;
	};
	
	//デフォルトのはい:いいえボタン設定用配列
	this.yesNoButtonArray = [
	                         	{
	                         		//はいボタン
		                        	 text:YES,
		                        	 //クリック時のコールバック関数を設定する
		                        	 click:this.callBackYes
	                         	},
		                         {	//いいえボタン
		                        	 text:NO,
		                        	//クリック時のコールバック関数を設定する
		                        	 click:this.callBackNo
		                         }
	                         ];
	
	/* 関数名:callBackYes
	 * 概要　:ダイアログのはいボタンを押したときのコールバック関数用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.callBackYes = function(){
		$(this).dialog(CLOSE);		//ダイアログを閉じる
	};
	
	/* 関数名:callBackNo
	 * 概要　:ダイアログのいいえボタンを押したときのコールバック関数用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.callBackNo = function(){
		$(this).dialog(CLOSE);		//ダイアログを閉じる
	};
	
	/* 関数名:callBackCancel
	 * 概要　:ダイアログのキャンセルボタンを押したときのコールバック関数用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.callBackCancel = function(){
		$(this).dialog(CLOSE);		//ダイアログを閉じる
	};

	
	
	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する。暫定的に安全性を考えてreturnするようにしました。
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

	/* 関数名:insertFooterContents
	 * 概要　:フッターのコンテンツを作る
	 * 引数　:なし(オーバーライド時に定義する)
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.insertFooterContents = function(){
	}
}

/* クラス名:connectErrorException
 * 概要　:Ajax通信失敗時の例外クラス
 * 引数　:Object xhr:通信結果をまとめたオブジェクト
 * 		:int status:通信ステータスの値
 * 		:String error:エラーテキスト
 * 作成日　:2015.0815
 * 作成者　:T.Masuda
 */
function connectErrorException(xhr, status, error){
	Error.apply(this);	//エラーを起こす
}

/* クラス名:connectErrorException
 * 概要　:Ajax通信失敗時の例外クラス
 * 引数　:Object json:サーバから返ってきたJSONのオブジェクト
 * 		:int status:通信ステータスの値
 * 作成日　:2015.0815
 * 作成者　:T.Masuda
 */
function failedToDBControleException(json, status){
	Error.apply(this);	//エラーを起こす
}

/* クラス名:jsonFailedToParseException
 * 概要　:JSONパース失敗時の例外
 * 引数　:Object json:サーバから返ってきたJSONのオブジェクト
 * 		:int status:通信ステータスの値
 * 作成日　:2015.0815
 * 作成者　:T.Masuda
 */
function jsonFailedToParseException(json){
	Error.apply(this);	//エラーを起こす
}

/* クラス名:failedToDisplayException
 * 概要　:dispContents内で起きたエラーに対する例外
 * 引数　:Object json:サーバから返ってきたJSONのオブジェクト
 * 		:int status:通信ステータスの値
 * 作成日　:2015.0815
 * 作成者　:T.Masuda
 */
function failedToDisplayException(json){
	Error.apply(this);	//エラーを起こす
}

