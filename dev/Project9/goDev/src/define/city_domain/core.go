package citydomain

const (
	BuildingTypeStore = "BuildingTypeStore"
)

type Building struct {
	Type string
}
type BuildingStore struct {
}
type City struct{}

type CityDomain struct {
	City           map[string]City
	Building       map[string]Building
	CityToGround   map[string]string
	BuildingToCity map[string]string
	BuildingStore  map[string]BuildingStore
}

func GetBuilding(domain CityDomain, buildingId string) interface{} {
	building, has := domain.Building[buildingId]
	if has {
		panic("")
	}
	switch building.Type {
	case BuildingTypeStore:
		return domain.BuildingStore[buildingId]
	}
	return nil
}
