## Hexapod 開発

### ＝必要部品＝
|名称|個数|
|--|--|
|Raspberry Pi Zero WH| 1 |
|Raspberry Pi カメラモジュール| 1 |
|カメラケーブル| 1 |
|SG92R|20|
|PCA9865|2|
|超音波距離センサー|2|
|フィラメント|大量|

[部品表及び製作費](https://docs.google.com/spreadsheets/d/1f1W85JDuBkQEPj0Cgu2Epr-7-u2uk7oBen7yUr_DpZg/edit?usp=sharing)

### ＝使用言語＝
- Python3 <br>
→ GPIO制御モジュール、人検知モジュール
- HTML/CSS, JavaScript <br>
→ Webアプリ (Hexapod操作、アルバム閲覧など)

### ＝使用ライブラリ＝
- Apache <br>
- Flask <br>
→ Webアプリ
- MJPG-streamer <br>
→ カメラ映像ストリーミング配信
- Adafruit-PCA9685 <br>
→ サーボモータ制御

### ＝概要＝
多足型ロボット「Hexapod」の開発・製作

Hexapodの操作はWebアプリで行う。

### ＝機能要件＝
**・障害物衝突防止機能** <br>
→ 超音波距離センサーを用いて障害物を検知し、自動で停止する。

**・人追従機能** <br>
→ Camera Moduleを用いて撮影後、顔検知を行い、顔のある方向に進行する。
顔検知にはOpenCVを用いる。 <br>
→ もしくは人影を検知して、人影のある方向に進行する。 <br>
→ バウンディングボックスの大きさで追従対象を決定する。

**・カメラ映像のストリーミング配信** <br>
→ MJPG-streamerでストリーミング配信を行う。

### =ブラウザ動作環境=
|ブラウザ|対応状況|
|--|--|
|Chrome|◯ 推奨|
|Edge|◯ 推奨|
|Firefox|◯ 推奨|
|Opera|◯ 推奨|
|IE|✕ 動作不可|
|Safari|－ 未検証|
