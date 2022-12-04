// HTMLの要素を取得
const videoElement = document.getElementById("input");
const canvasElement = document.getElementById("output");
const canvasCtx = canvasElement.getContext("2d");

// 手指の形状検出モデルのインスタンスを生成
const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

// 検出結果を引数に呼ばれる関数
function onResults(results) {

    // キャンバスにカメラ映像を描画
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // 手が検出された時の処理
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {

            // キャンバスに各ランドマークとつなぐ線を描画
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }

        for (const worldLandmarks of results.multiHandWorldLandmarks) {
            for (const handedness of results.multiHandedness) {

                let num = 0
                let fingers = ["thumb", "index", "middle", "ring", "little"]

                //// 関節角度計算（親指だけ特殊なので個別処理）
                // 角度計算
                let thumb_rad = ((worldLandmarks[2].x - worldLandmarks[3].x)*(worldLandmarks[4].x - worldLandmarks[3].x) + (worldLandmarks[2].y - worldLandmarks[3].y)*(worldLandmarks[4].y - worldLandmarks[3].y) + (worldLandmarks[2].z - worldLandmarks[3].z)*(worldLandmarks[4].z - worldLandmarks[3].z)) / (Math.sqrt((worldLandmarks[2].x - worldLandmarks[3].x)**2 + (worldLandmarks[2].y - worldLandmarks[3].y)**2 + (worldLandmarks[2].z - worldLandmarks[3].z)**2) * Math.sqrt((worldLandmarks[4].x - worldLandmarks[3].x)**2 + (worldLandmarks[4].y - worldLandmarks[3].y)**2 + (worldLandmarks[4].z - worldLandmarks[3].z) **2));
                console.log(fingers[0], thumb_rad);
                // 閾値より小さければ伸びていると判断しnumにプラス（2の0乗）
                if (thumb_rad < -0.7) num += 1;

                //// 関節角度計算（人差し指〜小指）
                for (let i = 5, j=1; i <=17; i+=4, j++) {
                    // 角度計算
                    let rad = ((worldLandmarks[i].x - worldLandmarks[i+1].x)*(worldLandmarks[i+3].x - worldLandmarks[i+1].x) + (worldLandmarks[i].y - worldLandmarks[i+1].y)*(worldLandmarks[i+3].y - worldLandmarks[i+1].y) + (worldLandmarks[i].z - worldLandmarks[i+1].z)*(worldLandmarks[i+3].z - worldLandmarks[i+1].z)) / (Math.sqrt((worldLandmarks[i].x - worldLandmarks[i+1].x)**2 + (worldLandmarks[i].y - worldLandmarks[i+1].y)**2 + (worldLandmarks[i].z - worldLandmarks[i+1].z)**2) * Math.sqrt((worldLandmarks[i+3].x - worldLandmarks[i+1].x)**2 + (worldLandmarks[i+3].y - worldLandmarks[i+1].y)**2 + (worldLandmarks[i+3].z - worldLandmarks[i+1].z) **2));
                    console.log(fingers[j], rad);
                    // 閾値より小さければ伸びていると判断しnumにプラス（2のj乗）
                    if (rad < -0.5) num += 2**j;
                }

                console.log(num)

                // キャンバスに計算結果を表示
                canvasCtx.font = "120px serif"
                canvasCtx.fillStyle = "white"
                canvasCtx.fillText(num, 70, 160)
            }
        }
    }

    canvasCtx.restore();
}

// 手指の形状検出のオプション設定
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

// カメラの設定
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});

// カメラスタート
camera.start();
