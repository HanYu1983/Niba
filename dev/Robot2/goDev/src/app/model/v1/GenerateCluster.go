package v1

import (
	"app/tool/helper"
	"math/rand"

	"tool/kmeans"

	"github.com/go-gl/mathgl/mgl64"
	"github.com/muesli/clusters"
)

func GenerateCluster(w int, h int, count int, clusterCount int, iteration int) ([][2]int, error) {
	clusterCount = helper.Min(count, clusterCount)
	// 隨機位置
	posList := [][2]int{}
	for i := 0; i < count; i++ {
		posList = append(posList, [2]int{
			rand.Int() % w,
			rand.Int() % h,
		})
	}
	// 分群
	{
		var d clusters.Observations
		for _, pos := range posList {
			d = append(d, clusters.Coordinates{
				float64(pos[0]),
				float64(pos[1]),
			})
		}
		km := kmeans.New()
		cc, err := km.Partition(d, clusterCount)
		if err != nil {
			return nil, err
		}

		for i := 0; i < iteration; i++ {
			// 朝各自的中心移動
			nextObservations := clusters.Observations{}
			for _, c := range cc {
				centerV2 := mgl64.Vec2{c.Center[0], c.Center[1]}
				for _, observation := range c.Observations {
					observationV2 := mgl64.Vec2{observation.Coordinates()[0], observation.Coordinates()[1]}
					observationV2 = observationV2.Add(centerV2.Sub(observationV2).Mul(0.5))
					nextObservations = append(nextObservations, clusters.Coordinates{
						observationV2.X(),
						observationV2.Y(),
					})
				}
			}
			// 重新計算中心
			cc.Reset()
			for _, observation := range nextObservations {
				ci := cc.Nearest(observation)
				cc[ci].Append(observation)
			}
			cc.Recenter()
		}

		nextObservations := clusters.Observations{}
		for _, c := range cc {
			nextObservations = append(nextObservations, c.Observations...)
		}

		posList = [][2]int{}
		for _, observation := range nextObservations {
			posList = append(posList, [2]int{int(observation.Coordinates()[0]), int(observation.Coordinates()[1])})
		}
	}
	return posList, nil
}
