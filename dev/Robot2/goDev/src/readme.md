# modify gopath
1. src\dev.bat
1. src\build.bat

# install command
    go get -u github.com/gopherjs/gopherjs

# setting gopath
    ctr + , (command + ,)
    search gopath

# install lib
    cd src
    .\getLib.bat

# run app
    cd src
    .\dev.bat

# mac
    go get golang.org/x/tools/cmd/goimports
settings.json
    "editor.formatOnSave": true,
    "go.formatTool": "goimports",

# memo
很多時候只要在struct中新增欄位編譯後本來沒問題的地方就bug了。原因是gopherjs在編譯時會使用快取，這個時候就要從vscode左方的專案檔案的每個資料來層級都存一遍才行，這樣會強迫gopherjs重新編譯。