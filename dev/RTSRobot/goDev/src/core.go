package main

import (
	"app"
)

//goDev/src/go generate
//go:generate genny -in tool/template/map.go -out app2/data/MapStringWeapon.go -pkg data gen "Key=string Value=Weapon"
//go:generate genny -in tool/template/map.go -out app2/data/MapStringWeapons.go -pkg data gen "Key=string Value=Weapons"
//go:generate genny -in tool/template/map.go -out app2/data/MapStringString.go -pkg data gen "Key=string Value=string"
//go:generate genny -in tool/template/map.go -out app2/data/MapStringPosition.go -pkg data gen "Key=string Value=Position"
//go:generate genny -in tool/template/map.go -out app2/data/MapStringRobot.go -pkg data gen "Key=string Value=Robot"
//go:generate genny -in tool/template/map.go -out app2/data/MapStringPilot.go -pkg data gen "Key=string Value=Pilot"
//go:generate genny -in tool/template/map.go -out app2/data/MapStringItem.go -pkg data gen "Key=string Value=Item"

func init() {
	app.Main()
}

func main() {

}
