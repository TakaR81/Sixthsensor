

//html の body部分ロード完了時実行
$(function () {
    //ボタン押されたら保存
    document.getElementById("csv").onclick = function () { btnClick() };
    readCSV();
});


//csvを保存する関数
//引数にあるリストデータを保存する
//php側のモードをwにしているので書き換え式になってる
//例　saveCSV("test") "test"という文字列を保存
function saveCSV(datalist) {
    console.log(datalist);
    $.ajax({
        url: "./php/csv.php",
        type: "POST",
        data: { datas: datalist }
    }).done(function (html) {
        $('#container').append(html);
    }).fail(function () {
        alert('エラーが起きました');
    }).always(function () {
        console.log('complete');
    });


}
function btnClick() {
    var ketui = document.getElementById("ketui").value;
    var url = document.getElementById("url").value;
    console.log([ketui, url]);
    saveCSV([ketui, url]);
    //window.location.href = '../home/'; // 通常の遷移
}




//csv読み込み
//https://uxmilk.jp/11586
function readCSV() {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "./data/setting.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行

    req.onload = function () {
        text = req.responseText;
        setInputBox(text.replace("\n", "").split(','));
    }
}


function setInputBox(words) {
    document.getElementById("ketui").value = words[0];
    document.getElementById("url").value = words[1];
    console.log(words);
}