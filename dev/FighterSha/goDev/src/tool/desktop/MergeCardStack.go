// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package desktop

func MergeCardStack(a map[string]CardStack, b map[string]CardStack) map[string]CardStack {
	ret := map[string]CardStack{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}
