let width = 512, height = 384; // カメラ映像画面デフォルトサイズ
const canvas = document.getElementById("canvas");

// カメラ映像描画
const context = canvas.getContext("2d");
function render() {
    const image = new Image();
    image.src = "http://192.168.1.22:8001/?action=snapshote";
    image.onload = function() {
        context.drawImage(image, 0, 0, width, height);
    }
    image.crossOrigin = "Anonymous";
    window.requestAnimationFrame(render);
}
render();

// カメラ映像画面サイズ変更
let canvassize = document.getElementById("canvas_size");
const canvassizeWidth = [512, 563, 614, 666, 717, 768, 800];
function canvasSize() {
    canvassize = document.getElementById("canvas_size");
    for (let i = 0; i < 7; i++) {
        if (canvassize.value === canvassize.options[i].value) {
            width = canvassizeWidth[i];
            height = width * 0.75;
            break;
        }
    }
    canvas.width = width;
    canvas.height = height;
    render();
}

// カメラコントロールボタン
let captureflg = 0;
const startcapture_button = document.getElementById("startcapture");
const endcapture_button = document.getElementById("endcapture");
// イベント紐付け
function cameracontrolInit() {
    startcapture_button.addEventListener('mouseover', function() {
        if (startcapture_button.disabled === false) {
            startcapture_button.style.backgroundColor = "deepskyblue";
        }
    });
    startcapture_button.addEventListener('mouseout', function() {
        if (startcapture_button.disabled === false) {
            startcapture_button.style.backgroundColor = "lightskyblue";
        }
    });
    endcapture_button.addEventListener('mouseover', function() {
        if (endcapture_button.disabled === false) {
            endcapture_button.style.backgroundColor = "deepskyblue";
        }
    });
    endcapture_button.addEventListener('mouseout', function() {
        if (endcapture_button.disabled === false) {
            endcapture_button.style.backgroundColor = "lightskyblue";
        }
    });
}
cameracontrolInit();
// 有効・無効切り替え
function cameraControl() {
    if (captureflg === 0) {
        endcapture_button.disabled = true;
        startcapture_button.disabled = false;

        endcapture_button.style.backgroundColor = "slategray";
        startcapture_button.style.backgroundColor = "lightskyblue";
    } else {
        startcapture_button.disabled = true;
        endcapture_button.disabled = false;

        startcapture_button.style.backgroundColor = "slategray";
        endcapture_button.style.backgroundColor = "lightskyblue";
    }
}
cameraControl();

// 撮影呼び出し
function call_uploadImage() {
    uploadImage(canvas);
}

// 録画・停止呼び出し
function call_startCapture() {
    captureflg = 1;
    startCapture(canvas);
    cameraControl(captureflg);
}
function call_endCapture() {
    captureflg = 0;
    endCapture();
    cameraControl(captureflg);
}

// レスポンシブ関連
let windowW, flg = 0;
const breakpointWidth = [750, 800, 850, 900, 950, 985]; // ブレークポイント
function responsiveChange() {
    // キャンバスサイズ変更
    windowW = window.innerWidth;
    for (let i = 5; i >= 0; i--) {
        if (windowW < breakpointWidth[i]) // ブレークポイントより小さい -> 選択無効化&サイズダウン
        {
            canvassize.options[i+1].disabled = true;
            // サイズ変更
            if (canvassize.value === canvassize.options[i+1].value)
            {
                canvassize.options[i].selected = true;
                canvasSize();
                break;
            }
        } else { // ブレークポイントより大きい -> 選択有効化
            canvassize.options[i+1].disabled = false;
        }
    }
}
window.onresize = responsiveChange;

// ------------------------------------------------------------------------------------------------

// canvas座標取得
document.addEventListener("DOMContentLoaded", function() {
    canvas.addEventListener("mousedown", function(e){
        const rect = e.target.getBoundingClientRect();

        // ブラウザ上の座標
        const viewX = e.clientX - rect.left, 
                viewY = e.clientY - rect.top;
        // 表示サイズとキャンバスの実サイズの比率
        const scaleWidth =  canvas.clientWidth / canvas.width,
                scaleHeight =  canvas.clientHeight / canvas.height;
        // canvas上の座標
        const canvasX = Math.floor( viewX / scaleWidth ),
                canvasY = Math.floor( viewY / scaleHeight );
        
        cameraMoveX(width, canvasX, 1); // 始点送信
    });
    canvas.addEventListener("mouseup", function(e){
        const rect = e.target.getBoundingClientRect();

        // ブラウザ上の座標
        const viewX = e.clientX - rect.left, 
                viewY = e.clientY - rect.top;
        // 表示サイズとキャンバスの実サイズの比率
        const scaleWidth =  canvas.clientWidth / canvas.width,
                scaleHeight =  canvas.clientHeight / canvas.height;
        // canvas上の座標
        const canvasX = Math.floor( viewX / scaleWidth ),
                canvasY = Math.floor( viewY / scaleHeight );
        
        cameraMoveX(width, canvasX, 0); // 終点送信
    });
});

xhr = new XMLHttpRequest();

// カメラ制御(X座標)
var xd, xu, cx;
function cameraMoveX(w, x, flg) {
    // 始点
    if (flg) {
        xd = x;
        return 0;
    } else { // 終点
        xu = x;
    }

    cx = (xu - xd) / (w / 180)

    // サーバ送信
    xhr.open('POST', '/cameraMoveX', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("c_xdeg="+cx);
}