package gamemap

import (
	. "src/game/define"
)

type ShortestPathTreeParentID []int
type ShortestPathTree []Position
type Path []Position

type IGameMapComponent interface {
	GetTerrianLayer(pos Position) Layer
	GetEffectLayers(pos Position) []EffectLayer
}

func GetShortestPathTree(ctx IGameMapComponent, start Position, end Position) (ShortestPathTree, ShortestPathTreeParentID, error) {
	return ShortestPathTree{}, ShortestPathTreeParentID{}, nil
}

func GetPath(tree ShortestPathTree, parent ShortestPathTreeParentID) (Path, error) {
	return Path{}, nil
}
