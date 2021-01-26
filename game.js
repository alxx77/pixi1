import { Reel } from "./reel.js";
import { InitSprites,AttachSpinButtonClickHandler } from "./setup.js";

const canvas1 = document.getElementById("mycanvas1");
const canvas2 = document.getElementById("mycanvas2");

let reel1=null;
let reel2=null;


AttachSpinButtonClickHandler(SpinButtonHandler)

function SpinButtonHandler(){
    reel1.SpinReel(10,[0.5,0.75,1,1,1,1,1,1,0.5,0.25])
    setTimeout(() => {
        reel2.SpinReel(10,[0.5,0.75,1,1,1,1,1,1,0.5,0.25])
    }, 500);
    
}

async function game_loop() {
  
  let map1 = await InitSprites();
  let map2 = await InitSprites();

  const ticker = new PIXI.Ticker();

  reel1 = new Reel(canvas1, 244, 244, map1);
  reel2 = new Reel(canvas2, 244, 244, map2);

  ticker.add(reel1.GetRendererFn);
  ticker.add(reel2.GetRendererFn);

  ticker.start()

}

game_loop()


