/* 
 * 関数名:setDBdata
 * 概要  :dbに接続し、データの挿入または更新または削除を行う
 * 引数  :object sendQueryJsonArray: DBに接続するためにdb_setQueryを子に持つcreatetagの連想配列
 		:object queryReplaceData: クエリの中で置換するデータが入った連想配列
 		:string successMessage: クエリが成功した時のメッセージ
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.06.27
 */
function setDBdata(sendQueryJsonArray, queryReplaceData, successMessage, createtag) {
	//DBに送信するための連想配列
	var send = {};
	//置換済みであるかどうか判定するためにkey名を一つだけ取り出す
	for(var arrayKey in queryReplaceData) {
		//key名を取り出したらループを回さずに終わらせる
		break;
	}
	//置換済みでなければ置換する
	if(!queryReplaceData[arrayKey].value) {
		send = $.extend(true, {}, sendQueryJsonArray, createtag.replaceValueNode(queryReplaceData))
	//置換済みであれば値をそのまま結合する	
	} else {
		send = $.extend(true, {}, sendQueryJsonArray, queryReplaceData);
	}
	//変更者:T.Yamamoto 日付:2015.06.26 内容:jsondbManagerに送信する値はjson文字列でないといけないので連想配列を文字列にする処理を追加しました。
	var sendJsonString = JSON.stringify(send);
	//Ajax通信を行う
	$.ajax({
		url: URL_SAVE_JSON_DATA_PHP,		//レコード保存のためのPHPを呼び出す
		//予約情報のJSONを送信する
		//変更者:T.Yamamoto 日付:2015.06.26 内容:dataを変数sendから変数sendJsonStringに変更し、送信する値を配列から文字列を送信するように修正しました
		data:{json:sendJsonString},				//送信するデータを設定する
		dataType: STR_TEXT,					//テキストデータを返してもらう
		type: STR_POST,						//POSTメソッドで通信する
		success:function(ret){				//通信成功時の処理
			//受け取ったjson文字列を連想配列にする
			var resultJsonArray = JSON.parse(ret);
			//更新成功であれば
			//変更者:T.Yamamoto 日付:2015.07.06 内容:コメント化しました
			//if(!parseInt(parseInt(ret.message)) && ret.message != "0"){
			//変更者:T.Yamamoto 日付2015.07.17 内容: ループで更新に対応するために第三引数が空白ならアラートを出さない設定をしました
			//第三引数が空白であるならループで更新を行うということなのでアラートを出さない
			if(successMessage != '') {
				//更新した内容が1件以上の時更新成功メッセージを出す
				if(resultJsonArray.message >= 1) {
					alert(successMessage);	//更新成功のメッセージを出す
				//更新失敗であれば
				} else {
					alert(STR_TRANSPORT_FAILD_MESSAGE);	//更新失敗のメッセージを出す
				}
			}
		},
		error:function(xhr, status, error){	//通信失敗時の処理
			//通信失敗のアラートを出す
			alert(MESSAGE_FAILED_CONNECT);
		}
	});
}

/* 
 * 関数名:insertTextboxToTable
 * 概要  :テーブルにテキストボックスを挿入する。
		受講承認テーブルなどでセルの内容をテキストボックスにする時に使う
 * 引数  :string tableClassName 対象テーブルのクラス名
 		string appendDom 追加するdom名
 		string appendTo 追加先セレクター
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.11
 */
function insertTextboxToTable (tableClassName, appendDom, appendTo, createtag) {
	//テキストボックスを挿入するために表示しているセルのテキストを削除する
	$(DOT + tableClassName + ' tr:eq(0) td').removeClass(appendTo);
	//テキストボックス追加先のdomに表示している文字列を空白で初期化する
	$(DOT + appendTo).text('');
	//テキストボックスを追加する
	createTag.outputTag(appendDom, 'replaceTextbox', DOT + appendTo);
}

/* 
 * 関数名:setProfileUpdate
 * 概要  :プロフィール画面で更新ボタンを押されたときにテキストボックスに
 		 入っている値をDBに送信してデータを更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.02
 */
function setProfileUpdate() {
	//更新ボタンが押された時の処理
	$('.updateButton').click(function(){
		//ユーザが入力した値を取得する
		var queryReplaceData = getInputData('memberInfo');
		//ユーザ番号を追加する
		queryReplaceData['userId'] = profileCreator.json.memberHeader.user_key.value;
		//入力項目に不備があったときにエラーメッセージを出す配列を作る
		var updateError = [];
		//メッセージを挿入するための関数を作る
		function erroeMesseageInput (func ,checkTarget, errorMessage) {
			//第一引数の関数を実行して第二引数の文字列をチェックをする
			if(!func(queryReplaceData[checkTarget])) {
				//エラー内容が初めてのときは改行を挟まずにエラーメッセージを表示する
				if(updateError.length == 0) {
					//エラーメッセージを配列に入れる
					updateError.push(errorMessage);
				} else {
					//改行を含めて配列に入れる
					updateError.push('\n' + errorMessage);
				}
			}
		}
		//名前の入力された文字をチェックする
		erroeMesseageInput(checkInputName, 'user_name', '名前に数字や記号が入っています');
		//カナの入力された文字をチェックする
		erroeMesseageInput(checkInputName, 'name_kana', '名前(カナ)に数字や記号が入っています');
		//電話番号の入力された文字をチェックする
		erroeMesseageInput(checkInputPhone, 'telephone', '電話番号に文字や記号が入っています');

		//入力内容エラーがあったときにメッセージを表示する
		if(updateError.length) {
			//配列を結合してエラーメッセージのアラートを出す
			alert(updateError.join(','))
		//入力内容にエラーがなかった時の処理
		} else {
			//データべベースにクエリを発行してデータを更新する
			setDBdata(profileCreator.json.updateUserInf, queryReplaceData, MESSAGE_SUCCESS_PROFILE_UPDATE);
		}
	})
}


/* 
 * 関数名:updatePassword
 * 概要  :パスワード変更画面で更新ボタンを押されたときにテキストボックスに
 		 入っている値をDBに送信してデータを更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.02
 */
function setPasswordUpdate() {
	//更新ボタンが押された時の処理
	$('.updateButton').click(function(){
		//ユーザが入力した値を取得する
		var queryReplaceData = getInputData('postPass');
		//ユーザ番号を追加する
		queryReplaceData['userId'] = passwordCreator.json.memberHeader.user_key.value;
		//新しいパスワードと確認のパスワードが一致すれば登録する
		if(queryReplaceData.newPass === queryReplaceData.password) {
			//データべベースにクエリを発行してデータを更新する
			setDBdata(passwordCreator.json.updatePassword, queryReplaceData, MESSAGE_SUCCESS_PASSWORD_UPDATE);
		} else {
			alert('パスワードが確認と異なります');
		}
		
	});
}

/*
 * 関数名 :addQueryExtractionCondition
 * 概要  　:ボタンがクリックされた時にテーブルの中身を入れ替える時に発行するクエリに抽出条件を追加する
 * 引数  　:element inputDataParent:テキストボックスが入っているdom名
 * 　　　　:string query:テーブル作成のためにDBに送信するクエリ文字列
 		createTag createtag:createTagクラスのインスタンス
 * 戻り値　:createTag createtag:createTagクラスのインスタンス
 * 作成日　:2015.07.03
 * 作成者　:T.Yamamoto
 */
function addQueryExtractionCondition(inputDataParent, queryArrayKey, createtag) {
	var counter = 0;
	//inputタグの数ループする
	$('.' + inputDataParent + ' input[type="text"]').each(function(){
		//入力された値が空白でなければ
		if($(this).val() != "") {
				//入力値を取得する
				var inputData = $(this).val();
				//name属性を所得する
				var attrName = $(this).attr('name');
			//カウンターが0でなければ
			if(counter != 0){
				//追加する変数を作る
				var addString = ' AND ' + attrName + " LIKE '%" + inputData + "%' ";
			} else {
				//追加する変数を作る
				var addString = ' WHERE ' + attrName + " LIKE '%" + inputData + "%' ";
				counter++;
			}
			//クエリに文字を付け加える
			createtag.json[queryArrayKey].db_getQuery += addString;
		}
	});
}

/*
 * 関数名 :replaceTableQuery
 * 概要  　:ボタンがクリックされた時にテーブルの中身を入れ替える時に発行するクエリに抽出条件を追加する
 * 引数  　:element inputDataParent:テキストボックスが入っているdom名
 * 　　　　:string query:テーブル作成のためにDBに送信するクエリ文字列
 		createTag createtag:createTagクラスのインスタンス
 * 戻り値　:createTag createtag:createTagクラスのインスタンス
 * 作成日　:2015.07.03
 * 作成者　:T.Yamamoto
 */
function replaceTableQuery(queryArrayKey, createtag) {
	//置換するための値を取得する
	var replaceValue = $(replaceTableOption[queryArrayKey]['replaceValueDom']).val();
	//置換するものが「全て以外であれば置換する」
	if (replaceValue != '全て') {
		//置換するためのkey名を取得する
		var replaceKey = replaceTableOption[queryArrayKey]['replaceQueryKey'];
		//取得した値をjsonの反映させる
		createtag.json[queryArrayKey][replaceKey]['value'] = replaceValue;
		//クエリをテーマ検索用のものと入れ替える
		createtag.json[queryArrayKey].db_getQuery = createtag.json[queryArrayKey].replace_query;
	//絞込ボタンで「全て」が選択されたときに全ての値を検索するためのクエリを入れる
	} else {
		//全ての値を検索するためのクエリをセットする
		createtag.json[queryArrayKey].db_getQuery = createtag.json[queryArrayKey].allSearch_query;
	}
}


/* 
 * 関数名:nowDatePaging
 * 概要  :現在の日付からページング機能を実装する
 * 引数  :clickSelectorParent:クリックボタンのセレクター
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.06
 */
function nowDatePaging(clickSelectorParent, createtag) {
	//現在時刻のオブジェクトを作る
	var nowDateObject = new Date();
	//日付の文字列を取得する
	var nowDateString = getDateFormatDB(nowDateObject);
	//日付をタイトルに入れる
	$(DOT + clickSelectorParent + ' p').text(nowDateString);
	//jsonに日付の値を入れる
	createtag.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
	//対象の要素がクリックされたときに日付を進退する
	$(DOT + clickSelectorParent + ' a').click(function(){
		//クリックされた番号を取得する
		var className = $(this).attr('class');
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
		//日付を更新する
		nowDateString = getDateFormatDB(nowDateObject);
		//jsonに日付の値を入れる
		createtag.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
		//テーブルをリロードする
		tableReload('eachDayReservedInfoTable', createtag);
		//日付をタイトルに入れる
		$(DOT + clickSelectorParent + ' p').text(nowDateString);
	});
	//検索ボタンがクリックされた時の処理
	$(DOT + 'dateSelect .searchButton').click(function(){
		//表示されている日付を更新するために検索する日付のデータを取得する。
		var changeDate = $('.dateInput').val();
		//現在表示されている日付を入力された日付で更新する
		$(DOT + clickSelectorParent + ' p').text(changeDate)
		//日付オブジェクトを検索された値で更新し、ページングの基準となる値にする
		nowDateObject = new Date(changeDate);
	});
}


/* 
 * 関数名:setTableReloadExecute
 * 概要  :テーブルページング機能を実装する
 * 引数  :tableClassName:テーブルのクラス名
 		:addQueryString:クエリに追加する文字列
 *       defaultQuery:デフォルトのクエリ
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.07
 */
function setTableReloadExecute(tableClassName, addQueryString, defaultQuery, createtag) {
	//クエリに文字列を追加する
	createtag.json[tableClassName].db_getQuery += addQueryString;
	//クエリからテーブルを作る
	tableReload(tableClassName, createtag);
	//クエリを追加前に戻す
	createtag.json[tableClassName].db_getQuery = defaultQuery;
}


/* 
 * 関数名:loginInsteadOfMember
 * 概要  :管理者ページから会員に為り変わって会員ページにログインする
 * 引数  :memberId: なり代わりを行うための会員番号
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function loginInsteadOfMember (memberId, cretetag) {
		//会員のヘッダー連想配列に会員番号を入れてログインの準備をする
		createtag.json.memberHeader.user_key.value = memberId;
		//会員の告知連想配列に会員番号を入れてログインの準備をする
		createtag.json.advertise.user_key.value = memberId;
		//会員の予約中授業テーブル連想配列に会員番号を入れてログインの準備をする
		createtag.json.reservedLessonTable.user_key.value = memberId;
		//会員の受講済み授業テーブル連想配列に会員番号を入れてログインの準備をする
		createtag.json.finishedLessonTable.user_key.value = memberId;
		//会員番号をグローバルな連想配列に入れ、日ごと授業予約やキャンセルで渡せるようにする
		memberInfo = memberId;
		//会員ページを呼び出す
		callPage('memberPage.html')
}


/* 
 * 関数名:setPermitListFromToDate
 * 概要  :受講承認一覧の検索する日付の範囲をデフォルトでは月の初日から末日に設定する
 * 引数  :createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function setPermitListFromToDate(createtag) {
	//今日の日付を取得する
	var today = new Date();
	//今月の初日オブジェクトを取得する
	var monthStartday = new Date(today.getFullYear(), today.getMonth(), 1);
	//今月の初日の日付を取得して、受講承認一覧のfromの部分で使う
	monthStartday = getDateFormatDB(monthStartday);
	//今月の末日オブジェクトを取得する
	var monthEndday = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	//今月の末日の日付を取得して、受講承認一覧のtoの部分で使う
	monthEndday = getDateFormatDB(monthEndday);
	//受講承認一覧に今月の初日を入れて一覧テーブルを検索するようにする
	createtag.json.lecturePermitListInfoTable.FromDate.value = monthStartday;
	//受講承認一覧に今月の末日を入れて一覧テーブルを検索するようにする
	createtag.json.lecturePermitListInfoTable.toDate.value = monthEndday;
	//デフォルトの検索値を分かりやすくするためにfromテキストボックスに月の初日の値を入れる
	$('[name=fromSearach]').val(monthStartday);
	//デフォルトの検索値を分かりやすくするためにtoテキストボックスに月の末日の値を入れる
	$('[name=toSearach]').val(monthEndday);
}


/* 
 * 関数名:logoutMemberPage
 * 概要  :ログアウトボタンを押したときに会員ページからログアウトして通常ページに遷移する
 		:管理者ページからログインした時は管理者のtopページに遷移する
 * 引数  :createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.15
 */
function logoutMemberPage(cretetag) {
	//ログアウトボタンがクリックされた時に処理を行うイベントを登録する
	$(STR_BODY).on(CLICK, '.logoutLink', function(){
		//管理者としてログインしていたなら管理者ページに遷移する
		if (createtag.json.adminHeader) {
			//管理者ページを呼び出し、続けて管理者としての処理をできるようにする
			callPage('adminPage.html');
		//管理者としてログインしていなければ通常ページのトップページに戻る
		} else {
			//通常ページを使いやすくするためにヘッダーを表示するようにする
			$('header').css('display', 'block');
			//通常ページに遷移する(createtagがリセットされる問題があるかも？)
			callPage('index.php');
		}
	});
}


/* 
 * 関数名:insertTableRecord
 * 概要  :テーブルに行を追加する。
 		受講承認のアコーディオン機能実装のために新しく行を挿入するために使う。
 		挿入するdom要素は最初はtdの代わりにdivで構成されていないといけない
 * 引数  :tableRecordClasssName:行に新しくつけるクラス名
 		:addDomClassName:挿入するdom要素のクラス属性名
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.16
 */
function insertTableRecord(tableRecordClasssName, addDomClassName, createtag) {
	//追加するDOMをとりあえずbodyに作る
	createtag.outputTag(addDomClassName, addDomClassName, STR_BODY);
	//後でテーブルの中にdomを移動させるために追加するDOMの子要素を全て取得する
	var addDomChild = $(DOT + addDomClassName).html();
	//取得したDOMのうち、テーブルのセルに適応させるため「div」を「td」に置換する
	addDomChild = addDomChild.replace(/div/g, 'td');
	//とりあえず作っておいたdomをテーブルのtrの後に移動させる。
	$(DOT + tableRecordClasssName).after($(DOT + addDomClassName));
	//追加したDOMのタグをテーブルに適応させるためtrタグに変換する
	$(DOT + addDomClassName).replaceWith('<tr class="' + addDomClassName + '"></tr>');
	//移動させたdomに対して取得していたセルを入れていき、アコーディオン用のテーブル行を完成させる
	$(DOT + addDomClassName).html(addDomChild);
}


/* 
 * 関数名:setSellingPrice
 * 概要  :受講承認テーブルの備品代を自動でセットする。
 		備品によって値段が異なるので備品名のセレクトボックスの値が変わったときに
 		備品名に対応した値段をテキストボックスに入れる
 * 引数  :selectboxParentSelector:セレクトボックスの親のセレクター名
 		textboxParentSelector:テキストボックスの親のセレクター
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setSellingPrice(selectboxParentSelector, textboxParentSelector, cretetag) {
	//備品名セレクトボックスの値が変更されたときに備品代を変えるイベントを開始する
	//イベントをonで登録しているのは違うページを読み込むときにイベントをoffにしやすくするため
	$(STR_BODY).on('change', selectboxParentSelector + ' .contentSelect', function(){
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
		var rowData = createtag.json.selectCommodityInf.table
		//取り出したデータの数だけループし、価格を取り出す
		$.each(rowData, function(){
			//取得した備品名と比較するためにループしている備品名を取得する
			var commodityName = rowData[counter].commodity_name;
			//取得した備品名とセレクトボックスの中にあるタグの名前が同じときにその番号を取得する
			if (contentName == commodityName) {
				//備品代をテキストボックスに入れるための番号を取得する
				sellingPrice = createtag.json.selectCommodityInf.table[counter].selling_price;
				//備品idをテキストボックスに入れるための番号を取得する
				commodityKey = createtag.json.selectCommodityInf.table[counter].commodity_key;
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
	//備品代のデフォルト値を設定するために備品代の最初値を取得する
	var sellingPrice = adminPageCreator.json.selectCommodityInf.table[0].selling_price;
	//備品代の連想配列にデフォルト値を設定する
	adminPageCreator.json.accordionContent.sellingPrice.sellingPriceTextbox.value = sellingPrice;
	//備品代のid値を設定するために備品代idの最初値を取得する
	var commodityKey = adminPageCreator.json.selectCommodityInf.table[0].commodity_key;
	//備品idの連想配列にデフォルト値を設定する
	adminPageCreator.json.commodityKeyBox.value = commodityKey;
}


/* 
 * 関数名:getSendReplaceArray
 * 概要  :可変テーブルで取得した連想配列とユーザがテキストボックスで入力した値の連想配列を結合する。
 		:これによってdb_setQueryで値を置換するときの連想配列が取得できる
 * 引数  :tableClassName:可変テーブルクラス名
 		rowNumber:可変テーブルで取り出す行番号
 		inputDataSelector:ユーザが入力した値を取得するためにinputタグなどの親のセレクター名
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :sendReplaceArray:テーブルと入力データを結合した結果の連想配列
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function getSendReplaceArray(tableClassName, rowNumber, inputDataSelector, createtag) {
	//可変テーブルから連想配列を取得する
	var resultTableArray = createtag.json[tableClassName].table[rowNumber]
	//ユーザが入力した値をDBのクエリに対応したkey名で連想配列で取得する
	var inputDataArray = getInputData(inputDataSelector);
	//取得した連想配列を結合する
	var sendReplaceArray = $.extend(true, {}, resultTableArray, inputDataArray);
	//結合した結果の連想配列を返す
	return sendReplaceArray;
}


/* 
 * 関数名:choiceSendQueryArray
 * 概要  :JSONDBManagerに送信するためのjsonを分岐する
 		:受講一覧の承認ボタンで使うクエリが受講情報のクエリか備品情報のクエリかを振り分けるときに使う
 * 引数  :boolRule:分岐させるための値が入った変数
 		trueQuery:条件がtrueのときに取得するクエリ
 		falseQuery:条件がfalseのときに取得するクエリ
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :resultSendQuery:選択した結果のクエリが入った連想配列
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function choiceSendQueryArray(boolRule, trueQueryArray, falseQueryArray, createtag) {
	//送信するクエリを入れるための変数を作る
	var resultSendQueryArray = {};
	//条件分岐を設定するための値があるかどうかでクエリを決める
	if (boolRule) {
		//trueだった時のクエリを取得する
		resultSendQueryArray = createtag.json[trueQueryArray];
	//条件が合わなかったときに別のクエリを入れる
	} else {
		//falseのときのクエリを取得する
		resultSendQueryArray = createtag.json[falseQueryArray];
	}
	//取得したクエリの結果を返す
	return resultSendQueryArray;
}


/* 
 * 関数名:addUsePointQuery
 * 概要  :既にあるクエリに対して、クエリを付け足す。
 		受講承認でユーザがポイントを使用したときにポイントしようクエリを付け足す
 * 引数  :sendQueryArray:jsondbManagerに渡すためのクエリが入った連想配列
 		sendReplaceArray:DBに更新で渡す値が入った連想配列
 		createTag createtag:createTagクラスのインスタンス
 * 返却値  :resultSendQueryArray
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function addUsePointQuery(sendQueryArray, sendReplaceArray, createtag) {
	//置換するクエリに使用ポイントの値が1以上のとき、ポイントを使うということなのでクエリにポイントしようクエリを付け足す
	if (sendReplaceArray.use_point >= 1) {
		//現状のクエリに使用ポイントのクエリを付け足す
		sendQueryArray.db_setQuery += createtag.json.updateUsePoint.db_setQuery;
	}
	//クエリの結果を返す
	return sendQueryArray;
}

/* 
 * 関数名:afterReloadPermitListInfoTable
 * 概要  :受講承認一覧がリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.23
 */
function afterReloadPermitListInfoTable() {
	//受講承認一覧テーブルの取り出した行にクラス名を付ける
	setTableRecordClass('lecturePermitListInfoTable', 'lecturePermitListRecord');

	//受講承認一覧テーブルの列内を編集する
	lessonTableValueInput('.lecturePermitListInfoTable', adminPageCreator.json.lecturePermitListInfoTable.table, 'callPermitLessonListValue');
	//受講承認一覧テーブルの料金列をテキストボックスにする
	insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxCost', 'replaceTextboxCostCell');
	//受講承認一覧テーブルの使用pt列をテキストボックスにする
	insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxUsePoint', 'replaceTextboxUsePointCell');
	//セレクトボックスを列にアウトプットする
	adminPageCreator.outputTag('contentSelect', 'contentSelect', '.appendSelectbox');
	//セレクトボックスのvalueを画面に表示されている値にする
	setSelectboxValue('.contentSelect');
	//アコーディオンのコンテントの中に隠れテキストボックスとして備品idを入れる
	adminPageCreator.outputTag('commodityKeyBox','commodityKeyBox', '.appendSelectbox');
	//受講承認一覧テーブルのテキストボックスにDBから読込んだ値をデフォルトで入れる
	setTableTextboxValuefromDB(adminPageCreator.json['lecturePermitListInfoTable']['table'], setInputValueToLecturePermitListInfoTable);
}


/*
 * 関数名:finshedLessonTableAfterPaging
 * 概要  :会員トップ、受講済みテーブルでページングボタンがクリックされた時にテーブルの値を置換する処理を行う
 * 引数  :createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function finshedLessonTableAfterPaging(createtag) {
	//ページングがクリックされた時のイベントを登録する
	$(STR_BODY).on(CLICK, '.finishedLessonPagingArea .numbering li', function() {
		//受講済みテーブルを編集が終わるまで表示しなくする
		$('.finishedLessonTable').hide();
		//時間差で表現するためにsetTimeOutを使う
		setTimeout(function(){
			//ページングの処理を行う件数を取得するためにページングの現在のページを取得する
			var nowPageNumber = NUMBER($('.select').text());
			//テーブルの値を編集するループを開始する値を取得する
			var loopStartCount = nowPageNumber * 10;
			//テーブルの値を編集するループを終了する値を取得する
			var loopEndCount = nowPageNumber * 10 + 9;
			//テーブルのデータを取得する
			var tableRow = createtag.json.finshedLessonTable.table;
			//ループで受講済みテーブルを編集する
			for(loopStartCount; loopStartCount<=loopEndCount; loopStartCount++) {
				//テーブルの値を置換する
				callMemberLessonValue('.finishedLessonTable', tableRow, loopStartCount, loopStartCount);
			}
			//受講済みテーブルを表示する
			$('.finishedLessonTable').show();
		},1);
	});
}


/* 
 * 関数名:createMemberFinishedLessonContent
 * 概要  :会員ページの受講済み授業タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createMemberFinishedLessonContent() {
	//受講済み授業の絞り込み領域を作る
	memberPageCreator.outputTag('selectTheme', 'selectTheme', '#finishedLesson');

	//受講済みテーブルページングの一番外側となる領域を作る
	memberPageCreator.outputTag('finishedLessonPagingArea', 'divArea', '#finishedLesson');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	memberPageCreator.outputTag('finishedLessonTableOutside', 'divArea', '.finishedLessonPagingArea');
	// ナンバリング領域を作る
	memberPageCreator.outputTag('numberingOuter','numberingOuter','.finishedLessonPagingArea');
	//メルマガのデータを取り出す
	memberPageCreator.getJsonFile(URL_GET_JSON_ARRAY_PHP, createtag.json['finishedLessonTable'], 'finishedLessonTable');
	//ページング機能付きでメルマガテーブルを作る
	memberPageCreator.outputNumberingTag('finishedLessonTable', 1, 4, 1, 10, '.finishedLessonTableOutside');
	//予約中テーブルのテーブルの値をしかるべき値にする
	lessonTableValueInput('.finishedLessonTable', memberPageCreator.json.finishedLessonTable.table, 'callMemberLessonValue');

	//ページング機能付きで受講済みテーブルを表示する(レコードの表示数が15、ページングの最大値が5)
	// tablePaging('finishedLessonTable', 15, 6);
	//セレクトボックスのvalueを画面に表示されている値にする
	setSelectboxValue('.selectThemebox');
	//絞り込みボタン機能を実装する
	reloadTableTriggerEvent('#finishedLesson .selectThemebox', CHANGE, 'finishedLessonTable', memberPageCreator);
}


/* 
 * 関数名:eventTableReload
 * 概要  :クリックやチェンジイベントで発生するテーブル再読み込み処理をまとめたもの。
		reloadTableTriggerEvent関数内で使い、用途に合わせてテーブルを更新する
 * 引数  :eventButtonParent: イベントが始まる検索ボタンの親要素
         queryArrayKey : クエリが入っている連想配列のkey
         createTag createtag:createTagクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.03
 */
function eventTableReload(reloadTableClassName, inputDataParent, createatag) {
	//クエリ初期状態を保存する
	var queryDefault = createatag.json[reloadTableClassName].db_getQuery;
	//クエリの置換フラグが追記のとき
	if (replaceTableOption[reloadTableClassName].replaceFlag == 'add') {
		//クエリに追記を行う関数を実行する
		addQueryExtractionCondition(inputDataParent, reloadTableClassName);
	//置換フラグが置換のとき
	} else if (replaceTableOption[reloadTableClassName].replaceFlag == 'replace') {
		//クエリの置換を行う関数を実行する
		replaceTableQuery(reloadTableClassName, createtag);
	}
	//テーブルをリロードする
	tableReload(reloadTableClassName, createatag);
	// クエリを最初の状態に戻す
	createatag.json[reloadTableClassName].db_getQuery = queryDefault;
}


/* 
 * 関数名:createAdminPermitLessonContent
 * 概要  :管理者ページの受講承認タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminPermitLessonContent() {
	//受講承認タブのコンテンツ
	//タブ
	adminPageCreator.outputTag('lecturePermitTab', 'tabContainer', '#lecturePermit' );
	//受講承認タブ
	adminPageCreator.outputTag('doLecturePermit','tabInContent', '.lecturePermitTab');
	//受講承認一覧タブ
	adminPageCreator.outputTag('lecturePermitList','tabInContent', '.lecturePermitTab');

	// 受講承認テーブル用のJSON配列を取得する
	adminPageCreator.getJsonFile('php/GetJSONArray.php', adminPageCreator.json['doLecturePermitInfoTable'], 'doLecturePermitInfoTable');
	//受講承認タブのリストテーブル
	adminPageCreator.outputTagTable('doLecturePermitInfoTable', 'doLecturePermitInfoTable', '#doLecturePermit');
	//受講承認のボタン
	adminPageCreator.outputTag('doLecturePermitButton', 'normalButton', '#doLecturePermit');
	//アコーディオンのセレクトボックスにいれるため受講承認の備品名JSON配列を取得する
	adminPageCreator.getJsonFile('php/GetJSONArray.php', adminPageCreator.json['selectCommodityInf'], 'selectCommodityInf');
	//タブを作る
	createTab('.lecturePermitTab');

	//受講承認のテーブルにチェックボックスを追加する
	addCheckbox('permitCheckboxArea', 'permitCheckbox');
	//受講承認に連番を入れる
	lessonTableValueInput('.doLecturePermitInfoTable', adminPageCreator.json.doLecturePermitInfoTable.table, 'callLecturePermitValue');

	//受講承認のアコーディオンの備品名にセレクトボックスの値をDBから取り出した値で追加する
	setSelectboxText(adminPageCreator.json.selectCommodityInf.table, adminPageCreator.json.accordionContent.contentCell.contentSelect.contentOption, 'commodity_name');
	//備品代の連想配列にDBから取り出した最初の値をデフォルトで入れる
	setDefaultSellingPrice();
	//受講承認テーブルでアコーディオン機能を実装するために可変テーブルの行にクラス属性を付ける
	setTableRecordClass('doLecturePermitInfoTable', 'lecturePermitAccordion');
	//受講承認テーブルのアコーディオン機能の中身の行をテーブルに挿入する
	insertTableRecord('lecturePermitAccordion', 'accordionContent');
	//アコーディオンのコンテントの中に隠れテキストボックスとして備品idを入れる
	createtag.outputTag('commodityKeyBox','commodityKeyBox', '.accordionContent');
	//受講承認テーブルのアコーディオン機能の概要の行をテーブルに挿入する
	insertTableRecord('lecturePermitAccordion', 'accordionSummary', adminPageCreator);
	//受講承認テーブルがクリックされた時にアコーディオン機能を実装する
	accordionSettingToTable('.lecturePermitAccordion', '.accordionSummary');
	accordionSettingToTable('.lecturePermitAccordion', '.accordionContent');
	//受講承認テーブルのチェックボックスですべてのチェックボックスにチェックを入れる関数を実行する
	allCheckbox('.permitCheckbox:eq(0)', '.permitCheckbox');
	//受講承認の備品名セレクトボックスにvalueを入れる
	setSelectboxValue('.contentSelect');
	//受講承認の備品名セレクトボックスが変化したときに備品代が変わるイベントを登録する
	setSellingPrice('.contentCell', '.accordionContent', adminPageCreator);
	//受講承認テーブルアコーディオンの会計のテキストボックスにデフォルト値を設定する
	setDefaultCommodityCostPrice();
	//受講承認テーブルの会計列を備品名が変化した時に自動でセットする
	setCommodityCostPrice('.contentSelect');
	//受講承認テーブルの会計列を個数が変化した時に自動でセットする
	setCommodityCostPrice('.sellNumberTextbox');
	//受講承認一覧タブをクリックしたときに受講承認一覧の内容を表示する
	createContentTriggerClick('.tabLink[href="#lecturePermitList"]', createAdminPermitLessonListContent);
	//承認ボタンクリックでデータを更新する
	loopUpdatePermitLesson();
}


/* 
 * 関数名:createAdminPermitLessonListContent
 * 概要  :管理者ページの受講承認一覧タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminPermitLessonListContent() {
	//受講承認一覧の検索領域を作る
	adminPageCreator.outputTag('permitListSearch', 'permitListSearch', '#lecturePermitList');
	//受講承認一覧で今月の初日から末日を検索するのをデフォルトにする
	setPermitListFromToDate(adminPageCreator);
	//受講承認一覧テーブルを作る
	tableReload('lecturePermitListInfoTable', adminPageCreator)
	//受講承認一覧のリスト更新ボタン
	createtag.outputTag('lecturePermitListUpdateButton', 'normalButton', '#lecturePermitList');
	//クリックでテキストボックスにカレンダーを表示する
	//clickCalendar('fromSearach');
	//クリックでテキストボックスにカレンダーを表示する
	//clickCalendar('toSearach');
	//受講承認一覧の検索機能を実装する
	searchPermitListInfoTable();
	//受講承認一覧の備品名にセレクトボックスの値をDBから取り出した値で追加する
	setSelectboxText(adminPageCreator.json.selectCommodityInf.table, adminPageCreator.json.contentSelect.contentOption, 'commodity_name');
	//受講承認の備品名セレクトボックスが変化したときに備品代が変わるイベントを登録する
	setSellingPrice('.lecturePermitListRecord', '.lecturePermitListRecord', adminPageCreator);
	//更新ボタンがクリックされたときにデータを更新するイベントを登録する
	loopUpdatePermitLessonList();
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
		//受講承認一覧の連想配列に検索初めの値を入れる
		adminPageCreator.json.lecturePermitListInfoTable.FromDate.value = fromDate;
		//受講承認一覧の連想配列に検索終わりの値を入れる
		adminPageCreator.json.lecturePermitListInfoTable.toDate.value = toDate;
		//テーブルを更新する
		tableReload('lecturePermitListInfoTable', adminPageCreator);
	});
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
	//受講承認一覧の更新ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(STR_BODY).on(CLICK, '.lecturePermitList .normalButton', function(){
		//受講承認一覧テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
		$('.lecturePermitListRecord').each(function() {
				//DBを更新するための値を取得するために置換する連想配列を取得する
				var sendReplaceArray = getSendReplaceArray('lecturePermitListInfoTable', counter, 'lecturePermitListRecord:eq(' + counter + ')');
				//DBを更新するためのクエリを設定する。行の情報にセレクトボックスがあるなら備品情報更新クエリ、ないなら授業情報更新クエリを設定する
				var sendQueryArray = choiceSendQueryArray(sendReplaceArray.lesson_name == "", 'updatePermitListCommoditySell', 'updatePermitListLesson', adminPageCreator);
				//ユーザがポイントを使用したときにポイント使用のクエリを追加する
				sendQueryArray = addUsePointQuery(sendQueryArray, sendReplaceArray, adminPageCreator);
				//クエリを実行してテーブルの値1行ずつ更新していく
				setDBdata(sendQueryArray, sendReplaceArray, '');
				//ループで実行するので置換データ連想配列を初期化する
				sendReplaceArray = {};
				//ループで実行するので置換データ連想配列を初期化する
				sendQueryArray = {};
			//カウンターをインクリメントする
			counter++;
		});
	});
}


/* 
 * 関数名:getUserPlusPointRate
 * 概要  :管理者　受講承認画面でユーザが加算するポイントを取得する
 * 引数  :plusPointQueryKey	:加算ポイントを発行するためのクエリが入ったkey
 		:lessonStudents		:授業に出席した生徒様の人数
 		:lessonKey			:授業のテーマを表すためのテーマの値(DBのlesson_infテーブルのlesson_key列の値)
 * 返却値  :userPlusPointRate 	:ユーザにプラスポイントの数
 * 作成者:T.Yamamoto
 * 作成日:2015.07.28
 */
function getUserPlusPointRate(plusPointQueryKey, lessonStudents, lessonKey, createtag) {
	//レッスンの加算ポイントを取得するために加算ポイント取得クエリの置換する値となるlesson_keyの値を入れる
	createtag.json[plusPointQueryKey].lesson_key.value = lessonKey;
	//受講ポイントの一覧を取得しどのポイントがユーザに加算されるポイント化を取得する
	createtag.getJsonFile(URL_GET_JSON_ARRAY_PHP, createtag.json[plusPointQueryKey], plusPointQueryKey);
	//加算ポイントについてループして値を走査するためにループの値を取得する
	var loopMaxCount = createtag.json[plusPointQueryKey].table.length;
	//加算ポイントのレートを返すための変数を作る
	var userPlusPointRate;
	//ループでポイントのレートを求める
	for(var loopCount=0; loopCount<loopMaxCount; loopCount++) {
		//テーブルの生徒の数を取得して加算ポイントレートを求めるために使う
		var studentsCount = createtag.json[plusPointQueryKey].table[loopCount].students;
		//受講した生徒の数が加算ポイント以下であるとき、加算ポイントのレートを決める
		if (lessonStudents < studentsCount || lessonStudents == studentsCount || loopCount == (loopMaxCount-1)) {
			//加算ポイントのレートを決定しループを終わらせる
			userPlusPointRate = createtag.json[plusPointQueryKey].table[loopCount].point_rate;
			break;
		}
	}
	return userPlusPointRate;
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
	$(STR_BODY).on(CLICK, '.doLecturePermit .normalButton', function(){
		//受講承認テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
		$('.lecturePermitAccordion').each(function() {
			//チェックボックスにチェックが入っているものだけを更新するように条件設定する
			if($('.permitCheckbox').eq(counter+1).prop('checked')) {
				//DBを更新するための値を取得するために置換する連想配列を取得する
				var sendReplaceArray = getSendReplaceArray('doLecturePermitInfoTable', counter, 'accordionContent:eq(' + counter + ')');
				//加算ポイントレートを取得する
				var lessonPlusPointRate = getUserPlusPointRate('lecturePermitPlusPointRate', sendReplaceArray.students, sendReplaceArray.lesson_key);
				//受講料から加算ポイントを求める
				sendReplaceArray['lessonPlusPoint'] = getUserPlusPoint(sendReplaceArray['user_classwork_cost'], lessonPlusPointRate, adminPageCreator);
				//備品代から加算ポイントを求める
				sendReplaceArray['commodityPlusPoint'] = getCommodityPlusPoint('commodityPlusPoint', sendReplaceArray, adminPageCreator)
				//DBを更新するためのクエリが入った連想配列を取得して更新の準備をする
				var sendQueryArray = choiceSendQueryArray(isBuyCommodity(sendReplaceArray), 'permitLessonContainCommodity', 'permitLessonUpdate', adminPageCreator);
				//ユーザがポイントを使用したときにポイント使用のクエリを追加する
				sendQueryArray = addUsePointQuery(sendQueryArray, sendReplaceArray, adminPageCreator);
				//クエリを実行してテーブルの値1行ずつ更新していく
				setDBdata(sendQueryArray, sendReplaceArray, '');
				//ループで実行するので置換データ連想配列を初期化する
				sendReplaceArray = {};
				//ループで実行するので置換データ連想配列を初期化する
				sendQueryArray = {};
			}
			//カウンターをインクリメントする
			counter++;
		});
	});
}


/* 
 * 関数名:getCommodityPlusPoint
 * 概要  :管理者　受講承認画面でユーザが加算するポイントを取得する
 * 引数  :plusPointQueryKey	:加算ポイントを発行するためのクエリが入ったkey
 		:lessonStudents		:授業に出席した生徒様の人数
 		:lessonKey			:授業のテーマを表すためのテーマの値(DBのlesson_infテーブルのlesson_key列の値)
 * 返却値  :userPlusPointRate 	:ユーザにプラスポイントの数
 * 作成者:T.Yamamoto
 * 作成日:2015.07.28
 */
function getCommodityPlusPoint(plusPointQueryKey, sendReplaceArray, createtag) {
	//DBからデータを取得するために備品のidを連想配列に入れてデータ取得のための準備をする
	createtag.json[plusPointQueryKey].commodity_key.value = sendReplaceArray['commodity_key'];
	//備品の加算ポイントレートを取得するためにDBからデータを取得する
	createtag.getJsonFile(URL_GET_JSON_STRING_PHP, createtag.json[plusPointQueryKey], plusPointQueryKey);
	//備品の加算ポイントレートを変数に入れる
	var commodityPlusPointRate = createtag.json[plusPointQueryKey].get_point.text;
	//加算ポイントを求める
	var plusPoint = getUserPlusPoint(sendReplaceArray['pay_cash'], commodityPlusPointRate, createtag);
	//加算ポイントを返す
	return plusPoint;
}


/* 
 * 関数名:createAdminUserListContent
 * 概要  :管理者ページのユーザ一覧タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminUserListContent() {
	// creator.getJsonFile('php/GetJSONArray.php', creator.json['userListInfoTable'], 'userListInfoTable');
	// ユーザ検索テキストボックス
	adminPageCreator.outputTag('searchUserList', 'searchUserList', '#userList');
	//ユーザ一覧ページングの一番外側となる領域を作る
	adminPageCreator.outputTag('userListPagingArea', 'divArea', '#userList');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	adminPageCreator.outputTag('userListTableOutside', 'divArea', '.userListPagingArea');
	// ナンバリング領域を作る
	adminPageCreator.outputTag('numberingOuter','numberingOuter','.userListPagingArea');
	//会員一覧のデータを取り出す
	adminPageCreator.getJsonFile('php/GetJSONArray.php', adminPageCreator.json['userListInfoTable'], 'userListInfoTable');
	//ページング機能付きでユーザ情報一覧テーブルを作る
	adminPageCreator.outputNumberingTag('userListInfoTable', 1, 4, 1, 15, '.userListTableOutside');
	//会員一覧タブのボタン群れ
	adminPageCreator.outputTag('userListButtons', 'userListButtons', '#userList');
	//会員一覧タブのユーザ検索機能を実装する
	// reloadTableTriggerEvent('.searchUserButton', CLICK, 'userListInfoTable', 'searchUserList');
	//会員一覧の検索の中にあるテキストボックスにフォーカスしているときにエンターキー押下で検索ボタンを自動でクリックする
	enterKeyButtonClick('.adminUserSearch', '.searchUserButton');
	//会員になり替わってログインするために、ユーザ一覧テーブルの会員の行をクリックしたときにクリックした会員で会員ページにログインする
	//loginInsteadOfMember('#userList', '.userListInfoTable tr');
	//会員一覧テーブルがクリックされた時にuserSelectクラスをがなければ追加しあるなら消去する
	$(STR_BODY).on(CLICK, '.userListInfoTable tr', function(){
		//userSelectクラスを追加したり消したりする。このクラスがあればユーザが選択されているとみなしてボタン処理を行うことができる
		$(this).toggleClass('selectRecord');
	});
	//検索ボタンをクリックしたときにテーブルの内容を更新する
	$(STR_BODY).on(CLICK, '.searchUserButton', function() {
		//ページングを作り直すためにページングの設定をリセットする
		pagingReset('userListInfoTable');
		//クエリを変数に入れてクエリ発行の準備をする
		var sendQuery = {db_getQuery:new adminUserSearcher().execute()}
		//クエリのデフォルトを取得する
		var defaultQuery = adminPageCreator.json.userListInfoTable.db_getQuery;
		//会員一覧のデータを取り出す
		adminPageCreator.getJsonFile('php/GetJSONArray.php', sendQuery, 'userListInfoTable');
		//クエリをデフォルトに戻す
		adminPageCreator.json.userListInfoTable.db_getQuery = defaultQuery;
		//取得した値が0の時のテーブルを作らない
		if(adminPageCreator.json.userListInfoTable.table.length != 0) {
			//ページング機能付きでユーザ情報一覧テーブルを作る
			adminPageCreator.outputNumberingTag('userListInfoTable', 1, 4, 1, 15, '.userListTableOutside');
		}
	});

	//詳細設定ボタンがクリックされたときになり代わりログインを行うかアラートを表示するかのイベントを登録する
	$(STR_BODY).on(CLICK, '.userDetail', function(){
		//選択されているユーザの数を変数に入れ、なり代わりログインで選択されている人が1人であるかを判定するのに使う
		var selected = $('.selectRecord').length;
		//詳細設定ボタンがクリックされた時に選択されている会員の人数が一人の時だけなりかわりログイン処理を行うイベントを登録する
		if(selected == 0 || selected > 1) {
			//選択している
			alert('ユーザを1人だけ選択してください');
		} else {
			//クリックした人でログインするために会員番号を取得する
			var memberId = $('.selectRecord').children('.id').text();
			//クリックした人でなり代わりログインを行う
			loginInsteadOfMember(memberId, adminPageCreator);
		}
	});
	
	// メール送信ボタンのクリック
	var doSendMail = function(){
		// TODO 個々にメール送信処理をたす
		alert("送信したつもり");
	};
	$(".createMail").click(function(e) {
		var sd = new SimpleConfirmDialog(
				doSendMail
				,"メールを送信します。よろしいですか?"
		);
		sd._showDialog();
	});
}


/* 
 * 関数名:createAdminLessonDetailContent
 * 概要  :管理者ページの授業詳細タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminLessonDetailContent() {
	//授業詳細タブ内にカレンダ-作る
	adminPageCreator.outputTag('adminCalendar', 'adminCalendar', '#lessonDetail');
	// 講座のカレンダーを作り、クリックでダイアログ作成を作る
	var lessonCalendar = new adminCalendar('.adminCalendar');
	lessonCalendar.create();	//カレンダーを実際に作成する
}

/* 
 * 関数名:createAdminMailMagaAnnounceContent
 * 概要  :管理者ページの授業詳細タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminMailMagaAnnounceContent() {
	//メルマガ＆アナウンスタブのコンテンツ
	//過去のメルマガを検索するための領域を作る
	adminPageCreator.outputTag('mailMagaSearchArea', 'mailMagaSearchArea', '#mailMagaAndAnnounce');
	//メルマガページングの一番外側となる領域を作る
	adminPageCreator.outputTag('mailMagaPagingArea', 'divArea', '#mailMagaAndAnnounce');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	adminPageCreator.outputTag('mailMagaTableOutside', 'divArea', '.mailMagaPagingArea');
	// ナンバリング領域を作る
	adminPageCreator.outputTag('numberingOuter','numberingOuter','.mailMagaPagingArea');
	//メルマガのデータを取り出す
	adminPageCreator.getJsonFile(URL_GET_JSON_ARRAY_PHP, adminPageCreator.json['mailMagaTable'], 'mailMagaTable');
	//ページング機能付きでメルマガテーブルを作る
	adminPageCreator.outputNumberingTag('mailMagaTable', 1, 4, 1, 15, '.mailMagaTableOutside', 'afterReloadMailMagaTable');

	//メルマガ検索ボタンがクリックされた時に検索機能を行うイベントを開始する
	$(STR_BODY).on(CLICK, '.mailMagaSearchButton', function() {
		//ページングの設定を初期化し、
		pagingReset('mailMagaTable');
		//クエリのデフォルトを取得し、編集した後でも戻せるようにする
		var queryDefault = adminPageCreator.json.mailMagaTable.db_getQuery;
		//クエリの文字列の長さを取得してORDER以降の文字列の取得に使う
		var queryStringLength = adminPageCreator.json.mailMagaTable.db_getQuery.length;
		//ORDER BY以降の文字列を取得するため、ORDER 以降の文字列を取得する
		var cutString = adminPageCreator.json.mailMagaTable.db_getQuery.substring(adminPageCreator.json.mailMagaTable.db_getQuery.indexOf("ORDER"),queryStringLength);
		//現在のクエリからORDER BYを取り除き、検索の条件を入れることができるようにする
		adminPageCreator.json.mailMagaTable.db_getQuery = adminPageCreator.json.mailMagaTable.db_getQuery.substring(0,adminPageCreator.json.mailMagaTable.db_getQuery.indexOf("ORDER"));
		//検索の条件をクエリに入れる
		addQueryExtractionCondition('mailMagaSearchArea', 'mailMagaTable', adminPageCreator);
		//クエリに切り取ったORDER BYを付け足す
		adminPageCreator.json.mailMagaTable.db_getQuery += cutString;
		//メルマガのデータを取り出す
		adminPageCreator.getJsonFile(URL_GET_JSON_ARRAY_PHP, adminPageCreator.json['mailMagaTable'], 'mailMagaTable');
		//ページング機能付きでメルマガテーブルを作る
		adminPageCreator.outputNumberingTag('mailMagaTable', 1, 4, 1, 15, '.mailMagaTableOutside', 'afterReloadMailMagaTable');
		//クエリをデフォルトに戻す
		adminPageCreator.json.mailMagaTable.db_getQuery = queryDefault;
	});

	//クリック対象となっているメルマガテーブルの行をクリックしたときにタイトルや内容を自動でセットするイベントを登録する
	$('.mailMagaAndAnnounce').on(CLICK, '.targetMailMagazine', function() {
		//クリックされたのが何番目の行であるかを取得し、メルマガのタイトルや内容を取り出すのに使う
		var targetNumber = $('.targetMailMagazine').index(this);
		//取得した番号をもとにメルマガのタイトルや内容などの情報を取得し、連想配列に入れる
		var targetInf = adminPageCreator.json.mailMagaTable.table[targetNumber];
		//取得した連想配列をテキストボックスにセットする
		setValueDBdata(targetInf, '.mailMagaAndAnnounceArea', 'keyTable');
	});

	// //メルマガの情報テーブルを取得するためのjsonをDBから取得する
	// creator.getJsonFile('php/GetJSONArray.php', creator.json['mailMagaTable'], 'mailMagaTable');
	// //メルマガテーブルを作る
	// creator.outputTagTable('mailMagaTable', 'mailMagaTable', '#mailMagaAndAnnounce');
	//メルマガ・アナウンス入力領域を作る
	adminPageCreator.outputTag('mailMagaAndAnnounceArea', 'mailMagaAndAnnounceArea', '#mailMagaAndAnnounce');

	//送信ボタンがクリックされたときにメール送信イベントを開始する
	$(STR_BODY).on(CLICK, '.messageButtonArea .sendButton', function() {
		var doSend = function() {
			//メルマガ送信にチェックが入っていたらメルマガを送信する
			if($('[name="messegeType"]').val() == "0") {
				//メルマガを送信するための値をテキストボックスから取得する
				var sendData = getInputData('mailMagaAndAnnounceArea');
				//メルマガをDBに新規登録する
				setDBdata(adminPageCreator.json.insertMailMagazine, sendData, '');
				// メルマガ送信処理
				sendMailmagazine(sendData['magazine_title'],sendData['magazine_content']);
			}
		};
		var sd = new SimpleConfirmDialog(
				doSend,
				"メルマガの送信を行います。よろしいですか?"
		);
		sd._showDialog();
	});

	//削除ボタンがクリックされたとき、テキストボックスの中身も空白にする
	$(STR_BODY).on(CLICK, ".messageButtonArea .deleteButton", function(){
		//メッセージ内容テキストエリアの中身を空にする
		$('.mailMagaAndAnnounceArea textarea').text('');
	});

	//メルマガ検索領域の内容テキストボックスでエンターキーを押すと検索のイベントを開始する
	enterKeyButtonClick('.mailMagaContentSearchTextbox', '.mailMagaSearchButton');
}

