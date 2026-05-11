package view;

import domain.Geometry.Vec2;
import view.Matrix2D.Mat3;
import view.Matrix2D.multiply;
import view.Matrix2D.rotation;
import view.Matrix2D.scale;
import view.Matrix2D.translation;

/**
 * 2D camera for render projection.
 *
 * viewportWidth / viewportHeight 以輸出像素為單位; zoom 表示每世界單位對應多少像素。
 */
typedef Camera2D = {
	var position:Vec2;
	var rotation:Float;
	var zoom:Float;
	var viewportWidth:Float;
	var viewportHeight:Float;
}

function createDefaultCamera(viewportWidth:Float = 800.0, viewportHeight:Float = 600.0):Camera2D {
	return {
		position: {x: 0.0, y: 0.0},
		rotation: 0.0,
		zoom: 1.0,
		viewportWidth: viewportWidth,
		viewportHeight: viewportHeight
	};
}

/**
 * world -> camera space。
 */
function createViewMatrix(camera:Camera2D):Mat3 {
	return multiply(
		scale(camera.zoom, camera.zoom),
		multiply(rotation(-camera.rotation), translation(-camera.position.x, -camera.position.y))
	);
}

/**
 * camera space -> screen space。
 *
 * 第一版只把 camera origin 移到 viewport 中心; 之後若切換 WebGL / NDC 可替換此矩陣。
 */
function createProjectionMatrix(camera:Camera2D):Mat3 {
	return translation(camera.viewportWidth * 0.5, camera.viewportHeight * 0.5);
}

function createViewProjectionMatrix(camera:Camera2D):Mat3 {
	return multiply(createProjectionMatrix(camera), createViewMatrix(camera));
}
