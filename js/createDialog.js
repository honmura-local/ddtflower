/* 
 * ファイル名:createDialog.js
 * 概要  :ダイアログと関係する関数を定義する
 * 作成者:T.M
 * 作成日:2015.
 * パス　:/js/createDialog.js
 */

/**
 * ダイアログを作る関数をまとめたJSファイル。
 */

//ファイルパスの定数
MSL_LIST_PHP = 'list.php';
MSL_DETAIL_PHP = 'detail.php';
INIT_JSON = 'source/init.json';


/* 
 * 関数名:getCurrentPageFileName()
 * 概要  :ファイル名を取得する。引数に拡張子が入っていた場合、末尾のパスに依存せずURL全体から抽出する
 * 引数  :String identifier:探す拡張子
 * 返却値  :String:ファイル名を返す
 * 作成者:T.M
 * 作成日:2015.06.03
 */
function getCurrentPageFileName(identifier){
	var retFileName = '';	//ファイル名を返却するための変数を宣言、初期化する
	//現在のページのパスを配列で取得する
	var path = location.pathname.split('/');
	//ファイル名取得の前準備としてパスの要素数を取得する
	var pathLength = path.length;
	
	//拡張子の指定があったら
	if(identifier){
		//拡張子の文字列を作成する
		var identifierString = '.' + identifier;
		//ループしてパスを走査する
		for(var i = 0; i < pathLength; i++){
			//配列の要素が指定した拡張子を含んでいたら
			if(path[i].indexOf(identifierString) != -1){
				//現在走査しているパスを返却するように、変数にセットする
				retFileName = path[i];
				break;	//ループ終了
			}
		}
	//拡張子の指定がなければ
	} else {
		//最後の文字列 = ファイル名として返却するようにする
		retFileName = path[pathLength - 1];
	}
	
	return retFileName;	//取得したファイル名を返す
}

/**
 * 体験レッスンページのコンテンツ作成用JavaScript関数 + 汎用テキスト作成JavaScript関数ファイル。
 */

var currentPage = getCurrentPageFileName('php');	//現在のページ名を取得する。phpでなければ空文字を返す

//現在のページがMSLのphpであれば
if(currentPage == MSL_LIST_PHP || currentPage == MSL_DETAIL_PHP){
	INIT_JSON_PATH = "../../../" + INIT_JSON;		//2階層下がってファイルを取得する
//他のページなら
} else {
	INIT_JSON_PATH = INIT_JSON;		//階層を下げない
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
		var type = $('input[name="' + names[i] + '"]:not(:hidden)').attr('type');
		if(type !== void(0)){	//要素が存在していればチェックを行う
			//typeがチェックするものであれば
			if(type == 'radio' || type == 'checkbox'){
				//チェックが入っているものがないなら
				if($('input[name="' + names[i] + '"]:checked').length <= 0){
					//配列にname属性の値を入れる。
					retArray.push(names[i]);
				}
				//テキストボックス等なら
			} else {
				//何も入力されていなければ
				if($('input[name="' + names[i] + '"]').val() == ''){
					//配列にname属性の値を入れる。
					retArray.push(names[i]);
				}
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
var checkNames = ['construct', 'course','schedule', 'name', 'personPhoneNumber', 'email', 'personEmailCheck', 'personCount'];
//必須入力を行う入力フォームのname属性の日本語版を連想配列で用意する。
var checkNamesJp = {
			construct:'希望作品', 
			schedule:'希望時限', 
			name:'ご氏名', 
			personPhoneNumber:'電話番号', 
			email:'メールアドレス', 
			personEmailCheck:'メールアドレス(確認)', 
			personCount:'人数',
			course:'コース'
		};

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
	 
	 //作成した配列、またはnullを返す。
	return retArray.length > 0? retArray: null;
}

/* 
 * 関数名:function numberCheck(selector)
 * 概要  :指定したクラスのテキストボックスの値が0以下でないかをチェックする。
 * 引数  :String selector:チェックするクラス。
 * 返却値  :null || Array:チェックがOKならnullを返し、そうでなければname属性の配列を返す。
 * 作成者:T.M
 * 作成日:2015.04.18
 */
function numberCheck(selector){
	//返却する配列を宣言、初期化する。
	var returns = [];
	
	//指定されたクラスの要素を走査する。
	$(selector).each(function(){
		//現在さす要素の値が0以下であれば
		if(parseInt($(this).val()) <= 0 ){
			//配列にこの要素のname属性を格納する。
			returns.push($(this).attr('name'));
		}
	})
	
	//チェックに引っかかった要素があれば配列を返し、なければnullを返す。
	return returns.length > 0? returns: null;
}

//入力項目のエラー別メッセージの連想配列。
var messages = {
		emptyList:"以下の項目が未入力となっています。\n",
		onlyAlphabetList	:"以下の項目は半角英数字記号のみを入力してください。\n",
		emailCheck	:"確認のため、同じメールアドレスもう一度入力してください。\n\n",
		numberList:"以下の項目の数値を1以上で入力してください。\n"
}


/* 
 * 関数名:function makeFailedAlertString(list, jpNameMap)
 * 概要  :入力失敗の警告メッセージを作る。
 * 引数  :map lists:エラーがあった欄のリストの連想配列。
 * 　　  :map jpNameMap:英語名のキーと日本語名の値の連想配列。
 * 　　  :map messages:エラーメッセージの序文の連想配列。
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.04.18
 */
function makeFailedAlertString(lists, jpNameMap, messages){
	var errorString = '';	//エラーメッセージのテキストを格納する変数を宣言、初期化する。
	
	//listsのキーを走査する
	for(key in lists){
		//チェックが通った項目でなければ
		if(lists[key] != null){
			 //エラーのリストを日本語に訳す。
			 var errorList = replaceJpName(lists[key], jpNameMap);
			 //エラーのリストを1つの文字列にする。
			 var errorListString = errorList.join("\n");
			 //警告を追加する。
			 errorString += messages[key] + errorListString + '\n\n';
		}
	}
	
	//エラーメッセージを返す。
	return errorString;
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
 * 関数名:function getMemberInformation(form)
 * 概要  :フォームの会員情報欄に情報を格納する。。
 * 引数  :String form:対象のフォーム
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.04.17
 */
function getMemberInformation(form){
	var userId = getUserId();	//ユーザIDを取得する。
	var tmp;					//JSONを一時的に格納する変数を用意する。
	//Ajax通信で会員情報のJSONを取得する
	$.ajax({
		// 予約データ保存用のPHPにデータを送信する。2015.02.19現在該当PHPが無いため自身のURLに送信しています。
		url: location.href,
//		url: init["getMemberInformation"],
		dataType: 'text',			//サーバ側の処理ができるまでの措置
//		dataType: 'JSON',			// JSONデータを返してもらう。
		async: false,				// 非同期通信にしない。
		data: {"userId":userId},	//ユーザIDを送信する。
		success:function(json){		// 通信成功時の処理。
			//tmp = json;				//tmpに取得したJSONの連想配列を格納する。
			tmp = {					//サーバの処理を実装するまでダミーデータを使う。
					"personName":"ユーザ",
					"personNameKana":"ユーザ",
					"personEmail":"user@exampleexampleuser.com",
					"personTel":"000-0000-0000"
			}
		}
	});
	
	//フォームの該当するタグの中にテキストを流し込む。
	for(key in tmp){
		$('.' + key).val(tmp[key]);	//連想配列からテキストを取得して流し込む。
	}
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


/* クラス名:createDialog
 * 概要　　:jQueryUIダイアログを作成するためのクラス
 * 引数　　:String className:ダイアログのクラス名
 * 引数　　:String title:ダイアログのタイトル
 * 引数　　:Object position:ダイアログを表示する位置を設定したオブジェクト。詳細はjQuery UIのリファレンスを参照されたし
 * 作成日　:2015.0610
 * 作成者　:T.Masuda
 */
function createDialog(className, title, functionObject){
	//ダイアログのオプション
	this.options = {
		width : 300,		//幅
		autoOpen : false,	//作成時の自動オープンを無効にする
		//タイトル文字列。入力がなければ空文字にする
		title : title !== void(0) && title != ''? title : '',
		modal : true,		//モーダル表示
		resizable : false,	//ドラッグでのリサイズ可否
		//表示位置の指定。
		position :{my:'center center',at:'center center', of:window},
		closeOnEscape : false	//escキーを押して閉じるか
	}

	//クラス名を保存する
	this.className = className;
	
	//引数の関数定義オブジェクトが用意されていれば
	if(functionObject !== void(0) && functionObject != null && typeof functionObject != 'Object'){
		//ダイアログのオプションと引数のオブジェクトを統合する
		//キーがかぶったら、引数のオブジェクトのvalueで上書きする
		$.extend(this.options, functionObject);
	}
	
	//自動でダイアログを開かない設定がされていれば
	if(this.options.autoOpen == false){
		//引数のクラス名を指定してダイアログを呼ぶ。連想配列に定義したオプションのオブジェクトを引数にセットする
		$('.' + className).dialog(this.options);
	}
	
	/* 
	 * 関数名:create
	 * 概要  :DOMを作成する関数。オーバーライドして使う
	 * 引数  :なし
	 * 返却値 :なし
	 * 作成者:T.M
	 * 作成日:2015.06.13
	 */
	this.create = function(){
		
	}
	
	/* 
	 * 関数名:open
	 * 概要  :画面を開くときの処理
	 * 引数  :なし
	 * 返却値 :なし
	 * 作成者:T.M
	 * 作成日:2015.06.10
	 */
	this.open = function(){
		//ダイアログを作成し、開く
		$('.' + this.className).dialog('open');
	}
	/* 
	 * 関数名:close
	 * 概要  :画面を閉じるの処理
	 * 引数  :なし
	 * 返却値 :なし
	 * 作成者:T.M
	 * 作成日:2015.06.12
	 */
	this.close = function(){
		//ダイアログを作成し、開く
		$('.' + this.className).dialog('close');
	}
}

/* クラス名:specialReservedDialog
 * 概要　　:体験レッスン予約希望のダイアログを作る
 * 引数　　:Object position:ダイアログを表示する位置を設定したオブジェクト。詳細はjQuery UIのリファレンスを参照されたし
 * 　　　　:String content:コンテンツ名
 * 　　　　:Array array:日付等の情報が格納された配列
 * 作成日　:2015.0610
 * 作成者　:T.Masuda
 */
function specialReservedDialog(className, title, functionObject, content, array){
	createDialog.call(this, className, title, functionObject);	//スーパークラスのコンストラクタをコールする

	//コンストラクタの引数をメンバにセットする
	this.content = content;
	this.array = array;
	this.className = 'specialReservedDialog';		//ダイアログのクラス名

	//optionsに予約ダイアログのオプションをセットする
	this.options = dialogOption['specialReservedDialog'];

	this.open = function(){
		//予約希望ダイアログを作る下準備をする
		readyDialogFunc[this.className](this.content, this.array);
		$('.' + this.className).dialog(dialogOption[this.className]);
	}
}

/* クラス名:specialReservedConfirmDialog
 * 概要　　:体験レッスン予約希望の確認ダイアログを作る
 * 引数　　:Object position:ダイアログを表示する位置を設定したオブジェクト。詳細はjQuery UIのリファレンスを参照されたし
 * 作成日　:2015.0610
 * 作成者　:T.Masuda
 */
function specialReservedConfirmDialog(className, title, functionObject){
	createDialog.call(this, className, title, functionObject);	//スーパークラスのコンストラクタをコールする
	//optionsに予約ダイアログのオプションをセットする
	this.options = dialogOption['specialReservedConfirmDialog'];
	this.className = 'specialReservedConfirmDialog';		//ダイアログのクラス名
	
	this.open = function(){
		//予約希望ダイアログを作る下準備をする
		readyDialogFunc[this.className]();
		$('.' + this.className).dialog(dialogOption[this.className]);
	}
}

/* クラス名:loginDialog
 * 概要　　:体験レッスン予約希望のダイアログを作る
 * 引数　　:Object position:ダイアログを表示する位置を設定したオブジェクト。詳細はjQuery UIのリファレンスを参照されたし
 * 作成日　:2015.0610
 * 作成者　:T.Masuda
 */
function loginDialog(className, title, functionObject){
	createDialog.call(this, className, title, functionObject);	//スーパークラスのコンストラクタをコールする
	this.className = 'loginDialog';		//ダイアログのクラス名
	
	this.open = function(){
		//予約希望ダイアログを作る下準備をする
		readyDialogFunc[this.className](this.content, this.array);
		$('.' + this.className).dialog(dialogOption[this.className]);
	}
}

/* クラス名:memberDialog
 * 概要　　:会員ページダイアログ
 * 引数　　:Object position:ダイアログを表示する位置を設定したオブジェクト。詳細はjQuery UIのリファレンスを参照されたし
 * 　　　　:String content:コンテンツ名
 * 　　　　:Array array:日付等の情報が格納された配列
 * 作成日　:2015.0611
 * 作成者　:T.Yamamoto
 */
function memberDialog(className, title, functionObject, content, array){
	createDialog.call(this, className, title, functionObject);	//スーパークラスのコンストラクタをコールする
	
	//コンストラクタの引数をメンバにセットする
	this.content = content;
	this.array = array;
	this.className = 'memberDialog';		//ダイアログのクラス名
	
	//optionsに予約ダイアログのオプションをセットする
	this.options = dialogOption['memberDialog'];
	
}

/* クラス名:tagDialog
 * 概要　　:表示するときに内容を更新するダイアログ
 * 引数　　:String className:クラス名
 * 　　　　:String title:ダイアログのタイトル
 * 　　　　:Object functionObject:追加設定のオブジェクト
 * 　　　　:function createTags:DOMを作成する記述の関数
 * 作成日　:2015.0612
 * 作成者　:T.Masuda
 */
function tagDialog(className, title, functionObject, createTags){
	createTags();	//DOMを作成する
	createDialog.call(this, className, title, functionObject);	//スーパークラスのコンストラクタをコールする
	
	//ダイアログとクラスのインスタンスは一対一になっているが、同一の存在ではないので互いの参照を確保する
	//メンバにダイアログのタグへの参照を保存する
	this.dialogDom = $(CHAR_DOT + this.className)[0];
	//ダイアログのDOMにクラスインスタンスへの参照を保存する
	this.dialogDom.dialogClass = this;
	
	//ダイアログのオプションのオブジェクト内にeventのキーがあれば
	if(STR_EVENT in this.options){
		//eventのキーの値に設定されている関数を実行する
		this.options.event();
	}
	
	/* 関数名　:getJsonFile
	 * 概要　　:JSONをサーバへ送信し、それを元にデータを取得する一連の処理
	 * 引数　　:Object queryReplaceData:クエリの置換を行うデータを格納したオブジェクト
	 * 　　　　:Object dialogObject:ダイアログを開くときに必要になるパラメータの集合のオブジェクト
	 * 作成日　:2015.0613
	 * 作成者　:T.Masuda
	 */
	this.getJsonFile = function(queryReplaceData, dialogObject){
		//受け取ったオブジェクトをダイアログのクラスのインスタンスにコピーした上で保存する
		this.queryReplaceData = $.extend(true, {}, queryReplaceData);
		//受け取ったオブジェクトを元にJSONデータを更新する。追加元のオブジェクトはJSONDBManagerで置換できる形にしておく
		creator.replaceData(PATTERN_ADD, creator.json[dialogObject.key], creator.replaveValueNode(queryReplaceData));
		//サーバへJSONを送信し、テーブルのデータを取得する
		creator.getJsonFile(dialogObject.url, creator.json[dialogObject.key], dialogObject.key);
		//作成する要素と同名のクラスの要素があれば削除しておく
		creator.removeDomNode($(CHAR_DOT + dialogObject.domName, $(CHAR_DOT + this.className)));
	}

	/* 関数名　:openTag
	 * 概要　　:タグを作ってダイアログを開く
	 * 引数　　:Object queryReplaceData:クエリの置換を行うデータを格納したオブジェクト
	 * 　　　　:Object dialogObject:ダイアログを開くときに必要になるパラメータの集合のオブジェクト
	 * 作成日　:2015.0613
	 * 作成者　:T.Masuda
	 */
	this.openTag = function(queryReplaceData, dialogObject){
		this.getJsonFile(queryReplaceData, dialogObject);	//タグを出力する準備を行う
		//テーブルを出力する
		creator.outputTag(dialogObject.key, dialogObject.domName, dialogObject.appendTo);
		//ダイアログを開く
		$(CHAR_DOT + this.className).dialog(STR_OPEN);
	}

	/* 関数名　:openTagTable
	 * 概要　　:テーブルを作ってダイアログを開く
	 * 引数　　:Object queryReplaceData:クエリの置換を行うデータを格納したオブジェクト
	 * 　　　　:Object dialogObject:ダイアログを開くときに必要になるパラメータの集合のオブジェクト
	 * 作成日　:2015.0613
	 * 作成者　:T.Masuda
	 */
	this.openTagTable = function(queryReplaceData, dialogObject){
		this.openTag(queryReplaceData, dialogObject);	//openTagを通常通り実行する
		//jsonのdb_getQueryのキーの値を上書きする
		creator.json[dialogObject.key].db_getQuery = creator.json[dialogObject.key].replaceTable.replace_getQuery;
		//テーブル用のデータを取得する
		creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json[dialogObject.key], dialogObject.key);
		//テーブルを出力する
		creator.outputTagTable(dialogObject.key, STR_LESSON_TABLE, CHAR_DOT + dialogObject.domName + SP_SELECTOR_REPLACE_TABLE);
		//テーブルを配置するターゲットのタグを削除する
		$(CHAR_DOT + dialogObject.domName + SP_SELECTOR_REPLACE_TABLE).children(':first').unwrap();
		//ダイアログを開く
		$(CHAR_DOT + this.className).dialog(STR_OPEN);
	}
}

//ダイアログクラスの親子関係を設定する
specialReservedDialog.prototype = new createDialog();
specialReservedConfirmDialog.prototype = new createDialog();
loginDialog.prototype = new createDialog();
memberDialog.prototype = new createDialog();
tagDialog.prototype = new createDialog();

//サブクラスのコンストラクタを有効にする
specialReservedDialog.prototype.constructor = specialReservedDialog;
specialReservedConfirmDialog.prototype.constructor = specialReservedConfirmDialog;
loginDialog.prototype.constructor = loginDialog;
memberDialog.prototype.constructor = memberDialog;
tagDialog.prototype.constructor = tagDialog;

var dialogOption = {};	//ダイアログ生成時にセットするオプションを格納した連想配列を作る
dialogOption['loginDialog'] = {
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
			        				 //ログイン認証のサーバにデータを送信する。
			        				url:location.href,
			        				//ユーザ名とパスワードをPHPに送信する。
			        				data:{'userName':$('input.userName' ,this).val(),
			        					'password':$('input.password' ,this).val()},
			        				//JSONで結果を返してもらう。
			        				dataType:'HTML',
			        				//同期通信を行う。
			        				async:false,
			        				//通信成功時の処理
			        				success:function(json){
			        					// 通信結果のデータをtransResultに格納する。
			        					transResult = {"result":"true","user":"testuser","userName":"user"};
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
	};

//予約希望ダイアログ
dialogOption['specialReservedDialog'] = {
			// 幅を設定する。
			width			: '300',
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
				        		 var onlyAlphabetList = checkAllAlphabet('input[name="personPhoneNumber"], input[name="email"], input[name="personCount"]');
				        		 //メールアドレスの再入力が行われているかをチェックする。失敗なら配列に空文字を入れる。
				        		 var emailCheck = $('.personEmail input').val() !== $('.personEmailCheck input').val()? [""]: null;
				        		 //カウントクラスのテキストボックス(人数)が0以下でないかをチェックする。
				        		 var numberList = numberCheck('.count');
				        		 // 必須入力項目が皆入力済みであり、英数字しか入力してはいけない項目がOKなら
				        		 if(emptyList == null && onlyAlphabetList == null && emailCheck == null &&numberList == null) {
					        		 // 入力確認ダイアログのクラスインスタンスを作る。
				        			 var confirmDialog = new specialReservedConfirmDialog(null, null, {autoOpen:true});
				        			 confirmDialog.open();	//ダイアログを開く
					        		 //入力確認のものは送信すべきではないので、送信前に前持って無効化する
					        		 $('.personEmailCheck input').attr('disabled', 'disabled');
					        		 //ダイアログ内のフォームをsubmitする。
					        		 $('form.specialReservedDialog').submit();				        		 
					        		 // このダイアログの入力要素を一時的に無効化する。
					        		 disableInputs($(this));
				        		 } else {
				        			 //警告のテキストを作る。
				        			 var alerts = makeFailedAlertString({'emptyList':emptyList,'onlyAlphabetList':onlyAlphabetList,'emailCheck':emailCheck,'numberList':numberList},checkNamesJp, messages);
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
		}

//予約希望送信前の確認ダイアログ
dialogOption['specialReservedConfirmDialog'] = {
			// 幅を設定する。
			width			: '300',
			// 予約ダイアログのクラスを追加する。
			dialogClass		:'reservedDialog',
			// ダイアログを生成と同時に開く。
			autoOpen		: true,
			// Escキーを押してもダイアログが閉じないようにする。
			closeOnEscape	: false,
			//タイトルをつける。
			title:"レッスン予約希望 送信内容確認",
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
		}		

dialogOption['memberDialog'] = {
		// 幅を設定する。
		width			: STR_AUTO,
		// 幅を設定する。
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
			$(this).next().css(STR_FONT_SIZE, VALUE_0_5EM);
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:STR_CENTER_CENTER,
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:STR_CENTER_CENTER,
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		}
	};

//予約ダイアログ用設定
dialogOption[STR_RESERVE_LESSON_LIST_DIALOG] = {
		// 幅を設定する。
		width			: STR_AUTO,
		// 幅を設定する。
		// ダイアログを生成と同時に開く。
		autoOpen		: false,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		//ダイアログを閉じるときのイベント
		close			:function(){
			//読み込んだテーブルのデータを消す
			delete creator.json[STR_MEMBER_INFORMATION].table;
		},
		//イベント
		event:function(){
			//予約決定ダイアログを表示する処理
			$(document).on(STR_CLICK, SELECTOR_RESERVE_LESSON_LIST_DIALOG_TD, function(){
				//予約決定ダイアログのクラスインスタンスを取得する
				var $nextDialog = $(SELECTOR_MEMBER_RESERVED_CONFIRM_DIALOG)[0].dialogClass;
				//レッスン一覧ダイアログを取得する
				var $prevDialog = $(SELECTOR_RESERVE_LESSON_LIST_DIALOG)[0].dialogClass;
				//クリックしたセルの親の行番号を取得する
				var rowNum = $(SELECTOR_RESERVE_LESSON_LIST_DIALOG_TR).index($(this).parent()) - 1;
				//次のダイアログに渡すオブジェクトを作る
				var sendObject = creator.replaceData(PATTERN_ADD, $.extend(true, {}, $prevDialog.queryReplaceData), 
						creator.json[STR_MEMBER_INFORMATION].table[rowNum]);
				
				insertConfirmReserveJsonDialogValue(sendObject);
				
				//予約決定ダイアログを開く。ユーザIDと日付、選択したレコードのデータをまとめてオブジェクトにして渡す
				$nextDialog.openTag(sendObject,
						{
							url:URL_GET_JSON_STRING_PHP, 
							key:STR_MEMBER_RESERVED_CONFIRM_DIALOG_CONTENT, 
							domName:STR_MEMBER_RESERVED_CONFIRM_DIALOG_CONTENT,
							appendTo:SELECTOR_MEMBER_RESERVED_CONFIRM_DIALOG
						}
				);
			});
		}
};

//予約決定ダイアログ用設定
dialogOption['memberReservedConfirmDialog'] = {
		// 幅を設定する。
		width			: 'auto',
		// 幅を設定する。
		// ダイアログを生成と同時に開く。
		autoOpen		: false,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		// ボタン
		buttons:[
		        //はいボタン
		        {
		        	text:'はい',	//ボタンのテキスト
		        	//クリックイベントの記述
		        	click:function(){
		        		
		        	}
		        },
		        //いいえボタン
		        {
		        	text:'いいえ',	//ボタンのテキスト
		        	//クリックイベントの記述
			        	click:function(){
			        		
			        }
		        }
		]
		
};

//ダイアログのコール前に呼ぶ関数を連想配列に格納しておく
var readyDialogFunc = {};

//ログインダイアログの準備関数
readyDialogFunc['loginDialog'] = function(){
	creator.getJsonFile('source/login.json');	// ファイルのデータをjsonを用いて持ってくる

	//ダイアログのタグを作る。
	creator.outputTag('loginDialog');
};

//予約ダイアログの準備関数
readyDialogFunc['specialReservedDialog'] = function(content, array){
	// ダイアログのデータを格納する連想配列を宣言し、引数の配列に格納されたコンテンツ名と予約希望日時を格納する。
	reservedData = {'year': array[0], 'month': array[1], 'day': array[2]};
	
	//@add 2015.0527 T.Masuda この関数が呼ばれるたびにreserved.htmlを読み込んでいた不具合を修正
	//予約ダイアログのDOMを読み込んでいなければ
	if(!$('.specialReservedDialog' ,creator.dom).length){
		creator.getDomFile('template/reserved.html');	//タグを作るためにテンプレートのDOMを取得する。
	}
	
	// ダイアログの本体となるdivタグを生成する。
	creator.reservedDialog[content]();

	//希望曜日の選択があれば
	if($('input[name="dayOfWeek"]').length){
		// 全ての曜日のチェックボックスにチェックする
		allCheckbox('.allDayCheckbox', 'input[name="dayOfWeek"]');
	}
	//希望週の選択があれば
	if($('input[name="week"]').length){
		// 全ての週のチェックボックスにチェックする
		allCheckbox('.allWeekCheckbox', 'input[name="week"]');
	}
	
	// ダイアログに日付欄を追加する。
	createSpecialDate(reservedData['year'], reservedData['month'], reservedData['day']);
};

//予約希望情報送信前の確認ダイアログ
readyDialogFunc['specialReservedConfirmDialog'] = function(reservedData){
		// ダイアログの本体となるdivタグを生成する。
		creator.outputTag('specialReservedConfirmDialog');
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
	//ログイン中であれば	※空のcookieに対しては、IEは文字列"undefined"を返し、それ以外は空文字を返す。
	if('user' in cookies && (cookies['user'] != "" && cookies['user'] != "undefined")){
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
 * 変更者:T.Masuda
 * 変更日:2015.06.10
 * 内容　:ダイアログを呼ぶ関数を共通化したものにしました
 */
function checkLoginState(){
	// ログイン状態をチェックする。
	if(!(checkLogin())){
		//ログインボタンのイベントを設定する。
		$('.login').on('click', function(){
			// ログインダイアログを作る
			var login = new loginDialog(null, null, {autoOpen:true});
			login.open();	//ログインダイアログを開く
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
var init = getInitData(INIT_JSON_PATH, 100);

/* 
 * 関数名:insertConfirmReserveJsonDialogValue
 * 概要  :授業一覧レコードの値を予約確定ダイアログのJSONに渡す。
 * 引数  :Object sendObject:値を渡す元となるオブジェクト
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.06.14
 */
function insertConfirmReserveJsonDialogValue(sendObject){
	//値を格納するオブジェクトの、可能なまで深い参照を変数に格納する
	var object = creator.json.memberReservedConfirmDialogContent;
	
	//順次オブジェクトから取り出したデータをJSONのしかるべき場所にセットしていく
	object.lessonConfirm.lessonInfo.timeSchedule.text = sendObject.start_time + SYMBOL_UNIT + sendObject.end_time;
	object.lessonConfirm.lessonInfo.store.text = sendObject.school_name;
	object.lessonConfirm.lessonInfo.course.text = sendObject.lesson_name;
	object.lessonConfirm.lessonInfo.price.text = 0;
//	object.lessonConfirm.lessonInfo.price.text = sendObject.;
	object.lessonConfirm.lessonStage.stageValue.text = sendObject.stage_no;
	object.lessonConfirm.lessonStage.levelValue.text = sendObject.level_no;
	object.attention.cancelRateValue.thatDayValue.text = 0;
	object.attention.cancelRateValue.oneBeforeDayValue.text = 0;
	object.attention.cancelRateValue.twoBeforeDayValue.text = 0;
	object.attention.addPointValueFirst.onePersonValue.text = 0;
	object.attention.addPointValueFirst.twoPeopleDayValue.text = 0;
	object.attention.addPointValueSecond.fourPersonValue.text = 0;
	object.attention.addPointValueSecond.eightPeopleDayValue.text = 0;
//	object.attention.cancelRateValue.thatDayValue.text = sendObject.;
//	object.attention.cancelRateValue.oneBeforeDayValue.text = sendObject.;
//	object.attention.cancelRateValue.twoBeforeDayValue.text = sendObject.;
//	object.attention.addPointValueFirst.onePersonValue.text = sendObject.;
//	object.attention.addPointValueFirst.twoPeopleDayValue.text = sendObject.;
//	object.attention.addPointValueSecond.fourPersonValue.text = sendObject.;
//	object.attention.addPointValueSecond.eightPeopleDayValue.text = sendObject.;
	
}


