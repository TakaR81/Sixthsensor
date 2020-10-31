async function sha256(text) {
    const uint8 = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', uint8)
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('')
}



function loginCheck() {
    var username = document.getElementById("user").value;
    var password = document.getElementById("pass").value;


    console.log(username + password);
    if (username == "kby" && password != "") {

        window.location.href = '../setting/?user=' + username; // 通常の遷移
    } else {
        document.getElementById("loginError").innerHTML =
            "ログインに失敗しました<br>" +
            "ユーザ名とパスワードを確認してください";
    }

}

$(function () {
    // 読み込み後に実行する処理
    document.getElementById("btn").onclick = function () {
        console.log("test");
        loginCheck();
    };
});
