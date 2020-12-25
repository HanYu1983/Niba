package main

import "app"

//goDev/src/go generate
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringWeapon.go -pkg data gen "Key=string Value=Weapon"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringWeapons.go -pkg data gen "Key=string Value=Weapons"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringString.go -pkg data gen "Key=string Value=string"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringPosition.go -pkg data gen "Key=string Value=Position"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringRobot.go -pkg data gen "Key=string Value=Robot"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringPilot.go -pkg data gen "Key=string Value=Pilot"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringWeapon.go -pkg data gen "Key=string Value=Weapon"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringComponent.go -pkg data gen "Key=string Value=Component"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringItem.go -pkg data gen "Key=string Value=Item"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringTag.go -pkg data gen "Key=string Value=Tag"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringRobotProto.go -pkg data gen "Key=string Value=RobotProto"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringPilotProto.go -pkg data gen "Key=string Value=PilotProto"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringWeaponProto.go -pkg data gen "Key=string Value=WeaponProto"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringComponentProto.go -pkg data gen "Key=string Value=ComponentProto"
//go:generate genny -in tool/template/list.go -out app/tool/ListInt.go -pkg tool gen "Item=int"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntMenu1D.go -pkg uidata gen "Key=int Value=Menu1D"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntMenu2D.go -pkg uidata gen "Key=int Value=Menu2D"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntBool.go -pkg uidata gen "Key=int Value=bool"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntListInt.go -pkg uidata gen "Key=int Value=ListInt"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntInt.go -pkg uidata gen "Key=int Value=int"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntGameplayPage.go -pkg uidata gen "Key=int Value=GameplayPage"

func init() {
	app.Main()
}

func main() {

}
