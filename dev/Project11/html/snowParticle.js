import particleGeometry from './snowParticleGeometry.js';

let particle = {elapsed: 0};

let spectacle;

let toClearDuration = 26000;

particle.init = function(spectacleParent, params) {
  spectacle = spectacleParent;

  if (typeof params.particle.toClearDuration === 'number') {
    toClearDuration = params.particle.toClearDuration;
  }

  let count = params.particle.count;
  let size = particleGeometry.worldRadiusToBoxSize(params.world.radius);
  let mapUrl = SCTool.replaceGDomain(params.particle.map);
  let material = new THREE.PointsMaterial({
    // 一つ一つのサイズ
    size: params.particle.size,
    transparent: true,
    blending: THREE.NormalBlending,
    depthTest: false,
    // 色
    map: new THREE.TextureLoader().load(mapUrl),
  });

  let geometry = particleGeometry.create(count, size);

  let mesh = new THREE.Points(geometry, material);

  spectacle.scene.add(mesh);
  spectacle.particleGeometry = geometry;
  spectacle.snowMaterial = material;
};

particle.startClear = function() {
  clearInterval(SCSpectacle.spectacle.particleInterval);
};

particle.start = function() {
  spectacle.particleInterval = setInterval(function() {
    if (!SCTool.checkDisplay()) {
      return;
    }
    particle.elapsed += 32;
    if (particle.elapsed > toClearDuration) {
      particle.startClear();
    }
    for (let i=0; i<spectacle.particleGeometry.vertices.length; i++) {
      spectacle.particleGeometry.vertices[i].
        setY(spectacle.particleGeometry.vertices[i].y - 0.1);
      spectacle.particleGeometry.verticesNeedUpdate = true;
      if (spectacle.particleGeometry.vertices[i].y < -spectacle.worldRadius) {
        spectacle.particleGeometry.vertices[i].setY(
          spectacle.particleGeometry.vertices[i].y * -1
        );
      }
    }
  }, 32);
};

export default particle;
