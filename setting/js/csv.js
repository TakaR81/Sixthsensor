

//html の body部分ロード完了時実行
$(function () {
    //ボタン押されたら保存
    document.getElementById("save").onclick = function () { btnClick() };
    $("#setting-btn").click(function () {
        //クリック後の処理
        //location.href = "../home/";
    });

    //readCSV();
});


//csvを保存する関数
//引数にあるリストデータを保存する
//php側のモードをwにしているので書き換え式になってる
//例　saveCSV("test") "test"という文字列を保存
function saveCSV(datalist) {
    $.ajax({
        url: "../php/csv.php",
        type: "POST",
        data: { datas: datalist }
    });

}
function btnClick() {
    var ketui = document.getElementById("ketui").value;
    var account = document.getElementById("account").value;

    if (ketui && account) {
        console.log(ketui, account);
        saveCSV([ketui, account]);
        document.getElementById("success").innerHTML = "保存が完了しました";
        document.getElementById("loginError").innerHTML = "";
        //location.href = "../home/";
    }
    else {
        document.getElementById("loginError").innerHTML = "正しい情報を入力してください";
        document.getElementById("success").innerHTML = "";
    }
}




//csv読み込み
//https://uxmilk.jp/11586
function readCSV() {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "../data/setting.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行

    req.onload = function () {
        text = req.responseText;
        setInputBox(text.replace("\n", "").split(','));
    }
}


function setInputBox(words) {
    document.getElementById("ketui").value = words[0];
    document.getElementById("url").value = words[1];
}