// 汎用的な処理をまとめたJSファイル。

// ドキュメント読み込み後の処理
$(document).ready(function(){
	// リンクをクリックしたら
	$(document).on('click', 'a[href$=".html"]', function(event){
		//URLを引数にしてページを切り替える関数をコールする。
		callPage($(this).attr('href'));
		//通常の画面遷移をキャンセルする。
		event.preventDefault();
	});
});

/*
 * 関数名:callPage(url, state)
 * 引数  :String url, Object state
 * 戻り値:なし
 * 概要  :新たにページを読み込む。
 * 作成日:2015.03.05
 * 作成者:T.M
 * 修正日:2015.03.06
 * 修正者:T.M
 * 内容　:戻るボタンに対応しました。
 */
function callPage(url, state){
	//Ajax通信を行う。
	$.ajax({
		//URLを指定する。
		url: url,
		//HTMLを返してもらう。
		dataType:'html',
		//同期通信を行う。
		async: false,
		//通信成功時の処理
		success:function(html){
			//ギャラリーがあったら
//			if($('.footGallery').length > 0){
//				//ギャラリーを破棄する。
//				destroyGallery('.footGallery');
//			}
			//mainのタグを空にする。
			$('.main').empty();
			//linkタグを収集する。
			var links = $(html).filter('link');
			//scriptタグを収集する。
			var scripts = $(html).filter('script:parent');
			//linkタグを展開する。
			links.each(function(){
				//headタグ内にlinkタグを順次追加していく。
				$('.main').append($(this));
			});
			//scriptタグを展開する。
			scripts.each(function(){
				//mainのタグの中にscriptタグを展開し、JavaScriptのコードを順次実行する。
				$('.main').append($(this));
			});
			//カレントのURLを更新する。
			currentLocation = url;
			//第二引数が入力されていなければ
			if(state === void(0)){
				//画面遷移の履歴を追加する。
				history.pushState({'url':currentLocation}, '', location.href);
			}
		}
	})
	//JSONデータを格納する変数を初期化する。
	creator.json = null;
	//ひな形のHTMLのDOMを格納する変数を初期化する。
	creator.dom = '';
}

/*
 * 関数名:callLoadingScreen()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :ローディング画面を表示する。
 * 作成日:2015.03.02
 * 作成者:T.Masuda
 */
function callLoadingScreen(){
		//ローディング画面を出す。
		$('.loading').css('display','block');
}

/*
 * 関数名:hideLoadingScreen()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :ローディング画面を隠す。
 * 作成日:2015.03.05
 * 作成者:T.Masuda
 */
function hideLoadingScreen(){
	//ローディング画面を隠す。
	$('.loading').css('display','none');
}

/* ローディング画面呼び出しのイベント登録 */
$(document).ready(function(){
	//ローディング画面を追加する。
	$('body').prepend($('<div></div>')
			.addClass('loading')
			//ローディング画像を追加する。
			.append($('<img>')
					//ローディング画像のパスを追加する。
					.attr('src', 'image/loading.gif')
			)
			//Loadingの文字を表示する。
			.append($('<p></p>')
					//文字を追加する。
					.text('Loading...')
			)
	);
});

/*
 * 関数名:createFormData(form)
 * 引数  :jQuery form
 * 戻り値:Object
 * 概要  :フォームの投稿データを作る。
 * 作成日:2015.03.09
 * 作成者:T.Masuda
 */
function createFormData(form){
	//返却するデータを格納する変数を宣言する。
	var formDataReturn = {};
	
	//フォーム内の入力要素を走査する。
	$('input, textarea, input:radio:checked, input:checkbox:checked', form).each(function(){
		//値を取得する。
		var val = $(this).val();
		//name属性の値を取得する。
		var name = $(this).attr('name');
		
		//name属性で括られた最初のチェックボックスなら
		if($(this).attr('type') == 'checkbox' 
			&& $(this).index('[name="' + name + '"]') == 0){
			//valを配列として扱う。
			val = [];
			//name属性で括られたチェックボックスを走査していく。
			$('input:checkbox[name="' + name + '"]').each(function(i){
				//配列にチェックボックスの値を格納していく。
				val[i] = $(this).val();
			});
			//formDataを連想配列として扱い、keyとvalueを追加していく。
			formDataReturn[name] = val;
		//チェックが入った2番目以降のチェックボックスであるか、name属性がない入力要素であれば
		} else if(($(this).attr('type') == 'checkbox' 
			&& $(this).index('[name="' + name + '"]') != 0) || name === void(0)){
			//何もしない。
		//それ以外であれば
		} else {
			//formDataを連想配列として扱い、keyとvalueを追加していく。
			formDataReturn[name] = val;
		}
	});
	
	//フォームデータを返す。
	return formDataReturn;
}

/* フォームがsubmitされたら */
$(document).on('submit', 'form', function(event){
	//submitイベントをキャンセルする。
	event.preventDefault();
	//フォームのaction属性から送信URLを取得する。
	var url = $(this).attr('action');
	
	//送信するデータを格納する連想配列を作成する。
	var formData = createFormData($(this));
	
	//postメソッドでフォームの送信を行う。
	$.post(url, formData,
	// 成功時の処理を記述する。
	 function(data){
		//mainのタグを空にする。
		$('.main').empty();
		//取得したページのmainタグ直下の要素をを取得し、mainのタグに格納する。
		$('.main').append($('.main > *', data));
		//linkタグを収集する。
		var links = $(data).filter('link');
		//scriptタグを収集する。
		var scripts = $(data).filter('script:parent');
		//linkタグを展開する。
		links.each(function(){
			//headタグ内にlinkタグを順次追加していく。
			$('.main').append($(this));
		});
		//scriptタグを展開する。
		scripts.each(function(){
			//mainのタグの中にscriptタグを展開し、JavaScriptのコードを順次実行する。
			$('.main').append($(this));
		});
		//カレントのURLを更新する。
		currentLocation = url;
	});
});

//現在選択中のページ
currentLocation = '';

/*
 * 関数名:functionFilter
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :引数をセレクターにしてマウスオーバーしたときに透過率を0.5にする
 * 作成日:2015.02.05
 * 作成者:T.Y
 * 変更日:2015.02.22
 * 変更者:T.Masuda
 * 内容  :トップメニューにある表示中のページのボタンの背景色を変える。
 */
function functionFilter (filterTarget) {
  // jqueryの記述の始まり
	//現在表示中のページのボタン以外に対して
    $(document)
        .on('mouseenter', filterTarget, function() {	// 引数の要素にマウスを乗せた時の処理
            $(this).addClass('active');   				 // 引数の要素にactiveクラスを付与する。
        })
        .on('mouseleave', filterTarget, function() {	// 引数の要素からマウスが離れたときの処理
            $(this).removeClass('active');  			// 引数の要素からactiveクラスを除去する。
        });
}
	
/*
 * 関数名:changeSelectedButtonColor
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :選択した要素の色を変えるクラスを付与する。
 * 作成日:2015.03.06
 * 作成者:T.Masuda
 */
function changeSelectedButtonColor(filterTarget){
	//一旦全てのactive,currentクラスを剥奪する。	
	$(filterTarget).removeClass('active');
	$(filterTarget).removeClass('current');
	// 現在のページのボタンの枠に対して、currentクラスを付与する。
	$(filterTarget, document).filter(':has(a[href$="' + currentLocation + '"])').addClass('current');
}

//Ajax通信が始まったら
$(document).ajaxStart( function(){
	//ローディング画面を出す。
	callLoadingScreen();
});
//Ajax通信が全て終了したら
$(document).ajaxStop( function(){
	//ローディング画面を隠す。
	hideLoadingScreen();
	//選択されたトップメニューの色を変える。
	changeSelectedButtonColor('.topMenu li');
});
/* 以上、ローディング画面呼び出しのイベント登録。 */

//popStateに対応できているブラウザであれば
if (window.history && window.history.pushState){
	//popStateのイベントを定義する。
    $(window).on("popstate",function(event){
        //初回アクセスであれば何もしない。
    	if (!event.originalEvent.state){
    		return; // 処理を終える。
    	}
        var state = event.originalEvent.state; 	//stateオブジェクトを取得する。
        currentLocation = state['url'];
        callPage(state['url'], state);			//履歴からページを読み込む。
  });
}

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
 */
function createReservedData(reservedData){
	
	// reservedDataに選択作品のデータを格納する。
	reservedData['construct'] = $('input[name="construct"]:checked').val();
	// reservedDataに選択した時限のデータを格納する。
	reservedData['schedule'] = $('input[name="schedule"]:checked').val();
	// 選択した予備日程の曜日を配列で取得してreservedDataに格納する。
	reservedData['weekDay'] = getCheckBoxValue('dayOfWeek');
	// 選択した予備日程の週を配列で取得してreservedDataに格納する。
	reservedData['weekNumber'] = getCheckBoxValue('week');
	
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
 * 関数名:createSpecialReservedDialog(json, array)
 * 概要  :特別レッスン予約用ダイアログを生成する。
 * 引数  :Object json, Array array
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
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
		// ダイアログが閉じられる前のイベント
		beforeClose:function(event, ui){
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
			        		 // 必須入力項目が皆入力済みであれば
			        		 if($('input[name="construct"]:checked' ,this).length > 0 
			        				 && $('input[name="schedule"]:checked' ,this).length > 0){
				        		 // 予約希望データを作成する。
			        			 reservedData = createReservedData(reservedData);
				        		 
				        		 // 入力確認ダイアログを呼び出す。
				        		 createSpecialReservedConfirmDialog(reservedData);
				        		 // このダイアログの入力要素を一時的に無効化する。
				        		 disableInputs($(this));
			        		 } else {
			        			 alert('作品、時限、またはその両方が未入力となっています。');
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
 */
function createSpecialDate(year, month, day){
	// 曜日の配列を宣言、初期化する。
	var weekChars = [ '日', '月', '火', '水', '木', '金', '土' ];
	// 予約希望ダイアログに予約希望日時が書かれたタグを追加する。
			// 年月日と曜日のテキストデータを流し込む。月は日付型で0〜11で表現されているので、-1する。
			$('.specialReservedDialog').attr('title', year + '年' + month + '月' + day + '日' 
					+ '(' + weekChars[new Date(year, month - 1, day).getDay()] + '曜日)')
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
	// ダイアログを消去する。
	current.dialog('close').dialog('destroy').remove();
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
 * 関数名:createSpecialReservedConfirmDialog(reservedData)
 * 概要  :入力内容を表示して送信を確定するダイアログを表示する。
 * 引数  :Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 */
function createSpecialReservedConfirmDialog(reservedData){
	// ダイアログの本体となるdivタグを生成する。
	creator.outputTag('specialReservedConfirmDialog');
	
	// 入力された予約内容を一覧表示する。
	createSpecialConfirmSummary(reservedData);
	
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
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			// タイトルバーを見えなくする。
			$(this).prev().children().filter('button').css('display', 'none');
			$(this).next().css('font-size', '0.5em');
		},
		// ダイアログが閉じられる前のイベント
		beforeClose:function(event, ui){
			// ロストした分のダイアログのDOMを補填する。
			creator.getDomFile('source/template.html');		// ファイルのhtmlデータをdomを用いて持ってくる
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
			        		 // サーバに予約希望データを送信する。
			        		 sendReservedData(reservedData);
			        		 
			        	 }
			         },
			         {
			        	 // キャンセルボタンのテキスト。
			        	 text:'Cancel',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // 前のダイアログに戻る。
			        		 moveToPrevDialog($(this));
			        		 }
			        	 }
			         
		         ]
	});
}

/* 
 * 関数名:createSpecialConfirmSummary(reservedData)
 * 概要  :予約データを予約内容確認ダイアログに書き出す。
 * 引数  :Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 */
function createSpecialConfirmSummary(reservedData){
	// 予約希望日時を書き出す。
	$('.dateValue').text(reservedData['year'] + '年' + reservedData['month'] + '月' + reservedData['day'] + '日')
	// 希望作品を書き出す。
	$('.constructValue').text(reservedData['construct']);
	// 希望の時限を書き出す。
	$('.scheduleValue').text(reservedData['schedule']);
	// 予備の希望曜日を書き出す。
	$('.subWeekOfDayValue').text(reservedData['weekDay']);
	// 予備の希望週を書き出す。
	$('.subWeekValue').text(reservedData['weekNumber']);
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
			        					//クッキーにユーザ情報を格納する。
			        					 document.cookie = 'user='+transResult["user"];
			        					 document.cookie = 'userName='+transResult["userName"];
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
 * 関数名:createCalendar
 * 引数  :なし
 * 戻り値:なし
 * 概要  :カレンダーを作る
 * 作成日:2015.02.06
 * 作成者:T.Y
 * 変更者:2015.02.10
 * 作成者:T.M
 * 概要  :カレンダーをクリックした時のコールバック関数を追加しました。
 * 変更者:2015.02.21
 * 作成者:T.M
 * 概要  :カレンダーのタグを作る記述を削除しました。
 */
function createCalendar () {
  // jqueryの記述の始まり
    $(function() {
        //@mod 2015.02.21 T.Masuda カレンダーのタグを作る記述を削除しました。
    	// カレンダーを表示するためのdivを作る
        //$('.specialGuide').after('<div class="calendar"></div>');
        // @mod 2015/02.10 T.M コールバック関数を追加しました。
        // カレンダーを表示する
        //$('.calendar').datepicker();
        // カレンダーを表示する

        $.datepicker.regional['ja'] = {
			closeText: '閉じる',
			prevText: '&#x3c;前',
			nextText: '次&#x3e;',
			currentText: '本日',
			monthNames: ['1月','2月','3月','4月','5月','6月',
			'7月','8月','9月','10月','11月','12月'],
			monthNamesShort: ['1月','2月','3月','4月','5月','6月',
			'7月','8月','9月','10月','11月','12月'],
			dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
			// dayNamesShort: ['日','月','火','水','木','金','土'],
			// dayNamesMin: ['日','月','火','水','木','金','土'],
			weekHeader: '週',
			dateFormat: 'yy/mm/dd',
			firstDay: 0,
			isRTL: false,
			showMonthAfterYear: true,
			yearSuffix: '年'};
			$.datepicker.setDefaults($.datepicker.regional['ja']);

        $('.calendar').datepicker({
        	// カレンダーの日付を選択したら
        	onSelect: function(dateText, inst){
        		// 予約のダイアログを出す。
        		callReservedDialog(dateText);
        	}
        });
        // ここまで追加・修正しました。
    });// jqueryの記述の終わり
}



/*
 * 関数名:toolTip
 * 引数  :var targetElement
 * 戻り値:なし
 * 概要  :引数の要素に対してツールチップを表示する
 * 作成日:2015.02.06
 * 作成者:T.Y
 */
function toolTip() {
  $(function() {
    //　要素を追加する処理
    $('body').append('<div class="tip"></div>');

    $('.tip')                         // 表示するツールチップに関するcssを有効にする
      .css({                          // jqueryでcssを記述する宣言をする
          border: '1px solid Black',  // 枠線を1pxで黒色、実線で描く
          backgroundColor: '#ffc',    // 背景を黄色っぽくする
          fontSize: 'smaller',        // ツールチップ内での文字のサイズは小さめにする
          padding: '2px',             // 2px分要素全体の幅を広くとる
          position: 'absolute',       // ポジションを絶対位置にする
          display: 'none'             // 画面には表示しない

      })
    //ツールチップを表示する処理
    $('.tiplink')
      //マウスオーバしたときの処理
      .mouseenter(function(e) {
      //.tipがアニメーション中でない場合のみ処理をする
        $('.tip:not(:animated)')
        //data-tips属性から本体テキストを設定
          .text($(this).data('tips'))
        //マウスの座標に応じて表示位置を決定
          .css({
            top: e.pageY,//現在マウスポインターがあるY座標
            left: e.pageX,//現在マウスポインターがあるX座標
            zIndex: 2,
          })
          .fadeIn(300);//300ミリ秒かけて表示する
      })
      //マウスオーバから離れたときの処理
      .mouseleave(function(e) {
      $('.tip')//tipの中身について
        .fadeOut(500);//500ミリ秒かけて表示しなくなる
      })

  });  
}

/*
 * 関数名:getContentName()
 * 引数  :なし
 * 戻り値:String
 * 概要  :URLから現在のファイル名を取り出し返す。
 * 作成日:2015.02.12
 * 作成者:T.M
 */
function getContentName(){
	// URLからファイル名を取得する。
	var contentName = location.href.substring(location.href.lastIndexOf("/")+1,location.href.length);
	// ファイル名から拡張子を取り除く。
	contentName = contentName.substring(0,contentName.indexOf('.'));
	// ファイル名に予約コンテンツであるということを示す文字列を追加する。
	contentName = contentName + 'Reserved';
	
	//contentNameを返す
	return contentName;
}

/*
 * 関数名:createDateArray(dateText)
 * 引数  :String dateText
 * 戻り値:なし
 * 概要  :日付文字列を配列にして返す。
 * 作成日:2015.02.12
 * 作成者:T.M
 */
function createDateArray(dateText){

	// 選択した日付を1つの文字列から配列に変換する。
	var date = dateText.split('/');
	//@mod 2015.02.19 T.M jQuery UIのバージョン変更により不要になりました。
	// 配列内の日付の並びが年月日になっていないので、並びを修正した配列を整数に直した上でtrueDateに格納する。
//	var trueDate = [parseInt(date[2]), parseInt(date[0]), parseInt(date[1])];

	//@mod 2015.02.19 T.M jQuery UIのバージョン変更により、trueDateではなくdateを返すことになりました。
	// trueDateを返す。
	return date;
	// trueDateを返す。
//	return trueDate;
}

/*
 * 関数名:callReservedDialog
 * 引数  :String dateText
 * 戻り値:なし
 * 概要  :ページに対応した予約ダイアログを生成する。
 * 作成日:2015.02.10
 * 作成者:T.M
 */
function callReservedDialog(dateText){
	// コンテンツ名を取得する。
	var contentName = getContentName();
	// 日付配列を取得する。
	var date = createDateArray(dateText)
	
	// コンテンツ名、レッスン予約のダイアログを生成する関数、日付の配列を引数にしてcreateText関数をコールする
	createSpecialReservedDialog(contentName, date);
}

/*
 * 関数名:createGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :カルーセルのギャラリーを生成する。
 * 作成日:2015.02.21
 * 作成者:T.M
 * 変更日:2015.03.09
 * 変更者:T.M
 * 内容　:setTimeoutを利用してAjax通信でのページ読み込みに対応しました。
 */
function createGallery(selector){
	//一旦ギャラリーを隠す。
	$('.' + selector).hide();
	//時間をおいて関数を実行する。
	window.setTimeout(function(){
		//ギャラリーを見える様にする。
		$('.' + selector).show();
		// jQueryプラグイン「Slick」によりカルーセルのギャラリーを作成する。
		$('.' + selector).smoothDivScroll({
			//カーソル合わせでスクロールする領域を表示する。
			hotSpotScrolling: true,
			//タッチでのスクロールを有効にする。
			touchScrolling: true,
			manualContinuousScrolling: true,
			//マウスホイールによるスクロールを無効にする。
			mousewheelScrolling: false
		});
		// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
		// 拡大表示を行うようにする。
		$('.' + selector + ' a').fancybox({
			'hideOnContentClick': true
		});
	//1秒置いて実行する。
	}, 1000);
}

/*
 * 関数名:destroyGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :カルーセルのギャラリーを破棄する。
 * 作成日:2015.03.09
 * 作成者:T.M
 */
function destroyGallery(selector){
	//選択されたギャラリーを破棄する。
	$(selector).smoothDivScroll("destroy");
}

/*
 * 関数名:createUnmovableGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :不動のギャラリーを生成する。
 * 作成日:2015.02.21
 * 作成者:T.M
 */
function createUnmovableGallery(selector){
// jQueryプラグイン「Slick」によりカルーセルのギャラリーを作成する。
	$('.' + selector).slick({
        //以下2ステップ、矢印を使わない設定。
		accessibility:false,
        arrows:false,
        // レスポンシブレイアウトに対応する。
        responsive:true,
        //可変幅にする。
		variableWidth:true,
        // 用意されている画像の数だけ並べる。
        slidesToShow:$('.' + selector + ' img').length
	});
	
// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
	}); 
}

/*
 * 関数名:allCheckbox
 * 引数  :var checkboxTarget, var allCheckTarget
 * 戻り値:なし
 * 概要  :クリックするとすべてのチェックボックスにチェックを入れる。
 * 作成日:2015.02.28
 * 作成者:T.Yamamoto
 */
function allCheckbox(checkboxTarget, allCheckTarget) {
	// jqueryの記述の始まり
 	$(function() {
 		// 第一引数の要素がクリックされたときの処理
		$('body').on('click', checkboxTarget, function() {
			// 第一引数のチェックボックスにチェックが入った時の処理
			if($(checkboxTarget + ':checked').val() == 'on') {
				// 第二引数のチェックボックスにチェックする
				$(allCheckTarget).prop('checked', true);
			// 第一引数のチェックボックスのチェックが外れた時の処理
			} else if ($(checkboxTarget + ':checked').val() == undefined) {
				// 第二引数のチェックボックスのチェックを外す
				$(allCheckTarget).prop('checked', false);
			};
		});
 	});
}
