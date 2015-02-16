/*
 * 関数名:functionFilter
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :引数をセレクターにしてマウスオーバーしたときに透過率を0.5にする
 * 作成日:2015.02.05
 * 作成者:T.Y
 */
function functionFilter (filterTarget) {
  // jqueryの記述の始まり
  $(function() {
    $(filterTarget)							// 引数に対して、透過度を調整する
    	.mouseenter(function() {			// 引数の要素にマウスを乗せた時の処理
    		$(this).css("opacity", 0.5);	// 引数の要素の透過度を0.5にする
    	})
    	.mouseleave(function() {			// 引数の要素からマウスが離れたときの処理
    		$(this).css("opacity", 1);		// 引数の要素の透過度を戻す
    	});
  });// jqueryの記述の終わり
}