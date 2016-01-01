/* 
 * ファイル名:adminPage.js
 * 概要  :管理者ページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/adminPage.js
 */

/* 
 * 関数名:clickEvent
 * 概要  :クリックイベントを登録する
 * 引数  :clickSelector:クリックされた要素のセレクター。
 		:clickFunc：クリックされたときにコールする関数
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function clickEvent(clickSelector, clickFunc) {
	$(clickSelector).click(function() {
		//コールバック関数の処理を開始する
		clickfunc(this);
	});
}

/* 
 * 関数名:toggleClassClickElement
 * 概要  :クリックした要素に対してクラス属性を付ける
 * 引数  :clickSelector:クリックされた要素のセレクター。
 		:clickFunc：クリックされたときにコールする関数
 * 返却値  :なし
 * 作成者:.Yamamoto
 * 作成日:2015.08.29
 */
function toggleClassClickElement (clickSelector, className) {
	//会員一覧テーブルがクリックされた時にuserSelectクラスをがなければ追加しあるなら消去する
	$(STR_BODY).on(CLICK, clickSelector, function(){
		//userSelectクラスを追加したり消したりする。このクラスがあればユーザが選択されているとみなしてボタン処理を行うことができる
		$(this).toggleClass(className);
	});
}

/* 
 * 関数名:dateMovement
 * 概要  :日付の進退を求めて返す。管理者日ごと授業者一覧の日付の進退の表示で使う
 * 引数  :clickSelector:クリックされた要素のセレクター。
 		:nowDateObject：進退の対象となる日付オブジェクトのデータ
 * 返却値  :nowDateString:進退した日付の結果
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function dateMovement(clickSelector, nowDateObject) {
	//クリックされたクラス名を取得する
	var className = $(clickSelector).attr('class');
	//取得したクラスの名前によって処理を分ける
	switch(className) {
		//クリックされたのが2日前の時、日付を2日前にする
		case 'twoDaysBefore':
		nowDateObject.setDate(nowDateObject.getDate() - 2);
		break;
		//クリックされたのが1日前の時、日付を1日前にする
		case 'oneDayBefore':
		nowDateObject.setDate(nowDateObject.getDate() - 1);
		break;
		//クリックされたのが1日後の時、日付を1日後にする
		case 'oneDayAfter':
		nowDateObject.setDate(nowDateObject.getDate() + 1);
		break;
		//クリックされたのが2日後の時、日付を2日後にする
		case 'twoDayAfter':
		nowDateObject.setDate(nowDateObject.getDate() + 2);
		break;
	}
	//日付が進退した結果を取り出す
	var nowDateString = create_tag.getDateFormatDB(nowDateObject);
	return nowDateString;
}

/* 
 * 関数名:updateDateMovement
 * 概要  :進退の領域をクリックしたときに日付を更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
var updateDateMovement = function(clickSelector, nowDateObject) {
	//日付を更新する
	nowDateString = dateMovement(clickSelector, nowDateObject);
	//jsonに日付の値を入れる
	create_tag.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
	//テーブルをリロードする
	create_tag.tableReload('eachDayReservedInfoTable');
	//日付をタイトルに入れる
	$(DOT + 'dateBelt' + ' p').text(nowDateString);
}

//日ごと予約者一覧共通で使う日付オブジェクト
nowDateObject = new Date();

/* 
 * 関数名:updateDateSearch
 * 概要  :日付検索をクリックした時の処理
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
var updateDateSearch = function () {
	//表示されている日付を更新するために検索する日付のデータを取得する。
	var changeDate = $('.dateInput').val();
	
	//日付文字列を日付のオブジェクトに変換する
	dateObject =  new Date(changeDate);
	
	//無効な日付であれば
	if(dateObject.toString() === "Invalid Date"){
		alert('有効な日付を入力してください。');	//警告を出す
		return nowDateObject;	//処理を中断する
	}
	
	nowDateObject =  dateObject;
	
	//現在表示されている日付を入力された日付で更新する
	$(DOT + 'dateBelt p').text(changeDate)
	//日ごと授業者一覧テーブルをリロードする
	create_tag.eventTableReload('eachDayReservedInfoTable');
	//日付オブジェクトを更新する
	return nowDateObject;
}

/* 
 * 関数名:nowDatePaging
 * 概要  :現在の日付からページング機能を実装する
 * 引数  :clickSelectorParent:クリックボタンのセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.06
 */
function nowDatePaging(clickSelectorParent, creator) {
	//現在時刻のオブジェクトを作る
	var nowDateObject = new Date();
	//日付の文字列を取得する
	var nowDateString = create_tag.getDateFormatDB(nowDateObject);
	//日付をタイトルに入れる
	$(DOT + clickSelectorParent + ' p').text(nowDateString);
	//jsonに日付の値を入れる
	//create_tag.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
	//対象の要素がクリックされたときに日付を進退する
	//clickEvent(DOT + clickSelectorParent + ' a', updateDateMovement);
	$(DOT + clickSelectorParent + ' a').click(function() {
		//コールバック関数の処理を開始する
		updateDateMovement(this, nowDateObject);
	});
	//検索ボタンがクリックされた時に日付を更新する
	$(DOT + 'dateSelect .searchButton').click(function() {
		//日付オブジェクトを更新する
		nowDateObject = updateDateSearch(this);
	});
	//clickEvent(DOT + 'dateSelect .searchButton', updateDateSearch);
}

/* 
 * 関数名:setPermitListFromToDate
 * 概要  :受講承認一覧の検索する日付の範囲をデフォルトでは月の初日から末日に設定する
 * 引数  :なし
 		:なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function setPermitListFromToDate() {
	//今日の日付を取得する
	var today = new Date();
	//今月の初日オブジェクトを取得する
	var monthStartday = new Date(today.getFullYear(), today.getMonth(), 1);
	//今月の初日の日付を取得して、受講承認一覧のfromの部分で使う
	monthStartday = create_tag.getDateFormatDB(monthStartday);
	//今月の末日オブジェクトを取得する
	var monthEndday = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	//今月の末日の日付を取得して、受講承認一覧のtoの部分で使う
	monthEndday = create_tag.getDateFormatDB(monthEndday);
	//受講承認一覧に今月の初日を入れて一覧テーブルを検索するようにする
	create_tag.json.lecturePermitListInfoTable.FromDate.value = monthStartday;
	//受講承認一覧に今月の末日を入れて一覧テーブルを検索するようにする
	create_tag.json.lecturePermitListInfoTable.toDate.value = monthEndday;
	//デフォルトの検索値を分かりやすくするためにfromテキストボックスに月の初日の値を入れる
	$('[name=fromSearach]').val(monthStartday);
	//デフォルトの検索値を分かりやすくするためにtoテキストボックスに月の末日の値を入れる
	$('[name=toSearach]').val(monthEndday);
}

/* 
 * 関数名:searchPermitListInfoTable
 * 概要  :受講承認一覧の検索機能を実装する
 * 引数  :なし
 		:なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function searchPermitListInfoTable() {
	//受講承認の検索ボタンをクリックした時のイベント
	$('.permitListSearch .searchButton').click(function(){
		//検索初めの値を取得する
		var fromDate = $('[name=fromSearach]').val();
		//検索終わりの値を取得する
		var toDate = $('[name=toSearach]').val();
		
		//不正な日付が入力されていたら
		if(commonFuncs.isInvalidDate(new Date(fromDate)) 
				|| commonFuncs.isInvalidDate(new Date(toDate))){
			alert('不正な日付が入力されています。');	//警告を出す
			return;	//処理を終える
		}
		
		//受講承認一覧のcreateTagを取得する
		var lecturePermitList = $('#lecturePermitList')[0].create_tag;
		
		//受講承認一覧の連想配列に検索初めの値を入れる
		lecturePermitList.json.lecturePermitListInfoTable.FromDate.value = fromDate;
		//受講承認一覧の連想配列に検索終わりの値を入れる
		lecturePermitList.json.lecturePermitListInfoTable.toDate.value = toDate;

		//テーブルデータをリセットしておく
		lecturePermitList.json.lecturePermitListInfoTable.tableData = [];
		//DBからデータを取得する
		lecturePermitList.getJsonFile('php/GetJSONArray.php', lecturePermitList.json['lecturePermitListInfoTable'], 'lecturePermitListInfoTable');
		
		//データがあれば
		if (lecturePermitList.json.lecturePermitListInfoTable.tableData.length) {
			//受講承認一覧テーブルを作る
			lecturePermitList.outputNumberingTag('lecturePermitListInfoTable', 1, 4, 1, 15, '.lecturePermitListInfoTableOutsideArea', 'afterReloadPermitListInfoTable', "$('#lecturePermitList')[0].");
		//なければ
		} else {
			//その旨を伝える
			alert('指定した期間内に受講データがありませんでした。');
		}
	});
}

/* 
 * 関数名:getCommodityCostPrice
 * 概要  :受講承認テーブルで個数テキストボックスと備品代テキストボックスの値を掛け合わせた合計を返す
 		:会計テキストボックスの値を自動で変更するために値を取得するための関数
 * 引数  :rowNumber:行の何番目にあるテキストボックスが対象なのかを示す番号
 * 返却値  :commodityCostPrice:備品代の会計テキストボックスに入る値
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function getCommodityCostPrice(rowNumber) {
	//備品代の合計を求めるために購入した備品の価格を取得する
	var sellingPrice = $('.sellingPriceTextbox').eq(rowNumber).val();
	//備品代の合計を求めるために購入した個数を取得する
	var sellNumber = $('.sellNumberTextbox').eq(rowNumber).val();
	//取得した値から備品の合計金額を求める
	var commodityCostPrice = sellingPrice * sellNumber;
	//求めた金額を他でも使えるようにするため、返り値として返す
	return commodityCostPrice;
}

/* 
 * 関数名:setDefaultCommodityCostPrice
 * 概要  :ページの初期読み込み時に会計のデフォルト値を設定する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setDefaultCommodityCostPrice() {
	//会計のデフォルト値を設定するために会計の値を取得する
	var commodityCostPrice = getCommodityCostPrice(0);
	//会計の連想配列にデフォルト値を設定する
	$('.payCashTextbox').val(commodityCostPrice);
}

/* 
 * 関数名:setCommodityCostPrice
 * 概要  :受講承認テーブル会計の値を設定する
 * 引数  :changeSelector:changeイベントを当てるセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setCommodityCostPrice(changeSelector) {
	//備品名、または個数が変化した時に会計の値をセットするイベントを登録する
	$(STR_BODY).on('change', changeSelector, function(){
		//他の行の備品代テキストボックスの値を変更しないために変更されたセレクトボックスが何番目のものなのかを取得する
		var contentSelectNumber = $(changeSelector).index(this);
		//会計のデフォルト値を設定するために会計の値を取得する
		var commodityCostPrice = getCommodityCostPrice(contentSelectNumber);
		//会計のテキストボックスの値を設定する
		$('.payCashTextbox').eq(contentSelectNumber).val(commodityCostPrice);
	});
}

/* 
 * 関数名:setSellingPrice
 * 概要  :受講承認テーブルの備品代を自動でセットする。
 		備品によって値段が異なるので備品名のセレクトボックスの値が変わったときに
 		備品名に対応した値段をテキストボックスに入れる
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setSellingPrice(selectboxParentSelector, textboxParentSelector) {
	//備品名セレクトボックスの値が変更されたときに備品代を変えるイベントを開始する
	//イベントをonで登録しているのは違うページを読み込むときにイベントをoffにしやすくするため
	$(STR_BODY).on(CHANGE, selectboxParentSelector + ' .contentSelect', function(){
		//他の行の備品代テキストボックスの値を変更しないために変更されたセレクトボックスが何番目のものなのかを取得する
		var contentSelectNumber = $(selectboxParentSelector + ' .contentSelect').index(this);
		//選択されているテキストを取得し、備品名を取り出すための値を取り出すために使う
		var contentName = $(selectboxParentSelector + ' .contentSelect').eq(contentSelectNumber).val();
		//備品代の値を取得するための変数を作る
		var sellingPrice;
		//備品idを取り出すための変数を作る
		var commodityKey;
		//取り出した行のデータを数えるためにカウンターを変数を作る
		var counter = 0;
		//行データを変数に入れる
		var rowData = create_tag.json.selectCommodityInf[TABLE_DATA_KEY]
		//取り出したデータの数だけループし、価格を取り出す
		$.each(rowData, function(){
			//取得した備品名と比較するためにループしている備品名を取得する
			var commodityName = rowData[counter].commodity_name;
			//取得した備品名とセレクトボックスの中にあるタグの名前が同じときにその番号を取得する
			if (contentName == commodityName) {
				//備品代をテキストボックスに入れるための番号を取得する
				sellingPrice = create_tag.json.selectCommodityInf[TABLE_DATA_KEY][counter].selling_price;
				//備品idをテキストボックスに入れるための番号を取得する
				commodityKey = create_tag.json.selectCommodityInf[TABLE_DATA_KEY][counter].commodity_key;
			}
			counter++;
		});
		//備品代テキストボックスに備品名に対応した値段を入れる
		$('.sellingPriceTextbox').eq(contentSelectNumber).val(sellingPrice);
		//備品idテキストボックスに備品名に対応した値段を入れる
		$(textboxParentSelector + ' .commodityKeyBox').eq(contentSelectNumber).val(commodityKey);
	});
}

/* 
 * 関数名:setDefaultSellingPrice
 * 概要  :受講承認テーブルの備品代をページ読み込み時に自動でセットする。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setDefaultSellingPrice() {
	//備品代の連想配列にデフォルト値を設定する
	create_tag.json.accordionContent.sellingPrice.sellingPriceTextbox.value = create_tag.json.selectCommodityInf[TABLE_DATA_KEY][0].selling_price;
	//備品idの連想配列にデフォルト値を設定する
	create_tag.json.commodityKeyBox.value = create_tag.json.selectCommodityInf[TABLE_DATA_KEY][0].commodity_key;
}

/* 
 * 関数名:isBuyCommodity
 * 概要  :受講承認の承認ボタンがクリックされた時に備品を購入したかどうかを判定する
 * 引数  :sendReplaceArray
 * 返却値  :resultBool:判定結果
 * 作成者:T.Yamamoto
 * 作成日:2015.07.21
 */
function isBuyCommodity (sendReplaceArray) {
	//備品を購入していたらtrueにする
	var resultBool = true;
	//備品を購入していないときにfalseにする
	if(sendReplaceArray.pay_cash <= 1) {
		resultBool = false;
	}
	return resultBool;
}

/* 
 * 関数名:permitDataUpdate
 * 概要  :受講承認テーブルの承認ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新してする
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function permitDataUpdate(sendReplaceArray, boolRule, trueQueryKey, falseQueryKey) {
	var sendQueryArray = create_tag.choiceSendQueryArray(boolRule, trueQueryKey, falseQueryKey);
	//クエリのデフォルトを取得してあとから元の戻せるようにする
	var defaultQuery = sendQueryArray.db_setQuery;
	//クエリを実行してテーブルの値1行ずつ更新していく
	create_tag.setDBdata(sendQueryArray, sendReplaceArray, '');
	//ループで実行するので置換データ連想配列を初期化する
	sendQueryArray.db_setQuery = defaultQuery;
}

/* 
 * 関数名:loopUpdatePermitLesson
 * 概要  :受講承認テーブルの承認ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新してする
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function loopUpdatePermitLesson() {
	//受講承認の承認ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(STR_BODY).on(CLICK, SELECTOR_DOLECTUREPERMIT_BUTTON, function(){
		
		//チェックが入っているレコードがなければ
		if (!$(SELECTOR_DOLECTUREPERMIT_SELECTED_CHECKBOX).length) {
			alert(ALERT_NEED_SELECT_LECTUREPERMIT_RECORD);
			return;	//処理を終える
		}
		
		//受講承認テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認を行った生徒の方のリストを作る
		var processedList = new Array();
		//序文を追加する
		processedList.push(MESSAGE_RESULT_DOLECTUREPERMIT);
		
		//フォームの追加取得用オブジェクトを作る
		var addAttr = commonFuncs.getAddAttrObject("use_point", "data-diff_point", "diff_point");
		commonFuncs.getAddAttrObject("use_point", "data-classwork_use_point", "classwork_use_point", addAttr);
		commonFuncs.getAddAttrObject("use_point", "data-commodity_use_point", "commodity_use_point", addAttr);
		commonFuncs.getAddAttrObject("use_point", "data-base_point", "base_point", addAttr);

		//validation用の設定オブジェクトを作る
		//use_pointの未定義チェック
		var validateSettings = VALIDATOR.getValidationSettingObject('use_point', 'isUndefined');
		//use_pointの数字チェック
		validateSettings = VALIDATOR.getValidationSettingObject('use_point', 'isNumeric', validateSettings);
		
		//受講承認途中にエラーが出たらそこで打ち切るため、try-catchを利用する
		try{
			//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
			$('.lecturePermitAccordion').each(function() {
				//チェックボックスにチェックが入っているものだけを更新するように条件設定する
				if($('.permitCheckbox').eq(counter+1).prop('checked')) {
						//DBを更新するための値を取得するために置換する連想配列を取得する
						var sendReplaceArray = create_tag.getSendReplaceArray('doLecturePermitInfoTable', counter, 'accordionContent:eq(' + counter + ')', addAttr);
						//取得した値が不正かどうかをチェックする
						VALIDATOR.validate(validateSettings, sendReplaceArray);
						
						//加算ポイントレートを取得する
						var lessonPlusPointRate = create_tag.getUserPlusPointRate('lecturePermitPlusPointRate', parseInt(sendReplaceArray.order_students), sendReplaceArray.lesson_key);
						//受講料から加算ポイントを求める
						sendReplaceArray['lessonPlusPoint'] = create_tag.getUserPlusPoint(sendReplaceArray['user_classwork_cost'], lessonPlusPointRate);
						//備品代から加算ポイントを求める
						sendReplaceArray['commodityPlusPoint'] = create_tag.getCommodityPlusPoint('commodityPlusPoint', sendReplaceArray)
						//受講承認データを更新する
						permitDataUpdate(sendReplaceArray, isBuyCommodity(sendReplaceArray), 'permitLessonContainCommodity', 'permitLessonUpdate');
						//生徒さんの情報をリストに追加していく
						processedList.push(sendReplaceArray.user_name + ' ' +sendReplaceArray.start_time + ' ' + sendReplaceArray.lesson_name + '\n');	
				}
				
				//カウンターをインクリメントする
				counter++;
			});
		//例外処理
		} catch(e){
			//処理件数が0件であれば
			if (counter == 0) {
				processedList = [];		//序文を消す
			}
			//メッセージの先頭を追加する
			processedList.unshift('受講承認処理中にエラーが発生したため受講承認処理を中断しました。\n' + e.message + '\n');
		//必ず行う処理
		} finally {
			alert(processedList.join(''));	//処理を行った生徒さんのリストを表示する
			
			//1件でも処理していたら
			if (counter > 0) {
				//先に既存のテーブルとボタンを消して
				$('.doLecturePermitInfoTable').remove();
				$('.doLecturePermit.normalButton').remove();
				
				//テーブルを更新する
				updateDoLecturePermitTable(create_tag);
			} 
			
		}
	});
}

function updateDoLecturePermitTable (create_tag) {
	//テーブル用JSONをクリアする
	create_tag.json['doLecturePermitInfoTable'].tableData = [];
	// 受講承認テーブル用のJSON配列を取得する
	create_tag.getJsonFile('php/GetJSONArray.php', create_tag.json['doLecturePermitInfoTable'], 'doLecturePermitInfoTable');
	//データがあればテーブルを追加する
	if(!create_tag.json.doLecturePermitInfoTable[TABLE_DATA_KEY].length) {
		return;	//なければ終了する
	}
	
	//受講承認タブのリストテーブル
	create_tag.outputTagTable('doLecturePermitInfoTable', 'doLecturePermitInfoTable', '#doLecturePermit');
	//受講承認のボタン
	create_tag.outputTag('doLecturePermitButton', 'normalButton', '#doLecturePermit');
	//アコーディオンのセレクトボックスにいれるため受講承認の備品名JSON配列を取得する
	create_tag.getJsonFile('php/GetJSONArray.php', create_tag.json['selectCommodityInf'], 'selectCommodityInf');

	//受講承認のテーブルにチェックボックスを追加する
	commonFuncs.addCheckbox('permitCheckboxArea', 'permitCheckbox');
	//受講承認のテーブルを置換する
	commonFuncs.dbDataTableReplaceExecute(DOT + DO_LECTURE_PERMIT_INFO_TABLE, create_tag.json[DO_LECTURE_PERMIT_INFO_TABLE][TABLE_DATA_KEY], DO_LECTURE_PERMIT_INFO_TABLE_REPLACE_FUNC);
	//受講承認のアコーディオンの備品名にセレクトボックスの値をDBから取り出した値で追加する
	create_tag.setSelectboxText(create_tag.json.selectCommodityInf[TABLE_DATA_KEY], create_tag.json.accordionContent.contentCell.contentSelect.contentOption, 'commodity_name');
	//備品代の連想配列にDBから取り出した最初の値をデフォルトで入れる
	setDefaultSellingPrice();
	//受講承認テーブルでアコーディオン機能を実装するために可変テーブルの行にクラス属性を付ける
	commonFuncs.setTableRecordClass('doLecturePermitInfoTable', 'lecturePermitAccordion');
	//受講承認テーブルのアコーディオン機能の中身の行をテーブルに挿入する
	create_tag.insertTableRecord('lecturePermitAccordion', 'accordionContent');
	//アコーディオンのコンテントの中に隠れテキストボックスとして備品idを入れる
	create_tag.outputTag('commodityKeyBox','commodityKeyBox', '.accordionContent');
	//受講承認テーブルのアコーディオン機能の概要の行をテーブルに挿入する
	create_tag.insertTableRecord('lecturePermitAccordion', 'accordionSummary');
	//受講承認テーブルがクリックされた時にアコーディオン機能を実装する
	create_tag.accordionSettingToTable('.lecturePermitAccordion', '.accordionSummary');
	create_tag.accordionSettingToTable('.lecturePermitAccordion', '.accordionContent');
	//受講承認テーブルのチェックボックスですべてのチェックボックスにチェックを入れる関数を実行する
	commonFuncs.allCheckbox('.permitCheckbox:eq(0)', '.permitCheckbox');
	//受講承認の備品名セレクトボックスにvalueを入れる
	create_tag.setSelectboxValueWithName('.contentSelect');
	//受講承認の備品名セレクトボックスが変化したときに備品代が変わるイベントを登録する
	setSellingPrice('.contentCell', '.accordionContent');
	//受講承認テーブルアコーディオンの会計のテキストボックスにデフォルト値を設定する
	setDefaultCommodityCostPrice();
	//受講承認テーブルの会計列を備品名が変化した時に自動でセットする
	setCommodityCostPrice('.contentSelect');
	//受講承認テーブルの会計列を個数が変化した時に自動でセットする
	setCommodityCostPrice('.sellNumberTextbox');
	
	var $activePanel = $('.tabPanel.active', $currentContent);	//現タブパネルを取得する
	// ボタンの見た目をjqueryuiのものにしてデザインを整える
	$('button, .searchButton, input[type="button"]', $activePanel).button();
}

/* 
 * 関数名:loopUpdatePermitLessonList
 * 概要  :受講承認一覧テーブルの更新ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function loopUpdatePermitLessonList() {
	var thisElem = this;
	//受講承認一覧の更新ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(STR_BODY).on(CLICK, '#lecturePermitList .normalButton', function(){
		//受講承認一覧テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認を行った生徒の方のリストを作る
		var processedList = new Array();
		//クエリのキー
		var queryKey = EMPTY_STRING;
		
		//フォームの追加取得用オブジェクトを作る
		var addAttr = commonFuncs.getAddAttrObject("use_point", "data-diff_point", "diff_point");
		
		//受講承認途中にエラーが出たらそこで打ち切るため、try-catchを利用する
		try{
			//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
			$(SELECTOR_LECTUREPERMITLIST_RECORD).each(function() {
					//DBを更新するための値を取得するために置換する連想配列を取得する
					var sendReplaceArray = create_tag.getSendReplaceArray(LECTURE_PERMIT_LIST_INFO_TABLE, counter, 'lecturePermitListRecord:eq(' + counter + ')', commonFuncs.checkEmpty($('input[name="use_point"]').eq(counter).attr('data-diff_point')) ? addAttr : null);
					//受講承認一覧データを更新する
					permitDataUpdate(sendReplaceArray, commonFuncs.checkEmpty(sendReplaceArray.content), 'updatePermitListCommoditySell', 'updatePermitListLesson');
				//カウンターをインクリメントする
				counter++;
			});
		//例外処理
		} catch(e){
			//処理件数が0件であれば
			if (counter == 0) {
				processedList = [];		//序文を消す
			}
			//メッセージの先頭を追加する
			processedList.unshift(ALERT_LECTUREPERMIT_PROCESS_ERROR + e.message + JS_EOL);
		//必ず行う処理
		} finally {
			//テーブルをリロードする。
			create_tag.loadTableData(LECTURE_PERMIT_LIST_INFO_TABLE, START_PAGE_NUM, LECTUREPERMITLIST_TABLE_NUMBERING_MAX, FIRST_DISPLAY_PAGE, LECTUREPERMITLIST_TABLE_MAX_ROWS, SELECTOR_LECTUREPERMITLIST_OUTSIDE, AFTER_RELOAD_LECTUREPERMITINFOLIST_FUNC, GET_LECTUREPERMITLIST_CREATE_TAG);
			//処理件数を処理リストの末尾に追加する
			processedList.push(counter + NOTICE_RECORD_UPDATE_MESSAGE_AND_NUMBER);
			alert(processedList.join(EMPTY_STRING));	//処理を行った生徒さんのリストを表示する
		}
	});
}

/* 
 * 関数名:userListSearch
 * 概要  :管理者 会員一覧の検索機能を有効にする
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function userListSearch() {
//検索ボタンをクリックしたときにテーブルの内容を更新する
	$(STR_BODY).on(CLICK, '.searchUserButton', function() {
		//当該タブのcreateTagを取得する
		var userListCreateTag = $('#userList')[0].create_tag;
		//クエリのデフォルトを取得する
		var defaultQuery = userListCreateTag.json.userListInfoTable.db_getQuery;
		//クエリを変数に入れてクエリ発行の準備をする
		var sendQuery = {db_getQuery:new adminUserSearcher($.extend(true, {}, userListCreateTag.json.userListInfoTable)).execute()}
		userListCreateTag.json.userListInfoTable.tableData = [];	//データを消しておく
		//会員一覧のデータを取り出す
		userListCreateTag.getJsonFile(URL_GET_JSON_ARRAY_PHP, sendQuery, 'userListInfoTable');
		//クエリをデフォルトに戻す
		userListCreateTag.json.userListInfoTable.db_getQuery = defaultQuery;
		//取得した値が0の時のテーブルを作らない
//		if(userListCreateTag.json.userListInfoTable[TABLE_DATA_KEY].length != 0) {
			//ページング機能付きでユーザ情報一覧テーブルを作る
			userListCreateTag.outputNumberingTag('userListInfoTable', 1, 4, 1, 15, '.userListTableOutside', "afterReloadUserListInfoTable", "$('#userList')[0].");
//		}
	});
}

/* 
 * 関数名:jumpToMemberPage
 * 概要  :管理者 会員一覧で選択されているユーザの会員ページに接続する
 * 引数  :String || Element clickTarget : クリックイベントの対象
 * 　　  :String user : 選択中ユーザのセレクタ
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 * 変更者:T.Masuda
 * 変更日:2015.11.01
 * 内容　:セレクタが固定になっていたため調整しました
 */
function jumpToMemberPage(clickTarget, user) {
	//詳細設定ボタンがクリックされたときになり代わりログインを行うかアラートを表示するかのイベントを登録する
	$(STR_BODY).on(CLICK, clickTarget, function(){
		//選択されているユーザの数を変数に入れ、なり代わりログインで選択されている人が1人であるかを判定するのに使う
		var selected = $(user).length;
		//詳細設定ボタンがクリックされた時に選択されている会員の人数が一人の時だけなりかわりログイン処理を行うイベントを登録する
		if(selected == 0 || selected > 1) {
			//選択している
			alert('ユーザを1人だけ選択してください');
		} else {
			//クリックした人でログインするために会員番号を取得する
			var memberId = $(user).children('.id').text();
			//クリックした人でなり代わりログインを行う
			loginInsteadOfMember(memberId);
		}
	});
}

/* 
 * 関数名:loginMemberPageFromAdminPage
 * 概要  :クリックした対象からユーザIDを抽出して会員画面へのログインを行う
 * 引数  :String || Element clickTarget : イベント登録の基点の要素
 * 　　  :String clickTarget : クリックイベントの対象
 * 	　   :String getTarget : ID取得対象のセレクタ
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.11.01
 */
function loginMemberPageFromAdminPage(eventBase, clickTarget, getTarget){
	//対象の要素のクリックイベントコールバックを登録する
	$(eventBase).on('click', clickTarget, function(e){
		var id = $(getTarget, this).text();	//対象からテキスト(ID)を取得する
		loginInsteadOfMember(id);			//取得したIDで会員画面へのログインを行う
	});
}

/* 
 * 関数名:loginInsteadOfMember
 * 概要  :管理者ページから会員に為り変わって会員ページにログインする
 * 引数  :memberId: なり代わりを行うための会員番号
 		:clickSelector クリックしてなり代わりを行うセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function loginInsteadOfMember (memberId) {
	//会員のヘッダー連想配列に会員番号を入れてログインの準備をする
	//create_tag.json.accountHeader.user_key.value = memberId;
	document.cookie = 'otherUserId=' + memberId;	//cookieに会員IDを追加する
	//会員ページを呼び出す。会員画面内では画面遷移の履歴を作らない
	$('.window[name="admin"]')[0].instance.callPage('window/member/page/memberTop.html', null);
}

/* 
 * 関数名:afterReloadPermitListInfoTable
 * 概要  :受講承認一覧がリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.23
 */
function afterReloadPermitListInfoTable() {
	//当該タブのcreateTagを取得する
	var lecturePermitList = $('#lecturePermitList')[0].create_tag;
	//受講承認一覧テーブルの取り出した行にクラス名を付ける
	setTableRecordClass('lecturePermitListInfoTable', 'lecturePermitListRecord');
	//受講承認一覧テーブルの列内を編集する
	commonFuncs.dbDataTableReplaceExecute(DOT + LECTURE_PERMIT_LIST_INFO_TABLE, lecturePermitList.json[LECTURE_PERMIT_LIST_INFO_TABLE][TABLE_DATA_KEY], LECTURE_PERMIT_LIST_INFO_TABLE_REPLACE_FUNC, null, DEFAULT_SHOW_MAX_ROW);
	//受講承認一覧テーブルの料金列をテキストボックスにする
	lecturePermitList.insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxCost', 'replaceTextboxCostCell');
	//受講承認一覧テーブルの使用pt列をテキストボックスにする
	lecturePermitList.insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxUsePoint', 'replaceTextboxUsePointCell');
	//セレクトメニューを列にアウトプットする
	lecturePermitList.outputTag('contentSelect', 'contentSelect', '.appendSelectbox');
	//受講承認のアコーディオンの備品名にセレクトボックスの値をDBから取り出した値で追加する
	lecturePermitList.setSelectboxText(lecturePermitList.json.selectCommodityInf[TABLE_DATA_KEY], lecturePermitList.json.accordionContent.contentCell.contentSelect.contentOption, 'commodity_name');
	
	//セレクトメニューが生成されていたら
	if($('.contentSelect').length){
		//セレクトボックスのvalueを画面に表示されている値にする
		lecturePermitList.setSelectboxValue('.contentSelect', LECTURE_PERMIT_LIST_INFO_TABLE, 'commodity_key', lecturePermitList.json.selectCommodityInf[TABLE_DATA_KEY]);
		//備品販売IDを格納するための隠しフォームを各行にセットする
		lecturePermitList.outputTag('commoditySellId','commoditySellId', '.appendSelectbox');
		//備品セレクトボックスを規定のものにする
		setSelectedCommodity(create_tag);
	}
	
	//受講承認一覧テーブルのテキストボックスにDBから読込んだ値をデフォルトで入れる
	lecturePermitList.setTableTextboxValuefromDB(lecturePermitList.json['lecturePermitListInfoTable'][TABLE_DATA_KEY], create_tag.setInputValueToLecturePermitListInfoTable);
	//置換済みテキストボックスに数値入力のみできるようにする
	$('.lecturePermitListInfoTable .replaceTextbox').attr({
        onkeydown:"return controllInputChar(event);"	//数値のみ入力できるように関数を登録
	});
}

/* 
 * 関数名:setSelectedCommodity
 * 概要  :備品セレクトメニューの選択をDBの値に変更する。また、対象に備品IDをセットする
 * 引数  :createTag create_tag : createTagクラスインスタンス
 * 　　  :int showMaxNum : 表示する最大行数
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.11.08
 */
function setSelectedCommodity(create_tag, showMaxNum){
	
	var pagenum = 1;					//ページ番号
	
	//showMaxNumが入力されていない場合
	if (!commonFuncs.checkEmpty(showMaxNum)) { 
		showMaxNum = DEFAULT_SHOW_MAX_ROW;	//デフォルトの値を使う
	}
	
	//ナンバリングを検出する
	if ($('.numbering li').length){
		//ナンバリングがある場合は選択済みのものの値を取得してページ番号として利用する
		pagenum = parseInt($('.numbering .select:visible').text());
	}
	
	//表示するレコードの起点の値を算出する
	var startNum = (pagenum - 1) * showMaxNum;
	//表示するレコードの最後の番号を算出する
	var endNum = startNum + showMaxNum;
	
	//リストのレコードを走査する
	$('.lecturePermitListRecord').each(function(i){
		//セレクトメニューが行内にあれば
		if($('.contentSelect', this).length){
			//セレクトメニューをDBの値のものを選択した状態にする
			$('.contentSelect' ,this).val(create_tag.json[LECTURE_PERMIT_LIST_INFO_TABLE][TABLE_DATA_KEY][startNum + i]['commodity_key']);
			//備品販売IDもセットする
			$('.commoditySellId' ,this).val(create_tag.json[LECTURE_PERMIT_LIST_INFO_TABLE][TABLE_DATA_KEY][startNum + i]['id']);
		}
	});
}

/* 
 * 関数名:afterReloadMailMagaTable
 * 概要  :メルマガテーブルがリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.22
 */
function afterReloadMailMagaTable() {
	//メルマガの内容列に対して150文字以上の内容は画面には表示しないようにする。テキストボックスにはすべての値が反映される
	cutString('.mailMagaContent', '150');
	//メルマガテーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
	commonFuncs.setTableRecordClass('mailMagaTable', 'targetMailMagazine');
}

/* 
 * 関数名:afterReloadUserListInfoTable
 * 概要  :管理者ユーザ一覧テーブルに対してdom作成後の処理を行う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function afterReloadUserListInfoTable() {
	//会員一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
	commonFuncs.setTableRecordClass('userListInfoTable', 'targetUser');
}

/* 
 * 関数名:getSendPersonInfo
 * 概要  :管理者ユーザ一覧で通常メールボタン、またはお知らせボタンでメッセージを送る人の情報を取得する
 * 引数  :selector:buttonSelector:クリックしたときにダイアログを開くためのボタンのセレクター
		string:sendType:お知らせとして送信するか、メールとして送信するかを識別するための文字列
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function getSendPersonInfo() {
	//メールに送信するためのデータ配列を作る
	var sendToPersonList = [],	//送信先宛先人一覧
	sendToList = [],			//送信先宛先一覧
	userNumberList = [];		//送信先会員番号一覧
	//選択されているレコードの数だけループする
	$(SEL_SELECT_USER).each(function() {
		//選択されたユーザの情報を配列に入れていく
		commonFuncs.textPushArray(this, sendToPersonList, SEL_USER_NAME);	//名前
		commonFuncs.textPushArray(this, sendToList, SEL_MAIL_ADDRESS);		//メールアドレス
		commonFuncs.textPushArray(this, userNumberList, SEL_ID);			//会員番号
		
	});
	//取得した結果を返すために連想配列に入れる
	var sendPersonInfo = {
		name:sendToPersonList,			//送信先宛先人一覧
		mail:sendToList,				//送信先アドレス一覧
		memberNumber:userNumberList		//会員番号
	};
	return sendPersonInfo;
}

/* 
 * 関数名:adminMessageCreate
 * 概要  :管理者ユーザ一覧で通常メールボタン、またはお知らせボタンでメッセージを作るためのダイアログを表示する
 * 引数  :selector:buttonSelector:クリックしたときにダイアログを開くためのボタンのセレクター
		string:sendType:お知らせとして送信するか、メールとして送信するかを識別するための文字列
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function adminMessageCreate(buttonSelector, sendType) {
	//お知らせボタンをクリックでメール送信ダイアログを作る
	$(STR_BODY).on(CLICK, buttonSelector, function() {
		//選択されているユーザの数を変数に入れ、ユーザが選択されていればメール送信処理を開始する
		var selected = $(SEL_SELECT_USER).length;
		//会員一覧から送信するメールの対象となる人が1人以上選択されているなら送信ダイアログを開く
		if(selected <= UNSELECTED_USER) {
			//アラートメッセージをだしてメール送信対象が1人以上選択することを警告する
			alert(TEXT_ERROR_SELECT_USER);
		} else {
			//メッセージを送信するための情報を取得する
			var sendMailData = getSendPersonInfo();
			// ダイアログを開くための情報とメール情報を結合する
			$.extend(true, sendMailData, {sendType:sendType});
			//ダイアログ用オブジェクトを作る。インプットデータをセットする
			var dialogObj = $.extend(true, {}, commonFuncs.getDefaultArgumentObject());
			//タイトルを設定する。
			$.extend(true, dialogObj.config, {title : sendType ==  MAIL? STR_JP_MAIL: STR_JP_ANNOUNCE});
			//送信するデータをオブジェクトに統合する
			$.extend(true, dialogObj.data, sendMailData);
			//メール送信ダイアログを作る
			var mailSendDialog = new dialogEx('dialog/adminMailDialog.html', dialogObj);
			mailSendDialog.setCallbackClose(mailSendDialog.destroy);	//閉じるときのイベントを登録
			mailSendDialog.run();	//主処理を走らせる
		}
	});
}
/* 
 * 関数名:mailMagaSearch
 * 概要  :管理者、メルマガタブの検索機能
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function mailMagaSearch() {

	//メルマガ検索ボタンがクリックされた時に検索機能を行うイベントを開始する
	$(STR_BODY).on(CLICK, '.mailMagaSearchButton', function() {
		
		//メルマガ・アナウンスタブのcreateTagを取得する
		var mailMagaAndAnnounce = $('#mailMagaAndAnnounce')[0].create_tag;
		//ページングの設定を初期化し、作り直しに備える
		create_tag.pagingReset('mailMagaTable');
		//クエリのデフォルトを取得し、編集した後でも戻せるようにする
		var queryDefault = create_tag.json.mailMagaTable.db_getQuery;

		//検索処理のエラーに備えてtry-catch構文を利用する
		try{
			//クエリの文字列の長さを取得してORDER以降の文字列の取得に使う
			var queryStringLength = create_tag.json.mailMagaTable.db_getQuery.length;
			//ORDER BY以降の文字列を取得するため、ORDER 以降の文字列を取得する
			var cutString = create_tag.json.mailMagaTable.db_getQuery.substring(create_tag.json.mailMagaTable.db_getQuery.indexOf("ORDER"),queryStringLength);
			//現在のクエリからORDER BYを取り除き、検索の条件を入れることができるようにする
			create_tag.json.mailMagaTable.db_getQuery = create_tag.json.mailMagaTable.db_getQuery.substring(0,create_tag.json.mailMagaTable.db_getQuery.indexOf("ORDER"));
			//検索の条件をクエリに入れる
			create_tag.addQueryExtractionCondition('mailMagaSearchArea', 'mailMagaTable');
			//クエリに切り取ったORDER BYを付け足す
			create_tag.json.mailMagaTable.db_getQuery += cutString;
			//メルマガのデータを取得して表示する
			create_tag.loadTableData('mailMagaTable', 1, 4, 1, MAILMAGA_TABLE_SHOW_NUMBER, '.mailMagaTableOutside', 'afterReloadMailMagaTable');
		//例外処理ブロック
		} catch (e) {
			//エラー発生を伝える
			alert('検索処理でエラーが発生しました。時間をおいてお試しください。');
		//必ず行う処理
		} finally {
			//クエリをデフォルトに戻す
			create_tag.json.mailMagaTable.db_getQuery = queryDefault;
		}
	});
}

/* 
 * 関数名:setMailMagaSendContent
 * 概要  :メルマガのテーブルをクリックしたときにクリックされた行の内容を
 		メルマガ送信のテキストボックスに入れる
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function setMailMagaSendContent() {

	//クリック対象となっているメルマガテーブルの行をクリックしたときにタイトルや内容を自動でセットするイベントを登録する
	$('.mailMagaAndAnnounce').on(CLICK, '.targetMailMagazine', function() {

		//メルマガ・アナウンスタブのcreateTagを取得する
		var mailMagaAndAnnounce = $('#mailMagaAndAnnounce')[0].create_tag;
		//クリックされたのが何番目の行であるかを取得し、メルマガのタイトルや内容を取り出すのに使う
		var targetNumber = $('.targetMailMagazine').index(this);
		
		//ページャの番号を取得する
		var pager = $('.mailMagaPagingArea .numbering .select').text();
		//ページャの番号-1の値を取得する
		var pageNum = commonFuncs.checkEmpty(pager) && !isNaN(pager)  ? parseInt(pager) - 1 : 0;
		//JSON内での記事の番号を取得する
		var targetNumberFix = pageNum * MAILMAGA_TABLE_SHOW_NUMBER + targetNumber;
		
		//取得した番号をもとにメルマガのタイトルや内容などの情報を取得し、連想配列に入れる
		var targetInf = mailMagaAndAnnounce.json.mailMagaTable[TABLE_DATA_KEY][targetNumberFix];
		//取得した連想配列をテキストボックスにセットする
		commonFuncs.setObjectValue(targetInf, '.mailMagaAndAnnounceArea');
	});
}

/* 
 * 関数名:mailMagaSendConfirm
 * 概要  :メルマガ送信の内容を取得して、メルマガ送信ダイアログを作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function mailMagaSendConfirm() {
	
	//送信ボタンがクリックされたときにメール送信イベントを開始する
	$(STR_BODY).on(CLICK, '.messageButtonArea .sendButton', function() {

		//タイトル、または本文が空であれば
		if(!commonFuncs.checkEmpty($('.messageTitleTextbox').val()) 
				|| !commonFuncs.checkEmpty($('.messageTextarea').val())){
			//空白があるという警告を出して
			alert('タイトル、または本文のいずれかが空白になっています。入力を行ってください。');
			return;		//処理を終える
		}
		
		//ダイアログ用オブジェクトを作る
		var dialogObj = commonFuncs.createBasicComfirmDialogObject(sendMailMaga, '送信確認', '入力した内容を送信します。');
		//インプットデータ用オブジェクトにメルマガ・アナウンスタブのcreateTagをセットする
		dialogObj.data.create_tag = $('#mailMagaAndAnnounce')[0].create_tag;
		//メルマガ送信ダイアログを作る
		var mailmagazineSendDialog = new dialogEx('dialog/confirmDialog.html', dialogObj);
		mailmagazineSendDialog.run();	//ダイアログを表示する
	});
}

/* 
 * 関数名:sendMailMaga
 * 概要  :メルマガの送信を行う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.11.08
 */
function sendMailMaga() {

	//はいボタンが押されていたら
	if(this.instance.getPushedButtonState() == YES){
		
		//メルマガタブのcreateTagを取得する
		var create_tag = this.instance.getArgumentDataObject().create_tag;
		//メルマガを送信するための値をテキストボックスから取得する
		var data = commonFuncs.getInputData('.mailMagaAndAnnounceArea');
		var sendObject = {									//送信するデータのオブジェクト
				//DB保存用クエリ
				db_setQuery : create_tag.json.insertMailMagazine.db_setQuery
				,subject:data.magazine_title	//タイトル
				,content:data.magazine_content	//本文
				,type :data.magazine_type		//メルマガの種別
				,school_key : data.school_key	//校舎キー
		}

		//DBにメルマガの内容を保存する。成功していれば送信処理に移る
		if (new baseDialog().sendQuery(URL_SAVE_JSON_DATA_PHP, sendObject)) {
			$.ajax({					//PHPにメール用データを渡すAjax通信
				url:SEND_MAILMAGA_PHP			//PHPのURLを設定する
				,data:sendObject	//送信データのオブジェクト
				,dataType:"json"	//JSON形式でデータをもらう
				,type:"POST"		//POSTメソッドでHTTP通信する
				,async : false		//同期通信を行う
				,cache : false		//通信結果をキャッシュしない
				,success:function(json){		//通信成功時
					//送信結果を伝える
					alert('メルマガの送信を行いました。\n送信結果は以下の通りになります。\n\n送信成功 : ' + json.sendCount + '件\n送信失敗 : ' + json.failCount + '件\nアドレスなし : ' + json.noAddressCount + '件');
					//メルマガテーブルをリフレッシュする
					create_tag.loadTableData('mailMagaTable', 1, 4, 1, 15, '.mailMagaTableOutside', 'afterReloadMailMagaTable', "$('#mailMagaAndAnnounce')[0].");
				}
				//通信失敗時
				,error:function(xhr, status, error){
					//送信失敗と再操作要求の旨を伝える
					alert(SEND_MAILMAGA_FAIL_HALF);
				}
			});
		//DBへの保存失敗時
		} else {
			//失敗の旨を伝える
			alert(SEND_MAILMAGA_FAIL_ALL);
		}
		
	}
}

/* 
 * 関数名:resetMailMageSendContent
 * 概要  :削除ボタンがクリックされた時にメルマガの送信内容のテキストボックスの中身を削除する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function resetMailMageSendContent() {
//削除ボタンがクリックされたとき、テキストボックスの中身も空白にする
	$(STR_BODY).on(CLICK, ".messageButtonArea .deleteButton", function(){
		//メッセージ内容テキストエリアの中身を空にする
		$('.mailMagaAndAnnounceArea textarea').text('');
	});
}
