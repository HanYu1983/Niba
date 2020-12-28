// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package uidata

// KesIntGameplayPage is
func KesIntGameplayPage(dict map[int]GameplayPage) []int {
	ret := make([]int, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsIntGameplayPage is
func ValsIntGameplayPage(dict map[int]GameplayPage) []GameplayPage {
	ret := make([]GameplayPage, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeIntGameplayPage is
func MergeIntGameplayPage(a map[int]GameplayPage, b map[int]GameplayPage) map[int]GameplayPage {
	ret := map[int]GameplayPage{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocIntGameplayPage is
func AssocIntGameplayPage(a map[int]GameplayPage, k int, v GameplayPage) map[int]GameplayPage {
	ret := map[int]GameplayPage{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocIntGameplayPage is
func DissocIntGameplayPage(a map[int]GameplayPage, k int) map[int]GameplayPage {
	ret := map[int]GameplayPage{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}
