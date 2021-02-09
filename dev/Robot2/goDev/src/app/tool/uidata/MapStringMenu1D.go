// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package uidata

import "fmt"

// KesStringMenu1D is
func KesStringMenu1D(dict map[string]Menu1D) []string {
	ret := make([]string, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsStringMenu1D is
func ValsStringMenu1D(dict map[string]Menu1D) []Menu1D {
	ret := make([]Menu1D, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeStringMenu1D is
func MergeStringMenu1D(a map[string]Menu1D, b map[string]Menu1D) map[string]Menu1D {
	ret := map[string]Menu1D{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocStringMenu1D is
func AssocStringMenu1D(a map[string]Menu1D, k string, v Menu1D) map[string]Menu1D {
	ret := map[string]Menu1D{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocStringMenu1D is
func DissocStringMenu1D(a map[string]Menu1D, k string) map[string]Menu1D {
	ret := map[string]Menu1D{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}

func TryGetStringMenu1D(a map[string]Menu1D, k string) (Menu1D, error) {
	ret, has := a[k]
	if has == false {
		return ret, fmt.Errorf("[TryGetStringMenu1D] key not found: %v", k)
	}
	return ret, nil
}

func DifferenceStringMenu1D(a map[string]Menu1D, b map[string]Menu1D) map[string]Menu1D {
	ret := map[string]Menu1D{}
	for k, v := range a {
		_, has := b[k]
		if has == false {
			ret[k] = v
		}
	}
	return ret
}
