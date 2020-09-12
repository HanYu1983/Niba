package template

import (
	"fmt"
)

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
	findID := -1
	for _findID, c := range s1 {
		if c == card {
			findID = _findID
			break
		}
	}
	if findID == -1 {
		return s1, fmt.Errorf("item not found")
	}
	s1 = append(s1[0:findID], s1[findID+1:]...)
	return s1, nil
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
