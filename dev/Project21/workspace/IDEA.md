# 提示詞中描寫人物時, 不寫名字, 而是能讓模型鎖定到參考圖的關鍵特徵, 從人物提示詞中抽取, 精簡描述, 比如, 性別,髮型,膚色, 人種等

# 因為人物的參考圖是純色背景, 所以提示詞中若有背景描述, 除了參考圖的準備外, 要注意句子所占的注意力資源不要被人物的純白背景搶走, 比如以下
要讓模型將注意力分給背景，必須做三件事：提升背景順序（Front-loading）、結合人物與環境互動、調整鏡頭範圍。

背景前置 (Front-Loading)：將 riverside embankment, tree line, canal 直接提到了鏡頭說明的正前方。模型處理文本頭部的注意力權重最高。

調整鏡頭運鏡 (Camera Framing)：把 holds tight on both faces 改為 WIDE-TO-MEDIUM PROFILE SHOT 或 holds on their upper bodies and background environment。給予背景必要的畫幅空間，否則特寫鏡頭下模型會理所當然地刪除背景。

創造人物與環境的光線連結：加入 under the open, shelterless sky，強制模型將強烈的正午陽光（harsh noon light）同時作用在人物與背景環境上，引導注意力擴散至整體空間。

* 024,028,029,032,044, 052,053,059

# 分析一下如何從小說中區分角色內心自白和旁白, 內心自白會依照角色性別, 但旁白在整部故事中都是一致的
054,056,066