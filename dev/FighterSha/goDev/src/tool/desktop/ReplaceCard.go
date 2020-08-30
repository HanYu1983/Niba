// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package desktop

// ReplaceCard is
func ReplaceCard(items []Card, info map[Card]Card) []Card {
	ret := make([]Card, len(items))
	copy(ret, items)
	for origin, next := range info {
		for idx, card := range items {
			if card == origin {
				ret[idx] = next
			}
		}
	}
	return ret
}
