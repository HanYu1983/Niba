// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package protocol

import "fmt"

// KesStringPosition is
func KesStringPosition(dict map[string]Position) []string {
	ret := make([]string, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsStringPosition is
func ValsStringPosition(dict map[string]Position) []Position {
	ret := make([]Position, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeStringPosition is
func MergeStringPosition(a map[string]Position, b map[string]Position) map[string]Position {
	ret := map[string]Position{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocStringPosition is
func AssocStringPosition(a map[string]Position, k string, v Position) map[string]Position {
	ret := map[string]Position{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocStringPosition is
func DissocStringPosition(a map[string]Position, k string) map[string]Position {
	ret := map[string]Position{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}

func TryGetStringPosition(a map[string]Position, k string) (Position, error) {
	ret, has := a[k]
	if has == false {
		return ret, fmt.Errorf("[TryGetStringPosition] key not found: %v", k)
	}
	return ret, nil
}

func DifferenceStringPosition(a map[string]Position, b map[string]Position) map[string]Position {
	ret := map[string]Position{}
	for k, v := range a {
		_, has := b[k]
		if has == false {
			ret[k] = v
		}
	}
	return ret
}
