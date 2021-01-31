import { shuffleArray } from "./helper_fn.js";
import { Reel } from "./reel.js";
import {
  loadTextures,
  initSprites,
  getReelSymbolTextureNames,
  getBackroundSprite
} from "./setup.js";

import { PlayRound } from "./backend.js";
import { checkTotalHits } from "./paytable.js";
import { GamePanel } from "./game_panel.js"

//slot mašina
export class SlotMachine {
  constructor(canvas) {
    this.canvas = canvas;

    //instance rolni
    this.reel1 = null;
    this.reel2 = null;
    this.reel3 = null;

    //nov ticker objekt
    this.ticker = new PIXI.Ticker();

    //kredit
    this.credit=0;
    this.bet=1;
  }

  async initMachine() {
    //imena simbola na rolnama
    let symbol_names = [];

    getReelSymbolTextureNames().forEach((val, key) => {
      symbol_names.push(key);
    });

    //kreiranje slučajnog redosleda simbola na rolnama
    let symbol_slot1 =shuffleArray(symbol_names.slice(0));
    let symbol_slot2 =shuffleArray(symbol_names.slice(0));
    let symbol_slot3 =shuffleArray(symbol_names.slice(0));

    //učitavanje tekstura
    await loadTextures();

    //inicijalizacija sprajtova
    let map1 = initSprites();
    let map2 = initSprites();
    let map3 = initSprites();

    
    //root kontejner
    let stage = new PIXI.Container();
   


    //renderer
    let renderer = new PIXI.Renderer({
      view: this.canvas,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      resolution:window.devicePixelRatio,
      autoDensity:true
    });

    window.addEventListener("resize",resize);

    function resize(){
        let w= document.documentElement.clientWidth;

        let h=document.documentElement.clientHeight;

        renderer.resize(w,h);
        console.log(w,h)
    }


    var viewWidth = (renderer.width / renderer.resolution);
    var back = new PIXI.Container();
    back.scale.x = 1920 / viewWidth;
    back.scale.y = back.scale.x;
    back.addChild(getBackroundSprite())
    stage.addChild(back);

    //stage za kontrole
    let game_panel=new GamePanel(244*3,this.spinReels)
    game_panel.stage.y=244*3


    stage.addChild(game_panel.stage)

    let reel_stage=new PIXI.Container();
    reel_stage.x=200
    const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
    mask.width = 244*3;
    mask.height =244*3;
    reel_stage.addChild(mask); // make sure mask it added to display list somewhere!
    reel_stage.mask = mask;

    //instanciranje instanci reel objekta
    this.reel1 = new Reel(1, reel_stage, 244, 244, map1, symbol_slot1, 0);
    this.reel2 = new Reel(2, reel_stage, 244, 244, map2, symbol_slot2, 244);
    this.reel3 = new Reel(3, reel_stage, 244, 244, map3, symbol_slot3, 244 * 2);

    stage.addChild(reel_stage)

    //dodavanje render funkcija objekata u ticker obj.
    this.ticker.add(() => {
      //animacija 3 rolne
      this.reel1.animateReel();
      this.reel2.animateReel();
      this.reel3.animateReel();

      //rendering
      renderer.render(stage);
    });

    
  }

  //igranje runde
  spinReels = async () => {
    //provera da li se rolne vrte, ako da ne radi ništa
    if (this.reel1.isSpinning || this.reel2.isSpinning || this.reel3.isSpinning)
      return;

    //odigravanje runde
    let [r1, r2, r3] = PlayRound();

    //console.log("symbol_slot 1: " + this.symbol_slot1);
    //console.log("symbol_slot 2: " + symbol_slot2);
    //console.log("symbol_slot 3: " + symbol_slot3);

    console.log(r1, r2, r3);

    //kraj okretanja 1. rolne
    let promiseSpinCompleted1 = new Promise((resolve, reject) => {
      this.reel1.cbSpinCompleted = (reel_id) => {
        resolve(reel_id);
      };
    });

    //kraj okretanja 2. rolne
    let promiseSpinCompleted2 = new Promise((resolve, reject) => {
      this.reel2.cbSpinCompleted = (reel_id) => {
        resolve(reel_id);
      };
    });

    //kraj okretanja 3. rolne
    let promiseSpinCompleted3 = new Promise((resolve, reject) => {
      this.reel3.cbSpinCompleted = (reel_id) => {
        resolve(reel_id);
      };
    });

    //pokretanje slotova
    this.reel1.spinReel(r1);

    setTimeout(() => {
      this.reel2.spinReel(r2);
    }, 50);

    setTimeout(() => {
      this.reel3.spinReel(r3);
    }, 100);

    //čekanje da sve rolne stanu završe...
    await Promise.all([
      promiseSpinCompleted1,
      promiseSpinCompleted2,
      promiseSpinCompleted3,
    ]);

    //console.log(this)

    //obračun bodova
    //podaci sa sve 3 rolne
    let reel_matrix = [
     this.reel1.reelArray.slice(0, 3),
     this.reel2.reelArray.slice(0, 3),
     this.reel3.reelArray.slice(0, 3),
    ];


    let symbol_list = Array.from(getReelSymbolTextureNames().keys());

    //console.log(symbol_list)


    let hit_list = checkTotalHits(reel_matrix,['01-lemon']);

    //PIXI.Texture

    setTimeout(() => {
        this.reel1.stage.children[0].texture=PIXI.utils.TextureCache["01-lemon-hi"]
      }, 500);

    //console.dir(hit_list)

  };

  //start
  startSlotMachine() {
    //start animacije
    this.ticker.start();
  }


  setCreditAmount(cr){
    let c=Number.parseFloat(cr);
    if(c>0){
        this.credit=c;
    }

  }

}
