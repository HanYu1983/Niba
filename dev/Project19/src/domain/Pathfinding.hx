package domain;

import domain.FieldObject;
import domain.World.NeighborProvider;
import domain.WorldNode.WorldNode;

/**
 * 目標物件篩選器
 *
 * 用於「從 A 與半徑中找到某物件」這類搜尋:
 *   - 回傳 true 代表此 FieldObject 是本次搜尋可接受的目標
 *   - 例: 找最近敵機 / 最近補給點 / id == objective_a 的 Marker
 */
typedef FieldObjectMatcher = (world:World, object:FieldObject) -> Bool;

/**
 * 場上物轉節點的解析器
 *
 * 因為世界座標是連續的, 但路徑搜尋跑在 WorldNode 上,
 * 所以搜尋物件前必須把 FieldObject.position 對應到某個 WorldNode。
 *
 * 回傳 null 表示該物件目前無法對應到可搜尋節點
 * (例: 在地圖外 / 在不可通行區 / 尚未生成地圖節點)。
 */
typedef FieldObjectNodeResolver = (world:World, object:FieldObject) -> Null<WorldNode>;

/**
 * 最短路徑樹中的單一節點紀錄
 *
 * previous:
 *   從 start 走到 node 的最短已知前驅節點。
 *   start 自身 previous = null。
 */
typedef ShortestPathTreeEntry = {
	var node:WorldNode;
	var costFromStart:Float;
	var ?previous:WorldNode;
}

/**
 * 最短路徑樹
 *
 * 這不是單一路徑, 而是搜尋過程得到的一棵樹:
 *   - entries 裡每個節點都記錄從 start 抵達它的最小成本與前驅節點
 *   - 若 target != null, 可透過 previous 反推 start -> target 的路徑
 *
 * treeCostLimit:
 *   若搜尋有半徑 / 成本上限, 記錄在此欄位; 無上限則為 null。
 */
typedef ShortestPathTree = {
	var start:WorldNode;
	var ?target:WorldNode;
	var entries:Array<ShortestPathTreeEntry>;
	var ?treeCostLimit:Float;
}

/**
 * 從樹中解出的具體路徑
 *
 * path:
 *   由 start 到 target 的節點序列; 若沒有合法路徑, path 為 []。
 */
typedef PathResult = {
	var found:Bool;
	var path:Array<WorldNode>;
	var cost:Float;
	var tree:ShortestPathTree;
}

/**
 * 在半徑內搜尋某個場上物的結果
 *
 * object:
 *   找到的目標物件; found=false 時為 null。
 *
 * objectNode:
 *   目標物件對應到的 WorldNode; found=false 時為 null。
 */
typedef FieldObjectPathResult = {
	var found:Bool;
	var ?object:FieldObject;
	var ?objectNode:WorldNode;
	var path:Array<WorldNode>;
	var cost:Float;
	var tree:ShortestPathTree;
}

/**
 * 路徑搜尋介面
 *
 * 設計重點:
 *   - NeighborProvider 的第一參數是 World, 因此成本計算是全息的:
 *     可以依機體佔位、發射物、碰撞箱、動態障礙、威脅區等調整鄰居與成本。
 *   - 回傳的是 ShortestPathTree, 不是只回傳單一路徑。
 *     這讓上層可以重用搜尋結果: 例如同一棵樹同時找最近目標、撤退點、掩體等。
 *   - 實作可使用 Dijkstra / A* / Jump Point Search 等演算法, 介面不限制。
 */
interface IPathfinder {
	/**
	 * 從 start 到 target 取得最短路徑樹。
	 *
	 * 常見實作:
	 *   - 若只需要 start -> target, 可在 target 被確定最短後提早停止
	 *   - 仍需回傳包含已展開節點的 ShortestPathTree, 方便除錯 / 重用
	 */
	public function findShortestPathTree(
		world:World,
		neighbors:NeighborProvider,
		start:WorldNode,
		target:WorldNode
	):PathResult;

	/**
	 * 從 start 出發, 在 maxCost 半徑 / 成本範圍內找符合 matcher 的最近場上物,
	 * 並回傳到該物件對應節點的最短路徑樹。
	 *
	 * 搜尋範圍:
	 *   - maxCost 是圖上的累積移動成本, 不一定等同幾何距離
	 *   - 實作通常先展開 start 周圍 maxCost 內的最短路徑樹,
	 *     再從 WorldQuery.getFieldObjects(world) 中篩選 matcher=true 的物件,
	 *     用 resolveObjectNode 對應節點後挑最低成本者
	 *
	 * 若找不到:
	 *   - found=false
	 *   - object / objectNode 為 null
	 *   - tree 仍應包含已展開的節點, 讓上層知道「搜過哪裡但無結果」
	 */
	public function findNearestObjectPathTree(
		world:World,
		neighbors:NeighborProvider,
		start:WorldNode,
		maxCost:Float,
		matcher:FieldObjectMatcher,
		resolveObjectNode:FieldObjectNodeResolver
	):FieldObjectPathResult;
}
