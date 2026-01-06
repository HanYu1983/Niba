import * as THREE from 'three';

/**
 * 360度球体の半径からパーティクルエミッタの箱のサイズへの変換。単純に2倍。
 * @param  {Number} radius 360度球体の半径
 * @return {Number}        パーティクルエミッタの箱のサイズ
 */
function worldRadiusToBoxSize(radius) {
  return radius * 2;
}

/**
 * 箱内で配置する
 * @param  {Number} size 箱のサイズ
 * @return {Object<x,y,z>} x,y,zオブジェクト
 */
function randomRangeInRadius(size) {
  return {
    x: size * (Math.random() - 0.5),
    y: size * (Math.random() - 0.5),
    z: size * (Math.random() - 0.5),
  };
}

/**
 * パーティクルの位置をランダムに配置する
 * @param  {Number} count  パーティクル数
 * @param  {Number} size 箱のサイズ
 * @param  {Number} length 雨の長さ
 * @return {THREE.Geometry}        [description]
 */
function create(count, size, length) {
  let geometry = new THREE.BufferGeometry();
  geometry.verticesNeedUpdate = true;
  let position = randomRangeInRadius(size);
  let vec = new THREE.Vector3(
    position.x,
    position.y,
    position.z
  );
  let vec2 = vec.clone();
  vec2.y += length;
  const vertices = new Float32Array([vec.x, vec.y, vec.z, vec2.x, vec2.y, vec2.z]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  return geometry;
}

export default { create, randomRangeInRadius, worldRadiusToBoxSize };
