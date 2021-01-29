// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package protocol

import "fmt"

// KesStringPlayer is
func KesStringPlayer(dict map[string]Player) []string {
	ret := make([]string, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsStringPlayer is
func ValsStringPlayer(dict map[string]Player) []Player {
	ret := make([]Player, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeStringPlayer is
func MergeStringPlayer(a map[string]Player, b map[string]Player) map[string]Player {
	ret := map[string]Player{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocStringPlayer is
func AssocStringPlayer(a map[string]Player, k string, v Player) map[string]Player {
	ret := map[string]Player{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocStringPlayer is
func DissocStringPlayer(a map[string]Player, k string) map[string]Player {
	ret := map[string]Player{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}

func TryGetStringPlayer(a map[string]Player, k string) (Player, error) {
	ret, has := a[k]
	if has == false {
		return ret, fmt.Errorf("[TryGetStringPlayer] key not found: %v", k)
	}
	return ret, nil
}

func DifferenceStringPlayer(a map[string]Player, b map[string]Player) map[string]Player {
	ret := map[string]Player{}
	for k, v := range a {
		_, has := b[k]
		if has == false {
			ret[k] = v
		}
	}
	return ret
}
