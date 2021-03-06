// Package data 遊戲用到的資料
package data

import (
	"encoding/json"
	"fmt"
	"math/rand"
)

// 地形適性索引。資料中的地形適性是[4]float，比如[1,1,0.5,1]
const (
	SuitabilityGround   = 0
	SuitabilitySea      = 1
	SuitabilitySky      = 2
	SuitabilityUniverse = 3
)

func GetSuitabilityIDBelongTerrain(terrain TerrainProto) (int, error) {
	switch terrain.ID {
	case "shallowSea", "deepSea":
		return SuitabilitySea, nil
	case "mountain", "plain", "forest", "road", "city", "beach", "award":
		return SuitabilityGround, nil
	default:
		return 0, fmt.Errorf("unknown terrain(%v)\n", terrain.ID)
	}
}

type RobotProto struct {
	ID          string
	Title       string
	Cost        int
	Power       int
	HP          int
	EN          int
	Weapons     []string
	Components  []string
	Suitability [4]float64
	Transform   []string
	UnlockExp   int
	Enemy       bool
}

type PilotProto struct {
	ID        string
	Title     string
	Cost      int
	Melee     int
	Range     int
	Atk       int
	Evade     int
	Guard     int
	Tech      int
	Ability   []string
	UnlockExp int
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
	UnlockExp int
}
type TerrainProto struct {
	ID      string
	Title   string
	Cost    [4]float64
	HitRate float64
	Damage  float64
}

type TerrainMappingProto struct {
	Terrain string
}

type ConfigProto struct {
	ID               string
	PowerCostForMove int
	Award            []float64
	Robots           []string
	Weapons          []string
	Components       []string
	Pilots           []string
}

type Data struct {
	Robot          map[string]RobotProto
	Pilot          map[string]PilotProto
	Weapon         map[string]WeaponProto
	Component      map[string]ComponentProto
	TerrainMapping map[string]TerrainMappingProto
	Terrain        map[string]TerrainProto
	Config         map[string]ConfigProto
}

var (
	// GameData 遊戲資料的全域參照
	GameData Data
)

func init() {
	err := json.Unmarshal([]byte(dataJsonString), &GameData)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
}

// RandRobotProto 隨機機器人，用來自動生成敵人。只會取用資料中enemy為true的
func RandRobotProto() (RobotProto, error) {
	filtered := map[string]RobotProto{}
	for protoID, proto := range GameData.Robot {
		if proto.Enemy == false {
			continue
		}
		filtered[protoID] = proto
	}
	protos := ValsStringRobotProto(filtered)
	if len(protos) == 0 {
		return RobotProto{}, fmt.Errorf("protos's len is zero.")
	}
	return protos[rand.Intn(len(protos))], nil
}
