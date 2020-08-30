package template

// MergeValue is
func MergeValue(a map[Key]Value, b map[Key]Value) map[Key]Value {
	ret := map[Key]Value{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}
