import { loadTexture } from './lib/tool';
import particlePng from './assets/particle.png';

export async function createExplosion(globalVar, x, y) {
  const particleTexture = await loadTexture(particlePng);
  const emitter = new window.PIXI.particles.Emitter(
    globalVar.container,
    window.PIXI.particles.upgradeConfig({
      "lifetime": { "min": 0.2, "max": 0.5 },
      "frequency": 0.001,
      "emitterLifetime": 0.2,
      "maxParticles": 20,
      "pos": { "x": x, "y": y },
      "addAtBack": false,
      "behaviors": [
        {
          "type": "alpha",
          "config": {
            "alpha": {
              "list": [
                { "time": 0, "value": 1 },
                { "time": 1, "value": 0 }
              ]
            }
          }
        },
        {
          "type": "scale",
          "config": {
            "scale": {
              "list": [
                { "time": 0, "value": 0.5 },
                { "time": 1, "value": 0.1 }
              ]
            }
          }
        },
        {
          "type": "color",
          "config": {
            "color": {
              "list": [
                { "time": 0, "value": "ffaa00" },
                { "time": 1, "value": "ff0000" }
              ]
            }
          }
        },
        {
          "type": "moveSpeed",
          "config": {
            "speed": {
              "list": [
                { "time": 0, "value": 200 },
                { "time": 1, "value": 50 }
              ]
            }
          }
        },
        {
          "type": "rotationStatic",
          "config": {
            "min": 0,
            "max": 360
          }
        },
        {
          "type": "spawnShape",
          "config": {
            "type": "torus",
            "data": {
              "x": 0,
              "y": 0,
              "radius": 10,
              "innerRadius": 0,
              "affectRotation": false
            }
          }
        }
      ]
    }, [particleTexture])
  );

  emitter.emit = true;
  const explosionObj = { emitter, elapsed: Date.now() };
  globalVar.collections.explosions.push(explosionObj);

  const updateHandler = () => {
    const now = Date.now();
    emitter.update((now - explosionObj.elapsed) * 0.001);
    explosionObj.elapsed = now;

    if (!emitter.emit && emitter.particleCount === 0) {
      removeExplosion(globalVar, explosionObj, updateHandler);
    }
  };

  globalVar.emitter.on('onTicker', updateHandler);
}

function removeExplosion(globalVar, explosionObj, handler) {
  const index = globalVar.collections.explosions.indexOf(explosionObj);
  if (index !== -1) {
    globalVar.collections.explosions.splice(index, 1);
  }
  explosionObj.emitter.destroy();
  globalVar.emitter.off('onTicker', handler);
}
