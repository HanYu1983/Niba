package impl;

import domain.Geometry.Vec2;
import domain.Skill.Movement;
import domain.Skill.MovementType;

/**
 * 招式位移軌跡的最小實作 — 對應 Skill.MovementResolver 契約.
 *
 * 用途:
 *   注入到 MachineCurrentSkillSystem 後, 每幀依當前 step 進度 t ∈ [0, 1] 算出
 *   「相對 step 起點」的世界座標位移向量, 系統再把它加到 stepStartPosition 上.
 *
 * 目前支援:
 *   - None:        恆為 (0, 0) — 純等待 / 純武器步驟
 *   - Dash:        從起點沿 facing 方向直線推進 baseDistance × multiplier × t 世界單位
 *
 * 暫未支援 (TODO):
 *   - Arc(angle):  圓弧運動; 完整版需以「弧長 / |angle|」算半徑、圓心為起點往 facing 左/右側偏移,
 *                  並把起點對圓心的向量旋轉 t·angle 弧度求得當下位置.
 *                  本實作先 fallback 到 Dash 軌跡, 視覺上看不到弧形但能讓 system 流程跑通.
 *   - SCurve:      左右各偏一次的 S 形曲線; 完整版可用兩段相反 Arc 拼接, 同樣 fallback 到 Dash.
 *
 * 為什麼用 module-level function 而非 class:
 *   - Skill.MovementResolver 已經是函式型別, 直接寫成函式比包成 class 乾淨
 *   - 沒有狀態 / 不需 DI, 純函式易測試
 */
function simpleMovementResolver(movement:Movement, facing:Float, baseDistance:Float, t:Float):Vec2 {
	// 整段距離 (baseDistance 乘上招式倍率), 進度 t 線性等分
	var distance = baseDistance * movement.multiplier * t;
	return switch (movement.type) {
		case None:
			{x: 0.0, y: 0.0};
		case Dash:
			{
				x: distance * Math.cos(facing),
				y: distance * Math.sin(facing)
			};
		case Arc(_):
			// TODO 完整實作 Arc 軌跡 (見檔頭 doc); 暫以 Dash 形狀 fallback
			{
				x: distance * Math.cos(facing),
				y: distance * Math.sin(facing)
			};
		case SCurve:
			// TODO 完整實作 SCurve 軌跡 (見檔頭 doc); 暫以 Dash 形狀 fallback
			{
				x: distance * Math.cos(facing),
				y: distance * Math.sin(facing)
			};
	};
}
