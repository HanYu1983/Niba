genny -in tool/template/Remove.go -out tool/desktop/RemoveCard.go -pkg desktop gen "Item=Card"
genny -in tool/template/Merge.go -out tool/desktop/MergeCardStack.go -pkg desktop gen "Key=string Value=CardStack"
genny -in tool/template/Replace.go -out tool/desktop/ReplaceCard.go -pkg desktop gen "Item=Card"

genny -in tool/template/Merge.go -out app/gameplay/MergeCharacterCardCom.go -pkg gameplay gen "Key=string Value=CharacterCardCom"
genny -in tool/template/Merge.go -out app/gameplay/MergePlayerBasicCom.go -pkg gameplay gen "Key=string Value=PlayerBasicCom"
genny -in tool/template/Assoc.go -out app/gameplay/AssocStringPlayerBasicCom.go -pkg gameplay gen "Key=string Value=PlayerBasicCom"