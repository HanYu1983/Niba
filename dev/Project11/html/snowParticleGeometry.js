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
 * @return {THREE.Geometry}        [description]
 */
function create(count, size) {
  let geometry = new THREE.Geometry();
  geometry.verticesNeedUpdate = true;
  for (let i = 0; i < count; i++) {
    let position = randomRangeInRadius(size);
    geometry.vertices.push(new THREE.Vector3(
      position.x,
      position.y,
      position.z
    ));
  }
  return geometry;
}

export default {create, randomRangeInRadius, worldRadiusToBoxSize};
