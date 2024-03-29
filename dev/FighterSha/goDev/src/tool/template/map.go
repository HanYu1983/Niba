package template

// KesKeyValue is
func KesKeyValue(dict map[Key]Value) []Key {
	ret := make([]Key, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsKeyValue is
func ValsKeyValue(dict map[Key]Value) []Value {
	ret := make([]Value, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

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
