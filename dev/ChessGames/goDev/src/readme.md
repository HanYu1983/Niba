# modify gopath
1. src\getLib.at
1. src\dev.bat
1. src\build.bat

# install command
    go get -u github.com/gopherjs/gopherjs

# setting gopath
    ctr + ,
    search gopath


or

    create .vscode folder in project root
    create settings.json in it
    {
        "go.gopath": "D:/Documents/git/Niba/dev/FighterSha/goDev/"
    }

# install lib
    cd src
    .\getLib.bat

# run app
    cd src
    .\dev.bat
    open browser http://localhost:8080