package main

import "app"

//goDev/src/go generate
//go:generate genny -in tool/template/map.go -out app/data/MapStringWeapon.go -pkg data gen "Key=string Value=Weapon"
//go:generate genny -in tool/template/map.go -out app/data/MapStringWeapons.go -pkg data gen "Key=string Value=Weapons"
//go:generate genny -in tool/template/map.go -out app/data/MapStringString.go -pkg data gen "Key=string Value=string"
//go:generate genny -in tool/template/map.go -out app/data/MapStringPosition.go -pkg data gen "Key=string Value=Position"
//go:generate genny -in tool/template/map.go -out app/data/MapStringRobot.go -pkg data gen "Key=string Value=Robot"
//go:generate genny -in tool/template/map.go -out app/data/MapStringPilot.go -pkg data gen "Key=string Value=Pilot"
//go:generate genny -in tool/template/map.go -out app/data/MapStringItem.go -pkg data gen "Key=string Value=Item"
//go:generate genny -in tool/template/map.go -out app/data/MapStringTag.go -pkg data gen "Key=string Value=Tag"
//go:generate genny -in tool/template/list.go -out app/tool/ListInt.go -pkg tool gen "Item=int"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntMenu1D.go -pkg ui_data gen "Key=int Value=Menu1D"
//go:generate genny -in tool/template/map.go -out app/tool/ui_data/MapIntMenu2D.go -pkg ui_data gen "Key=int Value=Menu2D"

func init() {
	app.Main()
}

func main() {

}
