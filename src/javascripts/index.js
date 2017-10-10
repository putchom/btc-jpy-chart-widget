var buf = {};
buf['CoinCheck'] = [[], []];
var ws = new WebSocket('wss://ws-api.coincheck.com/');
ws.onopen = function() {
  ws.send(JSON.stringify({        // 購読リクエストを送信
    "type": "subscribe",
    "channel": "btc_jpy-trades"
  }));
};
ws.onmessage = function(msg) { // メッセージ更新時のコールバック
  var response = JSON.parse(msg.data);
  buf['CoinCheck'][response[4] === 'buy' ? 0 : 1].push({
    x: Date.now(), // タイムスタンプ（ミリ秒）
    y: response[2] // 価格（日本円）
  });
}
var id = 'CoinCheck';
var ctx = document.getElementById(id).getContext('2d');
Chart.defaults.global.defaultFontColor = 'white';
var chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        data: [],
        label: 'Buy',                     // 買い取引データ
        borderColor: 'rgb(255, 0, 161)', // 線の色
        backgroundColor: 'rgba(255, 94, 193, 0.5)', // 塗りの色
        fill: false,                      // 塗りつぶさない
        lineTension: 0                    // 直線
      }, {
        data: [],
        label: 'Sell',                    // 売り取引データ
        borderColor: 'rgb(246, 255, 0)', // 線の色
        backgroundColor: 'rgba(250, 255, 132, 0.5)', // 塗りの色
        fill: false,                      // 塗りつぶさない
        lineTension: 0                    // 直線
      }]
    },
    options: {
      title: {
        text: 'BTC/JPY', // チャートタイトル
        display: true
      },
      scales: {
        xAxes: [{
          type: 'realtime', // X軸に沿ってスクロール
          gridLines: {
            color: '#595b77'
          }
        }],
        yAxes: [{
          gridLines: {
            color: '#595b77'
          }
        }]
      },
      plugins: {
        streaming: {
          duration: 300000, // 300000ミリ秒（5分）のデータを表示
          onRefresh: function(chart) { // データ更新用コールバック
            Array.prototype.push.apply(
              chart.data.datasets[0].data, buf[id][0]
            ); // 買い取引データをチャートに追加
            Array.prototype.push.apply(
              chart.data.datasets[1].data, buf[id][1]
            ); // 売り取引データをチャートに追加
            buf[id] = [[], []]; // バッファをクリア
          }
        }
      }
    }
});
