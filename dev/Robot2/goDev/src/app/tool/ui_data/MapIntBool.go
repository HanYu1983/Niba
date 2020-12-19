// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package ui_data

// KesIntBool is
func KesIntBool(dict map[int]bool) []int {
	ret := make([]int, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsIntBool is
func ValsIntBool(dict map[int]bool) []bool {
	ret := make([]bool, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeIntBool is
func MergeIntBool(a map[int]bool, b map[int]bool) map[int]bool {
	ret := map[int]bool{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocIntBool is
func AssocIntBool(a map[int]bool, k int, v bool) map[int]bool {
	ret := map[int]bool{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}
