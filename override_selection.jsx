/*
override_selection
(c)2005-2009 Seuzo Ichikawa. www.seuzo.jp
マスターページ上の選択アイテムをすべての適用ページ内でオーバーライドさせます。

2005-05-01	ver.0.1	とりあえず版。
2006-09-02	ver.0.2	Indesign CS2用	http://www.seuzo.jp/rubbs/search_html/msg01429.html
2009-10-28	ver.0.3	InDesign CS4用	JavaScriptで書き換え
*/


////////////////////////////////////////////エラー処理 
function myerror(mess) { 
  if (arguments.length > 0) { alert(mess); }
  exit();
}


////////////////////////////////////////////以下実行ルーチン
if (app.documents.length == 0) {myerror("ドキュメントが開かれていません")}
var my_document = app.documents[0];
var my_masterSpread = app.layoutWindows[0].activeSpread;//マスタースプレッド
if (my_masterSpread instanceof Spread) {myerror("マスターページのページアイテムを選択してください")}// MasterSpreadじゃなかった
var my_selection = my_document.selection;
if (my_selection.length === 0) {myerror("マスターページのページアイテムをひとつ以上選択してください")}
var my_class =my_selection[0].reflect.name; 
if ( !(my_class.match(/^(PageItem|Rectangle|Oval|Polygon|GraphicLine|TextFrame|Button|FormField|Group)$/))) {myerror("ページアイテムを選択してください")}

var my_counter = 0;//オーバーライドのカウンター
for (var i = 0; i < my_document.pages.length; i++) {//各ページループ
	if (my_document.pages[i].appliedMaster === my_masterSpread) {//同じマスターを適用していたら
		var my_masterPageItem = my_document.pages[i].masterPageItems;
		for (var ii = my_masterPageItem.length; ii >= 0; ii--) {//ページ中のマスターアイテムのループ：お尻から
			for (var iii = 0; iii < my_selection.length; iii++) {//選択アイテムのループ
				if (my_masterPageItem[ii] === my_selection[iii]) {
					try {
						my_masterPageItem[ii].override(my_document.pages[i]);
						my_counter++;
					} catch (my_Error) {
						myerror("オーバーライドでエラー：" + my_Error);
					}
				}
			}//選択アイテムのループ
		}//ページ中のマスターアイテムのループ
	}
}//各ページループ

if (my_counter === 0) {
	alert("オーバーライド箇所はありませんでした。");
} else {
	alert(my_counter + "箇所をオーバーライドしました。");
}
