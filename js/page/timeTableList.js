/** ファイル名:timetableList.js
 * 概要　　　:管理者画面 授業詳細タブの時間帯一覧用関数クラス定義のファイル
 * 作成日　:2016.0501
 * 作成者　:T.Masuda
 * 場所　　:js/page/timetableList.js
 */

/** クラス名:timetableList
 * 概要　　　:管理者画面 授業詳細タブの時間帯一覧用関数クラス
 * 引数     :なし
 * 作成日　:2016.0501
 * 作成者　:T.Masuda
 */
function timetableList() {

	/* 関数名:replaceTable
	 * 概要　:テーブルを編集可能になるように調整する。(そのまま出力した場合inputは付けられないため)
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2016.0502
	 * 作成者　:T.Masuda
	 */
	this.replaceTable = function(){
		//時間帯列の作成を行う
		commonFuncs.addTimeTableColumn('.start_time', '.end_time', 'timetableListTable', 4, '.id', true);
		//最小人数列の置換を行う
		commonFuncs.tdReplaceToTextbox('timetableListTable', 'min_students', 'min_students', 'number');
		//最大人数列の置換を行う
		commonFuncs.tdReplaceToTextbox('timetableListTable', 'max_students', 'max_students', 'number');
	}
	
	/* 関数名:callbackEdit
	 * 概要　:編集ボタンのコールバック関数(必ずオーバーライドで内容を定義されたし)
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2016.0409
	 * 作成者　:T.Masuda
	 */
	this.callbackEdit = function(){
		//選択されている行を取得する
		var $selectedRecord = $(SELECTOR_TBODY_TR, $(this.dialog)).filter('.selectRecord');
		//1行以上選択されていたら
		if ($selectedRecord.length > 0){
			//選択されている行を取得する
			var $selectedRecord = $(SELECTOR_TBODY_TR, $(TIME_TABLE_LIST_TAB)).filter('.selectRecord');
			//レコードの更新を行う
			this.updateRecords($selectedRecord);
			//テーブルをリロードする
			$(TIME_TABLE_LIST_TAB)[0].loadTableData('timetableListTable', 1, 1, 1, 1000, '.timetableListOuter');
			//リロードしたテーブルの置換を行う
			this.replaceTable();
		//選択なしであれば
		} else {
			//警告を出す
			alert(MESSAGE_NEED_SELECT_MORE_1_RECORD);
		}
	}
	
	/* 関数名:updateRecords
	 * 概要　:指定したレコードを更新する。(授業時間帯データ)
	 * 引数　:Array records : 更新対象の行HTML
	 * 返却値:なし
	 * 作成日　:2016.0502
	 * 作成者　:T.Masuda
	 */
	this.updateRecords = function(records){
		//タブのcreateTagを取得する
		var create_tag = $(TIME_TABLE_LIST_TAB)[0].create_tag;
		//送信用データを取り出す
		var sendData = create_tag.json.updateTimeTable;
		//結果のメッセージを格納する変数を用意する
		var resultMessage = EMPTY_STRING;
		//each内でクラスインスタンスを使うため、変数に入れておく
		var thisElem = this;
		
		//UPDATE失敗時に例外処理を行う
		try {
			//レコードを走査する
			$(records).each(function(i){
				//送信用データにフォームの値をセットする
				thisElem.setSendData(sendData, this);
				
				//UPDATEを行い成功したか
				if(!parseInt(thisElem.sendQuery(URL_SAVE_JSON_DATA_PHP, sendData).message)) {
					throw new Error(thisElem.makeErrorMessage(records, i));
				}
			});
		} catch (e) {
			//エラーメッセージを通知する
			alert(e);
		}
		
		//処理終了を伝えるダイアログを出す
		commonFuncs.showMessageDialog('授業時間帯更新完了', '授業時間帯の更新が完了しました。');
	}

	/* 関数名:makeErrorMessage
	 * 概要　:エラーメッセージを作成する。更新が成功した対象と失敗した対象を明記する
	 * 引数　:Array records : 更新対象の行HTML
	 *    　:int successCount : 更新が終わった数
	 * 返却値:Strinb : エラーメッセージ
	 * 作成日　:2016.0502
	 * 作成者　:T.Masuda
	 */
	this.makeErrorMessage = function(records, successCount){
		//エラーメッセージを作成していく
		makeErrorMessage(records, successCount)
		//更新成功した行を通知するため、更新した行の時間を改行しながら追記していくための変数を用意
		var successUpdateRecordsTime = EMPTY_STRING;
		//更新に成功した行を走査する
		for (var j = 0; j < successCount; j++) {
			//成功した時間を取り出して追記していく
			successUpdateRecordsTime += JS_EOL + $(records[j]).children('.startEndTime').text();
		}
		
		//更新に成功した行があればその旨の補足文を追記する。なければそのまま空文字となる
		successUpdateRecordsTime = successUpdateRecordsTime != EMPTY_STRING ? '以下の時間帯の更新が完了しています。' + successUpdateRecordsTime : successUpdateRecordsTime; 
		
		//失敗した行の時間帯の文字列を取り出す。成功数が更新対象行のindexと一致するので流用する
		var errorTargetName = $(records[successCount]).children('.startEndTime').text();
		//エラーを投げる
		return errorTargetName + 'の更新に失敗しました。処理を中断いたします。\n' + successUpdateRecordsTime;
	}
	
	/* 関数名:setSendData
	 * 概要　:送信用データを作成する
	 * 引数　:Object sendData : 送信用データのオブジェクト
	 *    　:Element targetRecord : データ取得対象のレコード
	 * 返却値:なし
	 * 作成日　:2016.0502
	 * 作成者　:T.Masuda
	 */
	this.setSendData = function(sendData, targetRecord){
		//ID、最小人数、最大人数をレコードから取得してそれぞれ送信用データにセットしていく
		sendData.value.id = $(targetRecord).children('.id').text();
		sendData.value.min_students = $(targetRecord).children('.min_students').text();
		sendData.value.max_students = $(targetRecord).children('.max_students').text();
	}

}

//継承の記述
timetableList.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
timetableList.prototype.constructor = baseDialog;

