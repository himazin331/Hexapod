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
	.then(data =>{
        successMessage();
	});
}

// キャンバス画像 -> バイナリ
function canvasToBlob(canvas) {
	const base64Data = canvas.toDataURL().split(',')[1]; // Data URLからBase64データを取得
	const binary = atob(base64Data); // Base64形式の文字列をデコード

	// Blobデータの生成
	const array = new Uint8Array(new ArrayBuffer(binary.length));
	for(let i = 0; i < binary.length; i++){
		array[i] = binary.charCodeAt(i);
	}

	// Blobの構築
	return new Blob([array], {type: 'image/png'});
}

function successMessage() {
    console.log("Upload");
}
