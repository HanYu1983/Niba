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
	AskOption(Gameplay, Player, string, []string) (string, error)
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

const (
	CharacterIDWarrior      = "戰士"
	CharacterIDThief        = "小偷"
	CharacterNameMage       = "法師"
	CharacterNameBlacksmith = "鐵匠"
)

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

func UpdateCharacterCom(origin Gameplay, player Player, f func(CharacterCardCom) (CharacterCardCom, error)) (Gameplay, error) {
	gameplayCtx := origin
	characterCard, err := GetCharacterCard(gameplayCtx, player)
	if err != nil {
		return origin, err
	}
	characterCom, isExist := gameplayCtx.CharacterCardCom[characterCard.ID]
	if isExist == false {
		characterCom = InitCharacterCardCom(characterCard)
	}
	characterCom, err = f(characterCom)
	if err != nil {
		return origin, err
	}
	gameplayCtx.CharacterCardCom = AssocStringCharacterCardCom(gameplayCtx.CharacterCardCom, characterCard.ID, characterCom)
	return gameplayCtx, nil
}

func InitCharacterCardCom(card desktop.Card) CharacterCardCom {
	return CharacterCardCom{Life: 3, Money: 3}
}

func MoveCard(ctx IView, origin Gameplay, from string, to string, mapCard func(desktop.Card) desktop.Card, card desktop.Card) (Gameplay, desktop.Card, error) {
	gameplayCtx := origin
	toCS := gameplayCtx.Desktop.CardStacks[to]
	fromCS := gameplayCtx.Desktop.CardStacks[from]
	fromCS, err := desktop.RemoveCard(fromCS, card)
	if err != nil {
		return origin, card, err
	}
	card = mapCard(card)
	toCS = append(toCS, card)
	gameplayCtx.Desktop.CardStacks = desktop.MergeStringCardStack(gameplayCtx.Desktop.CardStacks, map[string]desktop.CardStack{
		to:   toCS,
		from: fromCS,
	})
	return gameplayCtx, card, nil
}

func PrepareGameplay(origin Gameplay) (Gameplay, error) {
	gameplayCtx := origin

	home := desktop.CardStack{}

	// 殺
	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeAttack_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeAttack,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeDodge_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeDodge,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeStealMoney_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeStealMoney,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeSteal_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeSteal,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeJob_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeJob,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeMake_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeMake,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeGrind_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeGrind,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeBarrier_%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeBarrier,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeArm%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeArm,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeArmor%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeArmor,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	for i := 0; i < 5; i++ {
		card := desktop.Card{
			ID: fmt.Sprintf("CardTypeAccessory%v", i),
			CardPrototypeID: desktop.CardPrototypeID{
				CardType: CardTypeAccessory,
			},
			Face: desktop.FaceDown,
		}
		home = append(home, card)
	}

	desktop.ShuffleCard(home)
	gameplayCtx.Desktop.CardStacks = desktop.AssocStringCardStack(gameplayCtx.Desktop.CardStacks, CardStackHome, home)

	playerA := Player{"A", "player", 0}
	gameplayCtx.Players = AssocStringPlayer(gameplayCtx.Players, playerA.ID, playerA)

	characterA := desktop.Card{
		ID: "characterA",
		CardPrototypeID: desktop.CardPrototypeID{
			ID:       CharacterIDWarrior,
			CardType: CardTypeCharacter,
		},
		Face:   desktop.FaceDown,
		Player: playerA.ID,
	}
	gameplayCtx.Desktop.CardStacks = desktop.AssocStringCardStack(gameplayCtx.Desktop.CardStacks, CardStackIDCharacter(playerA), desktop.CardStack{characterA})

	playerB := Player{"B", "ai", 0}
	gameplayCtx.Players = AssocStringPlayer(gameplayCtx.Players, playerB.ID, playerB)

	characterB := desktop.Card{
		ID: "characterB",
		CardPrototypeID: desktop.CardPrototypeID{
			ID:       CharacterIDThief,
			CardType: CardTypeCharacter,
		},
		Face: desktop.FaceDown,
	}
	gameplayCtx.Desktop.CardStacks = desktop.AssocStringCardStack(gameplayCtx.Desktop.CardStacks, CardStackIDCharacter(playerB), desktop.CardStack{characterB})

	gameplayCtx.ActivePlayerID = playerA.ID
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
				CardStackGravyard:             desktop.CardStack{},
				CardStackIDHand(PlayerA):      desktop.CardStack{},
				CardStackIDCharacter(PlayerA): desktop.CardStack{},
				CardStackIDHand(PlayerB):      desktop.CardStack{},
				CardStackIDCharacter(PlayerB): desktop.CardStack{},
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
