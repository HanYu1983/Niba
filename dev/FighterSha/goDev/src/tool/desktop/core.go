package desktop

type Face struct {
	ID string
}

var (
	FaceDown = Face{"FaceDown"}
	FaceUp   = Face{"FaceUp"}
)

type CardType struct {
	ID string
}

type CardPrototypeID struct {
	CardType CardType
	ID       string
}

type Card struct {
	ID              string
	CardPrototypeID CardPrototypeID
	Face            Face
	Player          string
}

type CardStack struct {
	ID     string
	Cards  []Card
	Player string
}

type Desktop struct {
	CardStacks map[string]CardStack
}
