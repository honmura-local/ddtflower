// データ一覧

// ページのタイトルに関するデータ一覧
var pageTitle = [
    "プリザーブドフラワーアレンジメントコース",
    "生花フラワーアレンジメントコース",
    "NFD資格取得コース",
    "国家認定資格取得コース",
    "体験レッスン",
    "FC（フランチャイズ・ライセンス）資格取得コース"
];

// ページの概要に関するデータ一覧
var pageSummary = [
    "プリザーブドフラワーはお手入れ不要、数年間綺麗な状態で楽しむこと出来ます。この事からウェディングブーケを前もって準備出来たり、使用後作りかえることも簡単で、高価なプリザも結果的には経済的だったりします。また生花には不可能な形や、写真立てやバックに付けることも出来てアイデアは無限に広がります。お店で買えば高価なプリザも自分で作ればリーズナブル。お友達へのギフトにも最適です！",
    "生花に触れる事により四季を感じ、そして草木の生命を敏感に感じるとる感性が育まれます。また、瑞々しいフレッシュな質感、香りそして豊富な花の種類は何といっても生花の魅力です。近くのお花屋さんで手軽に花材をそろえてお友達にプレゼント！なんて事もできてポイント高いですね。",    
    "日本フラワーデザイナー協会が認定する民間の資格としては最もポピュラーな資格です。生花をターゲットにしており、カリキュラムに沿って初級者から上級者、講師資格まで取得可能です。",
    "国が認定している唯一のフラワーアレンジメント国家資格です。本校では３級から１級まで取得可能です。２級以上の難易度は高めですが、その分ステータスも高く頑張る価値は十分です。",
    "興味はあるけど作れるかどうか、続くかどうか不安・・・。まずは体験レッスンを受けてみて下さい！体験レッスンは本コースに則した内容で楽しくてかわいい作品を作ることが出来ます。",
    "大好きなお花で生活したい。本校のフランチャイズ制度はそんなあなたの夢に実現をサポートします。自宅から開業できるので初期投資はほとんど不要です。"
];

// ページのタイトルの横に来るアイコンに関するデータ一覧
var titleIcon = [
    // @mod 15.02.10 T.M 画像名修正
    "icon(tulipa)",
    "icon(leaf2)",
    "icon(clover)",
    "icon(drop100)",
    "icon(butterfly)",
    "icon(bird)",
    "icon(leaf2)",
    "icon(leaf3)",
];

// 共通事項に関するデータ一覧
var commonText = [
    "・月何回でも受講可能です。",
    "・１カ月に２回以上ご来校の場合、受講料を１０００円オフします。",
    "・１カ月に４回以上ご来校の場合、受講料を無料とします。",
    "・プリザ・生花コース修了後、本校認定のディプロマを発行します。",
    "・NFD、国家資格取得コースの花材費は別途となります。",
    "・異なるコースから生花、プリザへのスポット受講が可能です。"
];

// 会員規約に関するデータ一覧
var memberRule = [
    "・お支払い：都度払い前金制です。現金により次回分を事前にお支払い頂きます。",
    "・ご予約：予約指定日のプリザは3日前まで、生花は7日前までにインターネットもしくは電話によりご予約出来ます。",
    "・キャンセル：ご予約日のプリザは３日、生花は７日以上前までにキャンセル可能です。",
    "・振替え：上記、予約、キャンセル規定に沿い振替え自由です。",
    "・前金：最終受講日から３か月間受講がなかった場合、経過日から１カ月毎に５００円を前金から引かせて頂きます。",
    "・退会：随時、退会可能です。退会時、前金の残金は返金されます。",
    "・＊NFDおよび国家は生花に含みます。"
];

// 特徴に関するデータ一覧
var salesPoint = [
    "・インターネット対応のレッスン予約システムを無料にて提供します。",
    "・花材はマージンなし、配送料のみにて準備します。",
    "・受講料のロイヤリティーは５％。",
    "・年間ロイヤリティーは５万円。",
    "・他フランチャイズ店の生徒さんもレッスン可能です。登録店へのロイヤリティー３５％が発生します。",
    "・本校、他コース（プリザ、生花、NFD、国家）の受講が半額で受けられます。もちろん資格取得可能です。"
];

// コース案内のthに入るデータ一覧
var CourseGuideTh = [
    ["1stステージ", "2ndステージ", "3rdステージ"],
    ["1stステージ", "2ndステージ", "3rdステージ"],
    ["NFD1級", "NFD2級", "NFD3級"],
    ["1stステージ", "2ndステージ", "教育実習"]
];

// コース案内テーブルのtdに入るデータ一覧
var CourseGuideTd = [
    ["全12回","6,000 円／回　", "全12回","6,000 円／回　","全12回","6,000 円／回　"],
    ["全12回", "4,200 円／回　", "全12回", "5,000 円／回　", "全12回", "6,000 円／回　"],
    ["全40単位", "3,000 円／回　", "全40単位", "3,000 円／回　", "全40単位", "3,000 円／回　"],
    ["全16単位", "6,000 円／回　", "全16単位", "7,000 円／回　", "全48単位", "500 &nbsp;&nbsp;円／回"]
];

// レッスンスケジュールテーブルのthに入るデータ一覧
var lessonScheduleGuide = [
    "月曜日～日曜日",
    "１時限目",
    "2時限目",
    "3時限目",
    "4時限目",
    "4.5時限目"
];

// レッスンスケジュールテーブルのtdに入るデータ一覧
var lessonSchedule = [
    "11:00 ～ 13:00",
    "14:00 ～ 16:00",
    "16:30 ～ 18:30",
    "19:00 ～ 21:00",
    "19:30 ～ 21:30"
];

// 体験レッスンページのテーブルでthに入るデータ一覧
var SpecialTh = ['カテゴリ', 'できること・わかること', '費用', '回数', '1回あたりの時間', '対象者', '持ち物・その他'];

// 体験レッスンページのテーブルでtdに入るデータ一覧
var SpecialTd = [
    ['花・ガーデニング・環境', 'プリザーブドフラワー', '3,800円', '1回', '90分', '初めての方&nbsp;癒されたい方&nbsp;趣味を見つけたい方&nbsp;どなたでも大歓迎', 'お持ち帰り用の袋をご持参下さい'],
    ['新年から始める習い事特集', '生花', '2,800円', '1回', '60分', '初めての方&nbsp;癒されたい方&nbsp;趣味を見つけたい方&nbsp;どなたでも大歓迎', 'お持ち帰り用の袋をご持参下さい'],
    ['花・ガーデニング・環境', 'プリザーブドフラワー　レッスン', '4,000円', '1回', '120分', '初めての方&nbsp;癒されたい方&nbsp;趣味を見つけたい方&nbsp;どなたでも大歓迎', 'お持ち帰り用の袋をご持参下さい'],
    ['新年から始める習い事特集', '生花', '2,980円', '1回', '90分', '初めての方&nbsp;癒されたい方&nbsp;趣味を見つけたい方&nbsp;どなたでも大歓迎', 'お持ち帰り用の袋をご持参下さい']
];


// 関数一覧

/*
 * 関数名:createImg
 * 引数  :imgTarget, insertPlace
 * 戻り値:なし
 * 概要  :第一引数で指定した画像を第二引数で指定した要素の先頭に挿入する
 * 作成日:2015.02.06
 * 作成者:T.Y
 */
function createImg (imgTarget, insertPlace) {
	// jqueryの記述の始まり
	$(function() {
    	// 挿入する画像タグと中身を変数insertImgに入れる
    	var insertImg = '<img src="image/'+ imgTarget +'.png">';
    	// 実際にheaderタグとその中身である画像をmainクラスの前に配置する
    	$(insertPlace).prepend(insertImg);                                         
    });// jqueryの記述の終わり
}

/*
 * 関数名:createHeader
 * 引数  :なし
 * 戻り値:なし
 * 概要  :mainクラスの前にヘッダー画像を配置する
 * 作成日:2015.02.06
 * 作成者:T.Y
 */
function createHeader () {
  // jqueryの記述の始まり
	$(function() {
    	// 挿入するタグと中身を変数insertHeaderに入れる
    	var insertHeader = '<header></header>';
    	// 実際にheaderタグをmainクラスの前に配置する
    	$('.main').before(insertHeader);
    	// 画像を挿入する関数を実行して、ヘッダーの画像を挿入する
    	// @mod 15.02.10 T.M 画像名修正 セレクタ修正
    	createImg('main(upper800)', 'header:eq(1)');
//    	createImg('main(w800上飾り)', 'header');
	});// jqueryの記述の終わり
}

/*
 * 関数名:createFooter
 * 引数  :なし
 * 戻り値:なし
 * 概要  :containerのidで出来たdivの直後にfooterを作る
 * 作成日:2015.02.06
 * 作成者:T.Y
 */
function createFooter () {
  // jqueryの記述の始まり
	$(function() {
    	// 挿入するタグと中身を変数insertFooterに入れる
    	var insertFooter = '<footer></footer>';
    	// 実際にfooterタグをid、containerの後に配置する
    	$('.main').after(insertFooter);
    	// 画像を挿入する関数を実行してフッターの画像を挿入する
       	// @mod 15.02.10 T.M 画像名修正
    	createImg('main(lower800)', 'footer');
//    	createImg('main(w800下飾り)', 'footer');

    	// createText();　　テキストの挿入関数を実行し、コピーライトなどを入れる

	});// jqueryの記述の終わり
}

/*
 * 関数名:createTitle
 * 引数  :var titleNumber
 * 戻り値:なし
 * 概要  :headerタグの直後に準固定コンテンツを作る。
 　　　　　　　 引数はページのタイトルと概要を入れる引数の数字を使う
 　　　　　　　０：プリザ　　１：生花　　２：NFD　　３：国家　　４：体験　　５：FC　　から選ぶ
 * 作成日:2015.02.06
 * 作成者:T.Y
 */
function createTitle (titleNumber) {
  // jqueryの記述の始まり
    $(function() {
        // タイトルのdivとメインテキストを変数に入れて、挿入に使う
        var insertTitle = '<div class="title cf"><h1>' + pageTitle[titleNumber] + '</h1></div>';
        // h2タグを作るときに使うテキストを変数に入れる
        var insertH2 = '<h2 class="summary">' + pageSummary[titleNumber] + '</h2>';
        // headerの直後にタイトルのdivを作り、タイトルを入れる
        $('.content').prepend(insertTitle);
        // idがtitleの要素の最初に画像を作る関数を実行する
        createImg(titleIcon[titleNumber], '.title');
        // idがtitleのあとにh2(概要を作る)
        $('.title').append(insertH2);

    });// jqueryの記述の終わり
}

/*
 * 関数名:createTableCourseGuide
 * 引数  :var courseNumber
 * 戻り値:なし
 * 概要  :コース案内のテーブルを作る。
 　　　　　　　引数でどのページについての案内かを選択する
 　　　　　　　０：プリザ　　１：生花　　２：NFD　　３：FC　　の中から選ぶ
 * 作成日:2015.02.06
 * 作成者:T.Y
 */
function createTableCourseGuide (courseNumber) {
  // jqueryの記述の始まり
    $(function() {
        // テーブルの説明とテーブルを作る
        var insertTable = '<table class="courseGuide"><caption>コース案内</caption></table>';
        // テーブルの中身を作る
        var tableValue = '<tr><th></th><td></td><td></td></tr>';
        // section要素の最後にcourseGuideテーブルを作る
        $('section').prepend(insertTable);
        // テーブルの中身を変数を用いてループで作る
        for (var i = 0; i < 3; i++) {
            // テーブルの中身を変数を使って作る
            $('table').append(tableValue);
        }

        // ループを使って、テーブルの中にテキストをそれぞれの対応した場所に入れる
        for (var x = 0; x < 6; x++) {
            // カウンタ変数が③より低い時の処理(thは3個しかないからthについてのループは3で止まる)
            if(x < 3) {
                // テーブルのthに配列値を入れる
                $('.courseGuide tr:eq('+ x +') th:eq(0)').html(CourseGuideTh[courseNumber][x]);    
            }
            // テーブルのtdに配列から値を入れる
            $('.courseGuide td:eq('+ x +')').html(CourseGuideTd[courseNumber][x]);
        }

    });// jqueryの記述の終わり
}

/*
 * 関数名:createLessonSchedule
 * 引数  :なし
 * 戻り値:なし
 * 概要  :レッスンスケジュール(時間割)のテーブルを作る
 * 作成日:2015.02.09
 * 作成者:T.Y
 */
function createLessonSchedule () {
  // jqueryの記述の始まり
    $(function() {
        // レッスンのスケジュールを表すテーブルを作る
        var insertTable = '<table class="lessonSchedule"><caption>レッスンスケジュール</caption><tr><th colspan="2"></tr></table>';
        // テーブルの中身を作る変数を宣言する
        var tableValue = '<tr><th></th><td></td></tr>';

        // フッターの前に時間割のテーブルを作る
        $('section').after(insertTable);
        // ループでテーブルの中身を作る
        for (var i = 0; i <= 4; i++) {
            $('.lessonSchedule tr:eq(0)').after(tableValue);
        }
        // ループでテーブルの中にそれぞれに対応したテキストを入れる
        for (var j = 0; j <= 5; j++) {
            // テーブルのth部分のデータを読み込む
            $('.lessonSchedule th:eq('+ j +')').html(lessonScheduleGuide[j]);
            // テーブルのtd部分のデータを読み込む
            $('.lessonSchedule td:eq('+ j +')').html(lessonSchedule[j]);
        }

    });// jqueryの記述の終わり
}

/*
 * 関数名:createTableSpecialGuide
 * 引数  :なし
 * 戻り値:なし
 * 概要  :体験コース案内のテーブルを作る
 * 作成日:2015.02.08
 * 作成者:T.Y
 */
function createTableSpecialGuide (specialNumber) {
  // jqueryの記述の始まり
    $(function() {
        // テーブルの説明とテーブルを作る
        var insertTable = '<table class="specialGuide"><caption>体験レッスン案内</caption></table>';        
        // テーブルの中身を作る
        var tableValue = '<tr><th></th><td></td></tr>';

        // mainクラスのあとに体験レッスンのテーブルを作る
        $('.foot_gallery').before(insertTable);

        // ループでテーブルの中身を作る
        for (var i = 0; i <= 6; i++) {
            // テーブルの中身をさっき作った変数を用いて作る
            $('table').append(tableValue);
        }
        // ループでテーブルの中身にテキストを入れる
        for (var j = 0; j <= 6; j++) {
            // 配列の内容をテーブルのthに入れる
            $('th:eq('+ j +')').html(SpecialTh[j]);
            // 配列の内容をテーブルのtdに入れる
            $('td:eq('+ j +')').html(SpecialTd[specialNumber][j]); 
        }

    });// jqueryの記述の終わり
}


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
 */
function createCalendar () {
  // jqueryの記述の始まり
    $(function() {
        // カレンダーを表示するためのdivを作る
        $('.specialGuide').after('<div class="calendar"></div>');
        // @mod 2015/02.10 T.M コールバック関数を追加しました。
        // カレンダーを表示する
        //$('.calendar').datepicker();
        // カレンダーを表示する
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
 * 関数名:creatScrollPictures
 * 引数  :なし
 * 戻り値:なし
 * 概要  :写真のスクロールを作る
 * 作成日:2015.02.08
 * 作成者:T.Y
 */
function createScrollPictures () {
  // jqueryの記述の始まり
$(function() {
    // フッター前のカルーセルのギャラリーに画像を追加していくfor文
        for(var i = 0; i < 10; i++){
            // カルーセルのギャラリーのタグに対し、要素を追加していく。最上位はdivタグとなる。
            $('.foot_gallery').append($('<div></div>')
                                    // その子要素としてaタグを追加する。
                                    .append($('<a></a>')
                                        // 属性を追加する。
                                        .attr({
                                            // href属性に画像のURLを設定する。
                                            href: 'image/' + i + '.JPG',
                                            // galleryという名前で画像をグループ化する。
                                            rel:"gallery"
                                        })
                                        // 画像のタグを最下位に置く。
                                        .append($('<img>')
                                                // 画像のパスを設定する。
                                                .attr('src', 'image/' + i + '.JPG')
                                                )
                                    )
                                );
        }
       
        // jQueryプラグイン「Slick」によりフッター前にカルーセルのギャラリーを作成する。
        $('.foot_gallery').slick({
            // 矢印ボタンでの制御を有効にする。
            accessibility:true,
            // 矢印ボタンを使う。
            arrows:true,
            // レスポンシブレイアウトに対応する。
            responsive:true,
            // 一度に3個の画像をギャラリーに並べる。
            slidesToShow:3,
            // 緩急をつけたアニメーションでスクロールする。
            easing:'swing',
            // 画像を中心に配置する。
            centerMode: true
            });
        
        // フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
        // 拡大表示を行うようにする。
        $(".foot_gallery a").fancybox({
            'hideOnContentClick': true
        }); 
    });// jqueryの記述の終わり
}

/*
 * 関数名:createPictures
 * 引数  :なし
 * 戻り値:なし
 * 概要  :写真のスクロールを作る
 * 作成日:2015.02.08
 * 作成者:T.Y
 */
function createPictures () {
  // jqueryの記述の始まり
$(function() {
// フッター前のカルーセルのギャラリーに画像を追加していくfor文
        for(var i = 0; i < 4; i++){
            // カルーセルのギャラリーのタグに対し、要素を追加していく。最上位はdivタグとなる。
            $('.foot_gallery').append($('<div></div>')
                                    // その子要素としてaタグを追加する。
                                    .append($('<a></a>')
                                        // 属性を追加する。
                                        .attr({
                                            // href属性に画像のURLを設定する。
                                            href: 'image/' + i + '.JPG',
                                            // galleryという名前で画像をグループ化する。
                                            rel:"gallery"
                                        })
                                        // 画像のタグを最下位に置く。
                                        .append($('<img>')
                                                // 画像のパスを設定する。
                                                .attr('src', 'image/' + i + '.JPG')
                                                )
                                    )
                                );
        }
                // jQueryプラグイン「Slick」によりフッター前にカルーセルのギャラリーを作成する。
        $('.foot_gallery').slick({
            // 矢印ボタンでの制御を有効にする。
            accessibility:false,
            // 矢印ボタンを使う。
            arrows:false,
            // レスポンシブレイアウトに対応する。
            responsive:true,
            // 一度に3個の画像をギャラリーに並べる。
            slidesToShow:4,
            // 緩急をつけたアニメーションでスクロールする。
            easing:'swing',
            // 画像を中心に配置する。
            //centerMode: true
            });
        // フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
        // 拡大表示を行うようにする。
        $(".foot_gallery a").fancybox({
            'hideOnContentClick': true
        }); 
    });// jqueryの記述の終わり
}

/*
 * 関数名:createPointGuie
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :引数をセレクターにしてマウスオーバーしたときに透過率を0.5にする
 * 作成日:2015.02.09
 * 作成者:T.Y
 */
function createPointGuide () {
    // jqueryの記述の始まり
    $(function() {
        $('.lessonSchedule').after('<ul class="commonText">共通</ul>');
        for (var i = 0; i < 6; i++) {
           $('.commonText').append('<li></li>');
        }
        for (var j = 0; j < 6; j++) {
           $('.commonText li:eq(' + j + ')').append(commonText[j]); 
        }

        $('.foot_gallery').after('<ul class="salesPoint">特徴</ul>');
        for (var x = 0; x < 6; x++) {
            $('.salesPoint').append('<li></li>'); 
        }
        for (var y = 0; y < 6; y++) {
            $('.salesPoint li:eq(' + y + ')').append(salesPoint[y]); 
        }

        $('.salesPoint').after('<ul class="memberRule">会員規約</ul>');
        for (var a = 0; a < 7; a++) {
            $('.memberRule').append('<li></li>'); 
        }
        for (var b = 0; b < 7; b++) {
            $('.memberRule li:eq(' + b + ')').append(memberRule[b]); 
        }
    });// jqueryの記述の終わり
}


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
    $(filterTarget)                         // 引数に対して、透過度を調整する
        .mouseenter(function() {            // 引数の要素にマウスを乗せた時の処理
            $(this).css("opacity", 0.5);    // 引数の要素の透過度を0.5にする
        })
        .mouseleave(function() {            // 引数の要素からマウスが離れたときの処理
            $(this).css("opacity", 1);      // 引数の要素の透過度を戻す
        });
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
	// 配列内の日付の並びが年月日になっていないので、並びを修正した配列を整数に直した上でtrueDateに格納する。
	var trueDate = [parseInt(date[2]), parseInt(date[0]), parseInt(date[1])];
	
	// trueDateを返す。
	return trueDate;
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
	
	// 日付の配列の先頭にコンテンツ名を挿入する。 
	date.unshift(contentName);
	
	// コンテンツ名、レッスン予約のダイアログを生成する関数、日付の配列を引数にしてcreateText関数をコールする
	createText(contentName, createSpecialReservedDialog, date);
}
