package domain;

/**
 * 傷害屬性類型
 * 同時也是 DefenseProfile.weights 的 key
 * 例如: 防火 100、防電 20 即以 Fire / Electric 為 key
 */
enum DamageType {
	Physical;
	Fire;
	Electric;
	Ice;
	Energy;
	Explosion;
}

/**
 * 單筆傷害指令
 * 由發射物 / 命中效果產生, 最終由 IDamageable 套用
 */
typedef Damage = {
	var type:DamageType;
	var amount:Float;
}

/**
 * 機體的防禦比重檔案
 * weights 範例: [Fire => 100, Electric => 20]
 * 實際折抵公式 (例: amount * (1 - w/100)) 留給戰鬥系統
 */
typedef DefenseProfile = {
	var weights:Map<DamageType, Float>;
}
