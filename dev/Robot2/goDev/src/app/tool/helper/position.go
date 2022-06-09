package helper

import "app/tool/protocol"

func World2Local(camera protocol.Position, pos protocol.Position) protocol.Position {
	return protocol.Position{pos[0] - camera[0], pos[1] - camera[1]}
}

func Local2World(camera protocol.Position, pos protocol.Position) protocol.Position {
	return protocol.Position{pos[0] + camera[0], pos[1] + camera[1]}
}
