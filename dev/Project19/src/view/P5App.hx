package view;

import js.Syntax;
import view.EventCenter.Event;

/**
 * 建立 p5.js app, 並把 p5 lifecycle / pointer event 送進 EventCenter.eventSubject。
 *
 * p5.js 需先以 script 載入到 window.p5。
 */
function createP5App(eventCenter:EventCenter, canvasParentId:String = "canvas"):Void {
	Syntax.code("new p5({0}, {1})", function(p:Dynamic) {
		p.setup = function() {
			p.createCanvas(800, 600);
			p.frameRate(60);
			eventCenter.eventSubject.on_next(P5Setup(p));
		};

		p.draw = function() {
			eventCenter.eventSubject.on_next(P5Tick(p.frameCount, p.deltaTime));
		};

		p.touchStarted = function() {
			var touch = firstTouch(p);
			if (touch == null)
				return;

			eventCenter.eventSubject.on_next(P5TouchStarted(touch.x, touch.y));
		};

		p.touchEnded = function() {
			eventCenter.eventSubject.on_next(P5TouchEnded);
		};

		p.touchMoved = function() {
			var touch = firstTouch(p);
			if (touch == null)
				return;

			eventCenter.eventSubject.on_next(P5TouchMoved(touch.x, touch.y));
		};

		p.mousePressed = function() {
			eventCenter.eventSubject.on_next(P5MousePressed(p.mouseX, p.mouseY));
		};

		p.mouseReleased = function() {
			eventCenter.eventSubject.on_next(P5MouseReleased);
		};

		p.mouseMoved = function() {
			eventCenter.eventSubject.on_next(P5MouseMoved(p.mouseX, p.mouseY));
		};

		p.mouseDragged = function() {
			eventCenter.eventSubject.on_next(P5MouseDragged(p.mouseX, p.mouseY));
		};

		p.keyPressed = function() {
			eventCenter.eventSubject.on_next(P5KeyPressed(p.key, p.keyCode));
		};

		p.keyReleased = function() {
			eventCenter.eventSubject.on_next(P5KeyReleased(p.key, p.keyCode));
		};
	}, canvasParentId);
}

private function firstTouch(p:Dynamic):Dynamic {
	if (p.touches.length == 0)
		return null;

	return p.touches[0];
}
