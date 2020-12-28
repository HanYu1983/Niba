// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package data

// KesStringWeapons is
func KesStringWeapons(dict map[string]Weapons) []string {
	ret := make([]string, 0, len(dict))
	for k := range dict {
		ret = append(ret, k)
	}
	return ret
}

// ValsStringWeapons is
func ValsStringWeapons(dict map[string]Weapons) []Weapons {
	ret := make([]Weapons, 0, len(dict))
	for _, v := range dict {
		ret = append(ret, v)
	}
	return ret
}

// MergeStringWeapons is
func MergeStringWeapons(a map[string]Weapons, b map[string]Weapons) map[string]Weapons {
	ret := map[string]Weapons{}
	for k, v := range a {
		ret[k] = v
	}
	for k, v := range b {
		ret[k] = v
	}
	return ret
}

// AssocStringWeapons is
func AssocStringWeapons(a map[string]Weapons, k string, v Weapons) map[string]Weapons {
	ret := map[string]Weapons{}
	for k, v := range a {
		ret[k] = v
	}
	ret[k] = v
	return ret
}

// DissocStringWeapons is
func DissocStringWeapons(a map[string]Weapons, k string) map[string]Weapons {
	ret := map[string]Weapons{}
	for k, v := range a {
		ret[k] = v
	}
	delete(ret, k)
	return ret
}
