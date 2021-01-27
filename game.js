import { Reel } from "./reel.js";
import { LoadTextures,InitSprites,AttachSpinButtonClickHandler } from "./setup.js";

const canvas1 = document.getElementById("mycanvas1");
const canvas2 = document.getElementById("mycanvas2");
const canvas3 = document.getElementById("mycanvas3");

let reel1=null;
let reel2=null;
let reel3=null;


AttachSpinButtonClickHandler(SpinButtonHandler)

function SpinButtonHandler(){
    if(reel1.is_spinning || reel2.is_spinning || reel3.is_spinning) return;
    reel1.SpinReel(10,[0.5,0.75,1,1,1,1,1,1,0.5,0.25])
    setTimeout(() => {
        reel2.SpinReel(9,[0.5,0.75,1,1,1,1,1,1,0.5,0.25])
    }, 500);

    setTimeout(() => {
        reel3.SpinReel(12,[0.5,0.75,1,1,1,1,1,1,0.5,0.25,0.1,0.1])
    }, 1000);
    
}

async function game_loop() {

  await LoadTextures();
  
  let map1 = InitSprites();
  let map2 = InitSprites();
  let map3 = InitSprites();

  const ticker = new PIXI.Ticker();

  reel1 = new Reel(canvas1, 244, 244, map1);
  reel2 = new Reel(canvas2, 244, 244, map2);
  reel3 = new Reel(canvas3, 244, 244, map3);

  ticker.add(reel1.GetRendererFn);
  ticker.add(reel2.GetRendererFn);
  ticker.add(reel3.GetRendererFn);

  ticker.start()

}

game_loop()


