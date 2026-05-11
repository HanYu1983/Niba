package view;

import domain.World;
import view.Camera.Camera2D;
import view.Reactive.Observable;
import view.Reactive.Subject;
import view.RenderWorld.RenderWorld;
import view.WorldRenderModelBuilder.createRenderWorld;

enum Event {
	OnClick(id:String);
	P5Setup(p5:Dynamic);
	P5Tick(frameCount:Int);
	P5TouchStarted(x:Float, y:Float);
	P5TouchEnded;
	P5TouchMoved(x:Float, y:Float);
	P5MousePressed(x:Float, y:Float);
	P5MouseReleased;
	P5MouseMoved(x:Float, y:Float);
	P5MouseDragged(x:Float, y:Float);
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
 * - p5RenderSubject: p5 setup + p5 tick + render world 的 combineLatest 結果
 */
class EventCenter {
	public final eventSubject:Subject<Event>;
	public final commandSubject:Subject<Command>;
	public final worldSubject:Subject<World>;
	public final renderWorldSubject:Observable<RenderWorld>;
	public final p5SetupSubject:Observable<Event>;
	public final p5TickSubject:Observable<Event>;
	public final p5RenderSubject:Observable<P5RenderFrame>;

	final camera:Null<Camera2D>;

	public function new(?camera:Camera2D) {
		this.camera = camera;
		eventSubject = new Subject<Event>();
		commandSubject = new Subject<Command>();
		worldSubject = new Subject<World>();
		renderWorldSubject = Observable.map(worldSubject, world -> createRenderWorld(world, this.camera));
		p5SetupSubject = Observable.filter(eventSubject, isP5Setup);
		p5TickSubject = Observable.filter(eventSubject, isP5Tick);
		p5RenderSubject = Observable.combineLatest(
			cast p5SetupSubject,
			[cast p5TickSubject, cast renderWorldSubject],
			values -> createP5RenderFrame(cast values)
		);
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
			case P5Tick(_): true;
			default: false;
		}
	}

	static function createP5RenderFrame(values:Array<Dynamic>):P5RenderFrame {
		var p5:Dynamic = null;
		var frameCount = 0;

		switch ((values[0] : Event)) {
			case P5Setup(setupP5):
				p5 = setupP5;
			default:
		}

		switch ((values[1] : Event)) {
			case P5Tick(tickFrameCount):
				frameCount = tickFrameCount;
			default:
		}

		return {
			p5: p5,
			frameCount: frameCount,
			renderWorld: cast values[2]
		};
	}
}
