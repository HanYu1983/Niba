// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package p5

// KesStringCardView is
func KesStringCardView(dict map[string]CardView) []string {
	ret := make([]string, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsStringCardView is
func ValsStringCardView(dict map[string]CardView) []CardView {
	ret := make([]CardView, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeStringCardView is
func MergeStringCardView(a map[string]CardView, b map[string]CardView) map[string]CardView {
	ret := map[string]CardView{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocStringCardView is
func AssocStringCardView(a map[string]CardView, k string, v CardView) map[string]CardView {
	ret := map[string]CardView{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}
