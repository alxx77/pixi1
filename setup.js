
export const SYMBOL_WIDTH=244

export function getReelSymbolTextureNames() {
  let x = new Map();
  x.set("01-lemon", "./rsc/lemon_pr_low.png");
  x.set("02-orange", "./rsc/orange_pr_low.png");
  x.set("03-plum", "./rsc/plum_pr_low.png");
  x.set("04-cherry", "./rsc/cherry_pr_low.png");
  x.set("05-grapes", "./rsc/grapes_pr_low.png");
  x.set("06-watermelon", "./rsc/watermelon_pr_low.png");
  x.set("07-seven", "./rsc/7_pr_low.png");
  x.set("08-triple_seven", "./rsc/777_pr_low.png");
  x.set("09-bell", "./rsc/bell_pr_low.png");
  x.set("10-clover", "./rsc/4l_clover_pr_low.png");
  x.set("11-dollar", "./rsc/dollar_pr_low.png");
  x.set("12-triple_bar", "./rsc/tri_bar_pr_low.png");

  return x;
}

const BACKGROUND_TEXTURE="./rsc/background.jpg"
const CP1_BUTTON="./rsc/orange-button-hi.png"

//učitavanje tekstura
export async function loadTextures() {
  return new Promise((resolve, reject) => {
    //ide se redom po listi
    getReelSymbolTextureNames().forEach((value, key) => {
      PIXI.Loader.shared.add(key, value);
    });

    //slika za pozadinu
    PIXI.Loader.shared.add("background", BACKGROUND_TEXTURE)

    //dugme
    PIXI.Loader.shared.add("cp1_button",CP1_BUTTON)

    PIXI.Loader.shared.add("01-lemon-hi", "./rsc/lemon_pr.png")

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

export function getBackroundSprite(){
   //pozadina
   return new PIXI.Sprite(PIXI.utils.TextureCache["background"])
}



