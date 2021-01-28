package data

import (
	"encoding/json"
	"fmt"
	"strconv"
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

type Weapons = map[string]Weapon
type WeaponsByTransform = map[string]Weapons
type Position [2]int

type Robot struct {
	ID                 string
	ProtoID            string
	Title              string
	PilotID            string
	WeaponsByTransform WeaponsByTransform
	Transform          string
	PlayerID           string
	HP                 int
	EN                 int
	MaxHP              int
	MaxEN              int
}

type Item struct {
	ID      string
	ProtoID string
	Title   string
}

type Pilot struct {
	ID      string
	ProtoID string
	Title   string
}

type Weapon struct {
	ID      string
	ProtoID string
	Title   string
}

type Component struct {
	ID      string
	ProtoID string
	Title   string
}

const (
	PlayerIDPlayer = "PlayerIDPlayer"
)

type Player struct {
	ID      string
	GroupID string
}

type Tag struct {
	MoveCount int
	Sky       bool
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

func World2Local(camera Position, pos Position) Position {
	return Position{pos[0] - camera[0], pos[1] - camera[1]}
}

func Local2World(camera Position, pos Position) Position {
	return Position{pos[0] + camera[0], pos[1] + camera[1]}
}

func QueryTerrain(gameMap [][]int, cache map[Position]TerrainProto, pos Position) TerrainProto {
	if terrain, has := cache[pos]; has {
		return terrain
	}
	originTerrainID := gameMap[pos[1]][pos[0]]
	terrainMapping, has := GameData.TerrainMapping[strconv.Itoa(originTerrainID)]
	if has == false {
		fmt.Printf("terrainMapping not found: %v %v\n", originTerrainID, pos)
		return TerrainProto{}
	}
	terrain := GameData.Terrain[terrainMapping.Terrain]
	cache[pos] = terrain
	return terrain
}
