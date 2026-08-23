package debug;

import domain.World;
import domain.World.NeighborProvider;
import domain.WorldNode.NodeCost;
import domain.WorldNode.TerrainType;
import domain.WorldNode.WorldNode;

/** 預設格子間距 (世界座標單位) */
final CELL_STEP = 100.0;

/**
 * 基本鄰居提供器 - NeighborProvider 的最簡實作 (放在 debug/ 純供測試用)
 *
 * 規則:
 *   - 僅處理 WorldNode.Cell, 其他變體 (未來新增的 Door / Portal 等) 在此版本不展開鄰居
 *   - 4 連通: 上下左右各 CELL_STEP 單位 (預設 100)
 *   - 所有鄰居一律標為 Plain 地形
 *   - 成本 = CELL_STEP (即一格距離)
 *
 * 此版本不檢查:
 *   - 地圖邊界
 *   - 不可通行格 (Wall / Water 等)
 *   - 機體佔位 / 動態障礙
 *
 * NeighborProvider 第一參數 world 預留作全息成本來源, 此基本版未使用;
 * 後續可寫帶地圖資料 / 動態避障的版本, 直接替換成另一個 NeighborProvider 即可。
 */
function basicNeighborProvider(world:World, node:WorldNode):Array<NodeCost> {
	return switch (node) {
		case Cell(pos, _): [
				{node: Cell({x: pos.x + CELL_STEP, y: pos.y}, Plain), cost: CELL_STEP},
				{node: Cell({x: pos.x - CELL_STEP, y: pos.y}, Plain), cost: CELL_STEP},
				{node: Cell({x: pos.x, y: pos.y + CELL_STEP}, Plain), cost: CELL_STEP},
				{node: Cell({x: pos.x, y: pos.y - CELL_STEP}, Plain), cost: CELL_STEP},
			];
	}
}
