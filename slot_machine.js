import { shuffleArray } from "./helper_fn.js";
import { Reel } from "./reel.js";
import {
    loadTextures,
    initSprites,
    attachSpinButtonClickHandler,
    getReelSymbolTextureNames,
  } from "./setup.js";

import { PlayRound } from "./backend.js"


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

  }

  async initMachine() {

    //imena simbola na rolnama
    let symbol_names=[]
    
    getReelSymbolTextureNames().forEach((val,key)=>{
        symbol_names.push(key)
    })


    //kreiranje slučajnog redosleda simbola na rolnama
    let symbol_slot1 = shuffleArray(symbol_names.slice(0));
    let symbol_slot2 = shuffleArray(symbol_names.slice(0));
    let symbol_slot3 = shuffleArray(symbol_names.slice(0));

    //učitavanje tekstura
    await loadTextures();

    //inicijalizacija sprajtova
    let map1 = initSprites();
    let map2 = initSprites();
    let map3 = initSprites();

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

        //animacija 3 rolne
        this.reel1.animateReel();
        this.reel2.animateReel();
        this.reel3.animateReel();

        //rendering
        renderer.render(stage)
    });


    //kaćenje event handlera "spin" dugmeta
    attachSpinButtonClickHandler(this.spinReels);
  }


  //igranje runde
  spinReels = async () => {
    //provera da li se rolne vrte, ako da ne radi ništa
    if (
      this.reel1.isSpinning ||
      this.reel2.isSpinning ||
      this.reel3.isSpinning
    )
      return;

    //odigravanje runde
    let [r1,r2,r3]=PlayRound(this.symbol_slot1,this.symbol_slot2,this.symbol_slot3);

    //console.log("symbol_slot 1: " + this.symbol_slot1);
    //console.log("symbol_slot 2: " + symbol_slot2);
    //console.log("symbol_slot 3: " + symbol_slot3);

    console.log(r1, r2, r3);

    //kraj okretanja 1. rolne
    let promiseSpinCompleted1=new Promise((resolve,reject)=>{
        this.reel1.cbSpinCompleted=(reel_id)=>{
            resolve(reel_id)
        }
    })

    //kraj okretanja 2. rolne
    let promiseSpinCompleted2=new Promise((resolve,reject)=>{
        this.reel2.cbSpinCompleted=(reel_id)=>{
            resolve(reel_id)
        }
    })

    //kraj okretanja 3. rolne
    let promiseSpinCompleted3=new Promise((resolve,reject)=>{
        this.reel3.cbSpinCompleted=(reel_id)=>{
            resolve(reel_id)
        }
    })


    //pokretanje slotova
    this.reel1.spinReel(r1);

    setTimeout(() => {
      this.reel2.spinReel(r2);
    }, 250);

    setTimeout(() => {
      this.reel3.spinReel(r3);
    }, 500);

    //čekanje da sve rolne stanu završe...
    await Promise.all([promiseSpinCompleted1,promiseSpinCompleted2,promiseSpinCompleted3])

    //obračun bodova


  };

  //start
  startSlotMachine() {
    //start animacije
    this.ticker.start();
  }


}
