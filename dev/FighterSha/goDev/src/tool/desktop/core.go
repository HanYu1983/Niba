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

func Assoc(css map[string]CardStack, key string, cs CardStack) map[string]CardStack {
	var ret map[string]CardStack
	for k, v := range css {
		ret[k] = v
	}
	ret[key] = cs
	return ret
}

func Merge(css map[string]CardStack, append map[string]CardStack) map[string]CardStack {
	var ret map[string]CardStack
	for k, v := range css {
		ret[k] = v
	}
	for k, v := range append {
		ret[k] = v
	}
	return ret
}
