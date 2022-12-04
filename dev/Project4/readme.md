# clojure gradle dev
    git clone https://github.com/clojurephant/sample-clojurephant-clj-app.git
    // 使用gradle
    // container中若啟動server比須讓host設為0.0.0.0才可以讓本機browser使用localhost連到
    // 0.0.0.0 means "listen on ALL available addresses"
    // 若這個container要連到別的docker container的0.0.0.0
    // 必須加上--add-host host.docker.internal:host-gateway
    // 並且要連的host設為host.docker.internal
    docker run --rm -ti -p 8080:80 -v "$PWD":/home/gradle/project -w /home/gradle/project --add-host host.docker.internal:host-gateway gradle:latest bash
    // enter container
    gradle init
    gradle test
    gradle runShadow