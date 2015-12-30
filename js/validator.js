/** ファイル名:validator.js
 * 概要　　　:validate用クラスの定義のファイル
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:js/validator.js
 */

/** クラス名:validator.js
 * 概要　:validate用クラス
 * 引数	:なし
 * 作成日:2015.1230
 * 作成者:T.Masuda
 */
function validator () {

	//validation用関数をオブジェクトに登録する
	this.method = {
			//数値チェック
			isNumeric : this.checkNumeric,
			//nullチェック
			isNull : this.checkNull,
			//空文字チェック
			isEmpty : this.checkEmpty
	} 
	
	/* 関数名:validate
	 * 概要　:指定したルールでvalidationを行う
	 * 引数　:Object rules : validationルールのオブジェクト。以下の構成となる
	 * 		{
	 * 			valuesのkey(主にフォームパーツのname属性値) : [
	 * 				validationルール名(isNumeric、isNull等) , ... 
	 * 			]
	 * 		}
	 * 		:Object values : validation対象の値が格納された
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.1230
	 * 作成者　:T.Masuda
	 */
	this.validate = function(rules, values) {

		//指定したチェックを行う
		for (key in rules) {
			//validationルールを取り出す
			var rule = rules[key];
			//設定されたvalidationルールの数を取得する
			var ruleNumber = rule.length;
			//ruleに登録されたkey(=validatorクラスのvalidation関数名)を走査する
			for (var i = 0; i < ruleNumber; i++) {
				//該当するものがあれば
				if (rule[i] in this.method) {
					//validationがinvalidであることをエラーとしてtry-catch節を開始する
					try {
						//validation関数をコールする
						this.method[key](values[key]);
					//validationエラーが発生したら
					} catch (e) {
						//呼び出し元にエラーを渡す。形式としては文字列をエラーメッセージとして渡す
						throw e;
					}
				}
			}
		}
	}
	
	/* 関数名:checkNumeric
	 * 概要　:渡された値が数値かどうかを調べる
	 * 引数　:? value : 整数かどうかを確認する対象
	 * 返却値:boolean : 判定結果
	 * 作成日　:2015.1230
	 * 作成者　:T.Masuda
	 */
	this.checkNumeric = function(value) {
		//返す判定結果の変数を用意する
		var retBoo = true;
		
		//数値であれば
		
	}
	
}

//様々な場所で利用されるため予めインスタンスを生成しておく
var VALIDATOR = new validator();