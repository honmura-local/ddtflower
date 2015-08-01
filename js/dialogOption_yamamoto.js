
//ダイアログ設定用連想配列変数を宣言する
var dialogExOption = {};

//会員ページ、カレンダーをクリックしたときに表示する予約授業一覧ダイアログの設定
dialogExOption[STR_RESERVE_LESSON_LIST_DIALOG] = {
	//幅を自動設定する。
	width			: STR_AUTO,
	//ダイアログを生成と同時に開く。
	autoOpen		: true,
	//Escキーを押してもダイアログが閉じないようにする。
	closeOnEscape	: false,
	//モーダル化する
	modal:true,
	//リサイズ不可にする
	resizable:false,
	//画面上部にダイアログを表示する
	position :{my:'center top',at:'center top', of:window}
};

//会員ページTOP、予約確認ダイアログ用設定
dialogExOption[MEMBER_RESERVED_CONFIRM_DIALOG] = {
	// 幅を設定する。
	width			: STR_AUTO,
	// ダイアログを生成と同時に開く。
	autoOpen		: true,
	// Escキーを押してもダイアログが閉じないようにする。
	closeOnEscape	: false,
	//リサイズ不可にする
	resizable:false,
	//モーダル化する
	modal:true
};

//会員ページTOP、予約キャンセルダイアログ用設定
dialogExOption[CANCEL_LESSON_DIALOG] = {
	// 幅を設定する。
	width			: STR_AUTO,
	// ダイアログを生成と同時に開く。
	autoOpen		: true,
	//リサイズ不可にする
	resizable:false,
	// Escキーを押してもダイアログが閉じないようにする。
	closeOnEscape	: false
};

//管理者、授業詳細一覧用設定
dialogExOption[ADMIN_LESSONLIST_DIALOG] = {
	//幅を自動設定する。
	width			: STR_AUTO,
	//ダイアログを生成と同時に開く。
	autoOpen		: true,
	//リサイズ不可にする
	resizable:false,
	//Escキーを押してもダイアログが閉じないようにする。
	closeOnEscape	: false,
	//モーダル化する
	modal:true,
	//画面上部にダイアログを表示する
	position :{my:'center top',at:'center top', of:window}
}

//管理者、授業詳細ダイアログ
dialogExOption[LESSON_DETAIL_DIALOG] = {
	//幅を自動設定する。
	width			: STR_AUTO,
	//ダイアログを生成と同時に開く。
	autoOpen		: true,
	//リサイズ不可にする
	resizable:false,
	//Escキーを押してもダイアログが閉じないようにする。
	closeOnEscape	: false,
	//モーダル化する
	modal:true,
	//画面上部にダイアログを表示する
	position :{my:'center top',at:'center top', of:window}
}

//管理者、授業追加ダイアログ
dialogExOption[ADMIN_NEW_LESSON_CREATE] = {
	//幅を自動設定する。
	width			: STR_AUTO,
	//ダイアログを生成と同時に開く。
	autoOpen		: true,
	//リサイズ不可にする
	resizable:false,
	//Escキーを押してもダイアログが閉じないようにする。
	closeOnEscape	: false,
	//モーダル化する
	modal:true,
	//画面上部にダイアログを表示する
	position :{my:'center top',at:'center top', of:window}
}