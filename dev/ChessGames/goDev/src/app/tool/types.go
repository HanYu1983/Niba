package tool

/*
 package tool
 提供的常用库，有一些常用的方法，方便使用
*/

const (
	// King 帥
	King = iota
	// Assistant 仕
	Assistant
	// Elephant 象
	Elephant
	// Horse 馬
	Horse
	// Rock 車
	Rock
	// Cannon 炮
	Cannon
	// Pawn 兵
	Pawn
)

const (
	// Up 朝上
	Up = iota
	// Down 朝下
	Down
)

const (
	Red = iota
	Black
)

// ChessID
type ChessID struct {
	Color int
	Word  int
	Info  string
}

// Chess 代表一個子
type Chess struct {
	ID   ChessID
	Face int
}

type ChessBoard [10][9]Chess

type Gameplay struct {
	Board ChessBoard
}

var (
	// NoChess 代表沒有下子
	NoChess Chess

	// 紅子
	RedKing       = Chess{ID: ChessID{Red, King, ""}, Face: Up}
	RedAssistant1 = Chess{ID: ChessID{Red, King, "1"}, Face: Up}
	RedAssistant2 = Chess{ID: ChessID{Red, King, "2"}, Face: Up}
	RedElephant1  = Chess{ID: ChessID{Red, King, "1"}, Face: Up}
	RedElephant2  = Chess{ID: ChessID{Red, King, "2"}, Face: Up}
	RedHorse1     = Chess{ID: ChessID{Red, King, "1"}, Face: Up}
	RedHorse2     = Chess{ID: ChessID{Red, King, "2"}, Face: Up}
	RedRock1      = Chess{ID: ChessID{Red, King, "1"}, Face: Up}
	RedRock2      = Chess{ID: ChessID{Red, King, "2"}, Face: Up}
	RedCannon1    = Chess{ID: ChessID{Red, King, "1"}, Face: Up}
	RedCannon2    = Chess{ID: ChessID{Red, King, "2"}, Face: Up}
	RedPawn1      = Chess{ID: ChessID{Red, King, "1"}, Face: Up}
	RedPawn2      = Chess{ID: ChessID{Red, King, "2"}, Face: Up}
	RedPawn3      = Chess{ID: ChessID{Red, King, "3"}, Face: Up}
	RedPawn4      = Chess{ID: ChessID{Red, King, "4"}, Face: Up}
	RedPawn5      = Chess{ID: ChessID{Red, King, "5"}, Face: Up}

	// 黑子
	BlackKing       = Chess{ID: ChessID{Black, King, ""}, Face: Up}
	BlackAssistant1 = Chess{ID: ChessID{Black, King, "1"}, Face: Up}
	BlackAssistant2 = Chess{ID: ChessID{Black, King, "2"}, Face: Up}
	BlackElephant1  = Chess{ID: ChessID{Black, King, "1"}, Face: Up}
	BlackElephant2  = Chess{ID: ChessID{Black, King, "2"}, Face: Up}
	BlackHorse1     = Chess{ID: ChessID{Black, King, "1"}, Face: Up}
	BlackHorse2     = Chess{ID: ChessID{Black, King, "2"}, Face: Up}
	BlackRock1      = Chess{ID: ChessID{Black, King, "1"}, Face: Up}
	BlackRock2      = Chess{ID: ChessID{Black, King, "2"}, Face: Up}
	BlackCannon1    = Chess{ID: ChessID{Black, King, "1"}, Face: Up}
	BlackCannon2    = Chess{ID: ChessID{Black, King, "2"}, Face: Up}
	BlackPawn1      = Chess{ID: ChessID{Black, King, "1"}, Face: Up}
	BlackPawn2      = Chess{ID: ChessID{Black, King, "2"}, Face: Up}
	BlackPawn3      = Chess{ID: ChessID{Black, King, "3"}, Face: Up}
	BlackPawn4      = Chess{ID: ChessID{Black, King, "4"}, Face: Up}
	BlackPawn5      = Chess{ID: ChessID{Black, King, "5"}, Face: Up}

	// DefaultChessBoard 預設象棋擺設
	DefaultChessBoard = ChessBoard{
		[9]Chess{
			BlackRock1, BlackHorse1, BlackElephant1, BlackAssistant1, BlackKing, BlackAssistant2, BlackElephant2, BlackHorse2, BlackRock2,
		},
		[9]Chess{},
		[9]Chess{
			NoChess, BlackCannon1, NoChess, NoChess, NoChess, NoChess, NoChess, BlackCannon1, NoChess,
		},
		[9]Chess{
			BlackPawn1, NoChess, BlackPawn2, NoChess, BlackPawn3, NoChess, BlackPawn4, NoChess, BlackPawn5,
		},
		[9]Chess{},

		[9]Chess{},
		[9]Chess{
			RedPawn1, NoChess, RedPawn2, NoChess, RedPawn3, NoChess, RedPawn4, NoChess, RedPawn5,
		},
		[9]Chess{
			NoChess, RedCannon1, NoChess, NoChess, NoChess, NoChess, NoChess, RedCannon1, NoChess,
		},
		[9]Chess{},
		[9]Chess{
			RedRock1, RedHorse1, RedElephant1, RedAssistant1, RedKing, RedAssistant2, RedElephant2, RedHorse2, RedRock2,
		},
	}
)
