/** ファイル名:constants.js
 * 概要　　　:定数定義ファイル
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:js/constants.js
 */

//もともとが固定で使われている文字列
VALUE											= 'value';							//バリュー
ID												= 'id';								//ID
CLICK											= 'click';							//クリックイベントの文字列
CLOSE											= 'close';							//closeの文字列
CHANGE											= 'change';						//イベント名がchangeのときにchangeイベントを登録するための定数
CLASS											= 'class';							//クラス
OPTION											= 'option';
JSON  											= 'json';				//json
TITLE 											= 'title';		//タイトルの文字列
SPACE 											= ' '			//半角スペース
TYPE											= 'type';
HYPHEN											= '-';
RIGHT_ARROW										= '>';
TEXT											= 'text';
HTML											= 'html';
BODY											= 'body';
NAME											= 'name';
STYLE											= 'style';
OPEN											= 'open';
DIALOG											= 'dialog';
DOM  											= 'dom';				//dom
OBJECT 											= 'object';				//objectかどうかの判定に使う
POST											= 'POST';				//リクエストのPOSTメソッド設定
HTML											= 'HTML';				//AJAXのレスポンスの指定をHTMLにする時に使う
AUTO											= 'auto';
EVENT											= 'event';
SLASH											= '/';					//スラッシュ記号
DOT												= '.';					//ドット
EMPTY											= '';					//空文字
DESTROY											= 'destroy';			//破棄命令の文字列
BUTTONS											= 'buttons';
POSITION										= 'position';
NUMBER											= 'number';				//numberキーの文字列
STRING											= 'string';				//stringの文字列
STR_ARROW_LEFT_DOUBLE							= '<<';
SYMBOL_UNIT										= ' 〜 ';
NONE											= 'none';					//noneの文字列
HASH											= '#';			//ハッシュの文字

//htmlタグ名
TAG_TABLE										= 'table';						//tableタグ
TAG_TR											= 'tr';							//trタグ
TAG_TH											= 'th';
TAG_TD											= 'td';
TAG_P											= 'p';							//pタグ
TAG_INPUT										= 'input';
TAG_SELECT 										= 'select';

//タグ領域
TAG_AREA_DIV									= '<div></div>';
TAG_AREA_SPAN									= '<span></span>'; 
TAG_AREA_LABEL									= '<label></label>';
TAG_AREA_TEXTAREA								= '<textarea></textarea>'; 

//html属性名
ATTR_RADIO										= 'radio';
ATTR_CHECKBOX									= 'checkbox';
ATTR_COLSPAN									= 'colspan';

//ディレクトリ
DIR_JSON										= 'source/';				//jsonファイルが入っているディレクトリ
DIR_TEMPLATE 									= 'template/';				//テンプレートhtmlディレクトリ
DIR_PHP											= 'php/';					//phpファイルのディレクトリ
DIR_JS 											= 'js/';					//jsファイルのディレクトリ
DIR_DIALOG 										= 'dialog/';				//ダイアログファイルのディレクトリ

FILE_JSON_INIT									= 'init.json';				//初期化の値のJSONファイル
FILE_JSON_DIALOG_JSON 							= 'loginDialog.json';		//ログインダイアログjson
FILE_TEMPLATE_DIALOG_JSON 						= 'loginDialog.html';		//ログインダイアログjson

//ファイルのパス
//@add 2015.0627 T.Masuda 定数を大量に追加しました。詳細はGitで確認してください。
PATH_INIT_JSON									= DIR_JSON + FILE_JSON_INIT;		//初期化の値のJSONファイル
PATH_MSL_LIST									= 'list.php';						//MSLのリスト
PATH_MSL_DETAIL									= 'detail.php';						//MSLの記事詳細
PATH_LOGIN_DIALOG_JSON							= DIR_JSON + FILE_JSON_DIALOG_JSON;		//ログインダイアログjson
PATH_LOGIN_DIALOG_HTML							= DIR_TEMPLATE + FILE_TEMPLATE_DIALOG_JSON;//ログインダイアログjson
PATH_LOGIN_DIALOG								= DIR_DIALOG + 'loginDialog.html';					//ログインダイアログのクラスのセレクタ
PATH_MEMBERPAGE_JSON							= DIR_JSON + 'memberPage.json';			//会員ページのJSON
PATH_MEMBERCOMMON_JSON							= DIR_JSON + 'memberCommon.json';		//会員ページ共通のJSON
PATH_ADMIN_PAGE 								= 'adminPage.html';								//管理者ページURL
PATH_MEMBER_PAGE	 							= 'memberPage.html';							//会員ページURL
PATH_SPECIAL_RESERVED_DIALOG					= DIR_DIALOG + 'specialReservedDialog.html';		//体験レッスン予約ダイアログのHMTLファイルURL
PATH_ADMIN_NEWLESSON_CREATE_DIALOG 				= DIR_DIALOG + 'adminNewLessonCreateDialog.html';	//授業新規作成ダイアログのHTMLファイルのパス
PATH_LESSON_DETAIL_DIALOG						= DIR_DIALOG + 'lessonDetailDialog.html';			//管理者 授業詳細ダイアログのHTMLファイルのパス
PATH_LOGIN_DIALOG 								= DIR_DIALOG + 'loginDialog.html';	//ログインダイアログのHTMLファイルのURL
PATH_GET_JSON_STRING_PHP						= DIR_PHP + 'GetJSONString.php';
PATH_GET_JSON_ARRAY_PHP							= DIR_PHP + 'GetJSONArray.php';
PATH_GET_JSON_ARRAY_FOR_JQGRID_PHP				= DIR_PHP + 'GetJSONArrayForJqGrid.php';
PATH_SAVE_JSON_DATA_PHP							= DIR_PHP + 'SaveJSONRecord.php';
PATH_RESERVE_LIST_JSON							= 'dialog/source/memberReserveListDialog.json';
PATH_RESERVE_LIST_HTML							= 'dialog/template/memberReserveListDialog.html';
//会員、予約確認ダイアログ
PATH_MEMBER_RESERVE_CONFIRM_DIALOG				= 'dialog/memberReserveConfirmDialog.html';
PATH_MEMBER_RESERVE_CONFIRM_DIALOG_JS 			= 'dialog/js/memberReserveConfirmDialog.js';
PATH_MEMBER_RESERVE_CONFIRM_DIALOG_HTML 		= 'dialog/template/memberReserveConfirmDialog.html';
PATH_MEMBER_RESERVE_CONFIRM_DIALOG_JSON 		= 'dialog/source/memberReserveConfirmDialog.json';
//会員、予約キャンセルダイアログ
PATH_MEMBER_RESERVE_CANCEL_DIALOG 				= 'dialog/memberReserveCancelDialog.html';
PATH_MEMBER_RESERVE_CANCEL_DIALOG_JS 			= 'dialog/js/memberReserveCancelDialog.js';
PATH_MEMBER_RESERVE_CANCEL_DIALOG_HTML 			= 'dialog/template/memberReserveCancelDialog.html';
PATH_MEMBER_RESERVE_CANCEL_DIALOG_JSON 			= 'dialog/source/memberReserveCancelDialog.json';
PATH_MEMBER_RESERVE_CANCEL_DIALOG_CONTENT		= 'lessonConfirmContent';		//コンテンツデータの親のクラス名
//管理者、授業一覧ダイアログ
PATH_ADMIN_LESSON_LIST_DIALOG 					= 'dialog/adminLessonListDialog.html';
PATH_ADMIN_LESSON_LIST_DIALOG_JS 				= 'dialog/js/adminLessonListDialog.js';
PATH_ADMIN_LESSON_LIST_DIALOG_HTML 				= 'dialog/template/adminLessonListDialog.html';
PATH_ADMIN_LESSON_LIST_DIALOG_JSON 				= 'dialog/source/adminLessonListDialog.json';
//管理者、授業詳細ダイアログ
PATH_ADMIN_LESSON_DETAIL_DIALOG 				= 'dialog/adminLessonDetailDialog.html';
PATH_ADMIN_LESSON_DETAIL_DIALOG_JS 				= 'dialog/js/adminLessonDetailDialog.js';
PATH_ADMIN_LESSON_DETAIL_DIALOG_HTML 			= 'dialog/template/adminLessonDetailDialog.html';
PATH_ADMIN_LESSON_DETAIL_DIALOG_JSON 			= 'dialog/source/adminLessonDetailDialog.json';
//管理者、新規授業作成ダイアログ
PATH_ADMIN_LESSON_CREATE_DIALOG 				= 'dialog/adminLessonCreateDialog.html';
PATH_ADMIN_LESSON_CREATE_DIALOG_JS 				= 'dialog/js/adminLessonCreateDialog.js';
PATH_ADMIN_LESSON_CREATE_DIALOG_HTML 			= 'dialog/template/adminLessonCreateDialog.html';
PATH_ADMIN_LESSON_CREATE_DIALOG_JSON 			= 'dialog/source/adminLessonCreateDialog.json';
//会員マイブログ確認ダイアログ
PATH_MYBLOG_CONFIRM_DIALOG 						= 'dialog/myBlogConfirmDialog.html';
PATH_MYBLOG_CONFIRM_DIALOG_JS 					= 'dialog/js/myBlogConfirmDialog.js';
PATH_MYBLOG_CONFIRM_DIALOG_JSON 				= 'dialog/json/myBlogConfirmDialog.json';
//会員、目安箱送信確認ダイアログ
PATH_SUGGESTION_CONFIRM_DIALOG_JS 				= 'dialog/js/memberSuggestionConfirmDialog.js';
PATH_SUGGESTION_CONFIRM_DIALOG_JSON 			= 'dialog/json/memberSuggestionConfirmDialog.json';
PATH_SUGGESTION_CONFIRM_DIALOG 					= 'dialog/memberSuggestionConfirmDialog.html';
//管理者メッセージ送信確認ダイアログ
PATH_ADMIN_MAIL_SEND_DIALOG 					= 'dialog/adminMailSendDialog.html';
PATH_ADMIN_MAIL_SEND_DIALOG_JS 					= 'dialog/js/adminMailSendDialog.js';
PATH_ADMIN_MAIL_SEND_DIALOG_JSON 				= 'dialog/json/adminMailSendDialog.json';

PATH_TEST_DIALOG_GRANDCHILD_URL					= 'dialog/testdialoggrandchild.html';				//孫ダイアログURL
PATH_TEST_DIALOG_CHILD							= 'dialog/testdialogchild.html'							//テスト用子ダイアログ(2世代目)のURL
PATH_SEND_MEMBERMAIL_PHP						= 'php/mailSendEntryMemberMail.php';			//目安箱 会員メール送信用のPHP
PATH_SEND_SUGGEST_PHP							= 'php/mailSendEntrySuggest.php';					//目安箱 目安箱メール送信用のPHP
PATH_MAIL_SEND_ENTRY_ADMIN_MAIL_PHP				= 'php/mailSendEntryAdminMail.php';					//管理者 メール送信用php
PATH_LOGIN_DIALOG_TEMPLATE						= 'dialog/template/loginDialog.html';				//ログインダイアログのテンプレートHTLMパス
PATH_LOGIN_DIALOG_JSON							= 'dialog/source/loginDialog.json';					//ログインダイアログのJSONパス

//セレクタ
SELECTOR_HEADER									= '.header';						//ヘッダーのクラス
SELECTOR_LOGOUT_LINK							= '.logoutLink';					//ログアウトボタンのクラス
SELECTOR_LOGIN_DIALOG							= '.loginDialog';					//ログインダイアログのクラスのセレクタ
SELECTOR_LOGIN									= '.login';							//ログインボタンのクラスのセレクタ
SELECTOR_MAIN									= '.main';									//メインのタグのセレクタ
SELECTOR_HEADERS								= '.memberHeader, .adminHeader';	//会員ページ、管理者ページのヘッダーのクラス
SELECTOR_NORMAL_HEADER							= 'header.header';							//通常のヘッダー
SELECTOR_HEADER_VISIBLE							= 'header.header:visible';					//隠してないヘッダー
SELECTOR_HEADER_HIDDEN							= 'header.header:hidden';					//隠してあるヘッダー
SELECTOR_ADMIN_LESSON_LIST_DIALOG_TR 			= '.adminLessonListDialog tr';		//管理者の日ごと授業テーブルの行
SELECTOR_ADMIN_LESSON_LIST_DIALOG_TD 			= '.adminLessonListDialog td';		//管理者の日ごと授業テーブルのセル
SELECTOR_ALL_CHILD								= '> *';				//全ての子要素のセレクタ
SELECTOR_ALLCHILD_CLASS_FRONT					= ' > *[class="';
SELECTOR_CLOSE_ATTRIBUTE						= '"]';
SELECTOR_CONTAINS_FRONT							= 'contains(';
SELECOTR_CLOSE_PARENTHESES						= ')';
SELECTOR_KEYS									= '.keys'; 
SELECTOR_MAIN									= '.main';
SELECTOR_NUMBERING_OUGHTER						= '.numberingOuter';
SELECTOR_VALUES									= '.values';
SELECTOR_CURRENT_DIALOG							= '.dialog:last';			//カレントのダイアログのセレクタ
SELECTOR_DIALOG_TABLE_RECORD					= SELECTOR_CURRENT_DIALOG + ' table tr';
SELECTOR_DIALOG_TABLE_DATA						= SELECTOR_CURRENT_DIALOG + ' table tr td';
SELECTOR_SP_SELECTOR_REPLACE_TABLE				= ' .replaceTable';
SELECTOR_HEAD_LAST								= 'head link:last';					//headタグの最後のタグ
SELECTOR_LOADING_SCREEN							= '.loading';				//ローディング画面のセレクタ
SELECTOR_USERNAME_SELECTOR						= '.userName';				//ユーザ名
SELECTOR_LESSON_TABLE							= DOT + 'lessonTable';		//授業テーブルのセレクタ
SELECTOR_TABLE_AREA								= DOT + 'tableArea';
SELECTOR_LESSON_TABLE_RECORD					= '.targetLessonTable';		//ターゲットの授業テーブル

//css属性名
CSS_FONT_SIZE									= 'font-size';
CSS_0_5EM										= '0.5em';
CSS_DISPLAY										= 'display';				//displayの文字列。css用
CSS_BLOCK										= 'block';					//blockの文字列
CSS_MARGIN_TOP 									= 'margin-top';														//上margin
CSS_PX_5 										= '5px';																	//5PX
CSS_PX_115 										= '115px';																//115PX
CSS_BACKGROUND									= 'background';
CSS_GRAY_COLOR									= '#EDEDED';

//jsonの固定key名
KEY_TABLE_DATA									= 'tableData';	//DBから取り出した値全体のkey
KEY_DB_SET_QUERY 								= 'db_setQuery';
KEY_DATA										= 'data';

//クエリを投げる時に置換する時のキー名
KEY_LESSON_DATA									= 'lessonData';						//管理者の授業詳細ダイアログのコンテンツ部分
KEY_LESSON_DATE 								= 'lessonDate'						//レッスン日
KEY_USER_ID 								 	= 'userId';							//ユーザID
KEY_DATE_JAPANESE								= 'dateJapanese';					//日本語に変換した日付文字列

//jsonのkey
KEY_LOGIN_DIALOG								= 'loginDialog';					//ログインダイアログ
KEY_RESERVED_LESSON_TABLE						= 'reservedLessonTable';			//予約中授業のテーブルグの外枠
KEY_ADMIN_EACH_DAY_LESSON_TABLE					= 'adminEachDayLessonTable';		//管理者日ごと授業テーブル
KEY_PAGING_NOW									= 'nowPage';						//ページングの現在のページのクラス名
KEY_PAGING 										= 'paging';							//ページングのクラス名
KEY_PAGING_AREA									= 'pagingArea';						//ページングを囲むdivクラス名
KEY_NUMBERING									= 'numbering';
KEY_PRE											= 'pre';
KEY_KEY_AND_VALUE								= 'keyAndValue';
KEY_VALUE_LABEL									= 'valueLabel';
KEY_VALUES										= 'values';
KEY_KEYS										= 'keys';
KEY_EDITVALUE									= 'editValue';
KEY_LESSON_TABLE_AREA							= 'lessonTableArea';
KEY_GUIDES										= 'guides';									//ガイド領域
KEY_TOP_MENU									= 'topMenu';								//トップメニュー
KEY_TAG_TABLE									= 'tagTable';
KEY_LESSON_TABLE								= 'lessonTable';
KEY_MEMBER_INFORMATION							= 'memberInfomation';
KEY_REPLACE_TABLE								= 'replaceTable';
KEY_ACCOUNT_HEADER								= 'accountHeader';	//アカウント管理のJSONのキー
KEY_GUIDES										= 'guides';									//ガイド領域
KEY_TOP_MENU									= 'topMenu';								//トップメニュー
KEY_TAG_TABLE									= 'tagTable';
KEY_ACCOUNT_HEADER								= 'accountHeader';	//アカウント管理のJSONのキー
KEY_LESSON_TABLE_REPLACE_FUNC 					= 'callReservedLessonValue';					//予約可能授業一覧置換関数名
KEY_ADMIN_LESSON_DETAIL_TABLE					= 'adminLessonDetailTable';					//管理者、授業詳細一覧テーブル
KEY_ADMIN_LESSON_DETAIL_TABLE_RECORD			= 'targetAdminLessonRecord';					//管理者、授業詳細一覧テーブルの1行ごとのクラス名
KEY_ADMIN_LESSON_DETAIL_TABLE_REPLACE_FUNC 		= 'callAdminReservedLessonValue';				//管理者、授業詳細一覧テーブル置換関数名
KEY_FINISHED_LESSONTABLE						= 'finishedLessonTable';						//会員、受講済み授業テーブル
KEY_FINISHED_LESSONTABLE_REPLACE_FUNC			= 'callMemberLessonValue';						//会員、受講済み授業テーブル置換関数名
KEY_RESERVED_LESSON_TABLE 						= 'reservedLessonTable';						//会員、予約中授業テーブル
KEY_RESERVED_LESSON_TABLE_RECORD 				= 'targetCancelReservedLesson';				//会員、予約中授業テーブルの1行ごとのクラス名
KEY_RESERVED_LESSON_TABLE_REPLACE_FUNC 			= 'callMemberLessonValue';						//会員、予約中授業テーブル置換関数名
KEY_EACH_DAY_RESERVED_INFO_TABLE 				= 'eachDayReservedInfoTable';					//管理者、日ごと予約者一覧テーブル
KEY_EACH_DAY_RESERVED_INFO_TABLE_RECORD			= 'targetEachDayLessonRecord';					//管理者、日ごと予約者一覧テーブル1行ごとのクラス名
KEY_EACH_DAY_RESERVED_INFO_TABLE_REPLACE_FUNC 	= 'callEachDayReservedValue';					//管理者、日ごと予約者一覧テーブル置換関数名
KEY_DO_LECTURE_PERMIT_INFO_TABLE 				= 'doLecturePermitInfoTable';					//管理者、受講承認テーブル
KEY_DO_LECTURE_PERMIT_INFO_TABLE_REPLACE_FUNC 	= 'callLecturePermitValue';					//管理者、受講承認テーブル置換関数名
KEY_LECTURE_PERMIT_LIST_INFO_TABLE				= 'lecturePermitListInfoTable';				//管理者、受講承認一覧テーブル
KEY_LECTURE_PERMIT_LIST_INFO_TABLE_REPLACE_FUNC = 'callPermitLessonListValue';					//管理者、受講承認一覧テーブル置換関数名
KEY_ADMIN_LESSON_ADD_BUTTON						= 'lessonAddButton';							//管理者、授業詳細、新規授業の追加ボタン
KEY_LOGIN_BUTTON								= 'loginButton';			//ログインボタンのテキスト
KEY_LESSON_TABLE								= 'lessonTable';			//授業テーブル
KEY_SUGGESTION_QUERY 							= 'insertSuggestionBox';
KEY_SUGGESTION_DATA_DOM_PARENT 					= 'suggestionArea';	//データを取得する親のクラス名
KEY_ADMIN_MAIL_DATA_DOM_PARENT 					= 'mailSendContent';	//データを取得する親のクラス名
KEY_ADMIN_MESSAGE_INF_QUERY 					= 'insertMessageInf';
KEY_ADMIN_MESSAGE_TO_QUERY 						= 'insertMessageTo';
KEY_TABLE_AREA									= 'tableArea';
KEY_LESSON_STATUS								= 'lessonStatus';
KEY_LESSON_TABLE_RECORD 						= 'targetLessonTable';							//会員画面予約授業一覧テーブルの1行ごとのクラス名
KEY_INSERT_MYBLOG_QUERY 						= 'insertMyBlog';
KEY_UPDATE_MYBLOG_QUERY							= 'updateMyBlog';

//ダイアログオプション名
KEY_ADMIN_LESSON_DETAIL 						= 'adminLessonDtailDialog';
KEY_ADMIN_NEW_LESSON_CREATE 					= 'adminLessonCreate';
//DBカラム名
COLUMN_USER_KEY									= 'user_key';					//ユーザキー
COLUMN_MAX_NUM									= 'max_num';					// １限に予約できる最大の数
COLUMN_START_TIME								= 'start_time';					// 授業開始時間
COLUMN_END_TIME									= 'end_time';					// 授業終了時間
COLUMN_ORDER_STUDENTS							= 'order_students';				// 予約している生徒の数
COLUMN_MAX_STUDENTS								= 'max_students';				// 個別の予約できる最大の数
COLUMN_LESSON_DATE								= 'lesson_date';				// 授業受講日
COLUMN_USER_WORK_STATUS							= 'user_work_status';			// ユーザ授業ステータス
COLUMN_CLASSWORK_STATUS							= 'classwork_status';			// 授業ステータス
COLUMN_POINT_RATE								= 'point_rate';					// ポイントレート
COLUMN_STOP_ORDER_DATE							= 'stop_order_date';			// 授業締切日？
COLUMN_SCHOOL_NAME								= 'school_name';				// 店舗名
COLUMN_LESSON_NAME								= 'lesson_name';				//授業テーマ名
COLUMN_TODAY									= 'today';						// 今日の日付
COLUMN_LESSON_KEY								= 'lesson_key';					// 授業(classwork)のid
COLUMN_DEFAULT_USER_CLASSWORK_COST				= 'default_user_classwork_cost';// デフォルト授業料
COLUMN_USER_CLASSWORK_COST						= 'user_classwork_cost';		// 授業料
COLUMN_TIME_TABLE_DAY_KEY 						= 'time_table_day_key';			//授業の時限データのキー名
COLUMN_TIMETABLE_KEY 							= 'timetable_key';				//スクールの時限ごとのキー名
COLUMN_DEFAULT_USER_CLASSWORK_COST 				= 'default_user_classwork_cost';//DBのカラム名、この列の値があれば予約可になる。
COLUMN_TIME_SCHEDULE 							= 'time_schedule';				//時間割の列名
//新規追加カラム(加工後のデータが入るカラム)
COLUMN_START_END_TIME 							= 'startEndTime';				//開始時間と終了時間を合わせたもの
COLUMN_LESSON_DATE_TIME 						= 'lessonDateTime';				//年月日を含んだ開始時間と終了時間を合わせたもの
COLUMN_SUM_COST									= 'sumCost';					//受講料の合計
COLUMN_LESSON_POINT 							= 'lessonPoint';				//レッスン受講で加算されるポイント
COLUMN_LESSON_REST 								= 'lesssonRest';				//受講情報の残席情報記号
COLUMN_LESSON_STATUS 							= 'lessonStatus';				//レッスンの予約状況
COLUMN_RECORD_NUMBER 							= 'recordNumber';				//取得した行の番号

//日本語で表示する文字列
TEXT_SUCCESS_RESERVED							= '予約を承りました。';
TEXT_SUCCESS_CANCELED							= '予約をキャンセルしました。';
TEXT_SUCCESS_PROFILE_UPDATE						= 'プロフィールを変更しました。';
TEXT_SUCCESS_PASSWORD_UPDATE					= 'パスワードを変更しました。';
TEXT_FAILED_RESERVED							= '予約の処理に失敗しました。時間をおいてもう一度お試しください。';
TEXT_FAILED_CONNECT								= '通信に失敗しました。時間をおいてもう一度お試しください。';
TEXT_LOGIN_ERROR								= 'idまたはパスワードが間違っています';
TEXT_FAILD_TO_CREATE							= 'の作成に失敗しました。';	//outputTagでパーツの作成を失敗したときのメッセージ
TEXT_TRANSPORT_FAILD_MESSAGE					= '通信に失敗しました。';	//通信失敗のメッセージ
TEXT_LOGIN 										= 'ログイン';		//ログインダイアログのタイトル「ログイン」
TEXT_RE_LOGIN 									= '再ログイン';	//再ログインダイアログのタイトル「再ログイン」
TEXT_CREATE_NEW_LESSON_MESSAGE 					= '新規授業の作成に成功しました。';	
TEXT_SEND_SUCCESS_SIMPLE_NOTICE					= "メッセージの送信が完了しました。";					//簡易的なメッセージ送信完了のメッセージ	
TEXT_SEND_FAILED_SIMPLE_NOTICE					= 'メッセージの送信に失敗しました。時間をおいてお試しください。';	//簡易的なメッセージ送信失敗のメッセージ	
TEXT_CANCEL										= 'キャンセル';				//キャンセルのテキスト
TEXT_LOGIN										= 'ログイン';					//ログインのテキスト
TEXT_LESSON_NEW_BUTTON							= '新規作成'				 //授業新規作成ボタンテキスト
TEXT_ERROR_LESSONLIST							= '予約可能な授業がありません';	//予約できる授業がないというメッセージ
TEXT_MYBLOG_CONFIRM								= 'ブログを更新します。よろしいですか？';
TEXT_MYBLOG_CONFIRM_DIALOG_TITLE				= 'ブログ更新確認';
TEXT_SUGGESTION_CONFIRM							= 'メッセージを送信します。よろしいですか？';
TEXT_SUGGESTION_CONFIRM_DIALOG_TITLE			= 'メッセージ送信確認';
TEXT_RECEIVE_SUGGEST_STATE 						= '目安箱チェックボックスのname属性の値';
TEXT_ADMIN_MAIL_SEND_TEXT						= 'メッセージを送信します。よろしいですか？';
TEXT_ADMIN_MAIL_SEND_TITLE						= 'メッセージ送信確認';
TEXT_YES										= 'はい';	//「はい」の文字列
TEXT_NO											= 'いいえ';	//「いいえ」の文字列
TEXT_INVALIDATE									= '✕';
TEXT_CLOSE_JP									= '閉じる';
TEXT_SEND_JP									= '送信';
TEXT_SEND_TO_SERVER_MESSAGE 					= 'サーバへデータの送信を行いました。';

//トップページのファイル名の定数
FILE_PHP_TOPPAGE							 	= 'top.php';
SESSION_ID 										= 'PHPSESSID';	//PHPのセッションIDのキー
validIdentifiers								= ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'];	//有効な画像拡張子
//リンクタグ
LINK_MEMBERPAGE_CSS								= '<link href="css/memberPage.css" rel="stylesheet" type="text/css">';
LINK_COURCEGUIDE_CSS							= '<link href="css/courseGuide.css" rel="stylesheet" type="text/css">';
LINK_ADMINPAGE_CSS								= '<link href="css/adminPage.css" rel="stylesheet" type="text/css">';			//管理者ページ共通のCSS
LINK_CONTACT_CSS								= '<link href="css/contact.css" rel="stylesheet" type="text/css">';
//スクリプトタグ
SCRIPT_DAILYCLASSES_JS							= '<script type="text/javascript" src="js/dailyClasses.js"></script>';

WAIT_DEFAULT									= 0;								//待ち時間のデフォルト値

EXPERIENCE										= 'experience';
LESSON											= 'Lesson';
//定数定義
BLOG_SHOW_PAGES									= 1;											//ブログ表示記事数。blog.phpでも使う
LOCATION										= 'flower_clone/';							//サイトルート前
SITE_ROOT										= 'http://localhost/' + LOCATION;			//サイトルート
IMAGE_PATH										= 'uploadImage/flowerImage/';				//アップロード画像フォルダ
UPLOAD_LOCATION									= SITE_ROOT + SITE_ROOT;					//アップロードURL
//createLittleContentクラスインスタンスの連想配列内キー用文字列
CREATOR											= 'creator';
//会員ページ 予約一覧ダイアログのcreateLittleContentsクラスインスタンスの連想配列内キー用文字列
RESERVE_LIST_CREATOR							= 'reserveListCreator';	
//画像縮小時のデフォルトサイズ
DEFAULT_WIDTH									= 300;										//画像の縮小サイズ 横
DEFAULT_HEIGHT									= 300;										//画像の縮小サイズ 縦
IMG_QUALITY										= 80;										//画像圧縮時の品質
USER_IMAGE_UPLOADER								= 'uploadImage/imageUpload.php';			//画像アップローダーのパス
DIALOG_CENTER_POSTION							= 'center center';
//処理の分岐のフラグの数値
PATTERN_ADD 									= 0;
PATTERN_REPLACE 								= 1;
//outputNumberingTagで用いる記事のオブジェクトの親のキー。

ADMIN_AUTHORITY									= '80';	//管理者権限のIDの定数							

//ログインエラー時の状態の整数値定数

STATE_NOT_LOGIN	= 0;	//非ログイン時
STATE_TIMEOUT	= 1;	//タイムアウト時

LOGIN_MESSAGE = '';		//ログインダイアログのメッセージ
RE_LOGIN_MESSAGE = '';	//再ログインダイアログのメッセージ

UI_DIALOG 										= 'ui-dialog';									//ダイアログクラス名
UI_DIALOG_CONTENT 								= 'ui-dialog-content';							//ダイアログコンテンツのクラス名
DIALOG_DEFAULT_ALERT_CONTENTS					= 'dialog/defaultAlertContents.html';			//アラートを出すdomがあるファイル名
DEFAULT_ALERT_CONTENTS 							= 'defaultAlertContents';						//アラートダイアログの外側divのクラス名
CONFIRM_DIALOG 									= 'confirmDialog';								//確認ダイアログ
CONFIRM_DIALOG_BUTTONS							= '.confirmDialog button';						//確認ダイアログのボタン×2のセレクタ
CONFIRM_DIALOG_PATH								= 'dialog/confirmDialog.html';					//確認ダイアログのHTMLファイルパス
UI_DIALOG_CLOSEBOX								= '.ui-dialog-titlebar-close';					//jQuery UI Dialogのクローズボックスのセレクタ
UI_DIALOG_BUTTON_PANEL							= '.ui-dialog-buttonpane';						//jQuery UI Dialogのオプションで作るボタン領域のセレクタ

//選択されたボタンを表す値。
UNSELECTED 										= -1;											//ボタン未選択の値
NO												= 0;											//「はい」ボタンの値
YES												= 1;											//「いいえ」ボタンの値
CANCEL											= 2;											//「キャンセル」ボタンの値

CONFIRM_DIALOG_WAIT								= 30;											//汎用確認ダイアログ関数終了後関数実行までの待ち時間
ARGUMENT_OBJ									= 'argumentObj';								//dialogExクラスのインプット用オブジェクト名
RETURN_OBJ										= 'returnObj';									//dialogExクラスのアウトプット用オブジェクト名
SELECTOR_LAST									= ':last';										//「一番後ろの要素」の疑似セレクタ

ROLE											= 'role';										//role属性
CONFIRM_DIALOG									= 'confirmDialog';								//確認ダイアログ
SUGGESTION_BOX_CONFIRM_DIALOG					= 'suggestionBoxConfirmDialog';					//目安箱送信確認ダイアログ
MY_BLOG_CONFIRM_DIALOG							= 'myBlogConfirmDialog';						//マイブログ更新確認ダイアログ
MAIL_MAGAZINE_CONFIRM_DIALOG					= 'mailmagazineConfirmDialog';					//メルマガ送信確認ダイアログ


MEMBER_MAIL										= 0;											//目安箱 会員メールを示す数値
SUGGESTION_MAIL									= 1;											//目安箱 目安箱メールを示す数値

DIALOG_JS_DIR									= 'dialog/js/';
JS_IDENTIFIER									= '.js';
TEST_DIALOG										= 'testdialog';

GET_SCRIPT_FAIL_MESSAGE_FRONT					= "Faild to get Script File(location:";			//JSファイル取得エラーメッセージの前方
PARENTHESES_REAR								= ")";											//丸括弧閉じ

COMMON_FUNCS_NOT_EXIST							= 'commonFuncs is not exist.';					//共通関数クラスインスタンスcommonFuncsがないエラーメッセージ		
	
BLOG_UPDATE_STATUS 								= 'blogUpdateStatus';
INSERT_MYBLOG_STATUS							= 100;
UPDATE_MYBLOG_STATUS							= 200;
SUGGESTION_STATUS_OWNER							= 0;
SUGGESTION_STATUS_STAFF							= 1;
ADMIN_NORMAL_MAIL 								= 0;
ADMIN_ANNOUNCE_MESSAGE							= 1;

//jQuery UI Position用文字列。ダイアログの座標指定に使う
DIALOG_POSITION 								= 'center top';				//ダイアログのポジション

EXPLAIN											= 'explain';
TAG_CHILD_TR									= ' tr';	//子セレクタとしてのtr

//整数の4
INT_4											= 4;

//疑似セレクタ eqの文字列 前部
EQ_FRONT										= ':eq(';
//閉じ括弧と子セレクタtd
CLOSE_AND_TD_TAG 								= ') td';

//createTagクラスインスタンス用変数orキー名
INSTANCE_CREATE_TAG									= 'create_tag';
//クラスインスタンスを表すinstanceの文字列
INSTANCE										= 'instance';
//各ダイアログ専用クラスインスタンス用の変数orキー名
DIALOG_INSTANCE									= 'dialogBuilder';
//パスワードのセレクタ
PASSWORD_SELECTOR								= '.password';

//ユーザ名とパスワードをまとめたセレクタ
SELECTOR_USERNAME_PASSWORD					= '.userName, .password';
//ログインボタンのセレクタ
SELECTOR_LOGIN_BUTTON						= DOT + LOGIN_BUTTON;
//最新のダイアログのセレクタ
CURRENT_DIALOG								= DOT + DIALOG + SELECTOR_LAST;
//ログインダイアログのJSファイルのURL
URL_LOGIN_DIALOG_JS							= 'dialog/js/loginDialog.js';
//入力エリア
INPUT_AREA									= 'inputArea';
//体験レッスン予約希望ダイアログのJSファイルパス
EXPERIENCE_RESERVED_DIALOG_JS				= 'dialog/js/experienceReservedDialog.js';
ALLDAY_CHECKBOX								= '.allDayCheckbox';
ALLWEEK_CHECKBOX							= '.allWeekCheckbox';
CHECKBOX_DAYOFWEEK							= 'input[name="dayOfWeek"]';
CHECKBOX_WEEK								= 'input[name="week"]';
DIALOG_CLASS								= 'dialogClass';

//体験レッスン予約確認ダイアログのHTMLファイルのURL
EXPERIENCE_RESERVED_CONFIRM_DIALOG_URL		 = 'dialog/experienceReservedConfirmDialog.html';	
EXPERIENCE_RESERVED_CONFIRM_DIALOG_JS		 = 'dialog/js/experienceReservedConfirmDialog.js';	
EXPERIENCE_RESERVED_CONFIRM_DIALOG_JSON		 = 'dialog/source/experienceReservedConfirmDialog.json';	
EXPERIENCE_RESERVED_CONFIRM_DIALOG_HTML		 = 'dialog/template/experienceReservedConfirmDialog.html';	
//体験レッスン予約希望ダイアログの入力チェック用の定数群
//必須入力を行う入力フォームのname属性を配列に入れる。
EXPERIENCE_CHECK_FORMS = ['construct', 'course','schedule', 'name', 'personPhoneNumber', 'email', 'personEmailCheck', 'personCount'];
//必須入力を行う入力フォームのname属性の日本語版を連想配列で用意する。
EXPERIENCE_CHECK_FORMS_JP_NAME = {
			construct:'希望作品', 
			schedule:'希望時限', 
			name:'ご氏名', 
			personPhoneNumber:'電話番号', 
			email:'メールアドレス', 
			personEmailCheck:'メールアドレス(確認)', 
			personCount:'人数',
			course:'コース'
		};
//入力項目のエラー別メッセージの連想配列。
EXPERIENCE_CHECK_FORMS_ERROR_TEXT = {
		emptyList:"以下の項目が未入力となっています。\n",
		onlyAlphabetList	:"以下の項目は半角英数字記号のみを入力してください。\n",
		emailCheck	:"確認のため、同じメールアドレスもう一度入力してください。\n\n",
		numberList:"以下の項目の数値を1以上で入力してください。\n"
}
//体験レッスン予約希望ダイアログのパーツ名群
RESERVED_DATE								= 'reservedDate';
RESERVED_SUMMARY							= 'reservedSummary';
SPECIAL_CONTRUCT							= 'radioButtonSpecialConstruct';
SPECIAL_SCHEDULE							= 'radioButtonSpecialSchedule';
SUBINFO										= 'subInfo';
PERSON_INFORMATION							= 'personInformation';
MAIL_SUBJECT								= 'mailSubject';

//体験レッスン予約希望ダイアログ　入力チェックのリスト名称群
EMPTY_LIST									= 'emptyList';
ONLY_ALPHABET_LIST							= 'onlyAlphabetList';
EMAIL_CHECK									= 'emailCheck';
NUMBER_LIST									= 'numberList';
//体験レッスン予約希望ダイアログ 英数字入力チェック対象のセレクタ
IS_ALPHABET_CHECK_ELEMS_RESERVED_DIALOG		= 'input[name="personPhoneNumber"], input[name="email"], input[name="personCount"]';
SELECTOR_PERSON_MAIL						= '.personEmail input';
SELECTOR_PERSON_MAIL_CHECK					= '.personEmailCheck input';
SELECTOR_COUNT								= '.count';
ESCAPE_KAIGYOU								= "\n";				//改行のエスケープ文字
DISABLED									= 'disabled';
FORM_ELEMS									= 'input,button,textarea';	//フォームで使うタグ
FORM_DATA									= 'formData';
SELECTOR_NAME_FRONT							= '[name="';		//name属性を指定して取得するinputタグのセレクタの前部
SELECTOR_INPUT_NAME_FRONT					= 'input[name="';	//name属性を指定して取得するinputタグのセレクタの前部
SELECTOR_ATTR_REAR_AND_CHECKED				= '"]:checked';		//属性を指定するセレクタの閉じ括弧＋チェックが入った要素の疑似セレクタの文字列



FORM_VALIE_INPUTS							= 'input:text, input[type="email"], textarea, input:radio:checked, input:checkbox:checked, input:hidden,input[type="number"], input[type="search"], input[type="tel"], input[type="password"]';
ATTR_DISABLED								= '[disabled]';