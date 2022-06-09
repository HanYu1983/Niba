package useKmean

import (
	"fmt"
	"math/rand"
	"testing"

	"github.com/muesli/clusters"
	"github.com/muesli/kmeans"
)

func TestCore(t *testing.T) {
	var d clusters.Observations
	for x := 0; x < 1024; x++ {
		d = append(d, clusters.Coordinates{
			rand.Float64(),
			rand.Float64(),
		})
	}

	// Partition the data points into 16 clusters
	km := kmeans.New()
	clusters, err := km.Partition(d, 16)
	if err != nil {
		t.Error(err)
	}

	for _, c := range clusters {
		fmt.Printf("Centered at x: %.2f y: %.2f\n", c.Center[0], c.Center[1])
		fmt.Printf("Matching data points: %+v\n\n", c.Observations)
	}
}

func TestRecenter(t *testing.T) {
	// 舊位置
	var d clusters.Observations
	for x := 0; x < 10; x++ {
		d = append(d, clusters.Coordinates{
			rand.Float64(),
			rand.Float64(),
		})
	}

	// Partition the data points into 16 clusters
	km := kmeans.New()
	cc, err := km.Partition(d, 3)
	if err != nil {
		t.Error(err)
	}

	for _, c := range cc {
		fmt.Printf("Centered at x: %.2f y: %.2f\n", c.Center[0], c.Center[1])
		fmt.Printf("Matching data points: %+v\n\n", c.Observations)
	}

	fmt.Println("=============")
	// 新位置
	var d2 clusters.Observations
	for x := 0; x < 10; x++ {
		d2 = append(d2, clusters.Coordinates{
			rand.Float64(),
			rand.Float64(),
		})
	}

	cc.Reset()
	for _, point := range d2 {
		ci := cc.Nearest(point)
		cc[ci].Append(point)
	}
	cc.Recenter()
	for _, c := range cc {
		fmt.Printf("Centered at x: %.2f y: %.2f\n", c.Center[0], c.Center[1])
		fmt.Printf("Matching data points: %+v\n\n", c.Observations)
	}
}
