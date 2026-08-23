import BaseX from './baseX.js'

export function loadImage(dataUrl) {
  dataUrl = baseXToObjectURL(dataUrl)
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
  });
}

export async function loadVideo(dataUrl) {
  dataUrl = baseXToObjectURL(dataUrl)
  const video = document.createElement('video');
  video.src = dataUrl;
  video.autoplay = true;
  video.loop = true;
  video.muted = true; // 自動再生には muted が必要
  video.crossOrigin = "anonymous";
  video.playsInline = true; // iOS Safari のインライン再生許可
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  await new Promise((resolve, reject) => {
    video.addEventListener('loadedmetadata', resolve, { once: true });
    video.addEventListener('error', reject, { once: true });
  });
  video.currentTime = 0;
  video.load();
  await video.play();
  return video;
}

export async function loadTexture(dataUrl) {
  const img = await loadImage(dataUrl);
  return window.PIXI.Texture.from(img);
}

export async function loadVideoTexture(dataUrl) {
  const video = await loadVideo(dataUrl);
  return window.PIXI.Texture.from(video);
}

export async function loadSpritesheet(texture, json) {
  const sheet = new window.PIXI.Spritesheet(texture, json);
  await sheet.parse();
  return sheet;
}

export async function loadGifSprite(dataUrl) {
  const gif = await window.PIXI.Assets.load(dataUrl);
  return new window.PIXI.GifSprite({ source: gif });
}

export async function loadSpine({ atlasDataUrl, textureDataUrl, skelDataUrl }) {
  const spine = window.spine;
  const required = ["TextureAtlas", "AtlasAttachmentLoader", "SkeletonBinary", "Spine", "SpineTexture"];
  const missing = required.filter(k => !spine[k]);
  if (missing.length) {
    console.error("spine keys:", Object.keys(spine || {}));
    throw new Error("Spine v8 クラス不足: " + missing.join(", "));
  }
  const atlasText = atob(atlasDataUrl.split(",")[1]);
  const textureAtlas = new spine.TextureAtlas(atlasText);
  const texture = await loadTexture(textureDataUrl);
  for (const page of textureAtlas.pages) {
    page.setTexture(spine.SpineTexture.from(texture.source)); // ← 公式推奨の割当
  }
  const attachmentLoader = new spine.AtlasAttachmentLoader(textureAtlas);
  const binary = new spine.SkeletonBinary(attachmentLoader);
  const skelBytes = toUint8Array(skelDataUrl.split(",")[1]);
  const skeletonData = binary.readSkeletonData(skelBytes);
  return new spine.Spine(skeletonData);
}

function toUint8Array(b64) {
  const raw = atob(b64);
  const u8 = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i);
  return u8;
}

export async function loadAnimatedWebP(dataUrl) {
  dataUrl = baseXToObjectURL(dataUrl)
  return fetch(dataUrl)
    .then(res => res.arrayBuffer())
    .then(PIXI.pixiAnimatedWebp.AnimatedWebP.fromBuffer)
}

export async function loadAnimatedAPNG(dataUrl) {
  dataUrl = baseXToObjectURL(dataUrl)
  return fetch(dataUrl)
    .then(res => res.arrayBuffer())
    .then(PIXI.pixiApng.AnimatedAPNG.fromBuffer)
}

export function baseXToObjectURL(dataUrl) {
  const [meta, payload] = dataUrl.split(',')
  if (meta.indexOf('base32768') == -1) {
    return dataUrl
  }
  const mimeType = meta.match(/^data:([^;]+);/)[1]
  const bytes = BaseX.d32768(payload)
  const blob = new Blob([bytes], { type: mimeType })
  const url = URL.createObjectURL(blob)
  return url
}