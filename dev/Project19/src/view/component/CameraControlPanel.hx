package view.component;

import view.EventCenter;
import view.EventCenter.Event;

/**
 * 測試用控制板。
 *
 * 在 P5Setup 後建立 camera x/y/z 的 +/- 按鈕, 點擊後送出 OnClick(id)。
 */
function createCameraControlPanel(eventCenter:EventCenter, parentId:String = "canvas"):Void {
	eventCenter.p5SetupSubject.subscribe(event -> {
		switch (event) {
			case P5Setup(p5):
				createPanel(p5, eventCenter, parentId);
			default:
		}
	});
}

private function createPanel(p5:Dynamic, eventCenter:EventCenter, parentId:String):Void {
	var panel = p5.createDiv("Camera");
	panel.parent(parentId);
	panel.style("position", "absolute");
	panel.style("left", "12px");
	panel.style("top", "12px");
	panel.style("padding", "8px");
	panel.style("background", "rgba(0, 0, 0, 0.55)");
	panel.style("color", "#fff");
	panel.style("font-family", "sans-serif");

	createButton(p5, panel, eventCenter, "X-", "camera-x-dec");
	createButton(p5, panel, eventCenter, "X+", "camera-x-inc");
	createButton(p5, panel, eventCenter, "Y-", "camera-y-dec");
	createButton(p5, panel, eventCenter, "Y+", "camera-y-inc");
	createButton(p5, panel, eventCenter, "Z-", "camera-z-dec");
	createButton(p5, panel, eventCenter, "Z+", "camera-z-inc");
}

private function createButton(p5:Dynamic, panel:Dynamic, eventCenter:EventCenter, label:String, id:String):Void {
	var button = p5.createButton(label);
	button.parent(panel);
	button.style("margin", "4px");
	button.mousePressed(() -> eventCenter.eventSubject.on_next(OnClick(id)));
}
