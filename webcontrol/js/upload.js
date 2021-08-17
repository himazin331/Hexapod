const region = 'us-east-1';
const poolId = 'us-east-1:a1efa3fb-ea24-4f92-93fe-74db5d7782ed';
const bucket = 'hexapod-camera';

// AWS認証
AWS.config.region = region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: poolId
});

// 静止画アップロード
function uploadImage(canvas) {
    // バイナリ変換
    const file = canvasToBlob(canvas);

    // ファイル名
    let date = new Date();
    file.name = date.getFullYear() + "-" + ("0"+date.getMonth()).slice(-2) + "-" + ("0"+date.getDate()).slice(-2) + "-" + 
                                    ("0"+date.getHours()).slice(-2) + ("0"+date.getMinutes()).slice(-2) + ("0"+date.getSeconds()).slice(-2) + ".png";

    // ファイルのアップロード
	const upload = new AWS.S3.ManagedUpload({
		params: {
			Bucket: bucket,
			Key: file.name,
			Body: file,
			ContentType: file.type,
			ACL: 'public-read'
		}
	}).promise()
	.then((data)=> {
        Message(1); // 撮影成功メッセージ表示
	});
}

// 録画
let recorder;
function startCapture(canvas) {
	const stream = canvas.captureStream();
	
	// レコーダー作成
	if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {	// Chrome, Edge, Opera
		recorder = new MediaRecorder(stream, {mimeType:"video/webm;codecs=vp9"});
	} else {	// Firefox
		recorder = new MediaRecorder(stream, {mimeType:"video/webm;codecs=vp8"});
	}
	recorder.start(); // 録画開始
	Message(2); // 開始メッセージ表示
}
// 録画終了
function endCapture() {
	recorder.stop();
	recorder.ondataavailable = function(e) {
		uploadVideo(e); // 動画アップロード
	}
}

// 動画アップロード
function uploadVideo(video) {
	const file = new Blob([video.data], { type: video.data.type });

	// ファイル名
    let date = new Date();
    file.name = date.getFullYear() + "-" + ("0"+date.getMonth()).slice(-2) + "-" + ("0"+date.getDate()).slice(-2) + "-" + 
                                    ("0"+date.getHours()).slice(-2) + ("0"+date.getMinutes()).slice(-2) + ("0"+date.getSeconds()).slice(-2) + ".webm";

    // ファイルのアップロード
	const upload = new AWS.S3.ManagedUpload({
		params: {
			Bucket: bucket,
			Key: file.name,
			Body: file,
			ContentType: file.type,
			ACL: 'public-read'
		}
	}).promise()
	.then((data)=> {
        Message(3); // 録画成功メッセージ表示
	});
}

// キャンバス画像 -> バイナリ
function canvasToBlob(canvas) {
	const base64Data = canvas.toDataURL().split(',')[1]; // Data URLからBase64データを取得
	const binary = atob(base64Data); // Base64形式の文字列をデコード

	// Blobデータの生成
	const array = new Uint8Array(new ArrayBuffer(binary.length));
	for(let i = 0; i < binary.length; i++) {
		array[i] = binary.charCodeAt(i);
	}

	// Blobの構築
	return new Blob([array], {type: 'image/png'});
}

// メッセージ表示
function Message(id) {
    const msgfield = document.getElementById("message_field");

	// 表示
	if (id === 1) { // 撮影
		msgfield.innerHTML = "<p class='message'>撮影成功</p>";
	} else if (id === 2) { // 録画開始
		msgfield.innerHTML = "<p class='message'>録画開始</p>";
	} else {
		msgfield.innerHTML = "<p class='message'>録画成功</p>";
	}

	msgfield.animate([{opacity: '0'}, {opacity: '1'}], 500);

	// 消滅
	setTimeout(function () {
		msgfield.animate([{opacity: '1'}, {opacity: '0'}], 500);
		setTimeout(function () {
			msgfield.innerHTML = "";
		}, 510);
	}, 5000);
}


