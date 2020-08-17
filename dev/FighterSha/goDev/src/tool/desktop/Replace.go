package desktop

func Replace(cardStack CardStack, info map[Card]Card) CardStack {
	// 這裡必須copy, 因為slice是指標, 它的內容物指向本來array的內容物
	ret := CopyCardStack(cardStack)
	for origin, next := range info {
		for idx, card := range cardStack.Cards {
			if card == origin {
				ret.Cards[idx] = next
			}
		}
	}
	return ret
}
