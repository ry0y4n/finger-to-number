const videoElement = document.getElementById("input");
const canvasElement = document.getElementById("output");
const canvasCtx = canvasElement.getContext("2d");

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            // for (const handedness of results.multiHandedness) {
            //     if (handedness.label == "Left") {
            //         console.log("Right Hand")

            //     }
            //     else {
            //         console.log("Left Hand")
            //     }
            // }
            
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
            // console.log(landmarks)
        }
        for (const worldLandmarks of results.multiHandWorldLandmarks) {
            for (const handedness of results.multiHandedness) {

                let num = 0
                let fingers = ["thumb", "index", "middle", "ring", "little"]

                // 右手の処理
                if (handedness.label == "Left") {
                    console.log("Right Hand")

                    let thumb_rad = ((worldLandmarks[2].x - worldLandmarks[3].x)*(worldLandmarks[4].x - worldLandmarks[3].x) + (worldLandmarks[2].y - worldLandmarks[3].y)*(worldLandmarks[4].y - worldLandmarks[3].y) + (worldLandmarks[2].z - worldLandmarks[3].z)*(worldLandmarks[4].z - worldLandmarks[3].z)) / (Math.sqrt((worldLandmarks[2].x - worldLandmarks[3].x)**2 + (worldLandmarks[2].y - worldLandmarks[3].y)**2 + (worldLandmarks[2].z - worldLandmarks[3].z)**2) * Math.sqrt((worldLandmarks[4].x - worldLandmarks[3].x)**2 + (worldLandmarks[4].y - worldLandmarks[3].y)**2 + (worldLandmarks[4].z - worldLandmarks[3].z) **2));
                    console.log(fingers[0], thumb_rad);
                    if (thumb_rad < -0.7) num += 1;
                    for (let i = 5, j=1; i <=17; i+=4, j++) {
                        let rad = ((worldLandmarks[i].x - worldLandmarks[i+1].x)*(worldLandmarks[i+3].x - worldLandmarks[i+1].x) + (worldLandmarks[i].y - worldLandmarks[i+1].y)*(worldLandmarks[i+3].y - worldLandmarks[i+1].y) + (worldLandmarks[i].z - worldLandmarks[i+1].z)*(worldLandmarks[i+3].z - worldLandmarks[i+1].z)) / (Math.sqrt((worldLandmarks[i].x - worldLandmarks[i+1].x)**2 + (worldLandmarks[i].y - worldLandmarks[i+1].y)**2 + (worldLandmarks[i].z - worldLandmarks[i+1].z)**2) * Math.sqrt((worldLandmarks[i+3].x - worldLandmarks[i+1].x)**2 + (worldLandmarks[i+3].y - worldLandmarks[i+1].y)**2 + (worldLandmarks[i+3].z - worldLandmarks[i+1].z) **2));
                        console.log(fingers[j], rad);
                        if (rad < -0.5) num += 2**j;
                    }

                    console.log(num)
                    canvasCtx.font = "120px serif"
                    canvasCtx.fillStyle = "white"
                    canvasCtx.fillText(num, 70, 160)
                }
                else {
                    console.log("Left Hand")
                    let rad = ((worldLandmarks[9].x - worldLandmarks[10].x)*(worldLandmarks[12].x - worldLandmarks[10].x) + (worldLandmarks[9].y - worldLandmarks[10].y)*(worldLandmarks[12].y - worldLandmarks[10].y) + (worldLandmarks[9].z - worldLandmarks[10].z)*(worldLandmarks[12].z - worldLandmarks[10].z)) / (Math.sqrt((worldLandmarks[9].x - worldLandmarks[10].x)**2 + (worldLandmarks[9].y - worldLandmarks[10].y)**2 + (worldLandmarks[9].z - worldLandmarks[10].z)**2) * Math.sqrt((worldLandmarks[12].x - worldLandmarks[10].x)**2 + (worldLandmarks[12].y - worldLandmarks[10].y)**2 + (worldLandmarks[12].z - worldLandmarks[10].z) **2));
                    console.log(rad)
                }
            }
        }
    }

    canvasCtx.restore();
}

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});

camera.start();