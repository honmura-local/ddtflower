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
 * 引数  :String targetKey : 日付格納先のキー
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.3.19
 */
function setPermitListFromToDate(targetKey) {
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
	create_tag.json[targetKey].fromDate.value = monthStartday;
	//受講承認一覧に今月の末日を入れて一覧テーブルを検索するようにする
	create_tag.json[targetKey].toDate.value = monthEndday;
	//デフォルトの検索値を分かりやすくするためにfromテキストボックスに月の初日の値を入れる
	$('[name=fromSearach]').val(monthStartday);
	//デフォルトの検索値を分かりやすくするためにtoテキストボックスに月の末日の値を入れる
	$('[name=toSearach]').val(monthEndday);
}

/* 
 * 関数名:searchPermitListInfoTable
 * 概要  :受講承認一覧の検索機能を実装する
 * 引数  :String createTagTarget : createTagを取得する先のDOMセレクタ
 * 		:String targetTable : 処理対象テーブル
 * 		 int startPage:表示する1つ目のナンバリングの数
 * 		 int displayPageMax:表示するナンバリングの最大数
 * 		 int displayPage:表示するテーブルのページ番号
 * 		 int pageNum:1ページに表示するレコード数。
 * 		 String targetArea:DOM追加先のセレクタ。
 * 		 String callback:実行させたいコードの文字列
 * 		 String button : 検索のトリガーとなるボタンのセレクタ
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 * 内容　:引数を追加して他のテーブルでも使えるようにしました。
 */
function searchPermitListInfoTable(
		createTagTarget
		,targetTable
		,startPage
		,displayPageMax
		,displayPage
		,pageNum
		,targetArea
		,callback
		,button
	) {
	//受講承認の検索ボタンをクリックした時のイベント
	$(button).click(function(){
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
		var searchCreateTag = $(createTagTarget)[0].create_tag;
//		var lecturePermitList = $('#lecturePermitList')[0].create_tag;

		//受講承認一覧の連想配列に検索初めの値を入れる
		searchCreateTag.json[targetTable].fromDate.value = fromDate;
		//受講承認一覧の連想配列に検索終わりの値を入れる
		searchCreateTag.json[targetTable].toDate.value = toDate;

		//テーブルデータをリセットしておく
		searchCreateTag.json[targetTable].tableData = [];
		//DBからデータを取得する
		searchCreateTag.getJsonFile('php/GetJSONArray.php', searchCreateTag.json[targetTable], targetTable);
		
		//データがあれば
		if (searchCreateTag.json[targetTable].tableData.length) {
			//受講承認一覧テーブルを作る
			searchCreateTag.outputNumberingTag(targetTable, startPage, displayPageMax, displayPage, pageNum, targetArea, callback, "$('" + createTagTarget + "')[0].");
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
	$(SELECTOR_DOLECTUREPERMIT_BUTTON).on(CLICK, function(){
		//チェックが入っているレコードがなければ
		if (!$(LECTUREPERMIT_SELECTED_RECORD).length) {
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
		
		//当該画面のcreateTagを取得する
		var create_tag = $('#doLecturePermit')[0].create_tag;
		
		//受講承認途中にエラーが出たらそこで打ち切るため、try-catchを利用する
		try{
			//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
			$('.doLecturePermitInfoTable tr:not(:first)').each(function() {
				//選択されているものだけを更新するように条件設定する
				if(commonFuncs.checkEmpty($('.doLecturePermitInfoTable tr:not(:first)').eq(counter).attr('class')) && $('.doLecturePermitInfoTable tr:not(:first)').eq(counter).attr('class').indexOf('selectRecord') != -1) {
						// DBを更新するための値を取得するために置換する連想配列を取得する
						var sendReplaceArray = create_tag.getSendReplaceArray('doLecturePermitInfoTable', counter, 'doLecturePermitInfoTable tr:not(:first):eq(' + counter + ')');
						console.log(sendReplaceArray);
						console.log(validateSettings);
						//取得した値が不正かどうかをチェックする
						VALIDATOR.validate(validateSettings, sendReplaceArray);
						
						//加算ポイントレートを取得する
						var lessonPlusPointRate = create_tag.getUserPlusPointRate('lecturePermitPlusPointRate', parseInt(sendReplaceArray.order_students), sendReplaceArray.lesson_key);
						// ユーザの所持ポイント退避
						var userGetPoint = sendReplaceArray['get_point'];
						// 受講料から加算ポイントを求める
						var userClassworkCost = sendReplaceArray['user_classwork_cost'];
						var get_point = create_tag.getUserPlusPoint(userClassworkCost, lessonPlusPointRate);
						sendReplaceArray['get_point'] = get_point;
						// 支払い金額、使用ポイント計算(ポイントは授業料、備品代の双方に対して消費できる)
						var usePoint = sendReplaceArray['use_point'];
						if (userGetPoint * 1 < usePoint * 1) {
							throw new Error("使用ポイント(" + usePoint + ")が所持ポイント(" + userGetPoint + ")を超えています");
						}
						var classworkUsePoint = usePoint;
						var commodityUsePoint = usePoint - userClassworkCost;
						if (commodityUsePoint > 0) {
							classworkUsePoint = userClassworkCost;
						} else {
							commodityUsePoint = 0;
						}
						sendReplaceArray['pay_price'] = userClassworkCost - classworkUsePoint;
						sendReplaceArray['pay_cash'] = sendReplaceArray['pay_price'] - commodityUsePoint;
						
						sendReplaceArray['classwork_use_point'] = classworkUsePoint;
						sendReplaceArray['commodity_use_point'] = commodityUsePoint;
						//備品代から加算ポイントを求める
						//受講承認データを更新する
						permitDataUpdate(sendReplaceArray, isBuyCommodity(sendReplaceArray), 'permitLessonUpdate', 'permitLessonUpdate');
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

			//1件でも処理していたら
			if (counter > 0) {
				alert(processedList.join(''));	//処理を行った生徒さんのリストを表示する
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
	//一旦テーブルを削除する
	$('.doLecturePermitInfoTable').remove();
	//テーブル用JSONをクリアする
	create_tag.json['doLecturePermitInfoTable'].tableData = [];
	//今日の日付を取得し、データ検索の対象の日時としてJSONにセットする
	create_tag.json.doLecturePermitInfoTable.date.value = commonFuncs.getTodayDate();
	// 受講承認テーブル用のJSON配列を取得する
	create_tag.getJsonFile('php/GetJSONArray.php', create_tag.json['doLecturePermitInfoTable'], 'doLecturePermitInfoTable');
	//データがあればテーブルを追加する
	if(create_tag.json.doLecturePermitInfoTable[TABLE_DATA_KEY]) {
		//受講承認タブのリストテーブル
		create_tag.outputTagTable('doLecturePermitInfoTable', 'doLecturePermitInfoTable', '#doLecturePermit');
		//受講承認のボタン
		create_tag.outputTag('doLecturePermitButton', 'normalButton', '#doLecturePermit');
		//アコーディオンのセレクトボックスにいれるため受講承認の備品名JSON配列を取得する
		create_tag.getJsonFile('php/GetJSONArray.php', create_tag.json['selectCommodityInf'], 'selectCommodityInf');
	}

	//受講承認のテーブルを置換する
	commonFuncs.dbDataTableReplaceExecute(DOT + DO_LECTURE_PERMIT_INFO_TABLE, create_tag.json[DO_LECTURE_PERMIT_INFO_TABLE][TABLE_DATA_KEY], DO_LECTURE_PERMIT_INFO_TABLE_REPLACE_FUNC);
	
	//使用ポイントのテキストボックスの設定を書く
	var getPointSettings = {
			type : 'number'	//数値用テキストボックス
			,min : 0			//最低値
			,value : 0			//デフォルト値
			,name : 'use_point'	//使用ポイント
	};
	//使用ポイントのテキストボックスをセットする
	commonFuncs.putTextboxInTd(getPointSettings, 'td.use_point');

}

/* 
 * 関数名:loopUpdatePermitLessonList
 * 概要  :承認一覧テーブルの更新ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新する
 * 引数  :String button : トリガーとなるボタンのセレクタ
 * 　　  :String targetTab : 処理対象のテーブルがあるタブ
 * 　　  :String rowSelector : 処理対象のレコードのセレクタ
 * 　　  :String targetTable : 処理対象のレコードのあるテーブル
 * 　　  :String parentTab : 親のタブのセレクタ
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 * 内容　:処理対象を選択できるように変更しました
 */
function loopUpdatePermitLessonList(button, targetTab, rowSelector, targetTable, parentTab) {
	var thisElem = this;
	//受講承認一覧の更新ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(button).on(CLICK, function(){
		//受講承認一覧テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認を行った生徒の方のリストを作る
		var processedList = new Array();
		//クエリのキー
		var queryKey = EMPTY_STRING;
		//受講承認一覧のcreateTagを取得する
		var create_tag = $(targetTab)[0].create_tag;
		
		//フォームの追加取得用オブジェクトを作る
		var addAttr = commonFuncs.getAddAttrObject("use_point", "data-diff_point", "diff_point");
		
		//受講承認途中にエラーが出たらそこで打ち切るため、try-catchを利用する
		try{
			//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
			$(DOT + rowSelector).each(function() {
					//DBを更新するための値を取得するために置換する連想配列を取得する
					var diffPoint = $('input[name="use_point"]').eq(counter).attr('data-diff_point');	// 元の値からの増減値
					var sendReplaceArray = 
						create_tag.getSendReplaceArray(
							targetTable, 
							counter, 
							rowSelector + ':eq(' + counter + ')',
							 commonFuncs.checkEmpty(diffPoint) ? addAttr : null
					);
					//受講承認一覧データを更新する
					permitDataUpdate(sendReplaceArray, commonFuncs.checkEmpty(sendReplaceArray.content), 'updateSellCommodityPermitList', 'updatePermitListLesson');
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
			//createTagから検索日付をとりだす
			var fromDate = create_tag.json[targetTable][KEY_FROM_DATE][VALUE];
			var toDate = create_tag.json[targetTable][KEY_TO_DATE][VALUE];
			//検索日付をオブジェクトにまとめる
			var searchDate = {'fromDate' : fromDate, 'toDate' : toDate}
			
			//テーブルをリロードする。
			//処理件数を処理リストの末尾に追加する
			processedList.push(counter + NOTICE_RECORD_UPDATE_MESSAGE_AND_NUMBER);
			alert(processedList.join(EMPTY_STRING));	//処理を行った生徒さんのリストを表示する
			$(parentTab).easytabs('select', targetTab);
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
	//受講承認一覧テーブルのテキストボックスにDBから読込んだ値をデフォルトで入れる
	lecturePermitList.setTableTextboxValuefromDB(lecturePermitList.json['lecturePermitListInfoTable'][TABLE_DATA_KEY], create_tag.setInputValueToLecturePermitListInfoTable);
	
	//セレクトメニューが生成されていたら
	if($('.contentSelect').length){
		//セレクトボックスのvalueを画面に表示されている値にする
		lecturePermitList.setSelectboxValue('.contentSelect', LECTURE_PERMIT_LIST_INFO_TABLE, 'commodity_key', lecturePermitList.json.selectCommodityInf[TABLE_DATA_KEY]);
		//備品販売IDを格納するための隠しフォームを各行にセットする
		lecturePermitList.outputTag('commoditySellId','commoditySellId', '.appendSelectbox');
		//備品セレクトボックスを規定のものにする
		setSelectedCommodity(lecturePermitList, null, LECTURE_PERMIT_LIST_INFO_TABLE, '.lecturePermitListRecord');
	}
	
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
function setSelectedCommodity(create_tag, showMaxNum, targetTable, targetRowClass){
	
	var pagenum = 1;					//ページ番号
	
	//showMaxNumが入力されていない場合
	if (!commonFuncs.checkEmpty(showMaxNum)) { 
		showMaxNum = DEFAULT_SHOW_MAX_ROW;	//デフォルトの値を使う
	}
	
	//ナンバリングを検出する
	if ($('.numbering li:visible').length){
		//ナンバリングがある場合は選択済みのものの値を取得してページ番号として利用する
		//ページ番号をテキストで取得する
		var pageNumText = $('.numbering .select:visible').text();
		//有効なページ番号が取得できていたら数値に変換する。そうでなければ1ページ目とする
		pagenum = !isNaN(pageNumText) ? parseInt(pageNumText) : 1;
	}
	
	//表示するレコードの起点の値を算出する
	var startNum = (pagenum - 1) * showMaxNum;
	//表示するレコードの最後の番号を算出する
	var endNum = startNum + showMaxNum;
	
	//リストのレコードを走査する
	$(targetRowClass).each(function(i){
		//セレクトメニューが行内にあれば
		if($('.contentSelect', this).length){
			//セレクトメニューをDBの値のものを選択した状態にする
			$('.contentSelect' ,this).val(create_tag.json[targetTable][TABLE_DATA_KEY][startNum + i]['commodity_key']);
			//備品販売IDもセットする
			$('.commoditySellId' ,this).val(create_tag.json[targetTable][TABLE_DATA_KEY][startNum + i]['id']);
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


/* 
 * 関数名:permitSellCommodity
 * 概要  :商品購入承認を行う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function permitSellCommodity() {
	//受講承認の承認ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(SELECTOR_SELLCOMMODITYPERMIT_BUTTON).on(CLICK, function(){
		
		//チェックが入っているレコードがなければ
		if (!$('.sellCommodityPermitInfoTable tr.selectRecord').length) {
			alert(ALERT_NEED_SELECT_LECTUREPERMIT_RECORD);
			return;	//処理を終える
		}

		//商品購入承認テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//商品購入承認を行った生徒の方のリストを作る
		var processedList = new Array();
		//序文を追加する
		processedList.push(MESSAGE_RESULT_SELLCOMMODITYLECTUREPERMIT);
		
		//フォームの追加取得用オブジェクトを作る
		var addAttr = commonFuncs.getAddAttrObject("use_point", "data-diff_point", "diff_point");
		commonFuncs.getAddAttrObject("use_point", "data-commodity_use_point", "commodity_use_point", addAttr);
		commonFuncs.getAddAttrObject("use_point", "data-base_point", "base_point", addAttr);

		//validation用の設定オブジェクトを作る
		//use_pointの未定義チェック
		var validateSettings = VALIDATOR.getValidationSettingObject('use_point', 'isUndefined');
		//use_pointの数字チェック
		validateSettings = VALIDATOR.getValidationSettingObject('use_point', 'isNumeric', validateSettings);
		
		//createTagを取得する
		var scpc =$('#sellCommodityPermit')[0].create_tag;
		
		//商品購入承認途中にエラーが出たらそこで打ち切るため、try-catchを利用する
		try{
			//商品購入承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
			$('.sellCommodityPermitInfoTable tr:not(:first)').each(function() {
				//選択済みレコードであれば
				if(commonFuncs.checkEmpty($(this).attr('class')) && $(this).attr('class').indexOf('selectRecord') != -1){
					// DBを更新するための値を取得するために置換する連想配列を取得する
					var sendReplaceArray = scpc.getSendReplaceArray('sellCommodityPermitInfoTable', counter, 'sellCommodityPermitInfoTable tr:not(:first):eq(' + counter + ')');
					//取得した値が不正かどうかをチェックする
					VALIDATOR.validate(validateSettings, sendReplaceArray);
					// ユーザの所持ポイント退避
					var userGetPoint = sendReplaceArray['get_point'];
					//商品購入時のポイントレート
					var commodityPointrate = 1;
					// 商品代から加算ポイントを求める
					var get_point = Math.ceil(Number(sendReplaceArray.pay_cash) * commodityPointrate / 100);
					sendReplaceArray['get_point'] = get_point;
					// 支払い金額、使用ポイント計算(ポイントは授業料、備品代の双方に対して消費できる)
					var usePoint = sendReplaceArray['use_point'];
					if (userGetPoint * 1 < usePoint * 1) {
						throw new Error("使用ポイント(" + usePoint + ")が所持ポイント(" + userGetPoint + ")を超えています");
					}
					
					//実際の支配額をセットする
					sendReplaceArray['pay_cash'] = sendReplaceArray['pay_price'] - usePoint;
					
					//商品購入承認データを更新する
					permitDataUpdate(sendReplaceArray, isBuyCommodity(sendReplaceArray), 'permitLessonContainCommodity', 'permitLessonContainCommodity');
					//生徒さんの情報をリストに追加していく
					processedList.push(sendReplaceArray.user_name + ' ' + sendReplaceArray.content + ' ' + sendReplaceArray.sell_number + '個 ' + sendReplaceArray.pay_cash + '円' + '\n');	
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
			processedList.unshift('商品購入処理中にエラーが発生したため商品購入承認処理を中断しました。\n' + e.message + '\n');
		//必ず行う処理
		} finally {

			//1件でも処理していたら
			if (counter > 0) {
				alert(processedList.join(''));	//処理を行った生徒さんのリストを表示する
				//タブを開き直してページを更新する
				$('#permitTab').easytabs('select', '#sellCommodityPermit');
			} 
			
		}
	});
}

/* 
 * 関数名:loopUpdatesellCommodityList
 * 概要  :商品購入承認一覧のレコードを更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function loopUpdatesellCommodityList() {
	var thisElem = this;
	//受講承認一覧の更新ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$('#commodityPermitList .normalButton').on(CLICK, function(){
		//受講承認一覧テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認を行った生徒の方のリストを作る
		var processedList = new Array();
		//クエリのキー
		var queryKey = EMPTY_STRING;
		//承認一覧のcreateTagを取得する
		var create_tag = $(SELECTOR_PERMITLIST_TAB)[0].create_tag;
		
		//フォームの追加取得用オブジェクトを作る
		var addAttr = commonFuncs.getAddAttrObject("use_point", "data-diff_point", "diff_point");
		
		//受講承認途中にエラーが出たらそこで打ち切るため、try-catchを利用する
		try{
			//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
			$(SELECTOR_LECTUREPERMITLIST_RECORD).each(function() {
					//DBを更新するための値を取得するために置換する連想配列を取得する
					var diffPoint = $('input[name="use_point"]').eq(counter).attr('data-diff_point');	// 元の値からの増減値
					var sendReplaceArray = 
						create_tag.getSendReplaceArray(
							SELLCOMMODITY_PERMIT_LIST_INFO_TABLE, 
							counter, 
							'sellCommodityListRecord:eq(' + counter + ')',
							 commonFuncs.checkEmpty(diffPoint) ? addAttr : null
					);
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
			//createTagから検索日付をとりだす
			var fromDate = create_tag.json[LECTURE_PERMIT_LIST_INFO_TABLE][KEY_FROM_DATE][VALUE];
			var toDate = create_tag.json[LECTURE_PERMIT_LIST_INFO_TABLE][KEY_TO_DATE][VALUE];
			//検索日付をオブジェクトにまとめる
			var searchDate = {'fromDate' : fromDate, 'toDate' : toDate}
			
			//処理件数を処理リストの末尾に追加する
			processedList.push(counter + NOTICE_RECORD_UPDATE_MESSAGE_AND_NUMBER);
			alert(processedList.join(EMPTY_STRING));	//処理を行った生徒さんのリストを表示する
			//テーブルをリロードする。
			$('#permitListTab').easytabs('select', '#sellCommodityPermitList' );
		}
	});
}

/* 
 * 関数名:afterReloadSellCommodityPermitListInfoTable
 * 概要  :商品購入承認一覧がリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function afterReloadSellCommodityPermitListInfoTable() {
	//当該タブのcreateTagを取得する
	var sellCommodityPermitList = $('#sellCommodityPermitList')[0].create_tag;
	//受講承認一覧テーブルの取り出した行にクラス名を付ける
	setTableRecordClass('sellCommodityPermitListInfoTable', 'sellCommodityPermitListRecord');
	//受講承認一覧テーブルの列内を編集する
	commonFuncs.dbDataTableReplaceExecute(DOT + SELLCOMMODITY_PERMIT_LIST_INFO_TABLE, sellCommodityPermitList.json[SELLCOMMODITY_PERMIT_LIST_INFO_TABLE][TABLE_DATA_KEY], SELLCOMMODITY_PERMIT_LIST_INFO_TABLE_REPLACE_FUNC, null, DEFAULT_SHOW_MAX_ROW);
	//受講承認一覧テーブルの料金列をテキストボックスにする
	sellCommodityPermitList.insertTextboxToTable('sellCommodityPermitListInfoTable', 'replaceTextboxCost', 'replaceTextboxCostCell');
	//受講承認一覧テーブルの使用pt列をテキストボックスにする
	sellCommodityPermitList.insertTextboxToTable('sellCommodityPermitListInfoTable', 'replaceTextboxUsePoint', 'replaceTextboxUsePointCell');
	//セレクトメニューを列にアウトプットする
	sellCommodityPermitList.outputTag('contentSelect', 'contentSelect', '.appendSelectbox');
	//受講承認のアコーディオンの備品名にセレクトボックスの値をDBから取り出した値で追加する
	sellCommodityPermitList.setSelectboxText(sellCommodityPermitList.json.selectCommodityInf[TABLE_DATA_KEY], sellCommodityPermitList.json.accordionContent.contentCell.contentSelect.contentOption, 'commodity_name');
	//受講承認一覧テーブルのテキストボックスにDBから読込んだ値をデフォルトで入れる
	sellCommodityPermitList.setTableTextboxValuefromDB(sellCommodityPermitList.json['sellCommodityPermitListInfoTable'][TABLE_DATA_KEY], create_tag.setInputValueToLecturePermitListInfoTable);
	
	//セレクトメニューが生成されていたら
	if($('.contentSelect').length){
		//セレクトボックスのvalueを画面に表示されている値にする
		sellCommodityPermitList.setSelectboxValue('.contentSelect', LECTURE_PERMIT_LIST_INFO_TABLE, 'commodity_key', sellCommodityPermitList.json.selectCommodityInf[TABLE_DATA_KEY]);
		//備品販売IDを格納するための隠しフォームを各行にセットする
		sellCommodityPermitList.outputTag('commoditySellId','commoditySellId', '.appendSelectbox');
		//備品セレクトボックスを規定のものにする
		setSelectedCommodity(sellCommodityPermitList, null, SELLCOMMODITY_PERMIT_LIST_INFO_TABLE, '.sellCommodityPermitListRecord');
	}
	
	//置換済みテキストボックスに数値入力のみできるようにする
	$('.lecturePermitListInfoTable .replaceTextbox').attr({
        onkeydown:"return controllInputChar(event);"	//数値のみ入力できるように関数を登録
	});
}

/* 
 * 関数名:moveToUserList
 * 概要  :ユーザ情報取得のためにユーザ一覧へ遷移する
 * 引数  :String beforePanel : 遷移前のパネル名
 * 		:String button : ボタンのセレクタ
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function moveToUserList(beforePanel, button) {
	//ボタンにコールバックを登録する
	$(button).on(CLICK, function(){
		//遷移前の画面名を指定したタブのクラスインスタンスにセットする
		$('#adminTab')[0].instance.beforePanel = beforePanel;
		//対象のタブへ遷移する
		$('#adminTab').easytabs('select', '#userList');
	});
}

/*
 * 関数名:returnFromUserList
 * 概要  :ユーザ情報を選択した後前の画面に戻る
 * 引数  :element button : 押されたボタン
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function returnFromUserList(button) {
	//管理者タブから前の画面名を取得する
	var moveTo = $(SELECTOR_ADMIN_TAB)[0].instance.beforePanel;
	//選択済みの行を取得する
	var selectedRecords = $(SELECTED_USER_RECORDS);
	//押されたボタンの値を取得する
	var buttonType = $(this).attr('data-buttontype');
	
	//元の画面に戻る前の処理を行う
	backCallbacks[moveTo](selectedRecords, buttonType);
}

//ユーザ一覧から元画面に戻るときにコールする関数
var backCallbacks = {
		//受講承認
		doLecturePermit : function(records, buttonType){
			//押されたボタンがキャンセルでなければ
			if (buttonType != 0) {
				//受講承認タブのcreateTagを取得する
				var dlpc = $(DO_LECTUREPERMIT_TAB)[0].create_tag;
				//DOMの入れ物を作る
				var recordList = $(TAG_DIV)[0];
				var idList = [];	//ID一覧の入れ物を作る
				
				//元テーブルからID行を取り出す
				$(SELECTOR_DO_LECTURE_PERMIT_INFO_TABLE + ' td.user_key:not(:empty)').each(function(){
					//IDリストにIDを追加していく
					idList.push($(this).text());
				});
				
				//元テーブルのID一覧を作る
				for (var i = 0; i < records.length; i++) {
					//レコードからIDを抽出してJSONにセットする
					dlpc.json.getAdditionalUserForLecturePermit.user_key.value = $(records[i]).children('.id').text();
					
					//IDチェックを始める
					for(var j = 0; j < idList.length; j++) {
						if(idList[j] == dlpc.json.getAdditionalUserForLecturePermit.user_key.value){
							//スルーする
						//どれにも当てはまらなければレコード追加
						} else if(j == idList.length - 1){
							//DBからユーザに対応した受講承認データを取得する
							dlpc.getJsonFile(URL_GET_JSON_ARRAY_PHP, dlpc.json.getAdditionalUserForLecturePermit, 'getAdditionalUserForLecturePermit');
							//受講承認用のDOMを作り入れ物に追加する
							$(recordList).append(creaetLecturePermitRecord(dlpc.json.getAdditionalUserForLecturePermit.tableData[0]));
							//受講承認用JSONデータを追加する
							dlpc.json.doLecturePermitInfoTable.tableData.push(dlpc.json.getAdditionalUserForLecturePermit.tableData[0]);
							break;	//ループをやめる
						}
					}
				}
			}
			
			//作成したレコードを受講承認テーブルに追加する
			$('.doLecturePermitInfoTable').append($('tr', recordList));
			
			//タブのインスタンスを取得する
			var tabInstance = $('#adminTab')[0].instance;
			//タブが切り替わっても元々あったコンテンツを取得し直さない様に一時設定する
			tabInstance.cache = true;
			//元のタブに戻る
			$('#adminTab').easytabs('select', '#lecturePermit')
			//呼び出し画面情報を初期値に戻す
			tabInstance.beforePanel = null;
		},
		//商品購入承認
		sellCommodityPermit : function(records, buttonType){
			//押されたボタンがキャンセルでなければ
			if (buttonType != 0) {
				//商品購入承認画面のcreateTagを取得する
				var scpc = $('#sellCommodityPermit')[0].create_tag;
				//レコードを走査する
				$(records).each(function(){
					//データ作成用のデータをレコードから抽出する
					var recordData = createRecordFromDom(this);
					//元画面に追加するレコード(DOM)を作成する
					var addRecord = creaetSellCommodityPermitRecord(recordData);
					//承認用データを作り追加する
					scpc.json.sellCommodityPermitInfoTable.tableData.push(creaetSellCommodityPermitData(recordData));
					$('.sellCommodityPermitInfoTable tbody').append($('tr', addRecord));
					//TODO.sell_commodityテーブルへINSERTを行う
				});
			}

			//タブのインスタンスを取得する
			var tabInstance = $('#adminTab')[0].instance;
			//タブが切り替わっても元々あったコンテンツを取得し直さない様に一時設定する
			tabInstance.cache = true;
			//元のタブに戻る
			$('#adminTab').easytabs('select', '#lecturePermit')
			//呼び出し画面情報を初期値に戻す
			tabInstance.beforePanel = null;
		}
}


/* 
 * 関数名:creaetLecturePermitRecord
 * 概要  :受講承認用レコードのDOMを作成する
 * 引数  :Object record : 受講承認データ1レコード分 
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function creaetLecturePermitRecord(record) {
	//連番を取得する
	var seqNum = $('.doLecturePermitInfoTable tr:not(:first)').length + 1;
	//返却用のDOMを作成する
	var retDom =
			//行の連番
			$('<table><tr><td>' + seqNum
			//開始〜終了時刻
			+ TD_FROM_REAR + commonFuncs.allDateTime(record)
			//受講人数
			+ TD_FROM_REAR_DISPLAY_NONE + record.order_students
			//授業詳細情報テーブルのID
			+ TD_FROM_REAR_DISPLAY_NONE + record.lesson_key
			//開始時刻
			+ TD_FROM_REAR_DISPLAY_NONE + record.start_time
			//終了時刻
			+ TD_FROM_REAR_DISPLAY_NONE + record.end_time
			//ユーザ名
			+ TD_FROM_REAR + record.user_name
			//ステージ番号
			+ TD_FROM_REAR_DISPLAY_NONE + record.stage_no
			//レベル番号
			+ TD_FROM_REAR_DISPLAY_NONE + record.level_no
			//受講情報テーブルのID
			+ TD_FROM_REAR_DISPLAY_NONE + record.user_classwork_key
			//ユーザID
			+ TD_FROM_REAR_DISPLAY_NONE + record.user_key
			//所持ポイント
			+ TD_FROM_REAR+ record.get_point
			//授業(コース)名
			+ TD_FROM_REAR + record.lesson_name
			//使用ポイントを入力するテキストボックス
			+ '</td><td class="use_point"><input type="number" min="0" name="use_point" onkeydown="return controllInputChar(event);" value="0"></td>'
			+ '<td style="" colspan="">' + record.user_classwork_cost
			+ TD_FROM_REAR_DISPLAY_NONE+ record.school_key + '</td></tr></table>');
	
	//作成したDOMを返す
	return retDom;
}

/* 
 * 関数名:creaetLecturePermitData
 * 概要  :受講承認用データを作成する
 * 引数  :Object record : 受講承認データ1レコード分 
 * 返却値  :object : 受講承認データ
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function creaetLecturePermitData(record) {
	//返却用のDOMを作成する
	var obj =
			{
				//受講人数
				order_students : record.order_students
				//授業詳細情報テーブルのID
				,lesson_key : record.lesson_key
				//開始時刻
				 ,start_time : record.start_time
				//終了時刻
				 ,end_time : record.end_time
				//ユーザ名
				 ,user_name : record.user_name
				//ステージ番号
				 ,stage_no : record.stage_no
				//レベル番号
				 ,level_no : record.level_no
				//受講情報テーブルのID
				 ,user_classwork_key : record.user_classwork_key
				//ユーザID
				 ,user_key : record.user_key
				//所持ポイント
				 ,get_point : record.get_point
				//授業(コース)名
				 ,lesson_name : record.lesson_name
				//使用ポイントを入力するテキストボックス
				 ,use_point : 0
				 ,user_classwork_cost : record.user_classwork_cost
				 ,school_key : record.school_key
			};
	
	//作成したDOMを返す
	return obj;
}

/* 
 * 関数名:creaetSellCommodityPermitRecord
 * 概要  :商品購入承認用レコードのDOMを作成する
 * 引数  :Object record : 受講承認データ1レコード分 
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function creaetSellCommodityPermitRecord(record) {
	var seqNum = $('.sellCommodityPermitInfoTable tr:not(:first)').length + 1;
	//返却用のDOMを作成する
	var retDom =
		//行の連番
		$('<table><tr><td>' + seqNum
				//ユーザ名
				+ '</td><td style="" colspan="">' + record.user_name
				//獲得ポイント
				+ '</td><td style="" colspan="">' + record.get_point
				//商品キー
				+ '</td><td style="display : none" colspan="">' + 0
				//ユーザID
				+ '</td><td style="" colspan="">' + record.user_key
				//商品名
				+ '</td><td style="" colspan="">' + '未選択'
				//個数
				+ '</td><td style="" colspan="">' + 1
				//単価
				+ '</td><td style="" colspan="">' + 0
				//使用ポイント
				+ '</td><td style="" colspan="">' + 0
				//合計金額
				+ '</td><td style="" colspan="">' + 0
				+ '</td></tr></table>');		
	//作成したDOMを返す
	return retDom;
}

/* 
 * 関数名:creaetSellCommodityPermitData
 * 概要  :商品購入承認データを作成する
 * 引数  :Object record : 商品購入承認データ1レコード分 
 * 返却値  :object : 購入承認データ
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function creaetSellCommodityPermitData(record) {
	//返却用のDOMを作成する
	var obj =
		{
			//列の内訳 連番 ユーザ名 所持ポイント 商品ID ユーザID 商品名 数量 単価 使用ポイント 支払額
			'user_name' : record.user_name
			,'get_point' : record.get_point
			,'commodity_key' :0
			,'user_key' : record.user_key
			,'content' : "未選択"
			,'sell_number' : 1
			,'price' : 0
			,'use_point' : 0
			,'pay_price' : 0
		};
	
	//作成したDOMを返す
	return obj;
}

/* 
 * 関数名:createRecordFromDom
 * 概要  :ユーザ一覧の行DOMから販売承認用データを作る
 * 引数  :element record : 商品購入承認データ1レコード分 
 * 返却値  :object : 購入承認データ
 * 作成者:T.Masuda
 * 作成日:2016.03.19
 */
function createRecordFromDom(record){
	//返却するオブジェクトを用意する
	var dataObj = {
		//ユーザ名
		user_name : $('td', record).filter('.user_name').text()
		//ユーザID
		,user_key : $('td', record).filter('.id').text()
		//所持ポイント
		,get_point : $('td', record).filter('.get_point').text()
	}
	
	return dataObj;	//作成したデータを返す
}
