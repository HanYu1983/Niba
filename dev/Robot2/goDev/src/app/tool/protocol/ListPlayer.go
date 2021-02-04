// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package protocol

import (
	"fmt"
	"math/rand"
	"time"
)

// ShufflePlayer is
func ShufflePlayer(arr []Player) {
	t := time.Now()
	rand.Seed(int64(t.Nanosecond()))

	for i := len(arr) - 1; i > 0; i-- {
		j := rand.Intn(i)
		arr[i], arr[j] = arr[j], arr[i]
	}
}

// FilterPlayer is
func FilterPlayer(s1 []Player, f func(Player) bool) []Player {
	ret := []Player{}
	for _, v := range s1 {
		if f(v) {
			ret = append(ret, v)
		}
	}
	return ret
}

// RemovePlayer is
func RemovePlayer(s1 []Player, card Player) ([]Player, error) {
	if len(s1) == 0 {
		return s1, nil
	}
	ret := []Player{}
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

// ReplacePlayer is
func ReplacePlayer(items []Player, info map[Player]Player) []Player {
	ret := make([]Player, len(items))
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

// FindPlayerIndex is
func FindPlayerIndex(items []Player, target Player) int {
	for idx, item := range items {
		if item == target {
			return idx
		}
	}
	return -1
}

// ReplacePlayerIndex is
func ReplacePlayerIndex(items []Player, info map[int]Player) []Player {
	ret := make([]Player, len(items))
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

// TryGetPlayer
func TryGetPlayer(items []Player, i int) (Player, error) {
	if i < 0 || i >= len(items) {
		ret := map[int]Player{}
		return ret[0], fmt.Errorf("out of range (%v/%v)", i, len(items))
	}
	return items[i], nil
}

// TryGetPlayer2
func TryGetPlayer2(items [][]Player, i int) func(j int, err error) (Player, error) {
	return func(j int, err error) (Player, error) {
		if err != nil {
			ret := map[int]Player{}
			return ret[0], err
		}
		if i < 0 || i >= len(items) {
			ret := map[int]Player{}
			return ret[0], fmt.Errorf("out of range i (%v/%v)", i, len(items))
		}
		if j < 0 || j >= len(items[i]) {
			ret := map[int]Player{}
			return ret[0], fmt.Errorf("out of range j (%v/%v)", j, len(items[i]))
		}
		return items[i][j], nil
	}
}

// DifferencePlayer
func DifferencePlayer(a []Player, b []Player) []Player {
	ret := []Player{}
	for _, v := range a {
		has := false
		for _, v2 := range b {
			if v == v2 {
				has = true
				break
			}
		}
		if has == false {
			ret = append(ret, v)
		}
	}
	return ret
}