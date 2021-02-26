package data

import (
	"encoding/json"
	"fmt"
	"math/rand"
)

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
	Hp          int
	Weapons     []string
	Components  []string
	Suitability [4]float64
	Transform   []string
	UnlockExp   int
}

type PilotProto struct {
	ID      string
	Title   string
	Cost    int
	Melee   int
	Range   int
	Atk     int
	Evade   int
	Guard   int
	Tech    int
	Ability []string
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
	GameData Data
)

func init() {
	err := json.Unmarshal([]byte(dataJsonString), &GameData)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
}

func RandRobotProto() (RobotProto, error) {
	protos := ValsStringRobotProto(GameData.Robot)
	if len(protos) == 0 {
		return RobotProto{}, fmt.Errorf("protos's len is zero.")
	}
	return protos[rand.Intn(len(protos))], nil
}
