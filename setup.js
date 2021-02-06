export const SYMBOL_WIDTH = 244;
export const SYMBOL_HEIGHT = 244;
export const REEL_X_OFFSET = SYMBOL_WIDTH;


export const SYMBOL_NAMES = [
  "01-lemon",
  "02-orange",
  "03-plum",
  "04-cherry",
  "05-grapes",
  "06-watermelon",
  "07-seven",
  "08-triple_seven",
  "09-bell",
  "10-clover",
  "11-dollar",
  "12-triple_bar",
];

export const CURRENCY_SIGN="$"



export function getTextureNames() {
  let x = new Map();

  //default set tekstura
  x.set("01-lemon_low", "./rsc/lemon_low.png");
  x.set("02-orange_low", "./rsc/orange_low.png");
  x.set("03-plum_low", "./rsc/plum_low.png");
  x.set("04-cherry_low", "./rsc/cherry_low.png");
  x.set("05-grapes_low", "./rsc/grapes_low.png");
  x.set("06-watermelon_low", "./rsc/watermelon_low.png");
  x.set("07-seven_low", "./rsc/7_low.png");
  x.set("08-triple_seven_low", "./rsc/777_low.png");
  x.set("09-bell_low", "./rsc/bell_low.png");
  x.set("10-clover_low", "./rsc/4l_clover_low.png");
  x.set("11-dollar_low", "./rsc/dollar_low.png");
  x.set("12-triple_bar_low", "./rsc/triple_bar_low.png");

  x.set("01-lemon_hi", "./rsc/lemon_hi.png");
  x.set("02-orange_hi", "./rsc/orange_hi.png");
  x.set("03-plum_hi", "./rsc/plum_hi.png");
  x.set("04-cherry_hi", "./rsc/cherry_hi.png");
  x.set("05-grapes_hi", "./rsc/grapes_hi.png");
  x.set("06-watermelon_hi", "./rsc/watermelon_hi.png");
  x.set("07-seven_hi", "./rsc/7_hi.png");
  x.set("08-triple_seven_hi", "./rsc/777_hi.png");
  x.set("09-bell_hi", "./rsc/bell_hi.png");
  x.set("10-clover_hi", "./rsc/4l_clover_hi.png");
  x.set("11-dollar_hi", "./rsc/dollar_hi.png");
  x.set("12-triple_bar_hi", "./rsc/triple_bar_hi.png");

  x.set("01-lemon_low2", "./rsc/lemon_low2.png");
  x.set("02-orange_low2", "./rsc/orange_low2.png");
  x.set("03-plum_low2", "./rsc/plum_low2.png");
  x.set("04-cherry_low2", "./rsc/cherry_low2.png");
  x.set("05-grapes_low2", "./rsc/grapes_low2.png");
  x.set("06-watermelon_low2", "./rsc/watermelon_low2.png");
  x.set("07-seven_low2", "./rsc/7_low2.png");
  x.set("08-triple_seven_low2", "./rsc/777_low2.png");
  x.set("09-bell_low2", "./rsc/bell_low2.png");
  x.set("10-clover_low2", "./rsc/4l_clover_low2.png");
  x.set("11-dollar_low2", "./rsc/dollar_low2.png");
  x.set("12-triple_bar_low2", "./rsc/triple_bar_low2.png");

  return x;
}

const BACKGROUND_TEXTURE = "./rsc/background.jpg";
const FRAME_TEXTURE = "./rsc/transparent_frame.png";
const SPIN_BUTTON_TEXTURE = "./rsc/spin_button.png";
const MAX_BET_BUTTON_TEXTURE = "./rsc/max_bet_button.png";
const BET_UP_BUTTON_TEXTURE="./rsc/plus_button.png"
const BET_DOWN_BUTTON_TEXTURE="./rsc/minus_button.png"


//učitavanje tekstura
export async function loadTextures() {
  return new Promise((resolve, reject) => {
    //ide se redom po listi
    getTextureNames().forEach((value, key) => {
      PIXI.Loader.shared.add(key, value);
    });

    //slika za pozadinu
    PIXI.Loader.shared.add("background", BACKGROUND_TEXTURE);

    //okvir
    PIXI.Loader.shared.add("frame", FRAME_TEXTURE);

    //dugme
    PIXI.Loader.shared.add("spin_button", SPIN_BUTTON_TEXTURE);

    PIXI.Loader.shared.add("max_bet_button", MAX_BET_BUTTON_TEXTURE);

    PIXI.Loader.shared.add("bet_up_button", BET_UP_BUTTON_TEXTURE);
    PIXI.Loader.shared.add("bet_down_button", BET_DOWN_BUTTON_TEXTURE);

    PIXI.Loader.shared.load(() => {
      resolve();
    });
  });
}

//inicijalizacija sprajtova
export function initSprites() {
  let TextureCache = PIXI.utils.TextureCache;

  let x = new Map();

  //kao default set koriste se _low teksture
  SYMBOL_NAMES.forEach((name) => {
    x.set(name, new PIXI.Sprite(TextureCache[name+"_low"]));
  });

  return x;
}

export function getBackroundSprite() {
  //pozadina
  return new PIXI.Sprite(PIXI.utils.TextureCache["background"]);
}

export function getFrameSprite() {
  //pozadina
  return new PIXI.Sprite(PIXI.utils.TextureCache["frame"]);
}

//HTML5 sound element
export function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
} 
