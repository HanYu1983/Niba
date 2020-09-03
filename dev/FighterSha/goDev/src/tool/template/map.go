package template

// KeyValueMap is
type KeyValueMap map[Key]Value

// MergeKeyValue is
func MergeKeyValue(a map[Key]Value, b map[Key]Value) map[Key]Value {
	ret := map[Key]Value{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocKeyValue is
func AssocKeyValue(a map[Key]Value, k Key, v Value) map[Key]Value {
	ret := map[Key]Value{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}
