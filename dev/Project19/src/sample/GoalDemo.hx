package sample;

import domain.Goal;
import domain.Machine;
import domain.Machine.createEmptyMachine;
import domain.World;
import domain.World.createEmptyWorld;
import domain.World.findMachineById;

/**
 * 範例: 「接近並攻擊」目標
 *
 * 用來示範 Goal 系統的:
 *   - composite 巢狀結構 (Sequence + Leaf)
 *   - LeafBehavior 僅持有 name, runtime 透過 LeafFactory 取得實際生命週期函式
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
	public static final mockActor:Machine = createMockActor();

	private static function createMockActor():Machine {
		var actor = createEmptyMachine();
		actor.id = "demo_actor";
		actor.name = "Demo Actor";
		actor.maxHp = 100.0;
		actor.maxEnergy = 100.0;
		actor.energyRegen = 1.0;
		return actor;
	}

	/** Mock 世界, 由 createEmptyWorld 建空世界後放入 mockActor */
	public static final mockWorld:World = createMockWorld();

	private static function createMockWorld():World {
		var world = createEmptyWorld();
		world.machines.push(mockActor);
		return world;
	}

	/**
	 * 接近 leaf 的生命週期
	 * leafState 欄位:
	 *   - actorId: 執行此 leaf 的機體 id (由 makeNode 注入)
	 *   - ticks:   累積 tick 計數
	 *   - blocked: 路徑是否曾被阻擋過 (跨 reinit 保留)
	 */
	public static final approachLifecycle:LeafLifecycle = {
		initialize: (ctx, state) -> {
			var actor = findMachineById(ctx.world, state.actorId);
			if (actor == null) {
				trace('  [Approach] initialize: actor "${state.actorId}" 不存在, 放棄');
				return false;
			}
			trace('  [Approach] initialize: actor=${actor.name} 規劃路徑');
			state.ticks = 0;
			if (state.blocked == null)
				state.blocked = false;
			return true;
		},
		validate: (ctx, state) -> {
			if (findMachineById(ctx.world, state.actorId) == null) {
				trace('  [Approach] validate: actor "${state.actorId}" 不存在');
				return false;
			}
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
	 * 揮刀 leaf 的生命週期
	 * leafState 欄位:
	 *   - actorId: 執行此 leaf 的機體 id (由 makeNode 注入)
	 *   - swung:   是否已揮過
	 */
	public static final meleeStrikeLifecycle:LeafLifecycle = {
		initialize: (ctx, state) -> {
			var actor = findMachineById(ctx.world, state.actorId);
			if (actor == null) {
				trace('  [MeleeStrike] initialize: actor "${state.actorId}" 不存在, 放棄');
				return false;
			}
			trace('  [MeleeStrike] initialize: actor=${actor.name} 鎖定目標');
			state.swung = false;
			return true;
		},
		validate: (ctx, state) -> findMachineById(ctx.world, state.actorId) != null,
		tick: (ctx, state, dt) -> {
			state.swung = true;
			trace('  [MeleeStrike] tick: 揮刀!');
			return Succeeded;
		}
	};

	/**
	 * Demo 用的 LeafFactory: 依名稱回傳上面預設的 lifecycle。
	 * 找不到名稱時直接 throw, 避免靜默忽略設定錯誤。
	 */
	public static function leafFactory(name:String):LeafLifecycle {
		return switch (name) {
			case "Approach": approachLifecycle;
			case "MeleeStrike": meleeStrikeLifecycle;
			case _: throw 'GoalDemo.leafFactory: unknown leaf "$name"';
		}
	}

	/**
	 * Demo 用的 PlannerFactory。
	 * 此 demo 不使用 Custom composite, 但仍提供一個保底實作以滿足 runFrame 簽名。
	 */
	public static function plannerFactory(name:String):GoalPlanner {
		return switch (name) {
			case _: throw 'GoalDemo.plannerFactory: unknown planner "$name"';
		}
	}

	/** 目標規格樹: 先接近, 再揮刀 (純資料, 不含函式) */
	public static final approachAndStrike:GoalSpec = Sequence([
		Leaf({name: "Approach"}),
		Leaf({name: "MeleeStrike"})
	]);

	/** 執行整個 demo, 印出每個 frame 的狀態 (runtime engine 取自 domain.Goal) */
	public static function run():Void {
		trace("=== Goal System Demo: 接近並揮刀 ===");
		var node = makeNode(approachAndStrike, {actorId: mockActor.id});
		var ctx:GoalContext = {world: mockWorld};
		var maxFrames = 30;
		for (frame in 0...maxFrames) {
			trace('--- frame ${frame + 1} ---');
			runFrame(node, ctx, 0.1, leafFactory, plannerFactory);
			trace('  root status: ${node.status}');
			if (isFinal(node.status))
				break;
		}
		trace('FINAL: ${node.status}');
	}
}
