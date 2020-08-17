package desktop

func CopyCardStack(src CardStack) CardStack {
	dest := src
	dest.Cards = make([]Card, len(src.Cards))
	copy(dest.Cards, src.Cards)
	return dest
}
