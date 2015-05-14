<?php
include 'inc/mslinfo.php';
$msl_infos = new MSLListInfo();
?>
<!-- HTMLによるコード -->
<!doctype html>
<!-- 最も外のタグ -->
<html>
<!-- 予め仕様等を記すヘッダータグ -->
<head>
<!-- UTF-8でエンコード -->
<meta http-equiv="Content-Type" content="text/html charset=UTF-8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
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
<!-- Googleアナリティクスのトラッキングコード -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58020246-43', 'auto');
  ga('send', 'pageview');

</script>

<!-- jQueryの本体を読み込む。 -->
<script src="../js/jquery-1.11.0.min.js"></script>
<!-- タグを作成するJSの関数群を読み込む -->
<script type="text/javascript" src="../js/createTag.js"></script>

</head>
<!-- コンテンツを表示する領域 -->
<body>
	<!-- ウェブサイトの横幅の基準となる -->
	<div id="container">
		<!-- コンテンツ領域のタグ -->
		<div class="main">
			<script>
			//createTagクラスのインスタンスがなければ
			if(creator === void(0)){
				//インスタンスを生成する
				var creator = new createTag();
			}

			creator.getJsonFile('source/commonJson.json');			// ファイルのデータをjsonを用いて持ってくる

			creator.getDomFile('template/common.html');			// 共通パーツのDOMを取得する。
			creator.outputTag('headImage', 'createImage');			// 天の画像を作る
			</script>
			<!--MSL記事表示用-->
			<?php echo $msl_infos->get('html_article'); ?>
			<!--MSL記事表示用-->
			<script>
			creator.outputTag('footImage', 'createImage');			// 地の画像を作る
			creator.outputTag('footer');							// フッターを作る
			// メイン領域にヘッダーの高さ分のmarginを設定し、固定スクロール時に埋もれるのを阻止する。
			fixYCoordinate('header', '.main');
			// position:fixed;を設定したヘッダーが横スクロールしない問題を解決する関数をコールする。
			fixXCoordinateOnScroll('header')
			</script>
		</div>
	</div>
<!-- bodyタグを閉じる -->
</body>
<!-- htmlタグを閉じる -->
</html>