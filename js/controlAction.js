/* アクションを制御するJSファイル。 */

/*
 * 関数名:clickButtonToFile(parentClass)
 * 引数  :String parentClass:対象となる要素の親要素。
 * 　　　　String sendValTarget:アップロードされたファイルを渡す対象。ボタンと同じ階層。
 * 戻り値:なし
 * 概要  :ボタンを押したら同階層のファイルアップロードのボタンを押した事にする。
 * 作成日:2015.03.18
 * 作成者:T.M
 */
function clickButtonToFile(parentClass, sendValTarget){
	//アップロードボタンのchangeイベントを定義する。
	$(document).on('change', parentClass + ' > input[type="file"]', function(){
		//指定した対象に値を渡す。
		$(sendValTarget, $(this).parent()).val($(this).val());
	});
	
	//ボタンのクリックイベントを登録する。
	$(document).on('click', parentClass + ' > button', function(){
		//アップロードボタンをクリックする。
		$('input[type="file"]', $(this).parent()).click();
	});
}


/*
 * 関数名:checkAllRecord()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :見出しのチェックボックスをクリックしたら全ての行のチェックボックスのオンオフが切り替わる。
 * 作成日:2015.03.26
 * 作成者:T.M
 */
function checkAllRecord(){
	//見出し行のチェックボックスがクリックされたら
	$(document).on('click', '.tableHead th:first-child input:checkbox', function(){
		var parentTable = $('table').has(this);
		//見出し行のチェックボックスにチェックが入ったら
		if($(this).is(':checked')){
			//1列目のチェックボックスをみんな入れる。
			$('tr td:first-child input:checkbox', parentTable).prop('checked', true);
		//そうでなければ
		} else{
			//1列目のチェックボックスをみんな外す。
			$('tr td:first-child input:checkbox', parentTable).prop('checked', false);
		}
	});
}

/*
 * 関数名:function showRightOutOfDisplayButton(selector, timeout)
 * 引数  :String selector:対象となる要素のセレクタ。
 * 		:int timeout:ボタンの表示を始めるまでの時間。ミリ秒。
 * 		:int speed:メソッドが実行されてから変化が終わるまでの時間。
 * 戻り値:なし
 * 概要  :対象を右の画面外において、一定時間後に移動しながら表示する。
 * 作成日:2015.04.07
 * 作成者:T.M
 */
function showRightOutOfDisplayButton(selector, timeout, speed){
	var b = $("#container").width();
	var c = $(".main").width();
	var a = $("#container").width() - $(".main").width() / 2 + $(selector).width();
	//画面外に置く。
	$(selector).css("right", -($("#container").width() - $(".main").width() / 2 + $(selector).width()) + "px");
	$(selector).css("display", "block");	//表示する。
	
	//時間を置いてコードを実行する。
	window.setTimeout(function(){
		$(selector).animate({right:"5px"}, speed, "easeOutCubic");	//対象を移動させて表示する。
	}, timeout);	//timeoutミリ秒後にスタートする。
}

/*
 * 関数名:function fadeToggleSet(clicked, target, setClass, delay)
 * 引数  :String clicked:クリックイベントの対象となる要素のセレクタ。
 * 		:String target:クリックして表示/非表示が切り替わる要素のセレクタ。
 * 		:String setClass:targetをくくるクラスのセレクタ。
 * 		:int delay:フェードイン・アウトにかかる時間。ミリ秒。
 * 戻り値:なし
 * 概要  :clickedを押すとtargetがフェードイン・フェードアウトするイベントを登録する。
 * 作成日:2015.04.07
 * 作成者:T.M
 */
function fadeToggleSet(clicked, target, setClass, delay){

	//clicked以外をクリックしたらtargetが消えるイベント。何かしらクリックしたら判定を行う。
	$(document).on('click touchend',function(event){
		//clicked以外をクリックしていたら
		if (!$.contains($(clicked)[0], event.target)) {
			$(target).fadeOut(delay);	//targetを隠す。
		}
	});

	//clickedのクリックイベントを登録する。
	$(clicked).on('click' , function(){
		//他に表示されていれば
		if($(setClass + ':visible:not(' + target + ')').length > 0){
			//フェードアウトさせる。
			$(setClass + ':visible').fadeOut(delay);
			$(target).fadeIn(delay);	//自分だけ表示する。
		//そうでなければ
		} else {
			//targetがdelayミリ秒かけてフェードアウト・インをする。
			$(target).fadeToggle(delay);
		}
	});
}


/*
 * イベント名:$(document).on('click', '#studentManagement .addSearchContent', function()
 * 引数  　 	:なし
 * 戻り値　 :なし
 * 概要  　 :生徒さん登録・編集タブの検索ボックスを増やすボタンのイベント。
 * 作成日　　:2015.04.07
 * 作成者　　:T.Masuda
 */
$(document).on('click', '#studentManagement .addSearchContent', function(){
	var makeLimit = 10;	//作成できる限界の数を設定する。
	var $formParent = $(this).parent().parent();	//フォームの親要素を取得する。
	
	//まだ作れるなら
	if($('.selectSearchContent', $formParent).length <= makeLimit){
		//現状の最後の検索ボックスを取得する。
		var $sinceLast = $('.selectSearchContent:last', $formParent);
		
		//createTagで新たな検索ボックスを作る。
		creator.outputTag('studentSelectSearchContent', 'studentSelectSearchContent', $formParent);
		//新たな検索ボックスを取得する。
		var $newLast = $('.selectSearchContent:last', $formParent);
		$sinceLast.after($newLast);	//以前の最後の検索ボックスの後ろに新しい検索ボックスを配置する。
	}
});

/*
 * イベント名:$(document).on('click', '#studentManagement .deleteSearchContent', function()
 * 引数  　 	:なし
 * 戻り値　 :なし
 * 概要  　 :生徒さん登録・編集タブの検索ボックスを減らすボタンのイベント。
 * 作成日　　:2015.04.08
 * 作成者　　:T.Masuda
 */
$(document).on('click', '#studentManagement .deleteSearchContent', function(){
	var deleteLimit = 1;	//作成できる限界の数を設定する。
	var $formParent = $(this).parent().parent();	//フォームの親要素を取得する。
	
	//まだ消せる
	if($('.selectSearchContent', $formParent).length > deleteLimit){
		//最後の検索ボックスを削除する。
		var $sinceLast = $('.selectSearchContent:last', $formParent).remove();
	}
});
