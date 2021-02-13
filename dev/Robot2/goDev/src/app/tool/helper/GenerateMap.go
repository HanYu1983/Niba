package helper

import (
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

type GenerateMapConfig struct {
	Deepsea float32
	Sea     float32
	Sand    float32
	Grass   float32
	Hill    float32
	City    float32
	Tree    float32
	Award   float32
}

var (
	GenerateMapConfigDefault = GenerateMapConfig{
		Deepsea: 1,
		Sea:     1,
		Sand:    1,
		Grass:   1,
		Hill:    1,
		City:    0.3,
		Tree:    0.3,
		Award:   0.01,
	}
	GenerateMapConfigIsland = GenerateMapConfig{
		Deepsea: 0.3,
		Sea:     0.1,
		Sand:    0.1,
		Grass:   0.2,
		Hill:    0.1,
		City:    0.1,
		Tree:    0.2,
		Award:   0.1,
	}
)

// GenerateMap is
// dependencies: generateMap.js, perlin.js
func GenerateMap(config GenerateMapConfig, seed int, offset int, very float32, w int, h int, x int, y int) ([][]int, error) {
	generateMapFn := js.Global.Get("generateMap")
	if generateMapFn == js.Undefined {
		fmt.Println("generateMap.js not found")
		//return nil, fmt.Errorf("generateMap.js not found")
		return [][]int{}, nil
	}
	obj := generateMapFn.Invoke(
		seed,
		x, y, w, h,
		config.Deepsea,
		config.Sea,
		config.Sand,
		config.Grass,
		config.Hill,
		config.City,
		config.Tree,
		config.Award,
		very,
		offset)
	ary := []int{}
	for i := 0; i < obj.Length(); i++ {
		v := obj.Index(i)
		ary = append(ary, v.Int())
	}
	ret := [][]int{}
	for y := 0; y < h; y++ {
		ret = append(ret, ary[y*w:(y*w)+w])
	}
	return ret, nil
}
