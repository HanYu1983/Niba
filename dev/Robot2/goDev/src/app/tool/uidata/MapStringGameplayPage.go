// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package uidata

import "fmt"

// KesStringGameplayPage is
func KesStringGameplayPage(dict map[string]GameplayPage) []string {
	ret := make([]string, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsStringGameplayPage is
func ValsStringGameplayPage(dict map[string]GameplayPage) []GameplayPage {
	ret := make([]GameplayPage, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeStringGameplayPage is
func MergeStringGameplayPage(a map[string]GameplayPage, b map[string]GameplayPage) map[string]GameplayPage {
	ret := map[string]GameplayPage{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocStringGameplayPage is
func AssocStringGameplayPage(a map[string]GameplayPage, k string, v GameplayPage) map[string]GameplayPage {
	ret := map[string]GameplayPage{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocStringGameplayPage is
func DissocStringGameplayPage(a map[string]GameplayPage, k string) map[string]GameplayPage {
	ret := map[string]GameplayPage{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}

func TryGetStringGameplayPage(a map[string]GameplayPage, k string) (GameplayPage, error) {
	ret, has := a[k]
	if has == false {
		return ret, fmt.Errorf("[TryGetStringGameplayPage] key not found: %v", k)
	}
	return ret, nil
}

func DifferenceStringGameplayPage(a map[string]GameplayPage, b map[string]GameplayPage) map[string]GameplayPage {
	ret := map[string]GameplayPage{}
	for k, v := range a {
		_, has := b[k]
		if has == false {
			ret[k] = v
		}
	}
	return ret
}
