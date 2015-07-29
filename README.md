# ddtflower

環境ごとに設定の読み込みを変える方法(現状DBだけ)  
①php/DbDefine_dev.phpの定義を自分の環境に合わせて変える。  
②各自のapacheのhttpd.confに⬇️の一行を追加  
SetEnv DDT_FLOWER_ENV dev  
③apacheを再起動  
これで①のhp/DbDefine_dev.phpの定義が適用される。  
※環境変数にDDT_FLOWER_ENVが定義されてなければ本番としてsuffixなしの「php/DbDefine.php」が適用される。
