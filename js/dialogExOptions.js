
var specialReservedDialogOption = {
	argumentObj:{
		config:{
			// ボタンの生成と設定を行う。
			buttons:[
				{
					// OKボタンのテキスト。
					text:'OK',
					// ボタン押下時の処理を記述する。
					click:function(event, ui){
					    //必須入力チェックを行う。
					    var emptyList = checkEmptyInput(checkNames);
				        //アルファベット入力だけ行わせるテキストボックス名のリストを格納する配列を宣言する。
					    var onlyAlphabetList = checkAllAlphabet('input[name="personPhoneNumber"], input[name="email"], input[name="personCount"]');
					    //メールアドレスの再入力が行われているかをチェックする。失敗なら配列に空文字を入れる。
					    var emailCheck = $('.personEmail input').val() !== $('.personEmailCheck input').val()? [""]: null;
					    //カウントクラスのテキストボックス(人数)が0以下でないかをチェックする。
					    var numberList = numberCheck('.count');
					    // 必須入力項目が皆入力済みであり、英数字しか入力してはいけない項目がOKなら
					    if(emptyList == null && onlyAlphabetList == null && emailCheck == null &&numberList == null) {
						    // 予約希望確認ダイアログを作成する。引数のオブジェクトに日付データ配列、コンテンツ名を渡す
						    var confirmDialog = new dialogEx(SPECIAL_RESERVED_CONFIRM_DIALOG_URL, specialReservedConfirmDialogOption.argumentObj, specialReservedConfirmDialogOption.returnObj);
						    //閉じたら完全にダイアログを破棄させる
					        confirmDialog.setCallbackClose(confirmDialog.destroy);
					        confirmDialog.run();	//予約希望確認ダイアログを開く
						        			 
						    //入力確認のものは送信すべきではないので、送信前に前持って無効化する
						    $('.personEmailCheck input').attr('disabled', 'disabled');
						    //ダイアログ内のフォームをsubmitする。
						    $('form.specialReservedDialog').submit();				        		 
						    // このダイアログの入力要素を一時的に無効化する。
						    disableInputs($(this));
					    } else {
					        //警告のテキストを作る。
					        var alerts = makeFailedAlertString({'emptyList':emptyList,'onlyAlphabetList':onlyAlphabetList,'emailCheck':emailCheck,'numberList':numberList},checkNamesJp, messages);
					        //アラートを出す。
					    	 alert(alerts);
					    }
					}
				},
				{
					// キャンセルボタンのテキスト。
					text:'Cancel',
					// ボタン押下時の処理を記述する。
					click:function(event, ui){
						$(this).dialog('close');//ダイアログを閉じる
						reservedData = null;	//予約データを消す
					}
				}
			],
			// 幅を設定する。
			width			: '300',
			// 予約ダイアログのクラスを追加する。
			dialogClass		:'reservedDialog',
			// ダイアログを生成と同時に開く。
			autoOpen		: true,
			// Escキーを押してもダイアログが閉じないようにする。
			closeOnEscape	: false,
			// モーダルダイアログとして生成する。
			modal			: true,
			// リサイズしない。
			resizable		: false, 
			// 作成完了時のコールバック関数。
			create:function(event, ui){
				// タイトルバーを見えなくする。
//				$(this).prev().children().filter('.ui-dialog-titlebar-close').remove();
//				$(this).next().css('font-size', '0.5em');
			},
			// 位置を指定する。
			position:{
				// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
				my:'center center',
				// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
				at:'center center',
				// ウィンドウをダイアログを配置する位置の基準に指定する。
				of:window
			}
		},
		data:{
			
		}
	},
	returnObj:{
		
	}
}
//ここまで体験レッスン予約ダイアログ関連関数

//体験レッスン予約確認ダイアログ関連関数

//体験レッスン予約確認ダイアログの設定オブジェクト
var specialReservedConfirmDialogOption = {
	argumentObj:{
		config:{
			// 幅を設定する。
			width			: '300',
			// 予約ダイアログのクラスを追加する。
			dialogClass		:'reservedDialog',
			// ダイアログを生成と同時に開く。
			autoOpen		: true,
			// Escキーを押してもダイアログが閉じないようにする。
			closeOnEscape	: false,
			//タイトルをつける。
			title:"レッスン予約希望 送信内容確認",
			// モーダルダイアログとして生成する。
			modal			: true,
			// リサイズしない。
			resizable		: false, 
			// 作成完了時のコールバック関数。
			create:function(event, ui){
				// タイトルバーを見えなくする。
				$('.reservedDialog .ui-dialog-titlebar-close').css('display', 'none');
			},
			// ダイアログが閉じられる前のイベント
			beforeClose:function(event, ui){
				//下のダイアログのロックを解除する。
				moveToPrevDialog($(this));
			},
			// 位置を指定する。
			position:{
				// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
				my:'center center',
				// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
				at:'center center',
				// ウィンドウをダイアログを配置する位置の基準に指定する。
				of:window
			}
		},
		data:{
			
		}
	},
	//アウトプット用データを格納するオブジェクト
	returnObj:{
		
	}
}

//ここまで体験レッスン予約確認ダイアログ関連関数

//ダイアログ設定用連想配列変数を宣言する
var dialogExOption = {};

//会員ページ、カレンダーをクリックしたときに表示する予約授業一覧ダイアログの設定
dialogExOption[STR_RESERVE_LESSON_LIST_DIALOG] = {
		argumentObj:{
			config:{
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
			},
			data:{
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			
		}
};

//会員ページTOP、予約確認ダイアログ用設定
dialogExOption[MEMBER_RESERVED_CONFIRM_DIALOG] = {
		argumentObj:{
			config:{
				// 幅を設定する。
				width			: STR_AUTO,
				// ダイアログを生成と同時に開く。
				autoOpen		: true,
				// Escキーを押してもダイアログが閉じないようにする。
				closeOnEscape	: false,
				//モーダル化する
				modal:true,
				//リサイズ不可にする
				resizable:false,
				//画面上部にダイアログを表示する
				position :{my:'center top',at:'center top', of:window}
			},
			data:{
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			//ダイアログの状態を表すオブジェクト
			statusObj:{
				buttonState:UNSELECTED	//押されたボタンの値。1→未選択 0→いいえ 1→はい 
			},
			//関数オブジェクト
			funcObj:{
				YES_NO:[	//「はい」ボタン、「いいえ」ボタン用コールバック関数
				        function(){	//「いいえ」ボタン
				        	//いいえ」ボタンの処理内容
				        },
				        function(){	//「はい」ボタン
				        	//「はい」ボタンの処理内容
				        }
				]
			}
		}
};

//会員ページTOP、予約キャンセルダイアログ用設定
dialogExOption[CANCEL_LESSON_DIALOG] = {
		argumentObj:{
			config:{
				// 幅を設定する。
				width			: STR_AUTO,
				// ダイアログを生成と同時に開く。
				autoOpen		: true,
				//モーダル化する
				modal:true,
				//リサイズ不可にする
				resizable:false,
				// Escキーを押してもダイアログが閉じないようにする。
				closeOnEscape	: false,
				//画面上部にダイアログを表示する
				position :{my:'center top',at:'center top', of:window}
			},
			data:{
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			//ダイアログの状態を表すオブジェクト
			statusObj:{
				buttonState:UNSELECTED	//押されたボタンの値。1→未選択 0→いいえ 1→はい 
			},
			//関数オブジェクト
			funcObj:{
				YES_NO:[	//「はい」ボタン、「いいえ」ボタン用コールバック関数
				        function(){	//「いいえ」ボタン
				        	//いいえ」ボタンの処理内容
				        },
				        function(){	//「はい」ボタン
				        	//「はい」ボタンの処理内容
				        }
				]
			}
		}
};

//管理者、授業詳細一覧用設定
dialogExOption[ADMIN_LESSONLIST_DIALOG] = {
		argumentObj:{
			config:{
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
			},
			data:{
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			
		}
};

//管理者、授業詳細ダイアログ
dialogExOption[LESSON_DETAIL_DIALOG] = {
		argumentObj:{
			config:{
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
				position :{my:'center top',at:'center top', of:window},
				//以下、ダイアログの状態に合わせて発生するイベントとコールバック関数。
				//dialogExクラスのsetCallback~関数でコールバック関数をセットします
				create:function(){	//ダイアログが作られたときのイベントとコールバック関数
					
				},
				open:function(){	//ダイアログが開いたときのイベントとコールバック関数
					
				},
				close:function(){	//ダイアログが閉じたのイベントとコールバック関数
					
				}
			},
			data:{
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			
		}
}

//管理者、授業追加ダイアログ
dialogExOption[ADMIN_NEW_LESSON_CREATE] = {
		argumentObj:{
			config:{
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
				position :{my:'center top',at:'center top', of:window},
				//以下、ダイアログの状態に合わせて発生するイベントとコールバック関数。
				//dialogExクラスのsetCallback~関数でコールバック関数をセットします
				create:function(){	//ダイアログが作られたときのイベントとコールバック関数
					
				},
				open:function(){	//ダイアログが開いたときのイベントとコールバック関数
					
				},
				close:function(){	//ダイアログが閉じたのイベントとコールバック関数
					
				}
			},
			data:{
				
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			
		}
}

//管理者、メール送信ダイアログ
dialogExOption[ADMIN_MAIL_SEND_DIALOG] = {
		argumentObj:{
			config:{
				//幅を自動設定する。
				width			: 300,
				//ダイアログを生成と同時に開く。
				autoOpen		: true,
				//リサイズ不可にする
				resizable:false,
				//Escキーを押してもダイアログが閉じないようにする。
				closeOnEscape	: false,
				//モーダル化する
				modal:true,
				//ダイアログタイトルをメッセージ作成にする
				title:'メッセージ作成',
				//画面上部にダイアログを表示する
				position :{my:'center top',at:'center top', of:window},
				//以下、ダイアログの状態に合わせて発生するイベントとコールバック関数。
				//dialogExクラスのsetCallback~関数でコールバック関数をセットします
				create:function(){	//ダイアログが作られたときのイベントとコールバック関数
					
				},
				open:function(){	//ダイアログが開いたときのイベントとコールバック関数
					
				},
				close:function(){	//ダイアログが閉じたのイベントとコールバック関数
					
				}
			},
			//アウトプット用データオブジェクト
			data:{
				//送信タイプ。ここに入った値で確認ダイアログを閉じたときのコールバック関数を分岐させる
				sendType:""
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			//ダイアログの状態を表すオブジェクト
			statusObj:{
				buttonState:UNSELECTED,	//押されたボタンの値。1→未選択 0→いいえ 1→はい
			},
			//関数オブジェクト
			funcObj:{
				YES_NO:[	//「はい」ボタン、「いいえ」ボタン用コールバック関数
				        function(){	//「いいえ」ボタン
				        	//いいえ」ボタンの処理内容
				        },
				        function(){	//「はい」ボタン
				        	//「はい」ボタンの処理内容
				        }
				],
				//管理者メール送信用関数
				mail:doSendMail,
				//お知らせ送信用関数
				announce:announceInsert
			},
			data:{
				messages:{
					mail:"メールを送信します。",
					announce:"お知らせを配信します。"
				}
			}
		}
}

//マイブログ確認ダイアログ
dialogExOption[MY_BLOG_CONFIRM_DIALOG] = {
		argumentObj:{
			config:{
				//幅を自動設定する。
				width			: 250,
				//ダイアログを生成と同時に開く。
				autoOpen		: true,
				//リサイズ不可にする
				resizable:false,
				//Escキーを押してもダイアログが閉じないようにする。
				closeOnEscape	: false,
				//モーダル化する
				modal:true,
				//ダイアログタイトルを送信確認にする
				title:'記事編集',
				//画面上部にダイアログを表示する
				position :{my:'center top',at:'center top', of:window},
				//以下、ダイアログの状態に合わせて発生するイベントとコールバック関数。
				//dialogExクラスのsetCallback~関数でコールバック関数をセットします
				create:function(){	//ダイアログが作られたときのイベントとコールバック関数
					
				},
				open:function(){	//ダイアログが開いたときのイベントとコールバック関数
					
				},
				close:function(){	//ダイアログが閉じたのイベントとコールバック関数
					
				}
			},
			data:{
				
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			//ダイアログの状態を表すオブジェクト
			statusObj:{
				buttonState:UNSELECTED,	//押されたボタンの値。1→未選択 0→いいえ 1→はい
			},
			data:{
				message:"編集した内容を保存します。"
			}
		}
}

//会員メール/目安箱メール 送信確認ダイアログ
dialogExOption[SUGGESTION_BOX_CONFIRM_DIALOG] = {
		argumentObj:{
			config:{
				//幅を自動設定する。
				width			: 250,
				//ダイアログを生成と同時に開く。
				autoOpen		: true,
				//リサイズ不可にする
				resizable:false,
				//Escキーを押してもダイアログが閉じないようにする。
				closeOnEscape	: false,
				//モーダル化する
				modal:true,
				//ダイアログタイトルを送信確認にする
				title:'送信確認',
				//画面上部にダイアログを表示する
				position :{my:'center top',at:'center top', of:window},
				//以下、ダイアログの状態に合わせて発生するイベントとコールバック関数。
				//dialogExクラスのsetCallback~関数でコールバック関数をセットします
				create:function(){	//ダイアログが作られたときのイベントとコールバック関数
					
				},
				open:function(){	//ダイアログが開いたときのイベントとコールバック関数
					
				},
				close:function(){	//ダイアログが閉じたのイベントとコールバック関数
					
				}
			},
			data:{
				message:"入力した内容を送信します。"
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			//ダイアログの状態を表すオブジェクト
			statusObj:{
				buttonState:UNSELECTED,	//押されたボタンの値。1→未選択 0→いいえ 1→はい
			},
			data:{
			}
		}
}

//確認ダイアログ
dialogExOption[MAIL_MAGAZINE_CONFIRM_DIALOG] = {
		argumentObj:{
			config:{
				//幅を自動設定する。
				width			: 250,
				//ダイアログを生成と同時に開く。
				autoOpen		: true,
				//リサイズ不可にする
				resizable:false,
				//Escキーを押してもダイアログが閉じないようにする。
				closeOnEscape	: false,
				//モーダル化する
				modal:true,
				//ダイアログタイトルを送信確認にする
				title:'送信確認',
				//画面上部にダイアログを表示する
				position :{my:'center top',at:'center top', of:window},
				//以下、ダイアログの状態に合わせて発生するイベントとコールバック関数。
				//dialogExクラスのsetCallback~関数でコールバック関数をセットします
				create:function(){	//ダイアログが作られたときのイベントとコールバック関数
					
				},
				open:function(){	//ダイアログが開いたときのイベントとコールバック関数
					
				},
				close:function(){	//ダイアログが閉じたのイベントとコールバック関数
					
				}
			},
			data:{
				message:"メルマガを送信します。"
			}
		},
		//アウトプット用データを格納するオブジェクト
		returnObj:{
			//ダイアログの状態を表すオブジェクト
			statusObj:{
				buttonState:UNSELECTED,	//押されたボタンの値。1→未選択 0→いいえ 1→はい
			},
			data:{
			}
		}
}

