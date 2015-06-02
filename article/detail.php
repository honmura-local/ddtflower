<?php
include 'inc/mslinfo.php';
$msl_infos = new MSLDetailInfo();
if ($msl_infos->get('article_title')==""){
header("HTTP/1.0 404 Not Found");
header("Location:".(empty($_SERVER["HTTPS"]) ? "http://" : "https://") . $_SERVER["HTTP_HOST"]);
exit;
}
?>
<!-- HTMLによるコード -->
<!doctype html>
<!-- 最も外のタグ -->
<html>
<!-- 予め仕様等を記すヘッダータグ -->
<head>
<!-- jQueryの本体を読み込む。 -->
<script src="../js/jquery-1.11.0.min.js"></script>
<!-- サイト全体のレイアウト調整用JSファイル。 -->
<script src="../js/flowersstylefix.js"></script>
<!-- タグを作成するJSの関数群を読み込む -->
<script type="text/javascript" src="../js/createTag.js"></script>
<!-- メインのCSSファイルを読み込む。 -->
<link href="css/style.css" rel="stylesheet" type="text/css">
<!-- コース案内のCSSファイルを読み込む。 -->
			<link href="css/courseguide.css" rel="stylesheet" type="text/css">
			<script>
				$(document).ready(function(){
					creator.getJsonFile('source/commonJson.json');			// ファイルのデータをjsonを用いて持ってくる
	
					creator.getDomFile('template/common.html');			// 共通パーツのDOMを取得する。
					creator.getDomFile('template/courseguide.html');	// コース紹介ページのパーツのDOMを取得する。
					creator.outputTag('headImage', 'createImage');			// 天の画像を作る
	
					creator.outputTag('footImage', 'createImage');			// 地の画像を作る
					creator.outputTag('footer');							// フッターを作る
					
					// トップメニューにマウスオーバーのフィルターを配置する。
					functionFilter('.topMenu li');
					// メイン領域にヘッダーの高さ分のmarginを設定し、固定スクロール時に埋もれるのを阻止する。
					fixYCoordinate('header', '.main');
					// position:fixed;を設定したヘッダーが横スクロールしない問題を解決する関数をコールする。
					fixXCoordinateOnScroll('header')
					//花の上下の画像にMSL記事を移動する
					$('.createImage:first').after($('.mslongtail_wrapper:first'));
				});
				</script>
<!--title、keywords、description表示用-->
<?php echo $msl_infos->get('html_meta'); ?>
<!--title、keywords、description表示用-->

<!-- Googleアナリスティクの記述のタグ -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58020246-43', 'auto');
  ga('send', 'pageview');
</script>
<!-- mslで指定されたCSSファイルを読み込む -->
<link href="css/top.css" rel="stylesheet" type="text/css">

<!-- メインのCSSファイルを読み込む。 -->
<link href="../css/style.css" rel="stylesheet" type="text/css">
</head>
<!-- コンテンツを表示する領域 -->
<body>
	<!-- ウェブサイトの横幅の基準となる -->
	<div id="container">
		<!-- メインのタグ -->
		<div class="main">
			<?php echo $msl_infos->get('h1'); ?>
			<!--MSL記事表示用-->
			<ul id="mslSocial">
				<li class="mslFacebook"><a href="http://www.facebook.com/share.php?u=<?php echo $msl_infos->get('article_url'); ?>"><img src="http://ddthink.com/article/images/fb_likebtn.gif"></a></li>
				<li class="mslTwitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $msl_infos->get('article_url'); ?>" data-lang="ja" data-count="none">ツイート</a> 
					<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script> 
				</li>
				<li class="mslMixi"><a href="http://mixi.jp/share.pl" class="mixi-check-button" data-button="button-6">mixiチェック</a> 
					<script type="text/javascript" src="http://static.mixi.jp/js/share.js"></script> 
				</li>
			</ul>
			<?php echo $msl_infos->get('html_article'); ?>
			<!--MSL記事表示用-->
		</div>
	<!-- idをcontainerに指定したdivタグを閉じる -->
	</div>
<!-- bodyタグを閉じる -->
</body>
<!-- htmlタグを閉じる -->
</html>