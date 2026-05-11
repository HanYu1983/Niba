package view;

import domain.World;
import rx.Observable;
import rx.Subject;
import view.Camera.Camera2D;
import view.RenderWorld.RenderWorld;
import view.WorldRenderModelBuilder.createRenderWorld;

enum Event {
	OnClick(id:String);
}

enum Command {
	StartGame;
}

/**
 * View 層事件中心。
 *
 * - eventSubject: UI / pointer 等 view event
 * - commandSubject: view 對遊戲流程提出的 command
 * - worldSubject: 外部手動呼叫 on_next(world) 推送最新 World
 * - renderWorldSubject: worldSubject 經 createRenderWorld 轉換後的 render stream
 */
class EventCenter {
	public final eventSubject:Subject<Event>;
	public final commandSubject:Subject<Command>;
	public final worldSubject:Subject<World>;
	public final renderWorldSubject:Observable<RenderWorld>;

	final camera:Null<Camera2D>;

	public function new(?camera:Camera2D) {
		this.camera = camera;
		eventSubject = new Subject<Event>();
		commandSubject = new Subject<Command>();
		worldSubject = new Subject<World>();
		renderWorldSubject = Observable.map(worldSubject, world -> createRenderWorld(world, this.camera));
	}

	public function nextWorld(world:World):Void {
		worldSubject.on_next(world);
	}
}
