package desktop

func Replace(cardStack CardStack, info map[Card]Card) CardStack {
	ret := cardStack
	for origin, next := range info {
		for idx, card := range cardStack {
			if card == origin {
				ret[idx] = next
			}
		}
	}
	return ret
}
