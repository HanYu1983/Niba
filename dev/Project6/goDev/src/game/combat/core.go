package combat

func GetRobotAttackResult(ctx BattleComponent, robotA Robot, robotB Robot) RobotAttackPreview {
	switch styleA := robotA.GetCombatStyle(ctx).(type) {
	case SwordShieldCombatStyle:
		switch styleB := robotB.GetCombatStyle(ctx).(type) {
		case SwordShieldCombatStyle:
			var _ = styleB.Shield.GetBlockingRate(ctx)
		default:
			var _ = styleB
		}
	case SwordSwordCombatStyle:
	default:
		var _ = styleA
	}
	return RobotAttackPreview{}
}
