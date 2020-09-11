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
	ActivePlayerID   string
	PlayerBasicComs  map[string]PlayerBasicCom
	CharacterCardCom map[string]CharacterCardCom
}

const (
	CardStackHome     = "CardStackHome"
	CardStackGravyard = "CardStackGravyard"
)

func CardStackIDHand(player Player) string {
	return player.ID + "_CardStackHand"
}

func CardStackIDCharacter(player Player) string {
	return player.ID + "_CardStackCharacter"
}

func CardStackIDEquip(player Player) string {
	return player.ID + "_CardStackEquip"
}

func GetCharacterCard(gameplayCtx Gameplay, player Player) (desktop.Card, error) {
	cs := gameplayCtx.Desktop.CardStacks[CardStackIDCharacter(player)]
	if len(cs) == 0 {
		return desktop.Card{}, fmt.Errorf("player %v character card not found", player.ID)
	}
	return cs[0], nil
}

var (
	PlayerA         = Player{"A", "A", 0}
	PlayerB         = Player{"B", "B", 1}
	DefaultGamePlay = Gameplay{
		desktop.Desktop{
			map[string]desktop.CardStack{
				CardStackHome: desktop.CardStack{
					desktop.Card{
						ID: "1",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeDodge,
						},
						Face: desktop.FaceDown,
					},
					desktop.Card{
						ID: "2",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeDodge,
						},
						Face: desktop.FaceDown,
					},
					desktop.Card{
						ID: "3",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeSteal,
						},
						Face: desktop.FaceDown,
					},
					desktop.Card{
						ID: "4",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeStealMoney,
						},
						Face: desktop.FaceDown,
					},
				},
				CardStackGravyard: desktop.CardStack{},
				CardStackIDHand(PlayerA): desktop.CardStack{
					desktop.Card{
						ID: "5",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeAttack,
						},
						Face:   desktop.FaceDown,
						Player: PlayerA.ID,
					},
					desktop.Card{
						ID: "6",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeDodge,
						},
						Face:   desktop.FaceDown,
						Player: PlayerA.ID,
					},
				},
				CardStackIDCharacter(PlayerA): desktop.CardStack{
					desktop.Card{
						ID: "7",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeCharacter,
						},
						Face:   desktop.FaceUp,
						Player: PlayerA.ID,
					},
				},
				CardStackIDHand(PlayerB): desktop.CardStack{},
			},
		},
		map[string]Player{
			PlayerA.ID: PlayerA,
			PlayerB.ID: PlayerB,
		},
		PlayerA.ID,
		map[string]PlayerBasicCom{},
		map[string]CharacterCardCom{},
	}
)
