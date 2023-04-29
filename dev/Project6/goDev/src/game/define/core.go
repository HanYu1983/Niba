package define

type WeaponEquipPosition string

const (
	WeaponEquipPositionHead     = "WeaponEquipPositionHead"
	WeaponEquipPositionHand     = "WeaponEquipPositionHand"
	WeaponEquipPositionShoulder = "WeaponEquipPositionShoulder"
)

type Damage interface{}

type Weapon struct {
	Postion WeaponEquipPosition
	Damage  Damage
}

type Component interface{}

type Pilot struct{}

type Robot struct {
	Pilot      Pilot
	Weapons    []Weapon
	Components []Component
}

type Position [2]int

const (
	W = 10
	H = 10
)

type Layer [W][H]int

func GetTerrianLayer(pos Position) (Layer, error) {
	return Layer{}, nil
}

type EffectLayer [W][H]float32
