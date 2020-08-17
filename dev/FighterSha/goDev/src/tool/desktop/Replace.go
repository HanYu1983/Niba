package desktop

func Replace(cardStack CardStack, info map[Card]Card) CardStack {
	ret := cardStack
	for origin, next := range info {
		for idx, card := range cardStack.Cards {
			if card == origin {
				ret.Cards[idx] = next
			}
		}
	}
	return ret
}
