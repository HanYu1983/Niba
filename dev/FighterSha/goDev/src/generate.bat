genny -in tool/template/map.go -out app/gameplay/StringPlayerMap.go -pkg gameplay gen "Key=string Value=Player"
genny -in tool/template/list.go -out app/gameplay/PlayerList.go -pkg gameplay gen "Item=Player"
genny -in tool/template/map.go -out app/gameplay/StringPlayerBasicComMap.go -pkg gameplay gen "Key=string Value=PlayerBasicCom"
genny -in tool/template/map.go -out app/gameplay/StringCharacterCardComMap.go -pkg gameplay gen "Key=string Value=CharacterCardCom"
genny -in tool/template/map.go -out tool/desktop/StringCardStackMap.go -pkg desktop gen "Key=string Value=CardStack"
genny -in tool/template/list.go -out tool/desktop/CardList.go -pkg desktop gen "Item=Card"

genny -in app/view/cmd/template/AskOneItem.go -out app/view/cmd/AskOneDesktopCard.go -pkg "cmd" gen "Item=desktop.Card"
genny -in app/view/cmd/template/AskOneItem.go -out app/view/cmd/AskOneGameplayPlayer.go -pkg "cmd" gen "Item=gameplay.Player"
genny -in app/view/cmd/template/AskOneItem.go -out app/view/cmd/AskOneString.go -pkg "cmd" gen "Item=string"

genny -in tool/template/map.go -out app/view/p5/StringCardViewMap.go -pkg p5 gen "Key=string Value=CardView"
genny -in tool/template/list.go -out app/view/p5/CardViewList.go -pkg p5 gen "Item=CardView"