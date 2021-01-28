export function getReelSymbolTextureNames() {
  let x = new Map();
  x.set("01-lemon", "./rsc/lemon_pr.png");
  x.set("02-orange", "./rsc/orange_pr.png");
  x.set("03-plum", "./rsc/plum_pr.png");
  x.set("04-cherry", "./rsc/cherry_pr.png");
  x.set("05-grapes", "./rsc/grapes_pr.png");
  x.set("06-watermelon", "./rsc/watermelon_pr.png");
  x.set("07-seven", "./rsc/7_pr.png");
  x.set("08-triple_seven", "./rsc/777_pr.png");
  x.set("09-bell", "./rsc/bell_pr.png");
  x.set("10-clover", "./rsc/4l_clover_pr.png");
  x.set("11-dollar", "./rsc/dollar_pr.png");
  x.set("12-triple_bar", "./rsc/tri_bar_pr.png");

  return x;
}

//učitavanje tekstura
export async function loadTextures() {
  return new Promise((resolve, reject) => {
    //ide se redom po listi
    getReelSymbolTextureNames().forEach((value, key) => {
      PIXI.Loader.shared.add(key, value);
    });

    PIXI.Loader.shared.load(() => {
      resolve();
    });
  });
}

//inicijalizacija sprajtova
export function initSprites() {
  let TextureCache = PIXI.utils.TextureCache;

  let x = new Map();

  getReelSymbolTextureNames().forEach((value, key) => {
    x.set(key, new PIXI.Sprite(TextureCache[key]));
  });

  return x;
}


export function attachSpinButtonClickHandler(fn) {
  document.getElementById("spin").addEventListener("click", fn);
}
