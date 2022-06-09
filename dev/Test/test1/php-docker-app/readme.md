# compile

如果沒有修改任何檔案的話, 在 image build 的各個階段就會使用快取

    docker build -t php-app .

# run

加上--rm 在運行完 container 後自動刪除 container

    docker run --rm php-app

# 測試結果

沒有成功. curl 和 browser 在 172.17.0.2 都沒有反應
