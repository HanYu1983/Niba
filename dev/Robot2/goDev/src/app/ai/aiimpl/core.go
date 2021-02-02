package aiimpl

import "app/ai/aitypes"

type Model struct {
	Title string
}

func (m Model) QueryMyRole(string) (aitypes.Environment, int, error) {
	return m, aitypes.RoleTeamLeader, nil
}

func (m Model) QueryMyTeam(string) (aitypes.Environment, aitypes.Team, error) {
	return m, aitypes.Team{}, nil
}
