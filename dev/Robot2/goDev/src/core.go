package main

import "app"

//goDev/src/go generate
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringWeapon.go -pkg data gen "Key=string Value=Weapon"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringWeapons.go -pkg data gen "Key=string Value=Weapons"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringString.go -pkg data gen "Key=string Value=string"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringPosition.go -pkg data gen "Key=string Value=Position"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringRobot.go -pkg data gen "Key=string Value=Robot"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringPilot.go -pkg data gen "Key=string Value=Pilot"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringItem.go -pkg data gen "Key=string Value=Item"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringTag.go -pkg data gen "Key=string Value=Tag"
//go:generate genny -in tool/template/list.go -out app/tool/ListInt.go -pkg tool gen "Item=int"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntMenu1D.go -pkg ui_data gen "Key=int Value=Menu1D"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntMenu2D.go -pkg ui_data gen "Key=int Value=Menu2D"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntBool.go -pkg ui_data gen "Key=int Value=bool"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntListInt.go -pkg ui_data gen "Key=int Value=ListInt"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntInt.go -pkg ui_data gen "Key=int Value=int"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntGameplayPage.go -pkg ui_data gen "Key=int Value=GameplayPage"

func init() {
	app.Main()
}

func main() {

}
