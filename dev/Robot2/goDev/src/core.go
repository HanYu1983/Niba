package main

import (
	"app"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

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
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntMenu1D.go -pkg uidata gen "Key=int Value=Menu1D"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntMenu2D.go -pkg uidata gen "Key=int Value=Menu2D"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntBool.go -pkg uidata gen "Key=int Value=bool"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntListInt.go -pkg uidata gen "Key=int Value=ListInt"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntInt.go -pkg uidata gen "Key=int Value=int"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntGameplayPage.go -pkg uidata gen "Key=int Value=GameplayPage"
//go:generate genny -in tool/template/map.go -out app/tool/uidata/MapIntBattleMenu.go -pkg uidata gen "Key=int Value=BattleMenu"

func init() {
	TestKNN()
	app.Main()
}

func TestKNN() {
	KNN := js.Global.Get("_KNN")
	train_dataset := [][]interface{}{
		{0, 0, 0},
		{0, 1, 1},
		{1, 1, 0},
		{2, 2, 2},
		{1, 2, 2},
		{2, 1, 2},
	}
	train_labels := []interface{}{
		0, 0, 0, 1, 1, 1,
	}
	test_dataset := [][]interface{}{
		{0.9, 0.9, 0.9},
		{1.1, 1.1, 1.1},
		{1.1, 1.1, 1.2},
		{1.2, 1.2, 1.2},
	}
	knn := KNN.New(train_dataset, train_labels, map[string]interface{}{"k": 2})
	ans := knn.Call("predict", test_dataset)
	js.Global.Get("console").Call("log", ans)
	fmt.Println(js.Global.Get("A").String())
}

func TestModule() {
	js.Module.Get("exports").Set("init", Start)
}

func Start() string {
	return "hellow"
}

func main() {

}
