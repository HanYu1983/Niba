package template

func AssocKeyValue(a map[Key]Value, k Key, v Value) map[Key]Value {
	ret := map[Key]Value{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}
