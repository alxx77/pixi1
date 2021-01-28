import { shuffleArray } from "./helper_fn.js";
import { Reel } from "./reel.js";
import {
    LoadTextures,
    InitSprites,
    AttachSpinButtonClickHandler,
    GetReelSymbolTextureNames,
  } from "./setup.js";




//slot mašina
export class SlotMachine {
  constructor(canvas) {

    this.canvas=canvas;

    //instance rolni
    this.reel1 = null;
    this.reel2 = null;
    this.reel3 = null;

    //nov ticker objekt
    this.ticker = new PIXI.Ticker();

    this.cb_reel1_finished=null;
    this.cb_reel2_finished=null;
    this.cb_reel3_finished=null;
  }

  async InitMachine() {

    //imena simbola na rolnama
    let symbol_names=[]
    
    GetReelSymbolTextureNames().forEach((val,key)=>{
        symbol_names.push(key)
    })


    //kreiranje slučajnog redosleda simbola na rolnama
    let symbol_slot1 = shuffleArray(symbol_names.slice(0));
    let symbol_slot2 = shuffleArray(symbol_names.slice(0));
    let symbol_slot3 = shuffleArray(symbol_names.slice(0));

    //učitavanje tekstura
    await LoadTextures();

    //inicijalizacija sprajtova
    let map1 = InitSprites();
    let map2 = InitSprites();
    let map3 = InitSprites();

    let sprite=map1.entries().next().value[1]

    //console.log(sprite.width)

    let stage = new PIXI.Container();
    //stage.width=244*3

    //renderer
    let renderer=new PIXI.Renderer({
        view: this.canvas,
        width: 244*3,
        height: 244 * 3,
      });
    

    //instanciranje instanci reel objekta
    this.reel1 = new Reel(1,stage,244, 244, map1, symbol_slot1,0);
    this.reel2 = new Reel(2,stage,244, 244, map2, symbol_slot2,244);
    this.reel3 = new Reel(3,stage,244, 244, map3, symbol_slot3,244*2);
  

    //dodavanje render funkcija objekata u ticker obj.
    this.ticker.add(()=>{
        this.reel1.Animate();
        this.reel2.Animate();
        this.reel3.Animate();

        renderer.render(stage)
    });


    //kaćenje event handlera "spin" dugmeta
    AttachSpinButtonClickHandler(this.SpinReels);
  }

  //igranje runde
  SpinReels = () => {
    //provera da li se rolne vrte, ako da ne radi ništa
    if (
      this.reel1.is_spinning ||
      this.reel2.is_spinning ||
      this.reel3.is_spinning
    )
      return;

    //odigravanje runde
    let r1 = Math.floor(Math.random() * 12);
    let r2 = Math.floor(Math.random() * 12);
    let r3 = Math.floor(Math.random() * 12);

    //console.log("symbol_slot 1: " + this.symbol_slot1);
    //console.log("symbol_slot 2: " + symbol_slot2);
    //console.log("symbol_slot 3: " + symbol_slot3);

    //console.log(r1, r2, r3);

    //pokretanje slotova
    this.reel1.SpinReel(r1);

    setTimeout(() => {
      this.reel2.SpinReel(r2);
    }, 250);

    setTimeout(() => {
      this.reel3.SpinReel(r3);
    }, 500);
  };

  //start
  StartSlotMachine() {
    //start animacije
    this.ticker.start();
  }
}
