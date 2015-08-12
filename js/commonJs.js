/* 
 * ファイル名:commonJs.js
 * 概要  :どのページにも共通して使用できる関数群
 * 作成者:T.Yamamoto
 * 作成日:2015.08.10
 * パス :/js/commonJs.js
 */

DATA 											 = 'data';
CONFIG 											 = 'config';


/*
 * 関数名:createObject
 * 概要  :引数のkey名とValueの連想配列を作る
 * 引数  :string key:連想配列のkey名,
 		string:value:連想配列のvalue
 * 戻り値:Object:resultObject:生成した連想配列
 * 作成日:2015.08.10
 * 作成者:T.Yamamoto
 */
function createObject(key, value) {
	//連想配列を作れるように初期化して作る
	var resultObject = {};
	//第一引数のkey名で第二引数がvalueの値を作る
	resultObject[key] = value;
	//作った連想配列を返す
	return resultObject;
}

/*
 * 関数名:setConfigArgument
 * 概要  :第一引数の連想配列に対して、第二引数のkeyと第三引数のvalueの要素を追加する
 * 引数  :object mergeObject:結合する連想配列
 		 object2:結合元の連想配列2,
 * 戻り値:Object:resultObject:生成した連想配列
 * 作成日:2015.08.10
 * 作成者:T.Yamamoto
 */
function setConfigArgument(setObject, configObject) {
	//ダイアログの設定の連想配列をセットする
	return setObject[CONFIG] = configObject;
}


/*
 * 関数名:setDataArgument
 * 概要  :受け取った連想配列について、新たにkeyとvalueを設定する
 * 引数  :object setObject:値をセットする連想配列
 		 string:setKey:値をセットするkey名,
 		 string:setValue:値をセットするvalue,
 * 戻り値:Object:resultObject:生成した連想配列
 * 作成日:2015.08.10
 * 作成者:T.Yamamoto
 */
function setConfigArgument(setObject, setkey, setValue) {
	//ダイアログの設定の連想配列をセットする
	return setObject[setkey] = setValue;
}

// function createArgumentObject(configObject)

// var abc = {a:1,
// 		b:2,
// 		c:3};
// var test = {data:''};
// // setConfigArgument(c, 'test', 99);
// setConfigArgument(test, abc);
// console.log(test);

