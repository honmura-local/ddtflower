<?php
//MSLの情報を読み込むコード
include 'article/inc/mslinfo.php';
//MSLのブログデータを読み込む
$msl_infos = new MSLPageInfo('1197', '1984');
//MSLのギャラリーデータを読み込む
$msl_infos2 = new MSLPageInfo('1197', '1985');
?>
<!DOCTYPE html>
<html>
<head>

<!-- 画面の幅を使用している端末に依存する。加えてズームを許可しない。 -->
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes">
<!-- 使う文字コードを指定する。 -->
<meta charset="UTF-8">
<!-- キャッシュ無効のメタタグ2行 -->
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">

<!-- SEO対策のメタタグ -->
<meta name="description" content="東京のプリザーブドフラワースクール『DDTFlowers』。プリザーブドフラワーや生花コース、ブライダル・フラワーアイテム手作りコースなどフラワーアレンジメントに関することは当スクールにお任せ下さい。多彩なコースをご用意しております。東京都新宿区新宿2-12-1-4F"/>
<meta name="keywords" content="東京,プリザーブドフラワー,スクール,新宿,フラワーアレンジメント,生花,ブライダル"/>

<!-- ファビコンを設定する。 -->
<link rel="shortcut icon" href="image/icon/icon(mobile32).ico">
<!-- iPhone用のアイコンを設定する。 -->
<link rel="apple-touch-icon" href="image/icon/icon(mobile).ico">
<!-- IE用にファビコンを設置する -->
<link rel="shortcut icon" href="image/icon/icon(mobile32).ico" type="image/vnd.microsoft.icon">
<link rel="icon" href="image/icon/icon(mobile32).ico" type="image/vnd.microsoft.icon">

<!-- mslで指定されたCSSファイルを読み込む -->
<link href="article/css/top.css" rel="stylesheet" type="text/css">

<!-- メインのCSSファイルを読み込む。 -->
<link href="css/style.css" rel="stylesheet" type="text/css">
<!-- トップページのCSSファイルを読み込む。 -->
<link href="css/index.css" rel="stylesheet" type="text/css">
<!-- jqueryUIのcssを読み込む -->
<link rel="stylesheet" type="text/css" href="css/jquery-ui-1.10.4.custom.min.css" media="screen" />
<!-- SmoothDivScrollのCSSを読み込む。 -->
<link rel="stylesheet" type="text/css" href="css/smoothDivScroll.css" media="screen" />
<!-- fancyboxのCSSを読み込む。 -->
<link rel="stylesheet" type="text/css" href="js/source/jquery.fancybox.css" media="screen" />
<!-- 会員ページのCSSファイルを読み込む。 -->
<link href="css/memberPage.css" rel="stylesheet" type="text/css">
<!-- 管理者ページののCSSファイルを読み込む。 -->
<link href="css/memberPage.css" rel="stylesheet" type="text/css">

<!-- マイページのブログのCSSを読み込む -->
<link rel="stylesheet" type="text/css" href="css/myPageBlog.css" media="screen" />
<!-- マイページのギャラリーのCSSを読み込む -->
<link rel="stylesheet" type="text/css" href="css/myPageGallery.css" media="screen" />

<!-- Googleアナリティクスのトラッキングコード -->
<script>
//   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

//   ga('create', 'UA-58020246-43', 'auto');
//   ga('send', 'pageview');

</script>

<!-- jQueryの本体を読み込む。 -->
<script src="js/jquery-1.11.0.min.js"></script>
<!-- jQueryUIを読み込む。 -->
<script type="text/javascript" src="js/jquery-ui-1.9.2.custom.min.js"></script>
<!-- ユーティリティクラスのjsファイル。 -->
<script src="js/utils.js"></script>
<!-- サイト全体のレイアウト調整用JSファイル。 -->
<script src="js/flowersstylefix.js"></script>
<!-- タグを作成するJSの関数群を読み込む -->
<script type="text/javascript" src="js/createTag.js"></script>
<!-- カルーセルのギャラリー生成プラグイン「Slick」の本体を読み込む。 -->
<script type="text/javascript" src="js/slick.min.js" ></script>
<!-- クリックした画像をピックアップ表示するためのjQueryプラグイン「fancybox」の本体を読み込む。 -->
<script type="text/javascript" src="js/source/jquery.fancybox.js" ></script>
<!-- マウスホイールの動きに対応するプラグインを読み込む。 -->
<script type="text/javascript" src="js/jquery.mousewheel.min.js"></script>
<!-- ドラッグ用のjQueryプラグインを読み込む。 -->
<script type="text/javascript" src="js/jquery.kinetic.min.js"></script>
<!-- Smooth DIV Scrollの本体を読み込む。 -->
<script type="text/javascript" src="js/jquery.smoothDivScroll-1.3.js"></script>
<!-- easytabsの本体を読み込む。 -->
<script type="text/javascript" src="js/jquery.easytabs.js"></script>
<!-- アップロード機能を提供するjQueryプラグイン -->
<script src="js/jquery.upload-1.0.2.min.js" type="text/javascript"></script>
<!-- 入力チェック機能のjQueryプラグイン -->
<script src="js/jquery.validate.min.js"></script>
<!-- validate.jsの日本語対応プラグイン -->
<script type="text/javascript" src="js/messages_ja.js"></script>
<!-- ローカルからアップロードしたファイルを縮小するプラグインと、必要ファイル2つ -->
<script src="js/binaryajax.js"></script>
<script src="js/exif.js"></script>
<script src="js/canvasResize.js"></script>
<!-- タッチ操作のライブラリ。 -->
<script src="js/jquery.finger.js"></script>

<!-- 各ページ共通の関数ファイルを読み込む -->
<script src="js/page/commonPage.js"></script>
<!-- 画面操作の処理を記述したJSファイルを読み込む。 -->
<script type="text/javascript" src="js/controlPage.js"></script>
<!-- ダイアログ作成の処理を記述したJSファイルを読み込む。 -->
<script type="text/javascript" src="js/createDialog.js"></script>
<!-- 小規模のの処理を記述したJSファイルを読み込む。 -->
<script type="text/javascript" src="js/createLittleContent.js"></script>
<!-- ユーザのアクションに対応するイベントを定義したJSファイルを読み込む。 -->
<script type="text/javascript" src="js/controlAction.js"></script>
<!-- 会員検索クエリを検索ボタンクリックで生成する -->
<script src="js/replaceQuery.js"></script>
<!-- ダイアログ作成用クラス dialogExクラスのJSファイル -->
<script type="text/javascript" src="js/copy_dialogEx.js"></script>
<!-- ダイアログ作成用クラス dialogExクラスのオプションが定義されたJSファイル -->
<script type="text/javascript" src="js/dialogExOptions.js"></script>
<!-- ユーザのアクションに対応するイベントを定義したJSファイルを読み込む。 -->
<script type="text/javascript" src="js/dailyClasses.js"></script>

</head>

<body>
<!-- SEO対策の文章。 -->
<h1 id="SEOHeadText" style="display:none;">【東京】新宿のプリザーブドフラワースクール『DDTFlowers』。生花やブライダル用のフラワーアレンジメントなら是非当スクールへ！</h1>
<!-- container -->
<div id="container">

<header class="header">
</header>
	<div class="main">
<!-- JavaScriptのコードを記述する -->
<script>

//ドキュメント配備後
$(document).ready(function(){
	
try{
	util = new utils();			//汎用関数のクラスのインスタンスを用意する
	var creator = new createLittleContents();	//createTagクラスのインスタンスを生成する
	
	creator.getJsonFile('source/index.json');				// ファイルのデータをjsonを用いて持ってくる
	creator.getJsonFile('source/commonJson.json');			// ファイルのデータをjsonを用いて持ってくる
	creator.getDomFile('template/common.html');		// 共通パーツのDOMを取得する。
	creator.getDomFile('template/toppage.html');	// トップページのパーツのDOMを取得する。
	//ヘッダー内のタグが作成済みでなければ

	creator.createNormalHeaderContent();	//ヘッダー内のタグが作成済みでなければ作る。
	creator.showNormalHeader();				//ヘッダーが隠れていたら表示する。

	creator.outputTag('flowerBackground', 'createImage');	// トップページ背景を作る
	//ブログのお知らせを作る。
	creator.outputTag('topicGallery','topic', '.flowerBackground');
	creator.outputTag('topicCampaign','topic', '.flowerBackground');
	creator.outputTag('topicBlog','topic', '.flowerBackground');
	creator.outputTag('topicShowCampaign','topicShow', '.flowerBackground');
	creator.outputTag('topicShowGallery','topicShow', '.flowerBackground');
	creator.outputTag('topicShowBlog','topicShow', '.flowerBackground');
	
	creator.outputTag('footer');							// フッターを作る
	
	// トップメニューにマウスオーバーのフィルターを配置する。
	functionFilter('.topMenu li');

	// // メイン領域にヘッダーの高さ分のmarginを設定し、固定スクロール時に埋もれるのを阻止する。
	// fixYCoordinate('header', '.flowerBackground');
	// // position:fixed;を設定したヘッダーが横スクロールしない問題を解決する関数をコールする。
	// fixXCoordinateOnScroll('header');
	//テーブルの全レコード選択の処理をオンにする。
	checkAllRecord();
	//JSONデータを格納する変数を初期化する。
	//creator.json = null;
	//ひな形のHTMLのDOMを格納する変数を初期化する。
	creator.dom = '';
	//@add 2015.0604 T.Masuda MSLの記事一覧を最新記事表示ウィンドウに載せる
	//ブログとギャラリーのお知らせの内容を消す
	$('.topicGallery').empty();
	$('.topicBlog').empty();
	//MSLのリストをお知らせウィンドウに入れる。非表示になっているので表示する
	$('.topicGallery').append($('#mslongtail_1985').show());
	$('.topicBlog').append($('#mslongtail_1984').show());
	
	$.when(
	//0ミリ秒後にキャンペーンお知らせ表示ボタンをスライド表示する。
		showRightOutOfDisplayButton('.topicShowCampaign', 0, 3000)
		).then(function(){
			$.when(
				//400ミリ秒後にギャラリーお知らせ表示ボタンをスライド表示する。
				showRightOutOfDisplayButton('.topicShowGallery', 300, 3000)
				).then(function(){
					//900ミリ秒後にブログお知らせ表示ボタンをスライド表示する。
					showRightOutOfDisplayButton('.topicShowBlog', 600, 3000);
			});
	});
	//3つのウィンドウとそれを表示・非表示にするボタンのイベントを登録する。順番にコールして順を整える。
			fadeToggleSet('div.topicShowCampaign', '.topicCampaign', '.topic', 500);
			fadeToggleSet('div.topicShowGallery', '.topicGallery', '.topic', 500);		
			fadeToggleSet('div.topicShowBlog', '.topicBlog', '.topic', 500);
			// ログインダイアログを作る
			// var login = new loginDialog('loginDialog', 'ログイン', {autoOpen:false});
	}catch(e){
		console.log(e);
	}
});

</script>
	<?php echo $msl_infos->get('html_article'); ?>
	<?php echo $msl_infos2->get('html_article'); ?>
</div>
</div>
<!-- SEO対策のフッターテキスト -->
<p id="SEOFootText" style="display:none;">東京の新宿にありますフラワーアレンジメントスクール【DDT Flowers（ディーディーティーフラワーズ）】のホームページをご覧いただき、誠にありがとうございます。
本校ではプリザーブドフラワーアレンジメントコース、生花フラワーアレンジメントコース、NFD資格取得コース、フラワー装飾技能検定資格取得コース、ブライダル・フラワーアイテム手作りコース、FC（フランチャイズ・ライセンス）資格取得コースの6つのコースをご用意しています。
入会金や年会費は一切かかりません。レッスン代は、次のレッスン分を先に支払う都度払い前金制です。退会時に前金は返金されますのでご安心ください。
また本校はお仕事帰りに通いやすい時間帯でもレッスンを行っています。「仕事が終わってからじゃ間に合わない…」と今までレッスン受講を諦めていた方も勿論そうでない方も、この機会に本校でフラワーアレンジメントを始めてみませんか。体験レッスンも随時行っていますので、ぜひお気軽にホームページよりご予約ください。
皆様の受講を心よりお待ちしています。</p>

<!-- msl指定のタイトル -->
<title>【東京】プリザーブドフラワースクール | DDTFlowers</title>
<!-- 編集の邪魔になるので一旦コメントアウトしました。 -->
<!-- <a href="#article/list.php/1197/1984" style="display:block;font-size:10px;">MSL list.php</a>
<a href="#article/detail.php/1197/190747" style="display:block;font-size:10px;">MSL detail.php</a>
<a href="#mypage.html" style="display:block;font-size:10px;">mypage</a>
<a href="#admin.html" style="display:block;font-size:10px;">admin</a> -->
</body>
</html>