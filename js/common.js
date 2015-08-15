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
	
	/* 関数名:moveNoticeWindows
	 * 概要　:お知らせウィンドウを開くボタン群を移動させる
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.moveNoticeWindows = function(){
		$.when(
		//0ミリ秒後にキャンペーンお知らせ表示ボタンをスライド表示する。
			showRightOutOfDisplayButton('.topicShowCampaign', 0, 3000)
			).then(function(){
				$.when(
					//400ミリ秒後にギャラリーお知らせ表示ボタンをスライド表示する。
					showRightOutOfDisplayButton('.topicShowGallery', 300, 3000)
					).then(function(){
						//900ミリ秒後にブログお知らせ表示ボタンをスライド表示する。
						showRightOutOfDisplayButton('.topicShowBlog', 600, 3000);
				});
		});
	}
	/* 関数名:toggleNoticeWindows
	 * 概要　:お知らせウィンドウを開くボタン群を開閉するイベントを登録する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.toggleNoticeWindows = function(){
		//3つのウィンドウとそれを表示・非表示にするボタンのイベントを登録する。順番にコールして順を整える。
		fadeToggleSet('div.topicShowCampaign', '.topicCampaign', '.topic', 500);
		fadeToggleSet('div.topicShowGallery', '.topicGallery', '.topic', 500);		
		fadeToggleSet('div.topicShowBlog', '.topicBlog', '.topic', 500);
	}
	
	/* 関数名:tableReplaceAndSetClass
	 * 概要　:テーブルを置換し、さらに行に対してクラス属性を付ける
	 * 引数　:string:tableName:テーブル名
	 		string :tableReplaceFunc:テーブル置換関数名
			bool:replaceBool:置換するときにレッスン合計人数がどうかの判定
			string:recordClassName:行につけるクラス属性名
	 * 返却値:なし
	 * 作成日　:2015.08.08
	 * 作成者　:T.Yamamoto
	 * 作成日　:2015.08.14
	 * 作成者　:T.Masuda
	 * 作成者　:dialogExからcommon.jsに移動しました
	 */
	this.tableReplaceAndSetClass = function(tableName, tableReplaceFunc, replaceBool, create_tag, recordClassName) {
		//予約可能授業一覧を置換する
		this.dbDataTableValueReplace(tableName, tableReplaceFunc, replaceBool, create_tag);
		//予約一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
		this.setTableRecordClass(tableName, recordClassName);
	}

	/* 
	 * 関数名:dbDataTableValueReplace
	 * 概要　:データベースから取り出したテーブルについて、値を置換する
	 * 引数　:string:tableName:値を置換する対象のテーブル名
	 		:string:replaceFuncName:置換を行う関数名
	 		:boolean:lessonList:置換するテーブルが授業を一覧で表示する(会員、管理者両方にあてはまる)テーブルであるなら受講人数を使うかどうかの判定
	 		:creatTagInstance:creator:クリエイトタグのインスタンス名
	 * 返却値:なし
	 * 作成日　:2015.07.31
	 * 作成者　:T.Yamamoto
	 * 作成日　:2015.08.15
	 * 作成者　:T.Masuda
	 * 内容　	　:dialogExに対応しました
	 */
	this.dbDataTableValueReplace = function(tableName, replaceFuncName, lessonList, creator) {
		//テーブルを置換が終えるまで画面に表示しなくする
		$(DOT + tableName).hide();
		//時間差で表現するためにsetTimeOutを使う
	//	setTimeout(function(){
			//置換を行うテーブルのデータを取得する
			var tableData = creator.json[tableName][TABLE_DATA_KEY];
			//第三引数がtrueなら授業受講者人数を求めた上で関数を実行する
			if(lessonList) {
				//時間割1限分の生徒の合計人数が入った連想配列を作る
				var timeStudentsCount = getTotalStudentsOfTimeTable(tableData);
				//テーブルの値を置換する
				dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, timeStudentsCount);
			} else {
				//テーブルの値を置換する
				dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, '');
			}
	//	},1);
	}

	
	/* 
	 * 関数名:showElem
	 * 概要　:隠れている要素を表示する
	 * 引数　:string selector:要素のセレクタ
	 * 返却値:なし
	 * 作成日　:2015.07.31
	 * 作成者　:T.Yamamoto
	 */
	this.showElem = function(selector){
		//テーブルを画面に表示する
		$(selector).show();
	}

	/* 
	 * 関数名:dbDataTableReplaceExecute
	 * 概要  :dbから取り出したテーブルについてクライアント側で置換させる
	 * 引数  :
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 */
	this.dbDataTableReplaceExecute = function(tableName, rowData, func, timeTableStudents) {
		// カウンターを作る
		var counter = 0;
		// テーブルの行番号
		var rowNumber = 1;
		// テーブルのすべての行に対してループで値を入れる
		$.each(rowData, function() {
			// テーブルの値を変える関数をコールする
			eval(func)(tableName, rowData, counter, rowNumber, timeTableStudents);
			// 行番号をインクリメントする
			rowNumber++;
			// カウンタ変数をインクリメントする
			counter++;
		});
	}
	
	/* 
	 * 関数名:setTableRecordClass
	 * 概要  :テーブルの最初の行を除くtrタグに対してクラス属性を付ける
	 		これによってアコーディオン機能を実装するための行がどの行なのかを
	 		識別できるようになる
	 * 引数  :tableClassName: 行にクラス属性を付けたいテーブル名
	 		:tableRecordClasssName: 行に新しくつけるクラス名
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.16
	 */
	this.setTableRecordClass = function(tableClassName, tableRecordClasssName) {
		//第一引数のテーブルの1行目を除くtrタグに対して第2引数の名前のクラス属性を付け、行に対する対象を当てやすくする
		$(DOT + tableClassName + TAG_TR).eq(0).siblings().addClass(tableRecordClasssName);
	}	
}