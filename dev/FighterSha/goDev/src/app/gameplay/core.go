package gameplay

import (
	"fmt"
	"tool/desktop"
)

// IView is
type IView interface {
	AskCommand(Gameplay, Player) (interface{}, error)
	AskOneCard(Gameplay, Player, desktop.CardStack, func(desktop.Card) bool) (desktop.Card, error)
	AskOnePlayer(Gameplay, Player, map[string]Player) (Player, error)
	Alert(msg interface{})
	Render(gameplayCtx Gameplay)
}

var (
	CardTypeAttack     = desktop.CardType{"Attack"}
	CardTypeDodge      = desktop.CardType{"Dodge"}
	CardTypeStealMoney = desktop.CardType{"StealMoney"}
	CardTypeSteal      = desktop.CardType{"Steal"}
	CardTypeArm        = desktop.CardType{"CardTypeArm"}
	CardTypeArmor      = desktop.CardType{"CardTypeArmor"}
	CardTypeAccessory  = desktop.CardType{"CardTypeAccessory"}
	CardTypeCharacter  = desktop.CardType{"CardTypeCharacter"}
)

type Player struct {
	ID      string
	GroupID string
	Order   int
}

type PlayerBasicCom struct {
	AttackTimes     int
	StealTimes      int
	StealMoneyTimes int
}

type CharacterCardCom struct {
	Life  int
	Money int
}

type Gameplay struct {
	Desktop          desktop.Desktop
	Players          map[string]Player
	PlayerBasicComs  map[string]PlayerBasicCom
	CharacterCardCom map[string]CharacterCardCom
}

const (
	CardStackHome      = "CardStackHome"
	CardStackGravyard  = "CardStackGravyard"
	CardStackEquip     = "_CardStackEquip"
	CardStackCharacter = "_CardStackCharacter"
)

func GetCharacterCard(gameplayCtx Gameplay, player Player) (desktop.Card, error) {
	cs := gameplayCtx.Desktop.CardStacks[player.ID+CardStackCharacter]
	if len(cs) == 0 {
		return desktop.Card{}, fmt.Errorf("player %v character card not found", player.ID)
	}
	return cs[0], nil
}

var (
	DefaultGamePlay = Gameplay{
		desktop.Desktop{
			map[string]desktop.CardStack{
				CardStackHome:     desktop.CardStack{},
				CardStackGravyard: desktop.CardStack{},
				"A": desktop.CardStack{
					desktop.Card{
						ID: "abc",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeAttack,
						},
						Face:   desktop.FaceDown,
						Player: "A",
					},
				},
				"A" + CardStackCharacter: desktop.CardStack{
					desktop.Card{
						ID: "abc",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeCharacter,
						},
						Face:   desktop.FaceUp,
						Player: "A",
					},
				},
			},
		},
		map[string]Player{
			"A": Player{"A", "A", 0},
		},
		map[string]PlayerBasicCom{},
		map[string]CharacterCardCom{},
	}
)
