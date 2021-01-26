

export async function InitSprites() {
  let x = new Map();

  let loader=new PIXI.Loader();

  return new Promise((resolve, reject) => {
    loader
      .add("S1", "./rsc/lemonR1.png")
      .add("S2", "./rsc/lemonR2.png")
      .add("S3", "./rsc/lemonR3.png")
      .add("S4", "./rsc/lemonR4.png")
      .add("S5", "./rsc/lemonR5.png")
      .load((loader, resources) => {
        x.set(1, new PIXI.Sprite(resources["S1"].texture));
        x.set(2, new PIXI.Sprite(resources["S2"].texture));
        x.set(3, new PIXI.Sprite(resources["S3"].texture));
        x.set(4, new PIXI.Sprite(resources["S4"].texture));
        x.set(5, new PIXI.Sprite(resources["S5"].texture));
        x.set(6, new PIXI.Sprite(resources["S1"].texture));
        x.set(7, new PIXI.Sprite(resources["S2"].texture));
        x.set(8, new PIXI.Sprite(resources["S3"].texture));
        x.set(9, new PIXI.Sprite(resources["S4"].texture));
        x.set(10, new PIXI.Sprite(resources["S5"].texture));
        x.set(11, new PIXI.Sprite(resources["S1"].texture));
        x.set(12, new PIXI.Sprite(resources["S2"].texture));
        resolve(x);
      });
  });

  
}

export function AttachSpinButtonClickHandler(fn){
  document.getElementById("spin").addEventListener("click",fn)
}
