package helper

import (
	"fmt"
	"math"

	"github.com/aquilax/go-perlin"
	"github.com/gopherjs/gopherjs/js"
)

type GenerateMapConfig struct {
	// 高度權重
	Deepsea  float64 // 深海
	Sea      float64 // 淺海
	Sand     float64 // 沿海
	Grass    float64 // 草原
	Mountain float64 // 山脈
	// 草原部分中, 城市的比例
	City float64
	// 草原中城市之外的部分中, 森林的比例
	Tree  float64
	Award float64
}

var (
	GenerateMapConfigDefault = GenerateMapConfig{
		Deepsea:  0,
		Sea:      1,
		Sand:     0.05,
		Grass:    5,
		Mountain: 3,
		City:     0.2,
		Tree:     0.3,
		Award:    0.1,
	}
	GenerateMapConfigIsland = GenerateMapConfig{
		Deepsea:  2,
		Sea:      3,
		Sand:     0.5,
		Grass:    1,
		Mountain: 0.3,
		City:     0.1,
		Tree:     0.5,
		Award:    0.1,
	}
)

func GenerateMap(config GenerateMapConfig, seed int64, offset float64, very float64, w int, h int, sx int, sy int) ([][]int, error) {
	const (
		alpha = 2.0
		beta  = 2.0
		n     = 1
	)
	const (
		scale = 0.1
	)
	p := perlin.NewPerlin(alpha, beta, n, seed)
	total := config.Deepsea + config.Sea + config.Sand + config.Grass + config.Mountain
	deepseaIn := config.Deepsea / total
	seaIn := config.Sea/total + deepseaIn
	sandIn := config.Sand/total + seaIn
	grassIn := config.Grass/total + sandIn
	noiseList := [][]float64{}
	maxV := 0.0
	for y := 0; y < h; y++ {
		list := []float64{}
		for x := 0; x < w; x++ {
			i := float64(sx + x)
			j := float64(sy + y)
			noise := p.Noise2D(i*scale, j*scale)
			maxV = math.Max(maxV, math.Abs(noise))
			list = append(list, noise)
		}
		noiseList = append(noiseList, list)
	}

	generatedMap := [][]int{}
	for y := 0; y < h; y++ {
		list := []int{}
		for x := 0; x < w; x++ {
			i := float64(sx + x)
			j := float64(sy + y)
			f := noiseList[y][x]
			// 平均散布在-1~1
			f = f / maxV
			f = math.Pow(f, very)
			// 平移到0~1
			f = (f + 1) / 2
			f += offset
			if f > grassIn {
				// 山脈
				list = append(list, 5)
			} else if f > sandIn {
				cityPosX := math.Floor(i*0.4)*scale*3 + 123
				cityPosY := math.Floor(j*0.4)*scale*3 + 245
				f3 := p.Noise2D(cityPosX, cityPosY)
				f3 = f3 / maxV
				f3 = (f3 + 1) / 2
				if f3 > config.City {
					treePosX := i*scale*3 + 300
					treePosY := j*scale*3 + 20
					f2 := p.Noise2D(treePosX, treePosY)
					f2 = f2 / maxV
					f2 = (f2 + 1) / 2
					if f2 > config.Tree {
						// 平原
						list = append(list, 3)
					} else {
						// 樹林
						list = append(list, 6)
					}
				} else {
					if i == 4 || i == 8 || i == 12 || i == 16 ||
						j == 4 || j == 8 || j == 12 || j == 16 {
						// 路
						list = append(list, 8)
					} else {
						f4 := float64(int(f3*10000)%100.0) / 100.0
						if f4 > config.Award {
							// 城市
							list = append(list, 4)
						} else {
							// 恢復點
							list = append(list, 7)
						}
					}
				}
			} else if f > seaIn {
				// 沙灘
				list = append(list, 2)
			} else if f > deepseaIn {
				// 淺海
				list = append(list, 1)
			} else {
				// 深海
				list = append(list, 0)
			}
		}
		generatedMap = append(generatedMap, list)
	}
	return generatedMap, nil
}

// GenerateMap is
// dependencies: generateMap.js, perlin.js
func GenerateMap2(config GenerateMapConfig, seed int, offset int, very float32, w int, h int, x int, y int) ([][]int, error) {
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
		config.Mountain,
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
