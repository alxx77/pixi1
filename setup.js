

export async function LoadTextures() {
  return new Promise((resolve, reject) => {
    PIXI.Loader.shared
      .add("01-lemon", "./rsc/lemon_pr.png")
      .add("02-orange", "./rsc/orange_pr.png")
      .add("03-plum", "./rsc/plum_pr.png")
      .add("04-cherry", "./rsc/cherry_pr.png")
      .add("05-grapes", "./rsc/grapes_pr.png")
      .add("06-watermelon", "./rsc/watermelon_pr.png")
      .add("07-seven", "./rsc/7_pr.png")
      .add("08-triple_seven", "./rsc/777_pr.png")
      .add("09-bell", "./rsc/bell_pr.png")
      .add("10-clover", "./rsc/4l_clover_pr.png")
      .add("11-dollar", "./rsc/dollar_pr.png")
      .add("12-triple_bar", "./rsc/tri_bar_pr.png")
      .load(() => {
        resolve();
      });
  });
}

export function InitSprites() {
  let TextureCache = PIXI.utils.TextureCache;
  let x = new Map();
  x.set(1, new PIXI.Sprite(TextureCache["01-lemon"]));
  x.set(2, new PIXI.Sprite(TextureCache["02-orange"]));
  x.set(3, new PIXI.Sprite(TextureCache["03-plum"]));
  x.set(4, new PIXI.Sprite(TextureCache["04-cherry"]));
  x.set(5, new PIXI.Sprite(TextureCache["05-grapes"]));
  x.set(6, new PIXI.Sprite(TextureCache["06-watermelon"]));
  x.set(7, new PIXI.Sprite(TextureCache["07-seven"]));
  x.set(8, new PIXI.Sprite(TextureCache["08-triple_seven"]));
  x.set(9, new PIXI.Sprite(TextureCache["09-bell"]));
  x.set(10, new PIXI.Sprite(TextureCache["10-clover"]));
  x.set(11, new PIXI.Sprite(TextureCache["11-dollar"]));
  x.set(12, new PIXI.Sprite(TextureCache["12-triple_bar"]));

  return x;
}

export function AttachSpinButtonClickHandler(fn) {
  document.getElementById("spin").addEventListener("click", fn);
}


