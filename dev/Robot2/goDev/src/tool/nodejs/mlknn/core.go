package mlknn

import (
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

type KNN struct {
	*js.Object
}

func (knn KNN) Predict(test_dataset [][]interface{}) interface{} {
	obj := knn.Call("predict", test_dataset)
	ary := []interface{}{}
	for i := 0; i < obj.Length(); i++ {
		v := obj.Index(i)
		ary = append(ary, v.Interface())
	}
	return ary
}

func New(train_dataset interface{}, labels interface{}, options map[string]interface{}) (KNN, error) {
	if _, has := option["k"]; has == false {
		return KNN{}, fmt.Errorf("option must has k field")
	}
	_knn := js.Global.Get("ml-knn")
	knn := _knn.New(train_dataset, labels, options)
	return KNN{knn}, nil
}
