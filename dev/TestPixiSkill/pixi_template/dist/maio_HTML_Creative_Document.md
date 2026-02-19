# maio HTML Creative
この資料はmaio にて HTML動画クリエイティブを配信するための資料です。  
maio にて HTML 動画クリエイティブを配信する為には、後述の`maio Creative JS` を用いて、以下の`Specs`を遵守いただいたZIP パッケージを作成する必要があります。

このパッケージの最小構成は以下のようになります。
```
- creative.zip
  - index.html
  - maio.min.js
```

## Target environments
- iOS 8.0+
- Android 5.0+

## Specs
- [MUST] パッケージは任意に解凍可能な zip で圧縮し、拡張子は `.zip` として下さい。
- [MUST] パッケージの直下に index.html を置いてください。
- [MUST] index.html で maio.min.js スクリプトをロードして下さい。
- [MUST] 関連リソースは全てパッケージ内部に配置して下さい。それらリソースの解決は相対パスによって行って下さい。
- [MUST] テキストリソースは全て BOM 無しの UTF-8 (**UTF-8N**) でエンコードして下さい。
- [MUST] クリエイティブに含まれるクリック遷移先URLはプラットフォームに適したものにしてください。
- [MUST] video 又は audio 等のメディア要素で音声を出す場合は、初期値を消音とし、音声ボタンの押下等ユーザーが音声が出ることがわかるインタラクションにより音声を再生してください。
- [SHOULD] クリエイティブの縦横の表示方向はユーザーの表示方向に依存します。自動回転対応を実施し、見た目が自然になるようにして下さい。
- [SHOULD] 動画リソースは **mp4** 形式（Video Codec: H.264、Audio Codec: AAC）でエンコードして下さい。     
- [SHOULD] `Maio.onReady()` で設定したコールバックが呼ばれるまでは、消音設定として振舞って下さい。
- [SHOULD] 圧縮後のパッケージサイズは **2MB** 以内を目標として下さい。軽量であるほど配信負荷が軽減され効率的に露出されます。
- [MAY] 動画リソースは解像度やビットレートを弊社で最適な値に変換することが可能です。詳細は担当営業までご連絡ください。
- [MAY] 再生開始後、一定時間が経過すると画面右上に広告を終了させる×ボタンが表示されます。後述するcloseAdを実装しなくともこの機能を広告の終了処理としてご利用いただけます。×ボタンが表示されるまでの時間は設定可能ですので担当営業までご連絡ください。×ボタンによる終了ではエンドカードが表示されます。
- [MUST NOT] 圧縮後のパッケージサイズは **6MB** を超えないで下さい。
- [MUST NOT] iframe 等の如何なる手段によっても外部との通信は行わないで下さい。これを試みても動作しません。
- [MUST NOT] http(s)ではなく`ローカルアクセス(file://)`となるため、ajaxは利用できません。

それぞれのプリフィクスの意味は以下の通りです。

|Prefix|Description|
|---   |---        |
|MUST  |技術的な理由で遵守すべき項目。|
|SHOULD|技術的には問題ないが、仕様上の理由で遵守すべき項目。|
|MAY   |推奨される項目。|


## Sample
maio-playable-sample.zip


## maio Creative JS
`maio Creative JS` は、HTML 形式の動画クリエイティブを作成する為の JavaScript API です。  
maio.min.js が `maio Creative JS` の本体です。  
これを index.html にロードする事で、maio SDK の準備完了通知を受け取ったり、逆に広告の終了を maio SDK に通知する事が可能となります。  
その他の maio SDK との通信も `maio Creative JS` を通して呼び出して頂く仕様となっております。

### Usage
maio.min.js スクリプトをロードし、`Maio.onReady()` で maio SDK の準備完了通知を受け取る流れが基本となります。
```html
<!DOCTYPE html>
<html>
...
<body>
    ...
    <div id="btn">
        Install
    </div>
    ...
    <script src="scripts/maio.min.js"></script>
    <script>
        Maio.onReady(function(isDefaultMute) {
            // isDefaultMuteは使用せず、ユーザーインタラクションによって音声を再生させてください
            document.getElementById("btn").addEventListener("click", function() {
                Maio.openClickUrl('https://maio.jp');
                var showEndCard = true;
                Maio.closeAd(showEndCard);
            });
        });
    </script>
</body>
</html>
```

### APIs

| Name | Description |
|:-----------|:------------|
| onReady(Function) | maio SDK の初期化が完了した際に呼び出されるコールバックを登録することができます。 |
| isReady() | maio SDK の初期化が完了しているかどうかを示す値を返します。 |
| isDefaultMute() | ~~ゾーンが消音設定になっているかどうかを示す値を返します。~~<br />`※こちらのメソッドは利用せず、初期値は消音とし、ユーザーインタラクションによって音声を再生させてください。` |
| openClickUrl(String) | サーバーにクリックを通知し、ブラウザまたはストアに遷移します。 |
| closeAd(Boolean) | 広告を終了します。 |
| getDeviceInfo() | デバイス情報を返します。 |

---
#### onReady(Function)
maio SDK の初期化が完了した際に呼び出されるコールバックを登録することができます。
##### Parameters
###### `action` Function( Boolean isDefaultMute )
コールバックを設定できます。  
~~コールバックでは、そのゾーンが再生時にミュートにしてほしいかどうかを知ることができます。~~


**[MUST]** `初期値は消音とし、ユーザーインタラクションによって音声を再生させてください`

---
#### isReady()
maio SDK の初期化が完了しているかどうかを示す値を返します。
##### Returns
###### Boolean
maio SDK の初期化が完了していれば `true`、それ以外なら `false`。

---
#### isDefaultMute()
~~ゾーンが消音設定になっているかどうかを示す値を返します。~~  
`※こちらのメソッドは利用せず、初期値は消音とし、ユーザーインタラクションによって音声を再生させてください。`
##### Returns
###### Boolean
~~ゾーンが消音設定になっていれば `true`、それ以外なら `false`。~~

---
#### openClickUrl(String)
サーバーにクリックを通知し、ブラウザまたはストアに遷移します。
##### Parameters
###### `clickUrl` String
遷移先 URL。
※ clickUrl パラメータはあらかじめ計測用URLを発行いただき、設定してください。

---
#### closeAd(Boolean) 
広告を終了します。
##### Parameters
###### `showEndCard` Boolean
エンドカードを表示する場合は `true`、それ以外なら `false`。
サーバー側で値がセットされている場合、showEndCard は無視されます。

---
#### getDeviceInfo()
デバイス情報を返します。
##### Returns
###### Object
```js
{
    plt: String
    sdkv: String
}
```
e.g.
```js
{
    plt: "ios",
    sdkv: "1.2.19"
}
```
### Release note
|バージョン|更新日時|概要|
|:--:|:--:|:--:|
|1.0.0|2018-04-18|初版リリース|
|1.1.0|2018-08-20|開発者向け機能の追加|
|1.1.3|2019-03-27|defaultMute関連のメソッドを非推奨化|
## Test JS
`Test JS` は、`maio Creative JS`のテストを行うためのJSです  
maio.nativesdk-test-tool.jsが本体です。  
maio SDKのネイティブAPIのスタブの役割を果たします。
広告入稿時にmaio.nativesdk-test-tool.jsのリンクを削除する必要はありません。  

### Usage
 - `index.html`から`maio.nativesdk-test-tool.js`を読み込んでください。
   `maio.nativesdk-test-tool.js`は`maio.min.js`に依存しています。  
   そのため、`maio.min.js`より前に読み込むとエラーになります。必ず`maio.min.js`の後に読み込んでください  
 - maio Creative JSに定義されたAPIを正しく実行するとブラウザのコンソールに実行メソッドと引数が表示されます。
 - `getDeviceInfo()`が呼び出された際は必要最低限の情報を返却します。
 - `maio.nativesdk-test-tool.js`のバージョンは`maio.min.js`のバージョンと同じ物をご利用ください。
```html
<!DOCTYPE html>
<html>
...
<body>
    ...
    <script src="scripts/maio.min.1.1.0.js"></script>
    <script src="scripts/maio.nativesdk-test-tool.1.1.0.js"></script>
    <script>
        ...
    </script>
</body>
</html>
```
## Approval process
ここではHTML動画クリエイティブを入稿いただいた際に弊社で確認する項目を記載します。

### Detail
1. **入稿されたzipファイルにローカルアクセスし、Specificationの該当箇所がすべてクリアできているか**  
   ※``クリエイティブに含まれるクリック遷移先URLはプラットフォームに適したものにしてください。``
2. **各APIが適宜呼び出されているか**
   - openClickUrl
      - 再生中に外部サイトに遷移する場合はopenClickUrlによる遷移が必要です。
3. maio SDK上で実機での実動作確認
    - iOS
    - Android

## Changelogs
|バージョン|更新日時|対象バージョン|概要|
|:--:|:--:|:--:|:--:|
|1|2018/04/01|maio Creative Js 1.0.0|初版発行|
|2|2018/05/25|maio Creative Js 1.0.0|Specificationの更新| 
|3|2018/06/05|maio Creative Js 1.0.0|Testの追記| 
|4|2018/08/01|maio Creative Js 1.0.0|DescriptionとSpecificationに利用プロトコルについての追記| 
|5|2018/08/20|maio Creative Js 1.1.0|maio Creative JS 1.1.0のリリースとリリースノートの追加| 
|6|2018/10/02|maio Creative Js 1.1.0|ドキュメントの刷新<br />サンプルの同封<br />対応OSの記載| 
|7|2018/10/16|maio Creative Js 1.1.1|skipボタンの大きさを固定| 
|8|2019/01/28|maio Creative Js 1.1.2|Test JSの改修<br />細かいバグの修正| 
|9|2019/03/22|maio Creative Js 1.1.3|ユーザーインタラクションなしでの音声再生を禁止<br />maio-playable-sample.zipを修正| 
|10|2020/02/03|maio Creative Js 1.1.4|specsに広告終了ボタンについて記載| 
|11|2020/09/18|maio Creative Js 1.1.6|計測ツールの iOS 14 対応に起因する更新| 
|12|2020/12/09|maio Creative Js 1.1.6|圧縮後のパッケージサイズ上限を更新。| 

## Copyright
i-mobile Co.,Ltd.