// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package uidata

// KesIntListInt is
func KesIntListInt(dict map[int]ListInt) []int {
	ret := make([]int, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsIntListInt is
func ValsIntListInt(dict map[int]ListInt) []ListInt {
	ret := make([]ListInt, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeIntListInt is
func MergeIntListInt(a map[int]ListInt, b map[int]ListInt) map[int]ListInt {
	ret := map[int]ListInt{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocIntListInt is
func AssocIntListInt(a map[int]ListInt, k int, v ListInt) map[int]ListInt {
	ret := map[int]ListInt{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocIntListInt is
func DissocIntListInt(a map[int]ListInt, k int) map[int]ListInt {
	ret := map[int]ListInt{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}
