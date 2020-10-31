//https://qiita.com/masatatsu/items/a311e88f19eecd8f47ab
//https://qiita.com/Haruka-Ogawa/items/59facd24f2a8bdb6d369#3-2-%E6%A3%92%E3%82%B0%E3%83%A9%E3%83%95
//https://qiita.com/kakuta_yu/items/cb81b4ca63fae1067672
//http://www.kogures.com/hitoshi/javascript/chartjs/scale-label.html
//https://qiita.com/saka212/items/5714fa68deb44a185ec3


//こららはjsonファイルから読み込み
var datasets;
var label;
var ketui = "";
var colors = ["#ffc297", "#f56500", "#f56500", "#f56500"];
var buttonNames = ["tweet", "day", "week"];
$(function () {
    //canvasロード後に実行
    // ボタンをクリックしたら、グラフを再描画
    document.getElementById("tweet").onclick = function () { drawCanvas("tweet"); };
    document.getElementById("day").onclick = function () { drawCanvas("day"); };
    document.getElementById("week").onclick = function () { drawCanvas("week"); };


    $("#setting-btn").click(function () {
        //クリック後の処理
        location.href = "../setting/";
    });
    setColors();



});




function setColors() {
    var mayoi = "";
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "../data/setting.csv", true);
    req.send(null); // HTTPリクエストの発行

    req.onload = function () {
        text = req.responseText;
        ketui = text.replace("\n", "").split(',')[0];
        console.log(ketui);



        fetch("../data/colors.json")
            .then(res => res.json())
            .then(jsonData => {
                colors[2] = jsonData[ketui][0];
                colors[3] = jsonData[ketui][1];
                document.getElementById("day").click();
            });
    }
}


function drawCanvas(mode) {
    buttonNames.forEach(function (name) {

        if (name != mode) {
            document.getElementById(name).style.backgroundColor = colors[0];
        } else {
            document.getElementById(name).style.backgroundColor = colors[1];
        }
    });

    fetch("../data/" + mode + "7.json")
        .then(res => res.json())
        .then(jsonData => {
            //場合によって変更
            data = jsonData.data;
            label = jsonData.labels;


            datasets = [
                {
                    label: "",
                    data: data,
                    backgroundColor: ['#ff69b4'] // 配列にするとｎ番目のデータはn番目の色を使える
                }
            ]
            //optionsで縦軸のサイズを変更
            var options = setOptions(data);



            // 各棒グラフの値が正か負かによって色分け
            for (var i = 0; i < datasets[0].data.length; i++) {
                if (datasets[0].data[i] > 0) {
                    datasets[0].backgroundColor[i] = colors[2];
                } else {
                    datasets[0].backgroundColor[i] = colors[3];
                }
            }
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: label,
                    datasets: datasets

                },
                options: options
            });
        });



}


//桁指定の切り上げ
function Ceil(value, base = 0) {
    return Math.ceil(value * (10 ** base)) / (10 ** base);
}



function setOptions(datalist) {
    //データリストからy軸の最小、最大を変更する
    max = Math.max.apply(null, datalist);
    min = Math.min.apply(null, datalist);

    if (max < Math.abs(min)) max = Math.abs(min);

    yMax = Ceil(max, -1 * String(Math.ceil(max)).length);

    if (yMax / 2 > max) {
        yMax = yMax / 2;
    }






    var options = {
        legend: {                          //凡例設定
            display: false                 //表示設定
        },
        title: {                           //タイトル設定
            display: true,                 //表示設定
            fontSize: 30,                  //フォントサイズ
            text: ""               //ラベル
        },
        scales: {
            xAxes: [{
                gridLines: {
                    lineWidth: 2 //線を太く
                },
                ticks: {
                    fontSize: 24,

                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: -1 * yMax,
                    max: yMax,
                    maxTicksLimit: 12,
                    fontSize: 24
                },
                gridLines: {
                    lineWidth: 2, //線を太く
                    zeroLineWidth: 3//0軸はさらに太く
                }
            }]
        }
    }

    return options;
}