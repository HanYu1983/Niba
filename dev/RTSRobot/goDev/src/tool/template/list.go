package template

import (
	"fmt"
	"math/rand"
	"time"
)

// ShuffleItem is
func ShuffleItem(arr []Item) {
	t := time.Now()
	rand.Seed(int64(t.Nanosecond()))

	for i := len(arr) - 1; i > 0; i-- {
		j := rand.Intn(i)
		arr[i], arr[j] = arr[j], arr[i]
	}
}

// FilterItem is
func FilterItem(s1 []Item, f func(Item) bool) []Item {
	ret := []Item{}
	for _, v := range s1 {
		if f(v) {
			ret = append(ret, v)
		}
	}
	return ret
}

// RemoveItem is
func RemoveItem(s1 []Item, card Item) ([]Item, error) {
	if len(s1) == 0 {
		return s1, nil
	}
	ret := []Item{}
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

// ReplaceItem is
func ReplaceItem(items []Item, info map[Item]Item) []Item {
	ret := make([]Item, len(items))
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

// ReplaceIndex is
func ReplaceIndex(items []Item, info map[int]Item) []Item {
	ret := make([]Item, len(items))
	copy(ret, items)
	for idx2, next := range info {
		for idx := range items {
			if idx == idx2 {
				ret[idx] = next
			}
		}
	}
	return ret
}
