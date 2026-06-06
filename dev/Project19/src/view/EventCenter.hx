package view;

import domain.World;
import domain.World.createEmptyWorld;
import view.Camera.Camera2D;
import view.Reactive.BehaviorSubject;
import view.Reactive.Observable;
import view.Reactive.Subject;
import view.RenderWorld.RenderWorld;
import view.WorldRenderModelBuilder.createRenderWorld;

enum Event {
	OnClick(id:String);
	P5Setup(p5:Dynamic);

	/**
	 * 每個 p5 draw frame 觸發。
	 *
	 * @param frameCount p5.frameCount, 累計幀數
	 * @param deltaTime  p5.deltaTime 原值, 「上一幀開始到本幀開始」的毫秒數 (ms)
	 *                   消費端如需以秒為單位推進 (例: MovementSystem 的 position += velocity * dt),
	 *                   需自行 deltaTime / 1000
	 */
	P5Tick(frameCount:Int, deltaTime:Float);

	P5TouchStarted(x:Float, y:Float);
	P5TouchEnded;
	P5TouchMoved(x:Float, y:Float);
	P5MousePressed(x:Float, y:Float);
	P5MouseReleased;
	P5MouseMoved(x:Float, y:Float);
	P5MouseDragged(x:Float, y:Float);

	/**
	 * 鍵盤按下。
	 *
	 * @param key     原始 p5.key, 字串型別 ("a" / " " / "Enter" / "ArrowUp" 等);
	 *                可印字元就是該字元, 非可印鍵則為名稱字串
	 * @param keyCode 原始 p5.keyCode, 整數鍵盤碼 (例: 32 = 空白, 13 = Enter, 37 = ←);
	 *                以 keyCode 比對最穩定, key 在不同瀏覽器 / IME 下可能有差異
	 */
	P5KeyPressed(key:String, keyCode:Int);

	/**
	 * 鍵盤釋放。
	 *
	 * @param key     同 P5KeyPressed
	 * @param keyCode 同 P5KeyPressed
	 */
	P5KeyReleased(key:String, keyCode:Int);
}

enum Command {
	StartGame;
}

typedef P5RenderFrame = {
	var p5:Dynamic;
	var frameCount:Int;
	var renderWorld:RenderWorld;
}

/**
 * View 層事件中心。
 *
 * - eventSubject: UI / pointer 等 view event
 * - commandSubject: view 對遊戲流程提出的 command
 * - worldSubject: 外部手動呼叫 on_next(world) 推送最新 World
 * - renderWorldSubject: worldSubject 經 createRenderWorld 轉換後的 render stream
 * - p5RenderSubject: p5 setup 後, 以最新 render world 搭配後續 p5 tick 產生 render frame
 */
class EventCenter {
	public final eventSubject:Subject<Event>;
	public final commandSubject:Subject<Command>;
	public final worldSubject:BehaviorSubject<World>;
	public final renderWorldSubject:Observable<RenderWorld>;
	public final p5SetupSubject:Observable<Event>;
	public final p5TickSubject:Observable<Event>;
	public final p5RenderSubject:Observable<P5RenderFrame>;

	final camera:Null<Camera2D>;

	public function new(?camera:Camera2D) {
		this.camera = camera;
		eventSubject = new Subject<Event>();
		commandSubject = new Subject<Command>();
		worldSubject = new BehaviorSubject<World>(createEmptyWorld());
		renderWorldSubject = worldSubject.map(world -> createRenderWorld(world, this.camera));
		p5SetupSubject = eventSubject.filter(isP5Setup);
		p5TickSubject = eventSubject.filter(isP5Tick);
		p5RenderSubject = p5SetupSubject.switchMap(setupEvent -> {
			var p5 = p5FromSetupEvent(setupEvent);
			return renderWorldSubject.switchMap(renderWorld ->
				p5TickSubject.map(tickEvent -> createP5RenderFrame(p5, frameCountFromTickEvent(tickEvent), renderWorld))
			);
		});
	}

	public function nextWorld(world:World):Void {
		worldSubject.on_next(world);
	}

	static function isP5Setup(event:Event):Bool {
		return switch (event) {
			case P5Setup(_): true;
			default: false;
		}
	}

	static function isP5Tick(event:Event):Bool {
		return switch (event) {
			case P5Tick(_, _): true;
			default: false;
		}
	}

	static function p5FromSetupEvent(event:Event):Dynamic {
		return switch (event) {
			case P5Setup(setupP5):
				setupP5;
			default:
				null;
		};
	}

	static function frameCountFromTickEvent(event:Event):Int {
		return switch (event) {
			case P5Tick(tickFrameCount, _):
				tickFrameCount;
			default:
				0;
		};
	}

	static function createP5RenderFrame(p5:Dynamic, frameCount:Int, renderWorld:RenderWorld):P5RenderFrame {
		return {
			p5: p5,
			frameCount: frameCount,
			renderWorld: renderWorld
		};
	}
}
