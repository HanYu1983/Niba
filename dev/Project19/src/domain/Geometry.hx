package domain;

/** 二維向量 (位置 / 方向) */
typedef Vec2 = {
	var x:Float;
	var y:Float;
}

/** 三維向量 (3D 位置 / 相機位置) */
typedef Vec3 = {
	var x:Float;
	var y:Float;
	var z:Float;
}

/**
 * 碰撞形狀
 * 招式 hitbox / 爆炸範圍 / 場域等需要碰撞判定的場合共用
 *
 * 座標慣例 (本機座標, 與 MovementResolver 共用):
 *   定義時假設機體 facing = 0 (面朝 +X), x 為機體前方, y 為機體左側 (逆時針正)
 *   實際碰撞前需經 ShapeResolver 旋轉/位移到世界座標
 *
 * 之後若要新增多邊形 / 膠囊 / 扇形等, 直接擴充本 enum 即可,
 * 戰鬥系統的碰撞偵測模組以 switch 全面比對所有 case
 */
enum Shape {
	/** 矩形: 以左上角 (x, y) 為基準, 加上寬高 */
	Rect(x:Float, y:Float, width:Float, height:Float);

	/** 圓形: 以圓心 (x, y) 為基準, 加上半徑 */
	Circle(x:Float, y:Float, radius:Float);
}

/**
 * 把任意弧度值 wrap 到 [-π, π] 區間的正規化。
 *
 * 用途:
 *   - 計算「兩個朝向之間的最短夾角」: normalizeAngle(desired - current) 可以拿到
 *     有號短弧 (正值代表逆時針轉, 負值代表順時針轉), 避免 naive 相減出 ±2π 等繞遠路
 *   - HomingSystem 等轉向系統把 turn step clamp 到 turnRate * dt 之前, 必須先正規化
 *     delta, 否則「從 +170° 想轉到 -170°」會被 clamp 在錯誤的方向 (340° 繞一大圈)
 *
 * 演算:
 *   theta - 2π * floor((theta + π) / (2π))
 *   等價於對 (2π) 做 floored modulo 後再平移到 [-π, π]
 *
 * 邊角:
 *   - 輸入 NaN / Infinity 結果同樣 NaN / 異常, 呼叫端自行避免
 *   - 不假設輸入範圍 (任意大 / 小皆可); 內部用一次 floor 直接歸位, 不用迴圈
 */
inline function normalizeAngle(theta:Float):Float {
	var twoPi = 2.0 * Math.PI;
	return theta - twoPi * Math.floor((theta + Math.PI) / twoPi);
}

/**
 * 碰撞形狀的世界座標解析函式型別 (遊戲規則: 相對機體朝向)
 *
 * 規則:
 *   Shape 內的座標 (Rect 的 x/y, Circle 的 x/y) 為「本機座標」,
 *   定義時假設機體位於原點且 facing = 0 (面朝 +X)。
 *   實際碰撞偵測前必須:
 *     1. 依機體當下的 facing 將 Shape 的座標旋轉到世界方向
 *     2. 再以機體當下位置 origin 平移到世界座標
 *
 *   例子:
 *     - 機體 facing = 0    → Rect(2, -0.5, 1, 1) 表示「機體正前方 2 單位處的方塊」
 *     - 機體 facing = π/2  → 同樣 Rect 經 ShapeResolver 後落在機體 +Y 方向 2 單位處
 *
 * 輸入:
 *   - local:   原始 Shape (本機座標)
 *   - origin:  機體當下位置 (世界座標)
 *   - facing:  機體當下弧度
 *
 * 輸出:
 *   已轉換到世界座標的 Shape
 *   實作上 Rect 經旋轉後可能不再 axis-aligned, 解析器可選擇:
 *     a) 包成包圍盒 (AABB) 回傳 → 簡單但較不精確
 *     b) 改回傳 OBB / 多邊形 → 精確 (需擴充 Shape enum)
 *   本契約僅約束「輸入本機 / 輸出世界」, 精度策略由實作端決定
 */
typedef ShapeResolver = (local:Shape, origin:Vec2, facing:Float) -> Shape;
