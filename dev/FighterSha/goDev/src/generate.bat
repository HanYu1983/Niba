genny -in tool/template/map.go -out app/gameplay/StringPlayerBasicComMap.go -pkg gameplay gen "Key=string Value=PlayerBasicCom"
genny -in tool/template/map.go -out app/gameplay/StringCharacterCardComMap.go -pkg gameplay gen "Key=string Value=CharacterCardCom"
genny -in tool/template/map.go -out tool/desktop/StringCardStackMap.go -pkg desktop gen "Key=string Value=CardStack"
genny -in tool/template/list.go -out tool/desktop/CardList.go -pkg desktop gen "Item=Card"