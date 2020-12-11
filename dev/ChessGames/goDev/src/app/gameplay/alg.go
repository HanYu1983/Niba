package gameplay

import (
	"app/tool"
	"fmt"
)

func QueryMoveRange(origin tool.Gameplay, pos tool.Position) ([]tool.Position, error) {
	selectedChess := origin.Board[pos[1]][pos[0]]
	if selectedChess == tool.NoChess {
		return nil, fmt.Errorf("no chess in %v", pos)
	}
	switch selectedChess.ID.Word {
	case tool.King:
	}
	return []tool.Position{}, nil
}
