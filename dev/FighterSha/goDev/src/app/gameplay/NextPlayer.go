package gameplay

import (
	"fmt"
	"sort"
)

// SortByPlayerOrder is
type SortByPlayerOrder []Player

func (a SortByPlayerOrder) Len() int           { return len(a) }
func (a SortByPlayerOrder) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a SortByPlayerOrder) Less(i, j int) bool { return a[i].Order < a[j].Order }

// NextPlayer is
func NextPlayer(ctx IView, origin Gameplay, player Player) (Gameplay, error) {
	gameplayCtx := origin
	players := ValsStringPlayer(gameplayCtx.Players)
	if len(players) == 0 {
		return origin, fmt.Errorf("players length not be 0")
	}
	sort.Sort(SortByPlayerOrder(players))

	find := players[0]
	for idx, curr := range players {
		if curr == player {
			if idx == len(players)-1 {
				break
			} else {
				find = players[idx+1]
				break
			}
		}
	}

	gameplayCtx.ActivePlayerID = find.ID
	ctx.Alert(fmt.Sprintf("換下個玩家%v", find.ID))
	return gameplayCtx, nil
}
