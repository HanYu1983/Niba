# compile

如果沒有修改任何檔案的話, 在 image build 的各個階段就會使用快取

    docker build -t java-app .

# run

加上--rm 在運行完 container 後自動刪除 container

    docker run --rm java-app
