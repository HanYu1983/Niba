package sample;

import domain.Damage.DamageType;
import domain.Goal;
import domain.Machine;
import domain.World;
import domain.World.createEmptyWorld;

/**
 * 範例: 「接近並攻擊」目標
 *
 * 用來示範 Goal 系統的:
 *   - composite 巢狀結構 (Sequence + Leaf)
 *   - leaf 的 init / validate / tick 生命週期
 *   - validate 失敗 → reinit → 繼續執行的循環
 *   - leaf 在 leafState 上自管欄位
 *
 * 由於沒有實際戰鬥系統, leaf 內部用 leafState 上的計數器模擬:
 *   - approach: 共需 2 個 tick 抵達; 第 1 個 tick 之後 validate 會失敗一次,
 *               觸發 reinit, 之後重新累積 2 個 tick 完成
 *   - meleeStrike: 1 個 tick 完成揮刀
 */
class GoalDemo {
	/** Mock 機體, 此處只為填 GoalContext.actor */
	public static final mockActor:Machine = {
		id: "demo_actor",
		name: "Demo Actor",
		position: {x: 0.0, y: 0.0},
		facing: 0.0,
		maxHp: 100.0,
		maxEnergy: 100.0,
		energyRegen: 1.0,
		defense: {weights: new Map<DamageType, Float>()},
		weapons: [],
		skills: []
	};

	/** Mock 世界, 由 createEmptyWorld 建空世界後放入 mockActor */
	public static final mockWorld:World = createMockWorld();

	private static function createMockWorld():World {
		var world = createEmptyWorld();
		world.machines.push(mockActor);
		return world;
	}

	/**
	 * 接近 leaf
	 * leafState 欄位:
	 *   - ticks:   累積 tick 計數
	 *   - blocked: 路徑是否曾被阻擋過 (跨 reinit 保留)
	 */
	public static final approach:LeafBehavior = {
		name: "Approach",
		initialize: (ctx, state) -> {
			trace('  [Approach] initialize: 規劃路徑');
			state.ticks = 0;
			if (state.blocked == null)
				state.blocked = false;
			return true;
		},
		validate: (ctx, state) -> {
			if (state.ticks == 1 && !state.blocked) {
				trace('  [Approach] validate: 路徑被阻擋! 觸發 re-init');
				state.blocked = true;
				return false;
			}
			return true;
		},
		tick: (ctx, state, dt) -> {
			state.ticks++;
			trace('  [Approach] tick #${state.ticks}: 移動中');
			if (state.ticks >= 2) {
				trace('  [Approach] 抵達!');
				return Succeeded;
			}
			return Running;
		}
	};

	/**
	 * 揮刀 leaf
	 * leafState 欄位:
	 *   - swung: 是否已揮過
	 */
	public static final meleeStrike:LeafBehavior = {
		name: "MeleeStrike",
		initialize: (ctx, state) -> {
			trace('  [MeleeStrike] initialize: 鎖定目標');
			state.swung = false;
			return true;
		},
		validate: (ctx, state) -> true,
		tick: (ctx, state, dt) -> {
			state.swung = true;
			trace('  [MeleeStrike] tick: 揮刀!');
			return Succeeded;
		}
	};

	/** 目標規格樹: 先接近, 再揮刀 */
	public static final approachAndStrike:GoalSpec = Sequence([
		Leaf(approach),
		Leaf(meleeStrike)
	]);

	// ==================================================================
	// 以下為簡易 runtime 引擎, 純 demo 用
	// 真正的戰鬥系統會把這段替換成自己的調度邏輯
	// ==================================================================

	/** 從 spec 建立對應的 runtime node */
	public static function makeNode(spec:GoalSpec):GoalNode {
		return {
			spec: spec,
			status: Pending,
			children: [],
			activeChildIndex: 0,
			leafState: null
		};
	}

	/** status 是否為終止狀態 */
	public static function isFinal(status:GoalStatus):Bool {
		return switch (status) {
			case Succeeded | Failed(_): true;
			default: false;
		}
	}

	/**
	 * 跑一個 frame
	 * 流程:
	 *   - Pending  → 初始化 (leaf 跑 initialize, composite 建立子節點)
	 *   - Running  → leaf 走 validate-reinit-tick; composite 推進子節點
	 */
	public static function runFrame(node:GoalNode, ctx:GoalContext, dt:Float):Void {
		switch (node.status) {
			case Pending:
				switch (node.spec) {
					case Leaf(beh):
						if (node.leafState == null)
							node.leafState = {};
						if (beh.initialize(ctx, node.leafState)) {
							node.status = Running;
						} else {
							node.status = Failed(InitFailed);
						}
					case Sequence(children) | Selector(children):
						node.children = [for (c in children) makeNode(c)];
						node.activeChildIndex = 0;
						node.status = Running;
					case Custom(planner, children):
						node.children = [for (c in children) makeNode(c)];
						var idx = planner(ctx, children, -1);
						if (idx < 0) {
							node.status = Failed(ChildFailed);
						} else {
							node.activeChildIndex = idx;
							node.status = Running;
						}
				}

			case Running:
				switch (node.spec) {
					case Leaf(beh):
						if (!beh.validate(ctx, node.leafState)) {
							if (!beh.initialize(ctx, node.leafState)) {
								node.status = Failed(Invalidated);
								return;
							}
						}
						node.status = beh.tick(ctx, node.leafState, dt);

					case Sequence(_):
						var child = node.children[node.activeChildIndex];
						runFrame(child, ctx, dt);
						switch (child.status) {
							case Succeeded:
								node.activeChildIndex++;
								if (node.activeChildIndex >= node.children.length) {
									node.status = Succeeded;
								}
							case Failed(_):
								node.status = Failed(ChildFailed);
							default:
						}

					case Selector(_):
						var child = node.children[node.activeChildIndex];
						runFrame(child, ctx, dt);
						switch (child.status) {
							case Succeeded:
								node.status = Succeeded;
							case Failed(_):
								node.activeChildIndex++;
								if (node.activeChildIndex >= node.children.length) {
									node.status = Failed(ChildFailed);
								}
							default:
						}

					case Custom(planner, children):
						var child = node.children[node.activeChildIndex];
						runFrame(child, ctx, dt);
						switch (child.status) {
							case Succeeded:
								node.status = Succeeded;
							case Failed(_):
								var nextIdx = planner(ctx, children, node.activeChildIndex);
								if (nextIdx < 0) {
									node.status = Failed(ChildFailed);
								} else {
									node.activeChildIndex = nextIdx;
								}
							default:
						}
				}

			case _:
		}
	}

	/** 執行整個 demo, 印出每個 frame 的狀態 */
	public static function run():Void {
		trace("=== Goal System Demo: 接近並揮刀 ===");
		var node = makeNode(approachAndStrike);
		var ctx:GoalContext = {actor: mockActor, world: mockWorld};
		var maxFrames = 30;
		for (frame in 0...maxFrames) {
			trace('--- frame ${frame + 1} ---');
			runFrame(node, ctx, 0.1);
			trace('  root status: ${node.status}');
			if (isFinal(node.status))
				break;
		}
		trace('FINAL: ${node.status}');
	}
}
