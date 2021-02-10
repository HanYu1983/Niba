package data

import (
	"encoding/json"
	"fmt"
)

const (
	SuitabilityGround   = 0
	SuitabilitySea      = 1
	SuitabilitySky      = 2
	SuitabilityUniverse = 3
)

type RobotProto struct {
	ID          string
	Title       string
	Cost        int
	Power       int
	Hp          int
	Weapons     []string
	Components  []string
	Suitability [4]float64
	Transform   []string
	UnlockExp   int
}

type PilotProto struct {
	ID       string
	Title    string
	Cost     int
	Melee    float64
	Range    float64
	Evade    float64
	Guard    float64
	ExpMelee int
	ExpRange int
	ExpEvade int
	ExpGuard int
	Exp      int
}

type WeaponProto struct {
	ID             string
	Title          string
	Cost           int
	Range          [2]int
	EnergyCost     int
	MaxBulletCount int
	Suitability    [4]float64
	Ability        []string
	EnergyType     string
	Type           string
	Accuracy       float64
	Damage         int
	Curage         int
	PowerCost      int
	UnlockExp      int
}

type ComponentProto struct {
	ID        string
	Title     string
	Cost      int
	Desc      string
	Value     []string
	PowerCost int
	Action    string
}
type TerrainProto struct {
	ID      string
	Title   string
	Cost    float64
	HitRate float64
	Damage  float64
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
}
