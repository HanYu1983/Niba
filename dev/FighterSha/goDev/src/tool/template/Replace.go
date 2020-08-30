package template

func ReplaceItem(items []Item, info map[Item]Item) []Item {
	ret := make([]Item, len(items))
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
