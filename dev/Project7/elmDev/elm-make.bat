docker run -ti --rm -v D:\Han\dev\Niba\dev\Project7\elmDev\:/han -w /han -p 8000:8000 codesimple/elm:0.19 make src/Main2.elm --optimize --output=public/elm.js