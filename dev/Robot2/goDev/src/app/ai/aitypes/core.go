package aitypes

const (
	RoleTeamLeader = iota
	RoleTeamMember
)

type Team struct {
	Leader string
	Member map[string]bool
}

type Environment interface {
	QueryMyRole(string) (Environment, int, error)
	QueryMyTeam(string) (Environment, Team, error)
}
