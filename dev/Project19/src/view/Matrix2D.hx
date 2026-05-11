package view;

import domain.Geometry.Vec2;

/**
 * 2D affine matrix, 使用 3x3 表示以便之後銜接 MVP 流程。
 *
 * 向量以 column vector 視角計算:
 *   x' = m00*x + m01*y + m02
 *   y' = m10*x + m11*y + m12
 */
typedef Mat3 = {
	var m00:Float;
	var m01:Float;
	var m02:Float;
	var m10:Float;
	var m11:Float;
	var m12:Float;
	var m20:Float;
	var m21:Float;
	var m22:Float;
}

function identity():Mat3 {
	return {
		m00: 1.0, m01: 0.0, m02: 0.0,
		m10: 0.0, m11: 1.0, m12: 0.0,
		m20: 0.0, m21: 0.0, m22: 1.0
	};
}

function translation(x:Float, y:Float):Mat3 {
	return {
		m00: 1.0, m01: 0.0, m02: x,
		m10: 0.0, m11: 1.0, m12: y,
		m20: 0.0, m21: 0.0, m22: 1.0
	};
}

function rotation(radians:Float):Mat3 {
	var c = Math.cos(radians);
	var s = Math.sin(radians);

	return {
		m00: c, m01: -s, m02: 0.0,
		m10: s, m11: c, m12: 0.0,
		m20: 0.0, m21: 0.0, m22: 1.0
	};
}

function scale(x:Float, y:Float):Mat3 {
	return {
		m00: x, m01: 0.0, m02: 0.0,
		m10: 0.0, m11: y, m12: 0.0,
		m20: 0.0, m21: 0.0, m22: 1.0
	};
}

function multiply(a:Mat3, b:Mat3):Mat3 {
	return {
		m00: a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20,
		m01: a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21,
		m02: a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22,
		m10: a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20,
		m11: a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21,
		m12: a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22,
		m20: a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20,
		m21: a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21,
		m22: a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22
	};
}

function transformPoint(matrix:Mat3, point:Vec2):Vec2 {
	return {
		x: matrix.m00 * point.x + matrix.m01 * point.y + matrix.m02,
		y: matrix.m10 * point.x + matrix.m11 * point.y + matrix.m12
	};
}
