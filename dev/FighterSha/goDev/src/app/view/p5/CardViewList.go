// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package p5

import (
	"fmt"
	"math/rand"
	"time"
)

// ShuffleCardView is
func ShuffleCardView(arr []CardView) {
	t := time.Now()
	rand.Seed(int64(t.Nanosecond()))

	for i := len(arr) - 1; i > 0; i-- {
		j := rand.Intn(i)
		arr[i], arr[j] = arr[j], arr[i]
	}
}

// FilterCardView is
func FilterCardView(s1 []CardView, f func(CardView) bool) []CardView {
	ret := []CardView{}
	for _, v := range s1 {
		if f(v) {
			ret = append(ret, v)
		}
	}
	return ret
}

// RemoveCardView is
func RemoveCardView(s1 []CardView, card CardView) ([]CardView, error) {
	if len(s1) == 0 {
		return s1, nil
	}
	ret := []CardView{}
	for _, c := range s1 {
		if c == card {
			continue
		}
		ret = append(ret, c)
	}
	if len(s1) == len(ret) {
		return s1, fmt.Errorf("item not found")
	}
	return ret, nil
}

// ReplaceCardView is
func ReplaceCardView(items []CardView, info map[CardView]CardView) []CardView {
	ret := make([]CardView, len(items))
	copy(ret, items)
	for origin, next := range info {
		for idx, card := range items {
			if card == origin {
				ret[idx] = next
			}
		}
	}
	return ret
}
