const region = 'us-east-1';
const poolId = 'us-east-1:a1efa3fb-ea24-4f92-93fe-74db5d7782ed';
const bucket = 'hexapod-camera';

// AWS認証
AWS.config.region = region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: poolId
});
const imageList = document.getElementById("image_list");
const s3 = new AWS.S3();
let filesData;

// 画像・動画表示
function showImage() {
    // 画像・動画取得
    s3.listObjectsV2({
        Bucket: bucket,
    }).promise()
    .then((data)=>{
        let table = "";
        for(let i = 0; i < data.Contents.length; i++){
            const item = data.Contents[i];
            const url = "https://" + data.Name + ".s3.amazonaws.com/"+ item.Key;

            table += "<tr id='" + item.Key + "_col'>";
            table += "<td><img id='" + item.Key + "_image' crossOrigin='Anonymous' src='" + url + "' width='200'></td>";
            table += "<td>" + item.Key + "</td>";
            table += "<td>" + item.LastModified + "</td>";
            table += "<td>" + 
                        "<div><a href='javascript:void(0);' onclick='deleteImage(\"" + item.Key + "\");'>削除</a></div>" + 
                        "<div><a id='" + item.Key + "_download' href='' onclick='downloadImage(\""+ item.Key +"\")'>ダウンロード</a></div>" +
                    "</td>";
            table += "</tr>";
        }
        imageList.innerHTML = table;
    });
}
window.onload = showImage;

// 画像・動画削除
function deleteImage(key) {
    s3.deleteObject({
        Bucket: bucket, 
        Key: key
    }).promise()
    .then((data)=>{
        // 要素削除
        const col = document.getElementById(key + "_col");
        col.remove();
    });
}

// 画像ダウンロード
function downloadImage(key) {
    const image = document.getElementById(key + "_image");
    
    // キャンバス描画
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);
    
    // ダウンロードリンクにbase64データを関連付け
    const download_link = document.getElementById(key + "_download");
    download_link.download = key;
    download_link.href = "data:image/png;base64," + canvas.toDataURL().split(',')[1];

    // キャンバス破棄
    canvas.remove();
}