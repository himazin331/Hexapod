const region = 'us-east-1';
const poolId = 'us-east-1:a1efa3fb-ea24-4f92-93fe-74db5d7782ed';
const bucket = 'hexapod-camera';

// AWS認証
AWS.config.region = region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: poolId
});
const contentList = document.getElementById("content_list");
const s3 = new AWS.S3();
let contentData;

// 画像・動画表示
function showContent() {
    // 画像・動画取得
    s3.listObjectsV2({
        Bucket: bucket,
    }).promise()
    .then((data)=>{
        contentData = data;

        // DOM操作
        contentList.innerHTML = funcDOM();
    });
}
window.onload = showContent;

// 表示コンテンツ&並び順設定適用
function refreshViewSort() {
    let vc, sc;
    // 表示コンテンツ
    const vcs = document.getElementsByName("view_content");
    for (let i = 0; i < vcs.length; i++) {
        if (vcs[i].checked) {
            vc = vcs[i].value;
            break;
        }
    }
    // 並び順
    const scs = document.getElementsByName("sort_content");
    for (let i = 0; i < scs.length; i++) {
        if (scs[i].checked) {
            sc = scs[i].value;
            break;
        }
    }
    // DOM操作
    contentList.innerHTML = funcDOM(vc, sc);
}

// DOM操作
function funcDOM(vc="vc1", sc="sc1") {
    function innerTable(item) {
        const url = "https://"+contentData.Name+".s3.amazonaws.com/"+item.Key;

        table += "<tr id='"+item.Key+"_col'>";
        // サムネイル
        if (item.Key.slice(-3) === "png") { // 画像
            table += "<td class='content-td'> \
                        <img name='item' id='"+item.Key+"_content' crossOrigin='Anonymous' src='"+url+"' width='200px'> \
                    </td>";
        } else { // 動画
            table += "<td class='content-td'> \
                        <video controls name='item' id='"+item.Key+"_content' crossOrigin='Anonymous' width='200px'> \
                            <source id='test' src='"+url+"' type='video/webm'> \
                        </video> \
                    </td>";
        }
        // ファイル名
        table += "<td>"+item.Key+"</td>";
        // アップロード日時
        table += "<td>"+String(item.LastModified).slice(0, -16)+"</td>";
        // 削除リンク
        table += "<td><div><a href='javascript:void(0);' onclick='deleteContent(\""+item.Key+"\");'>削除</a></div>";
        // ダウンロードリンク
        if (item.Key.slice(-3) === "png") { // 画像
            table += "<div><a id='"+item.Key+"_download' href='' onclick='downloadImage(\""+item.Key+"\")'>ダウンロード</a></div></td>";
        } else { // 動画
            table += "<div><a id='"+item.Key+"_download' href='#!' onclick='downloadVideo(\""+item.Key+"\")'>ダウンロード</a></div></td>";
        }
        table += "</tr>";
    }

    let table = "";
    // アップロード日時が新しい順
    if (sc === "sc1") {
        for(let i = contentData.Contents.length-1; i >= 0; i--) {
            const item = contentData.Contents[i];
            if (vc === "vc2" && item.Key.slice(-4) === "webm") { // 画像のみ
                continue;
            } else if (vc === "vc3" && item.Key.slice(-3) === "png") { // 動画のみ
                continue;
            }
            innerTable(item);
        }
    } else { // アップロード日時が古い順
        for(let i = 0; i < contentData.Contents.length; i++) {
            const item = contentData.Contents[i];
            if (vc === "vc2" && item.Key.slice(-4) === "webm") { // 画像のみ
                continue;
            } else if (vc === "vc3" && item.Key.slice(-3) === "png") { // 動画のみ
                continue;
            }
            innerTable(item);
        }
    }
    return table;
}

// 画像・動画削除
function deleteContent(key) {
    s3.deleteObject({
        Bucket: bucket, 
        Key: key
    }).promise()
    .then((data) => {
        // 要素削除
        const col = document.getElementById(key + "_col");
        col.remove();
    });
}

// 画像ダウンロード
function downloadImage(key) {
    const image = document.getElementById(key + "_content");
    
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

// 動画ダウンロード
function downloadVideo(key) {
    // 動画をBlob形式で取得
    s3.getObject({
        Bucket: bucket,
        Key: key,
        ResponseContentType: "Blob"
    }).promise()
    .then((data) => {
        // Blob作成
        const blobData = new Blob([data.Body], { type: "video/webm;codecs=vp9" })

        // ダウンロードリンクにbase64データを関連付け
        const download_link = document.getElementById(key + "_download");
        download_link.download = key;
        download_link.href = URL.createObjectURL(blobData);
        download_link.onclick();

        // 60秒後にダウンロードリンク無効(メモリ解放) -> リクエスト時再度生成
        setTimeout(function(){URL.revokeObjectURL(download_link.href);}, 60000);
    });
}