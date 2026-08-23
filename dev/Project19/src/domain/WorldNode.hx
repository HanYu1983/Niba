package domain;

import domain.Geometry.Vec2;

/**
 * 地形類型
 * 影響移動成本與可通行性 (具體成本 / 是否可通行由 NeighborProvider 決定)
 */
enum TerrainType {
	/** 平地 */
	Plain;

	/** 崎嶇地 (移動成本較高) */
	Rough;

	/** 水域 (可選擇是否可通行) */
	Water;

	/** 牆 / 障礙 (不可通過) */
	Wall;
}

/**
 * 世界節點
 *
 * 雖然戰場世界的座標是連續的 (Vec2), 但尋路 / 圖搜尋等演算法 (A* / Dijkstra)
 * 需要將世界離散化成節點。本 enum 用 typedef-like 變體描述各種節點語意:
 *
 *   - Cell:   方格節點, 是最常見的網格化節點
 *
 * 之後若需要其他語意 (例: Door / Portal / Cover 等), 直接擴充本 enum,
 * NeighborProvider 的實作以 switch 全面比對所有 case。
 */
enum WorldNode {
	/**
	 * 方格節點
	 *   - pos:     世界座標 (通常為格子中心或左下角)
	 *   - terrain: 地形類型, 影響相鄰節點的移動成本
	 */
	Cell(pos:Vec2, terrain:TerrainType);
}

/**
 * 節點與抵達該節點的成本
 */
typedef NodeCost = {
	var node:WorldNode;
	var cost:Float;
}
