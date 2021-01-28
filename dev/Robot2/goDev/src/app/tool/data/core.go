package data

import (
	"encoding/json"
	"fmt"
)

type RobotProto struct {
	Title       string
	Cost        int
	Power       int
	Weapons     []string
	Components  []string
	Suitability [4]float32
	Transform   []string
	UnlockExp   int
}

type PilotProto struct {
	Title    string
	Cost     int
	Melee    float32
	Range    float32
	Evade    float32
	Guard    float32
	ExpMelee int
	ExpRange int
	ExpEvade int
	ExpGuard int
	Exp      int
}

type WeaponProto struct {
	Title          string
	Cost           int
	Range          [2]int
	EnergyCost     int
	MaxBulletCount int
	Suitablility   [4]float32
	Ability        []string
	EnergyType     string
	Type           string
	Accuracy       float32
	Damage         int
	Curage         int
	PowerCost      int
	UnlockExp      int
}

type ComponentProto struct {
	Title     string
	Cost      int
	Desc      string
	Value     []string
	PowerCost int
	Action    string
}
type TerrainProto struct {
	Title   string
	Cost    float32
	HitRate float32
	Damage  float32
}

type TerrainMappingProto struct {
	Terrain string
}

type Data struct {
	Robot          map[string]RobotProto
	Pilot          map[string]PilotProto
	Weapon         map[string]WeaponProto
	Component      map[string]ComponentProto
	TerrainMapping map[string]TerrainMappingProto
	Terrain        map[string]TerrainProto
}

var (
	GameData Data
)

func init() {
	err := json.Unmarshal([]byte(dataJsonString), &GameData)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	//fmt.Printf("%+v\n", GameData)
}
