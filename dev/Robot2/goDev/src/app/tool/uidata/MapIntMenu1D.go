// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package uidata

import "fmt"

// KesIntMenu1D is
func KesIntMenu1D(dict map[int]Menu1D) []int {
	ret := make([]int, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsIntMenu1D is
func ValsIntMenu1D(dict map[int]Menu1D) []Menu1D {
	ret := make([]Menu1D, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeIntMenu1D is
func MergeIntMenu1D(a map[int]Menu1D, b map[int]Menu1D) map[int]Menu1D {
	ret := map[int]Menu1D{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocIntMenu1D is
func AssocIntMenu1D(a map[int]Menu1D, k int, v Menu1D) map[int]Menu1D {
	ret := map[int]Menu1D{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocIntMenu1D is
func DissocIntMenu1D(a map[int]Menu1D, k int) map[int]Menu1D {
	ret := map[int]Menu1D{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}

func TryGetIntMenu1D(a map[int]Menu1D, k int) (Menu1D, error) {
	ret, has := a[k]
	if has == false {
		return ret, fmt.Errorf("[TryGetIntMenu1D] key not found: %v", k)
	}
	return ret, nil
}
