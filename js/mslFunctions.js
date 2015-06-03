/*
 * ファイル名:mslFunctions.js
 * 概要   :MSLのlist.php、detail.php用の画面遷移調整JavaScript
 * 作成日 :2015.06.03
 * 作成者 :T.M
 */

//URLをルートディレクトリまで階層を戻すための文字列
ROOT_DIR = '../../../'; 

/*
 * 関数名:isSupportPushState()
 * 引数  :なし
 * 戻り値:boolean
 * 概要  :ブラウザがpushStateに対応しているかをbooleanで返す。
 * 作成日:2015.03.10
 * 作成者:T.M
 */
function isSupportPushState(){
	// 返却値を格納する変数returnsを宣言し、falseで初期化する。
	var returns = false;
	//ブラウザがpushStateに対応していれば
	if(window.history && window.history.pushState){
		//trueを返す様にする。
		returns = true;
	}
	
	//returnsを返す。
	return returns;
}


/*
 * 関数名:linkClicked
 * 引数   :String Selector:クリック対象のセレクタ
 * 戻り値 :なし
 * 概要   :クリックして画面遷移の関数を呼ぶイベントを登録する関数
 * 作成日 :2015.06.03
 * 作成者 :T.M
 */
function linkClicked(selector){
	// リンクをクリックした後のイベント。新規タブを開くリンクについては処理しない。
	$(document).on('click', selector, function(event){
		//URLを引数にしてページを切り替える関数をコールする。
		pageMove($(this).attr('href'));
		//デフォルトの画面遷移処理をキャンセルする
		event.preventDefault();
	});
}

/*
 * 関数名:pageMove(url)
 * 引数  :String url
 * 戻り値:なし
 * 概要  :画面遷移を行う
 * 作成日:2015.06.03
 * 作成者:T.M
 */
function pageMove(url){
	//urlから#を抜き取り、有効なURLを形成する。
	//url = url.replace(/#/g, '');
	//画面遷移を行う
	location.href =  '../../../' + url;
}

/*
 * 関数名:removeTextNode
 * 引数  :String Selector:セレクタの文字列
 * 戻り値:なし
 * 概要  :指定した要素のテキストノードを消す
 * 作成日:2015.06.03
 * 作成者:T.M
 */
function removeTextNode(selector){
	//要素の子ノードを取得する
	var childen = $(selector)[0].childNodes;
	//子ノードの数を取得する
	var childrenLength = childen.length;
	//子ノードを走査する
	for(var i = 0; i < childrenLength; i++){
		//テキストノードなら
		if(childen[i].nodeType == 3){
			//テキストノードを削除する
			childen[i].textContent　= '';
		}
	}
}

