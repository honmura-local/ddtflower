/**
 * ダイアログを作る関数をまとめたJSファイル。
 */

/**
 * 体験レッスンページのコンテンツ作成用JavaScript関数 + 汎用テキスト作成JavaScript関数ファイル。
 */


/* 
 * 関数名:createReservedData(reservedData)
 * 概要  :予約希望のデータを作成する。
 * 引数  :Object reservedData
 * 返却値  :Object
 * 作成者:T.M
 * 作成日:2015.02.11
 * 追加者 :T.Yamamoto
 * 追加日 :2015.03.09
 * 内容   :氏名、電話番号、メールアドレス、人数を追加
 */
function createReservedData(reservedData){
	
	// reservedDataに選択作品のデータを格納する。
	reservedData['construct'] = $('input[name="construct"]:checked').val();
	// reservedDataに選択した時限のデータを格納する。
	reservedData['schedule'] = getCheckBoxValue('schedule');
	// 選択した予備日程の曜日を配列で取得してreservedDataに格納する。
	reservedData['weekDay'] = getCheckBoxValue('dayOfWeek');
	// 選択した予備日程の週を配列で取得してreservedDataに格納する。
	reservedData['weekNumber'] = getCheckBoxValue('week');
	// 入力された氏名を取得する
	reservedData['name'] = $('input[name="name"]').val();
	// 入力された電話番号を取得する
	reservedData['personPhoneNumber'] = $('input[name="personPhoneNumber"]').val();
	// 入力されたメールアドレスを取得する
	reservedData['personEmail'] = $('input[name="personEmail"]').val();
	// 入力された人数を取得する
	reservedData['personCount'] = $('input[name="personCount"]').val();
	

	// reservedDataを返す。
	return reservedData;
}

/* 
 * 関数名:disableInputs(dialog)
 * 概要  :対象のダイアログの入力要素を一時無効にする。
 * 引数  :jQuery dialog
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function disableInputs(dialog){
	// dialogのinputタグ、buttonタグにdisabled属性を追加して一時無効化する。
	$('input,button', dialog).attr('disabled', 'disabled');
}

/* 
 * 関数名:getCheckBoxValue(className)
 * 概要  :チェックボックスの値を配列で取得する。
 * 引数  :String className
 * 返却値  :Array
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function getCheckBoxValue(className){
	// 返却する値を格納する配列を用意する。
	var checkBoxies = [];
	var tmp = $('input[name="'+ className +'"]:checked');
	// チェックが入ったチェックボックスを走査する。
	$('input[name="'+ className +'"]:checked').each(function(i){
		// 該当するチェックボックスから値を取得してcheckBoxiesに格納する。
		checkBoxies[i] = $(this).val();
	});
	
	// checkBoxiesを返す。
	return checkBoxies;
}

/* 
 * 関数名:removeInputDialog(dialog, reservedData)
 * 概要  :入力ダイアログを消す。
 * 引数  :jQuery dialog, Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function removeInputDialog(dialog, reservedData){
	// ダイアログを完全に消去する。
	dialog.dialog("close").dialog("destroy").remove();
	// reservedDataにnullを格納して空扱いにする。
	reservedData = null;
}

/* 
 * 関数名:checkEmptyInput(names)
 * 概要  :入力フォームの空チェックを行う。
 * 引数  :Array names:チェックするフォームのname属性をまとめた配列。
 * 返却値:null or Array
 * 作成者:T.M
 * 作成日:2015.04.01
 */
function checkEmptyInput(names){
	//namesの要素数を取得する。
	var nameslength = names.length;
	//返す配列を作成する。
	var retArray = [];
	//namesを走査する。
	for(var i = 0; i < nameslength; i++){
		//入力フォームのタイプを取得する。
		var type = $('input[name="' + names[i] + '"]').attr('type');
		//typeがチェックするものであれば
		if(type == 'radio' || type == 'checkbox'){
			//チェックが入っているものがないなら
			if($('input[name="' + names[i] + '"]:checked').length <= 0){
				//配列にname属性の値を入れる。
				retArray[retArray.length] = names[i];
			}
		//テキストボックス等なら
		} else {
			//何も入力されていなければ
			if($('input[name="' + names[i] + '"]').val() == ''){
				//配列にname属性の値を入れる。
				retArray[retArray.length] = names[i];
			}
		}
	}
	
	//結果を返す。未入力のname属性の配列か、未入力なしのnullを返す。
	return retArray.length > 0 ? retArray: null;
}

/* 
 * 関数名:replaceJpName(names, jpNames)
 * 概要  :配列の英語名を日本語する。
 * 引数  :Array names:英語名の配列。
 * 　　　 :Object jpNames:キーが英語名、値が日本語名の連想配列。
 * 返却値:Array
 * 作成者:T.M
 * 作成日:2015.04.01
 */
function replaceJpName(names, jpNames){
	var retArray = [];				//返す配列を宣言する。
	var nameslength = names.length;	//namesの要素数を取得する。
	
	//namesを走査する。
	for(var i = 0; i < nameslength; i++){
		var key = names[i];
		//返す配列に日本語名を順次格納していく。
		retArray[i] = jpNames[key];
	}
	
	//作成した配列を返す。
	return retArray;
}


//必須入力を行う入力フォームのname属性を配列に入れる。
var checkNames = ['construct', 'schedule', 'name', 'personPhoneNumber', 'personEmail', 'personEmailCheck', 'personCount'];
//必須入力を行う入力フォームのname属性の日本語版を連想配列で用意する。
var checkNamesJp = {construct:'希望作品', schedule:'希望時限', name:'ご氏名', personPhoneNumber:'電話番号', personEmail:'メールアドレス', personEmailCheck:'メールアドレス(確認)', personCount:'人数'};

/* 
 * 関数名:function checkAllAlphabet(selector)
 * 概要  :全角文字の入力チェックを行う。
 * 引数  :String selector:対象となる要素のセレクタ。
 * 返却値:Array
 * 作成者:T.M
 * 作成日:2015.04.09
 */
function checkAllAlphabet(selector){
	var retArray = [];	//返却値を格納する配列を宣言、空の配列で初期化する。
	 //全角入力チェックを行う。
	 $(selector).each(function(){
		 var onlyAlphabet = checkAlphabet($(this).val());	//アルファベットオンリーでないかのチェックをする。
		 //有効でない文字があったら
		 if(onlyAlphabet == false){
			 retArray.push($(this).attr('name'));	//name属性を配列に入れる。
		 }
	 });
	 
	 return retArray;	//作成した配列を返す。
}

/* 
 * 関数名:createSpecialReservedDialog(json, array)
 * 概要  :特別レッスン予約用ダイアログを生成する。
 * 引数  :Object json, Array array
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 * 変更者:T.M
 * 変更日:2015.03.31
 * 内容　:submitイベントで処理するようにしました。
 */
function createSpecialReservedDialog(json, array){
	
	// ダイアログのデータを格納する連想配列を宣言し、引数の配列に格納されたコンテンツ名と予約希望日時を格納する。
	reservedData = {'year': array[0], 'month': array[1], 'day': array[2]};

	//ダイアログを呼ぶ下準備としてjsonとテンプレートのdomを取得する。
	creator.getJsonFile('source/experience.json');
	creator.getDomFile('source/template.html');
	
	// ダイアログの本体となるdivタグを生成する。
	creator.outputTag('specialReservedDialog');

	// ダイアログに日付欄を追加する。
	createSpecialDate(reservedData['year'], reservedData['month'], reservedData['day']);
	// 生成したdivタグをjQuery UIのダイアログにする。
	$('.specialReservedDialog').dialog({
		// 幅を設定する。
		width			: '300px',
		// 予約ダイアログのクラスを追加する。
		dialogClass		:'reservedDialog',
		// ダイアログを生成と同時に開く。
		autoOpen		: true,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			// タイトルバーを見えなくする。
			$(this).prev().children().filter('.ui-dialog-titlebar-close').remove();
			$(this).next().css('font-size', '0.5em');
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:'center center',
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:'center center',
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		},
		// ボタンの生成と設定を行う。
		buttons:[
			         {
			        	 // OKボタンのテキスト。
			        	 text:'OK',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 //必須入力チェックを行う。
			        		 var emptyList = checkEmptyInput(checkNames);
		        			//アルファベット入力だけ行わせるテキストボックス名のリストを格納する配列を宣言する。
			        		 var onlyAlphabetList = checkAllAlphabet('input[name="personPhoneNumber"], input[name="personEmail"], input[name="personCount"]');
			        		 //メールアドレスの再入力が行われているかをチェックする。
			        		 var emailCheck = $('.personEmail input').val() == $('.personEmailCheck input').val()? true: false;
			        		 
			        		 // 必須入力項目が皆入力済みであり、英数字しか入力してはいけない項目がOKなら
			        		 if(emptyList == null && onlyAlphabetList.length == 0 && emailCheck == true) {
				        		 // 入力確認ダイアログを呼び出す。
				        		 createSpecialReservedConfirmDialog();
				        		 //入力確認のものは送信すべきではないので、送信前に前持って無効化する
				        		 $('.personEmailCheck input').attr('disabled', 'disabled');
				        		 //ダイアログ内のフォームをsubmitする。
				        		 $('form.specialReservedDialog').submit();				        		 
				        		 // このダイアログの入力要素を一時的に無効化する。
				        		 disableInputs($(this));
			        		 } else {
			        			 var alerts = "";	//警告の文字列を格納する変数を宣言、初期化する。
			        			 
				        		 if(emptyList != null){	//未入力項目リストがNGであったら
				        			 //未入力項目のリストを日本語に訳す。
				        			 emptyList = replaceJpName(emptyList, checkNamesJp);
				        			 //未入力項目のリストを1つの文字列にする。
				        			 var emptyListString = emptyList.join("\n");
				        			 //警告を追加する。
				        			 alerts += "以下の項目が未入力となっています。\n" + emptyListString + '\n\n';
				        			 
				        		 }
				        		 //英数字チェックリストがNGであったら
				        		 if(onlyAlphabetList.length != 0){
				        			 //英数字チェックリストを訳す。
				        			 onlyAlphabetList = replaceJpName(onlyAlphabetList, checkNamesJp);
				        			 //英数字チェックリストを1つの文字列にする。
				        			 var onlyAlphabetListString = onlyAlphabetList.join("\n");
				        			 //警告を追加する。
				        			 alerts += "以下の項目は半角英数字記号のみを入力してください。\n" + onlyAlphabetListString + '\n\n';
				        		 }
				        		 //メールの再入力が行われていなかったら
				        		 if(emailCheck == false){
				        			 alerts += "確認のため、同じメールアドレスもう一度入力してください。";
				        		 }
			        			 //アラートを出す。
			        			 alert(alerts);
			        		 }
			        	 }
			         },
			         {
			        	 // キャンセルボタンのテキスト。
			        	 text:'Cancel',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // ダイアログと、入力された予約データを消去する。
			        		 removeInputDialog($(this), reservedData);
			        	 }
			         }
		         ]
	});
}

/* 
 * 関数名:createSpecialDate(year, month, day)
 * 概要  :予約希望日時のパーツを追加する。
 * 引数  :int year, int month, int day
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 * 変更者:T.M
 * 変更日:2015.04.01
 * 内容　:体験レッスン予約希望メールの仕組みの変更により、inputタグへも日付を渡す様に変更しました。
 */
function createSpecialDate(year, month, day){
	// 曜日の配列を宣言、初期化する。
	var weekChars = [ '日', '月', '火', '水', '木', '金', '土' ];
	// 予約希望ダイアログに予約希望日時が書かれたタグを追加する。
	// 年月日と曜日で構成された日付テキストを作る。月は日付型で0〜11で表現されているので、-1する。
	var date = year + '年' + month + '月' + day + '日' + '(' + weekChars[new Date(year, month - 1, day).getDay()] + ')';
	$('.specialReservedDialog').attr('title', date);
	//日付のinputタグにも日付を追加する。
	$('.reservedDate').val(date);
}

/* 
 * 関数名:sendReservedData(reservedData)
 * 概要  :サーバに予約希望データを送信する。
 * 引数  :Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function sendReservedData(reservedData){
	// サーバにデータを送信し、その結果の文字列をisSuccessに格納する。
	var isSuccess = sendData(reservedData);
	// データの送信に成功したら
	if(isSuccess){
		// 帰ってきたメッセージをダイアログで表示する。
		alert(isSuccess);
		// ダイアログを消す。
		removeReservedDialogs($('.reservedDialog .ui-dialog-content'));
	} else {
		// 時間を空けてもう一度実行してもらうようメッセージのダイアログを出す。
		alert("通信に失敗しました。時間をあけてもう一度お試しください。");
	}
}

/* 
 * 関数名:sendData(reservedData)
 * 概要  :サーバに予約希望データを送信する。
 * 引数  :Object reservedData
 * 返却値  :Object or int
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function sendData(reservedData){
	// 返却値を格納する変数returnsを宣言、0で初期化する。
	var returns = 0;
	// ajax通信で予約データをサーバに送信する。
	$.ajax({
		// 予約データ保存用のPHPにデータを送信する。2015.02.19現在該当PHPが無いため自身のURLに送信しています。
		url: location.href,
//		url: init["sendReservedPhp"],
		// テキストデータを返してもらう。
		dataType: 'text',
		// 非同期通信にしない。
		async: false,
		// 予約データを添付する。
		data: {"reserved":reservedData},
		// 通信成功時の処理。
		success:function(text){
			// returnsに帰ってきたテキストを代入する。2015.03.06現在ではテスト用のテキストを返す。
			//returns = text;
			returns = "ご予約希望を承りました。追ってメールでの返信をいたします。";
		}
	});
	
	// returnsを返す。
	return returns;
}

/* 
 * 関数名:moveToPrevDialog(current)
 * 概要  :直前のダイアログに戻る。
 * 引数  :jQuery current
 * 返却値 :なし
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function moveToPrevDialog(current){
	//1つ前のダイアログを取得する。
	var $prevDialog = $('.ui-dialog-content').eq(current.index('.ui-dialog-content') - 1);
	// currentの前のダイアログの入力要素を有効にする。
	$('input' ,$prevDialog).removeAttr('disabled');
}

/* 
 * 関数名:removeReservedDialogs(dialogs)
 * 概要  :引数の配列にセットされたダイアログを消す。
 * 引数  :array dialogs
 * 返却値 :なし
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function removeReservedDialogs(dialogs){
	// 引数のダイアログの配列を走査する。
	dialogs.each(function(){
		// ダイアログを消去する。
		$(this).dialog('close').dialog('destroy').remove();
	});
}

/* 
 * 関数名:checkAlphabet(str)
 * 概要  :英数字と最低限の記号が文字列に含まれているかをチェックする。
 * 引数  :String str:チェックする文字列
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.04.08
 */
function checkAlphabet(str){
	var retBool = true;	//返却する真理値を格納する変数を宣言、falseで初期化する。
	
	//for文で文字列を走査する。
	for(var i = 0; i < str.length; i++){
		//この文字列に含まれない文字が含まれていたら
		if (!(' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.indexOf(str[i]) >= 0)){
			retBool = false;	//チェックにひっかかったということで、falseを返す。
			break;			//チェックを終える。
		}
	}
	
	return retBool;	//判定を返す。
}

/* 
 * 関数名:createSpecialReservedConfirmDialog(reservedData)
 * 概要  :入力内容を表示して送信を確定するダイアログを表示する。
 * 引数  :Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 * 変更者:T.M
 * 変更日:2015.03.31
 * 内容　:フォームメール対応
 */
function createSpecialReservedConfirmDialog(reservedData){
	// ダイアログの本体となるdivタグを生成する。
	creator.outputTag('specialReservedConfirmDialog');
	
	// 生成したdivタグをjQuery UIのダイアログにする。
	$('.specialReservedConfirmDialog').dialog({
		// 幅を設定する。
		width			: '300px',
		// 予約ダイアログのクラスを追加する。
		dialogClass		:'reservedDialog',
		// ダイアログを生成と同時に開く。
		autoOpen		: true,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		//タイトルをつける。
		title:"体験レッスン 送信内容確認",
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			var c = this;
			// タイトルバーを見えなくする。
			$('.reservedDialog .ui-dialog-titlebar-close').css('display', 'none');
		},
		// ダイアログが閉じられる前のイベント
		beforeClose:function(event, ui){
			//下のダイアログのロックを解除する。
			moveToPrevDialog($(this));
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:'center center',
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:'center center',
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		}
	});
}

/* 
 * 関数名:getInitData(path, continues)
 * 概要  :初期化用データの連想配列を取得して返す。
 * 引数  :String path, int continues
 * 返却値  :Object
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function getInitData(path, continues){
	// 返却値を格納する変数を宣言、0で初期化する。
	var returns = 0;
	// for文で規定回数通信するか、通信成功するまで通信を繰り返す。
	for (var i = 0; i < continues && returns == 0; i++){
		// Ajax通信を行いファイルを取得する。
		returns = getJSONFile(path);
	}
	
	// ファイルが取得できていなかったら
	if(!(returns)){
		alert('初期化ファイルの取得に失敗しました。');
	}
	
	// 取得したデータを返す。
	return returns;
}

/* 
 * 関数名:getJSONFile(path)
 * 概要  :JSONファイルを取得して返す。
 * 引数  :String path
 * 返却値  :Object or int
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function getJSONFile(path){
	// 返却値を格納する変数を宣言、0で初期化する。
	var returns = 0;

	// ajax通信で予約データをサーバに送信する。
	$.ajax({
		// pathのファイルを取得する。
		url: path,
		// テキストデータを返してもらう。
		dataType: 'JSON',
		// 同期通信を行う。
		async: false,
		// 通信成功時の処理。
		success:function(json){
			// returnsに取得したJSONデータを格納する。
			returns = json;
		}
	});
	
	// returnsを返す。
	return returns;
}

/* 
 * 関数名:createLoginDialog()
 * 概要  :ログインダイアログを生成する。
 * 引数  :なし
 * 返却値 :なし
 * 作成者:T.M
 * 作成日:2015.02.18
 */
function createLoginDialog(){
	creator.getJsonFile('source/login.json');	// ファイルのデータをjsonを用いて持ってくる
	creator.getDomFile('source/template.html');		// ファイルのhtmlデータをdomを用いて持ってくる

	//ダイアログのタグを作る。
	creator.outputTag('loginDialog');
	
	// 生成したdivタグをjQuery UIのダイアログにする。
 	$('.loginDialog').dialog({
		// 幅を設定する。
		width			: '300',
		// 幅を設定する。
		title			: 'ログイン',
		// ダイアログを生成と同時に開く。
		autoOpen		: true,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			//文字サイズを小さめにする。
			$(this).next().css('font-size', '0.5em');
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:'center center',
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:'center center',
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		},
		// ボタンの生成と設定を行う。
		buttons:[
			         {
			        	 // OKボタンのテキスト。
			        	 text:'ログイン',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // 必須入力項目が皆入力済みであれば
			        		 if($('input.userName' ,this).val() != ''
			        			 &&  $('input.userName' ,this).val() != ''){
			        			 
			        			 //通信の返却値を格納する変数を宣言する。
			        			 var transResult = {"result":false};
			        			 // ajax通信を行いサーバにユーザ情報を送る。
			        			 $.ajax({
			        				 //ログイン認証のPHPにデータを送信する。
//			        				url:"loginauth.php",
			        				url:location.href,
			        				//ユーザ名とパスワードをPHPに送信する。
			        				data:{'userName':$('input.userName' ,this).val(),
			        					'password':$('input.password' ,this).val()},
			        				//JSONで結果を返してもらう。
//			        				dataType:'JSON',
			        				dataType:'HTML',
			        				//同期通信を行う。
			        				async:false,
			        				//通信成功時の処理
			        				success:function(json){
			        					// 通信結果のデータをtransResultに格納する。
			        					transResult = {"result":"true","user":"testuser","userName":"user"};
//			        					transResult = json;
			        				},
			        				//通信失敗時の処理
			        				error:function(){
			        					//エラーログを出す。
			        					console.log(errorMessages[0]);
			        				}
			        				
			        			 });
			        			// 通信が成功していたら
			        			 if(transResult["result"]){
			        				// ユーザ情報の取得に成功していたら
			        				 if('user' in transResult){
			        					 //@mod T.Masuda 2015.03.27 Cookieを期限付きにしました。
			        					//クッキーにユーザ情報を格納する。
//			        					 document.cookie = 'user='+transResult["user"];
//			        					 document.cookie = 'userName='+transResult["userName"];
			        					
			        					 //日付クラスインスタンスを生成する。
			        					 var cookieLimit = new Date();
			        					 //現在の日付にクッキーの生存時間を加算し、cookieLimitに追加する。
			        					 cookieLimit.setTime(cookieLimit.getTime() + parseInt(init['cookieLimitTime']));
			        					 //cookieにユーザ情報と期限の日付を格納する。
			        					 document.cookie = 'user=' + transResult["user"] + ';expires=' + cookieLimit.toGMTString();
			        					 document.cookie = 'userName=' + transResult["userName"] + ';expires=' + cookieLimit.toGMTString();
			        					 //ここまで変更しました。
			        					 // ダイアログを消去する。
						        		 $(this).dialog('close').dialog('destroy').remove();
						        		 //画面を更新する。
						        		 location.reload();
			        				 } else {
			        					 // 認証失敗のメッセージを出す。
			        					 alert(errorMessages[1]);
			        				 }
			        			//通信に失敗していたら。 
			        			 } else {
			        			//通信エラーのメッセージを出す。
		        				alert(errorMessages[2]);
			        			}
			        		//空欄に入力するようにメッセージを出す。
			        		 } else {
			        			 alert(errorMessages[3]);
			        		 }
			        	 }
			         },
			         {
			        	 // キャンセルボタンのテキスト。
			        	 text:'Cancel',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // ダイアログを消去する。
			        		 $(this).dialog('close').dialog('destroy').remove();
			        	 }
			         }
		         ]
	});
}

/* 
 * 関数名:checkLogin()
 * 概要  :ログイン状態をチェックする。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.18
 * 修正者:T.M
 * 修正日:2015.03.10
 * 変更　:ユーザー名が複数表示されてしまうバグへ対応しました。
 */
function checkLogin(){
	// ログインしているか否かの結果を返すための変数を用意する。
	var result = false;
	// クッキーを連想配列で取得する。
	var cookies = GetCookies();
	//ログイン中であれば
	if('user' in cookies && cookies['user'] != ""){
		// ログインボタンをログアウトボタンに差し替える。
		$('.login').removeClass('login')
					.addClass('logout')
					.attr('src', 'image/icon(logout22-50).png');
		//ログアウトボタンの下にユーザ名を表示する。
		$('.logout')
					// spanタグを追加する。
					.after($('<span></span>')
							// ユーザ名のクラスを設定する。
							.addClass('userName')
							//cookieからユーザ名を取り出し表示する。
							.text(cookies['userName'] + '様')
							)
					// spanタグを追加する。
					.after($('<span></span>')
							// ユーザ名のクラスを設定する。
							.addClass('welcome')
							//cookieからユーザ名を取り出し表示する。
							.text('ようこそ')
							)
					;
		// ログアウトのイベントを定義する。
		$(document).on('click', '.logout', function(){
			// ユーザのクッキーを削除してログアウトする。
			deleteCookie('user');
			deleteCookie('userName');
			//画面を更新する。
   		 	location.reload();
		});
		
		// ログインしている状態であるという結果を変数に格納する。
		result = true;
	}
	
	// ログイン状態を返す。
	return result;
}

/* 
 * 関数名:function getUserId()
 * 概要  :cookieからユーザIDを取得して返す。
 * 引数  :なし
 * 返却値  :String:ユーザIDの文字列。
 * 作成者:T.Masuda
 * 作成日:2015.04.16
 */
function getUserId(){
	// クッキーを連想配列で取得する。
	var cookies = GetCookies();
	//ユーザIDを取得して返す。なければゲスト用IDを返す。
	return 'userId' in cookies? cookies['userId']: '999999';
}

/* 
 * 関数名:function checkLoginState()
 * 概要  :ログイン状態をチェックする。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.02.20
 */
function checkLoginState(){
	// ログイン状態をチェックする。
	if(!(checkLogin())){
		//ログインボタンのイベントを設定する。
		$('.login').on('click', function(){
			// ログインダイアログを呼び出す。
			createLoginDialog();
		});
	}
}


//クッキーの削除。http://javascript.eweb-design.com/1404_dc.htmlより。
function deleteCookie(cookieName) {
  cName = cookieName + "="; // 削除するクッキー名
  dTime = new Date();
  dTime.setYear(dTime.getYear() - 1);
  document.cookie = cName + ";expires=" + dTime.toGMTString();
}

/* クッキーを連想配列で取得する関数。http://so-zou.jp/web-app/tech/programming/javascript/cookie/#no5より。 */
function GetCookies()
{
    var result = new Array();

    var allcookies = document.cookie;
    if( allcookies != '' )
    {
        var cookies = allcookies.split( '; ' );

        for( var i = 0; i < cookies.length; i++ )
        {
            var cookie = cookies[ i ].split( '=' );

            // クッキーの名前をキーとして 配列に追加する
            result[ cookie[ 0 ] ] = decodeURIComponent( cookie[ 1 ] );
        }
    }
    //結果を返す。
    return result;
}
//エラーメッセージの配列。
var errorMessages = [
'failed to connect',
'ユーザ認証に失敗しました。ユーザ名、またはパスワードを確認してください。',
'サーバとの通信に失敗しました。時間を置いて再度お試しください。',
'ユーザ名、パスワード、または両方が空欄になっています。'
];

// 初期化用関数をコールして初期化用データの連想配列を用意する。
var init = getInitData("source/init.json", 100);

/* 
 * 関数名:showEditDialog(editElem)
 * 概要  :テキストを編集するダイアログを表示する。
 * 引数  :Element editElem:編集対象となる要素。
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.03.18
 */
function showEditDialog(editElem){
	
}

/* 
 * 関数名:useEditDialog(selector)
 * 概要  :指定した要素をクリックしたらテキスト編集用のダイアログを出すイベントを登録する。
 * 引数  :string selector:編集対象となる要素のセレクタ。
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.03.18
 */
function useEditDialog(selector){
	
	//createTagでダイアログのタグを作る。
	creator.outputTag('textEditPopup','textEditPopup','body');
	//ダイアログのテキストエリアのjQueryオブジェクトを生成する。
	var textarea;
	
	//タグに呼び出すダイアログを指定する属性を追加する。
	$(selector).attr('data-smallipop-referenced-content', '#textEditPopupBody').attr('title', 'Referenced content');
	
	//smallipopによるポップアップを生成する。
    $(selector).smallipop({
    	hideOnPopupClick:false,		//ポップアップをクリックしても消えないようにする。
    	triggerOnClick:true,		//対象をクリックすることでポップアップが出るようにする。
    	windowPadding:0,			//ウィンドウに対する最低限のpaddinをなくす。
    	handleInputs:false,			//表示後にテキストエリアにフォーカスを移すとポップアップが消える問題への対応。
    	onAfterShow:function(from){	//ポップアップ表示直後の処理。
    		//ポップアップのテキストエリアのjQueryオブジェクトを取得する。
    		textarea = $('.textEditPopupBody textarea', document).eq(1);
    		textarea.focus();
    		//ポップアップの呼び出し元のテキストエリアの内容をコピーする。
    		textarea.val($(from).val());
    		//2つのテキストエリアの内容が連動するようにイベント登録する。
    		textarea.on('change', function(){
    			//呼び出し元のテキストエリアの値をポップアップのテキストエリアの値で上書きする。
    			from.val(textarea.val());
    		});    		
    	},
    	onAfterHide:function(){		//ポップアップが消えた後の処理。
    		textarea.off('change');	//テキストエリアのイベントを解除する。
    	}
    });
}