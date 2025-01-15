import particleGeometry from './rainParticleGeometry.js';
import * as THREE from 'three';

let particle = { elapsed: 0 };

let spectacle;

let toClearDuration = 26000;

particle.init = function (spectacleParent, params) {
  spectacle = spectacleParent;
  spectacle.rains = [];

  if (typeof params.particle.toClearDuration === 'number') {
    toClearDuration = params.particle.toClearDuration;
  }

  let count = params.particle.count;
  let length = params.particle.length;
  let size = particleGeometry.worldRadiusToBoxSize(params.world.radius);

  for (let i = 0; i < count; i++) {
    let geometry = particleGeometry.create(count, size, length);

    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: 0xdddddd,
      opacity: 0.25,
      transparent: true,
    }));

    line.overdraw = true;

    spectacle.scene.add(line);

    spectacle.rains.push(line);
  }
};

particle.startClear = function () {
  clearInterval(spectacle.particleInterval);
};

particle.start = function () {
  spectacle.particleInterval = setInterval(function () {
    // if (!SCTool.checkDisplay()) {
    //   return;
    // }
    particle.elapsed += 32;
    if (particle.elapsed > toClearDuration) {
      particle.startClear();
    }
    for (let i = 0; i < spectacle.rains.length; i++) {
      spectacle.rains[i].geometry.attributes.position.array[0 * 3 + 1] -= 2;
      spectacle.rains[i].geometry.attributes.position.array[1 * 3 + 1] -= 2;
      spectacle.rains[i].geometry.attributes.position.needsUpdate = true;
      if (spectacle.rains[i].geometry.attributes.position.array[0 * 3 + 1] < -spectacle.worldRadius) {
        let l =
          spectacle.rains[i].geometry.attributes.position.array[1 * 3 + 1] -
          spectacle.rains[i].geometry.attributes.position.array[0 * 3 + 1];
        spectacle.rains[i].geometry.attributes.position.array[0 * 3 + 1] =
          spectacle.worldRadius;
        spectacle.rains[i].geometry.attributes.position.array[1 * 3 + 1] =
          spectacle.worldRadius + l;
      }
    }
  }, 32);
};

export default particle;
