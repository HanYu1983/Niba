package mlkmeans

import (
	"github.com/gopherjs/gopherjs/js"
)

// KMeansResult {
// 	clusters: [ 0, 0, 1, 1 ],
// 	centroids:
// 	 [ { centroid: [ 1, 1.5, 1 ], error: 0.25, size: 2 },
// 	   { centroid: [ -1, -1, -1.25 ], error: 0.0625, size: 2 } ],
// 	converged: true,
// 	iterations: 1
//   }

type Centroid struct {
	Centroid []float64
	Error    float64
	Size     int
}
type KMeansResult struct {
	Clusters   []int
	Centroids  []Centroid
	Converged  bool
	Iterations int
}

// KMeans is
// let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
// let centers = [[1, 2, 1], [-1, -1, -1]];
// let ans = kmeans(data, 2, { initialization: centers });
// console.log(ans);
// The initial centers should have the same length as K
func KMeans(dataset interface{}, cnt int, options map[string]interface{}) (KMeansResult, error) {
	ans := js.Global.Get("ml-kmeans").New(dataset, cnt, options)
	clusters := js2intary(ans.Get("clusters"))
	centroids := []Centroid{}
	for i := 0; i < ans.Get("centroids").Length(); i++ {
		v := ans.Get("centroids").Index(i)
		centroids = append(centroids, Centroid{
			Centroid: js2f64ary(v.Get("centroid")),
			Error:    v.Get("error").Float(),
			Size:     v.Get("size").Int(),
		})
	}
	converged := ans.Get("converged").Bool()
	iterations := ans.Get("iterations").Int()
	return KMeansResult{
		Clusters:   clusters,
		Centroids:  centroids,
		Converged:  converged,
		Iterations: iterations,
	}, nil
}

func js2intary(_js *js.Object) []int {
	ret := []int{}
	for i := 0; i < _js.Length(); i++ {
		v := _js.Index(i)
		ret = append(ret, v.Int())
	}
	return ret
}

func js2f64ary(_js *js.Object) []float64 {
	ret := []float64{}
	for i := 0; i < _js.Length(); i++ {
		v := _js.Index(i)
		ret = append(ret, v.Float())
	}
	return ret
}
