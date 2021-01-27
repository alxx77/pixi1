import { shuffleArray } from "./helper_fn.js";
import { Reel } from "./reel.js";
import {
    LoadTextures,
    InitSprites,
    AttachSpinButtonClickHandler,
  } from "./setup.js";

  //canvas elementi za tri rolne
const canvas1 = document.getElementById("mycanvas1");
const canvas2 = document.getElementById("mycanvas2");
const canvas3 = document.getElementById("mycanvas3");


//slot mašina
export class SlotMachine {
  constructor() {
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
    //kreiranje redosleda simbola na rolnama
    let symbol_slot1 = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    let symbol_slot2 = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    let symbol_slot3 = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    //učitavanje tekstura
    await LoadTextures();

    //inicijalizacija sprajtova
    let map1 = InitSprites();
    let map2 = InitSprites();
    let map3 = InitSprites();

    //instanciranje instanci reel objekta
    this.reel1 = new Reel(1, canvas1, 244, 244, map1, symbol_slot1);
    this.reel2 = new Reel(2, canvas2, 244, 244, map2, symbol_slot2);
    this.reel3 = new Reel(3, canvas3, 244, 244, map3, symbol_slot3);

    //dodavanje render funkcija objekata u ticker obj.
    this.ticker.add(this.reel1.GetRendererFn);
    this.ticker.add(this.reel2.GetRendererFn);
    this.ticker.add(this.reel3.GetRendererFn);

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
