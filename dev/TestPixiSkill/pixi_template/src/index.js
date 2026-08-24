import { loadTexture, loadSpritesheet, loadSpine, loadVideo, loadGifSprite, loadAnimatedWebP, loadAnimatedAPNG, baseXToObjectURL } from './lib/tool';
import bg from './assets/bg.jpg';
import texture from './assets/texture.png';
import textureJson from './assets/texture.json';
import atlas1015001201DataUrl from './assets/1015001201_kuuga_battle.atlas';
import texture1015001201DataUrl from './assets/1015001201_kuuga_battle.png';
import skel1015001201DataUrl from './assets/1015001201_kuuga_battle.skel';
import avifImage from './assets/output_h264-ezgif.com-video-to-avif-converter.avif';
import testVideo from './assets/test.mp4';
import testGif from './assets/eglite.gif';
import testWebp from './assets/animated-webp-supported.webp';
import testApng from './assets/elephant.png';
import test265 from './assets/shoot_02_video_only_500kb.mp4'
import testWebm from './assets/file_example_WEBM_480_900KB.webm'
import testHvc1 from './assets/shoot_02_hvc1_small.mp4'
import particlePng from './assets/particle.png';
import firePng from './assets/Fire.png';
import emitterJson from './assets/emitter.json';

main().catch(console.error);

async function test() {
  const networkPlugin = await window.app.networkPlugin
  networkPlugin.onAssetsLoaded()

  const app = new window.PIXI.Application();
  await app.init({
    view: document.getElementById('game-canvas'),
    width: 400,
    height: 400,
    backgroundColor: 0x000000
  });
  app.stage.sortableChildren = true;

  const text = new window.PIXI.Text(`0`, { fontSize: 20, fill: 0xFFFFFF });
  text.position.set(100, 100);
  app.stage.addChild(text);

  const interval = setInterval(() => {
    text.text = String(parseInt(text.text) + 1);
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
  }, 10000);

  addTestCtaPress()
  addTestRetry()
}

async function main() {
  try {
    const networkPlugin = await window.app.networkPlugin
    networkPlugin.onAssetsLoaded()
    addTestCtaPress()
    addTestRetry()

    const app = new window.PIXI.Application();
    await app.init({
      view: document.getElementById('game-canvas'),
      width: 400,
      height: 400,
      backgroundColor: 0x000000
    });
    app.stage.sortableChildren = true;

    const bgSprite = new window.PIXI.Sprite(await loadTexture(bg));
    bgSprite.width = 400;
    bgSprite.height = 400;
    app.stage.addChild(bgSprite);

    const sheet = await loadSpritesheet(await loadTexture(texture), textureJson);
    const sprite = new window.PIXI.Sprite(sheet.textures['logo_01_01 x-15 y407.png']);
    sprite.width = 100;
    sprite.height = 100;
    app.stage.addChild(sprite);

    const gaman = await loadSpine({ atlasDataUrl: atlas1015001201DataUrl, textureDataUrl: texture1015001201DataUrl, skelDataUrl: skel1015001201DataUrl });
    gaman.scale.set(0.1);
    gaman.position.set(100, 100);
    gaman.state.setAnimation(0, "skill_R", true);
    app.stage.addChild(gaman);

    // no animation
    try {
      const avifImageAsset = await PIXI.Assets.load(avifImage);
      const avifImageSprite = new window.PIXI.Sprite(avifImageAsset);
      avifImageSprite.width = 100;
      avifImageSprite.height = 100;
      avifImageSprite.position.set(300, 100);
      app.stage.addChild(avifImageSprite);
    } catch (error) {
      alert('avifImageAsset error');
      alert(error.message);
    }

    // ok
    try {
      const video = await loadVideo(testVideo);
      const videoTexture = PIXI.Texture.from(video);
      const videoSprite = new PIXI.Sprite(videoTexture);
      videoSprite.width = 100;
      videoSprite.height = 100;
      videoSprite.position.set(300, 300);
      app.stage.addChild(videoSprite);
    } catch (error) {
      alert('video error');
      alert(error.message);
    }

    // ok
    try {
      const gifSprite = await loadGifSprite(testGif);
      gifSprite.width = 100;
      gifSprite.height = 100;
      gifSprite.position.set(200, 200);
      app.stage.addChild(gifSprite);
    } catch (error) {
      alert('gifSprite error');
      alert(error.message);
    }

    try {
      const apngSprite = await loadAnimatedAPNG(testApng);
      apngSprite.width = 100;
      apngSprite.height = 100;
      apngSprite.position.set(100, 100);
      app.stage.addChild(apngSprite);
    } catch (error) {
      alert('apngSprite error');
      alert(error.message);
    }
    // iphone not support
    try {
      const webpSprite = await loadAnimatedWebP(testWebp);
      webpSprite.width = 100;
      webpSprite.height = 100;
      webpSprite.position.set(100, 200);
      app.stage.addChild(webpSprite);
    } catch (error) {
      alert('webpSprite error');
      alert(error.message);
    }
    // ok
    try {
      const video = await loadVideo(test265);
      const videoTexture = PIXI.Texture.from(video);
      const videoSprite = new PIXI.Sprite(videoTexture);
      videoSprite.width = 100;
      videoSprite.height = 100;
      videoSprite.position.set(300, 200);
      app.stage.addChild(videoSprite);
    } catch (error) {
      alert('test265 error');
      alert(error.message);
    }
    // iphone not support
    try {
      const video = await loadVideo(testWebm);
      const videoTexture = PIXI.Texture.from(video);
      const videoSprite = new PIXI.Sprite(videoTexture);
      videoSprite.width = 100;
      videoSprite.height = 100;
      videoSprite.position.set(0, 200);
      app.stage.addChild(videoSprite);
    } catch (error) {
      alert('testWebm error');
      alert(error.message);
    }
    // iphone not support(?)
    try {
      const video = await loadVideo(testHvc1);
      const videoTexture = PIXI.Texture.from(video);
      const videoSprite = new PIXI.Sprite(videoTexture);
      videoSprite.width = 100;
      videoSprite.height = 100;
      videoSprite.position.set(200, 300);
      app.stage.addChild(videoSprite);
    } catch (error) {
      alert('testHvc1 error');
      alert(error.message);
    }

    const container = new PIXI.Container();
    container.position.set(350, 200);
    app.stage.addChild(container);
    await addTestParticles(container)

    {
      // Create a particle container with default options
      const container = new PIXI.ParticleContainer({
        // this is the default, but we show it here for clarity
        dynamicProperties: {
          position: true, // Allow dynamic position changes (default)
          scale: false, // Static scale for extra performance
          rotation: false, // Static rotation
          color: false, // Static color
        },
      });

      // Add particles
      const texture = await loadTexture(particlePng);

      for (let i = 0; i < 10; ++i) {
        let particle = new PIXI.Particle({
          texture,
          x: Math.random() * 400,
          y: Math.random() * 400,
        });

        container.addParticle(particle);
      }

      // Add container to the Pixi stage
      app.stage.addChild(container);
    }
  } catch (error) {
    alert(error.message);
  }
}

function addTestCtaPress() {
  const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.sega.Kotodaman"
  const APP_STORE_URL = "https://itunes.apple.com/jp/app/id493470467"
  const button = document.createElement('button')
  button.innerText = 'Test CTA Press'
  button.onclick = () => {
    app.networkPlugin.then(networkPlugin => networkPlugin.onCtaPressed(GOOGLE_PLAY_URL, APP_STORE_URL))
  }
  document.body.appendChild(button)
}
function addTestRetry() {
  const button = document.createElement('button')
  button.innerText = 'Test Retry'
  button.onclick = () => {
    app.networkPlugin.then(networkPlugin => networkPlugin.onRetry())
  }
  document.body.appendChild(button)
}

async function addTestParticles(container) {
  // https://github.com/pixijs-userland/particle-emitter
  var emitter = new PIXI.particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    container,
    // Emitter configuration, edit this to change the look
    // of the emitter
    PIXI.particles.upgradeConfig(emitterJson, [await loadTexture(particlePng)])
  );

  // Calculate the current time
  var elapsed = Date.now();

  // Update function every frame
  var update = function () {

    // Update the next frame
    requestAnimationFrame(update);

    var now = Date.now();

    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;
  };

  // Start emitting
  emitter.emit = true;

  // Start the update
  update();
}