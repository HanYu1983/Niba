package main

import "app"

//goDev/src/go generate
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringWeapon.go -pkg protocol gen "Key=string Value=Weapon"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringWeapons.go -pkg protocol gen "Key=string Value=Weapons"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringString.go -pkg protocol gen "Key=string Value=string"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringPosition.go -pkg protocol gen "Key=string Value=Position"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringRobot.go -pkg protocol gen "Key=string Value=Robot"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringPilot.go -pkg protocol gen "Key=string Value=Pilot"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringWeapon.go -pkg protocol gen "Key=string Value=Weapon"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringComponent.go -pkg protocol gen "Key=string Value=Component"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringItem.go -pkg protocol gen "Key=string Value=Item"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringTag.go -pkg protocol gen "Key=string Value=Tag"
//go:generate genny -in tool/template/map.go -out app/tool/protocol/MapStringPlayer.go -pkg protocol gen "Key=string Value=Player"
//go:generate genny -in tool/template/list.go -out app/tool/protocol/ListPosition.go -pkg protocol gen "Item=Position"
//go:generate genny -in tool/template/list.go -out app/tool/protocol/ListPlayer.go -pkg protocol gen "Item=Player"

//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringRobotProto.go -pkg data gen "Key=string Value=RobotProto"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringPilotProto.go -pkg data gen "Key=string Value=PilotProto"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringWeaponProto.go -pkg data gen "Key=string Value=WeaponProto"
//go:generate genny -in tool/template/map.go -out app/tool/data/MapStringComponentProto.go -pkg data gen "Key=string Value=ComponentProto"

//go:generate genny -in tool/template/list.go -out app/tool/ListBasic.go -pkg tool gen "Item=int,string"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapStringMenu1D.go -pkg uidata gen "Key=string Value=Menu1D"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapStringMenu2D.go -pkg uidata gen "Key=string Value=Menu2D"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapStringBool.go -pkg uidata gen "Key=string Value=bool"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapStringListString.go -pkg uidata gen "Key=string Value=ListString"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapStringInt.go -pkg uidata gen "Key=string Value=int"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapStringGameplayPage.go -pkg uidata gen "Key=string Value=GameplayPage"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapStringBattleMenu.go -pkg uidata gen "Key=string Value=BattleMenu"

func init() {
	app.Main()
}

func main() {

}
