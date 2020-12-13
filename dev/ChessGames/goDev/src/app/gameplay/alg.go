package gameplay

import (
	"app/tool"
	"fmt"
)

var (
	Plus   = []tool.Position{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}
	L      = []tool.Position{{1, 2}, {2, 1}, {1, -2}, {2, -1}, {-2, -1}, {-1, -2}, {-2, 1}, {-1, 2}}
	Cross  = []tool.Position{{1, 1}, {1, -1}, {-1, -1}, {-1, 1}}
	Cross2 = []tool.Position{{2, 2}, {2, -2}, {-2, -2}, {-2, 2}}
)

func QueryMoveRange(origin tool.Gameplay, pos tool.Position) ([]tool.Position, error) {
	selectedChess := origin.Board[pos[1]][pos[0]]
	if selectedChess == tool.NoChess {
		return nil, fmt.Errorf("no chess in %v", pos)
	}
	moves := []tool.Position{}
	cx, cy := pos[0], pos[1]
	switch selectedChess.ID.Word {
	case tool.King:
		moves = append(moves, Plus...)
		for i, move := range moves {
			moves[i][0] = move[0] + cx
			moves[i][1] = move[1] + cy
		}
	case tool.Assistant:
		moves = append(moves, Cross...)
		for i, move := range moves {
			moves[i][0] = move[0] + cx
			moves[i][1] = move[1] + cy
		}
	case tool.Elephant:
		moves = append(moves, Cross2...)
		for i, move := range moves {
			moves[i][0] = move[0] + cx
			moves[i][1] = move[1] + cy
		}
	case tool.Horse:
		moves = append(moves, L...)
		for i, move := range moves {
			moves[i][0] = move[0] + cx
			moves[i][1] = move[1] + cy
		}
	case tool.Rock:
		for x := 0; x < len(origin.Board[0]); x++ {
			moves = append(moves, tool.Position{x, cy})
		}
		for y := 0; y < len(origin.Board); y++ {
			moves = append(moves, tool.Position{cx, y})
		}
	case tool.Cannon:
		for x := 0; x < len(origin.Board[0]); x++ {
			moves = append(moves, tool.Position{x, cy})
		}
		for y := 0; y < len(origin.Board); y++ {
			moves = append(moves, tool.Position{cx, y})
		}
	case tool.Pawn:
		moves = append(moves, Plus...)
		for i, move := range moves {
			moves[i][0] = move[0] + cx
			moves[i][1] = move[1] + cy
		}
	default:
		return nil, fmt.Errorf("no this type: %v", selectedChess)
	}
	moves = tool.FilterPosition(moves, func(pos tool.Position) bool {
		x, y := pos[0], pos[1]
		if x < 0 || x >= len(origin.Board[0]) {
			return false
		}
		if y < 0 || y >= len(origin.Board) {
			return false
		}
		occupy := origin.Board[pos[1]][pos[0]]
		if occupy != tool.NoChess && occupy.ID.Color == selectedChess.ID.Color {
			return false
		}
		return true
	})
	return moves, nil
}

func IsWin(origin tool.Gameplay) bool {
	return false
}
