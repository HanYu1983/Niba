package template

import (
	"fmt"
)

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
