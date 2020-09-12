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
	// CardTypeAttack 殺
	CardTypeAttack = desktop.CardType{ID: "Attack"}
	// CardTypeDodge 閃
	CardTypeDodge = desktop.CardType{ID: "Dodge"}
	// CardTypeStealMoney 劫
	CardTypeStealMoney = desktop.CardType{ID: "StealMoney"}
	// CardTypeSteal 盜
	CardTypeSteal = desktop.CardType{ID: "Steal"}
	// CardTypeArm 武器
	CardTypeArm = desktop.CardType{ID: "CardTypeArm"}
	// CardTypeArmor 防具
	CardTypeArmor = desktop.CardType{ID: "CardTypeArmor"}
	// CardTypeAccessory 配件
	CardTypeAccessory = desktop.CardType{ID: "CardTypeAccessory"}
	// CardTypeCharacter 角色
	CardTypeCharacter = desktop.CardType{ID: "CardTypeCharacter"}
	// CardTypeJob 打工
	CardTypeJob = desktop.CardType{ID: "CardTypeJob"}
	// CardTypeMake is 製造
	CardTypeMake = desktop.CardType{ID: "CardTypeMake"}
	// CardTypeGrind is 研磨
	CardTypeGrind = desktop.CardType{ID: "CardTypeGrind"}
	// CardTypeBarrier is 壁壘
	CardTypeBarrier = desktop.CardType{ID: "CardTypeBarrier"}
)

// Player is
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

func UpdateCharacterCom(origin Gameplay, player Player, f func(CharacterCardCom) CharacterCardCom) (Gameplay, error) {
	gameplayCtx := origin
	characterCard, err := GetCharacterCard(gameplayCtx, player)
	if err != nil {
		return origin, err
	}
	characterCom := f(gameplayCtx.CharacterCardCom[characterCard.ID])
	gameplayCtx.CharacterCardCom = AssocStringCharacterCardCom(gameplayCtx.CharacterCardCom, characterCard.ID, characterCom)
	return gameplayCtx, nil
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
							CardType: CardTypeAccessory,
						},
						Face: desktop.FaceDown,
					},
					desktop.Card{
						ID: "2",
						CardPrototypeID: desktop.CardPrototypeID{
							CardType: CardTypeArm,
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
				CardStackGravyard:        desktop.CardStack{},
				CardStackIDHand(PlayerA): desktop.CardStack{},
				CardStackIDCharacter(PlayerA): desktop.CardStack{
					desktop.Card{
						ID: "character1",
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
