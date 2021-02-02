import { shuffleArray } from "./helper_fn.js";
import { Reel } from "./reel.js";
import { loadTextures, initSprites, getBackroundSprite } from "./setup.js";

import { PlayRound } from "./backend.js";
import { checkTotalHits } from "./paytable.js";
import { GamePanel } from "./game_panel.js";
import {
  winSymbolsFlicker
} from "./win_animations.js";

//slot mašina
export class SlotMachine {
  constructor(canvas, symbol_names, currency_sign) {
    this.canvas = canvas;

    //instance rolni
    this.reel1 = null;
    this.reel2 = null;
    this.reel3 = null;

    //nov ticker objekt
    this.ticker = new PIXI.Ticker();

    //lista imena simbola
    this.symbol_names = symbol_names;

    //simbol valute kredita
    this.currency_sign = currency_sign;

    //kredit
    this.credit_amount = 0;
    this.bet_amount = 0;

    //panel
    this.game_panel = null;

    //da li treba prekinuti animaciju
    this.cancel_animation = false;

    //da li je neka animacija trenutno u toku
    this._is_animation_running = false;

    this.cb_notify_animation_stopped = null;
  }

  get is_animation_running() {
    return this._is_animation_running;  
  }

  set is_animation_running(value) {
    this._is_animation_running = value;
    if (value === false) {
      if (this.cb_notify_animation_stopped) {
        if (this.cb_notify_animation_stopped instanceof Function) this.cb_notify_animation_stopped();
      }
      console.log("slot machine: animation stopped/ended")
    }
  }

  async initMachine() {
    //kreiranje slučajnog redosleda simbola na rolnama

    let symbol_slot1 = shuffleArray(this.symbol_names.slice(0));
    let symbol_slot2 = shuffleArray(this.symbol_names.slice(0));
    let symbol_slot3 = shuffleArray(this.symbol_names.slice(0));

    /*
    let symbol_slot1 =(this.symbol_names.slice(0));
    let symbol_slot2 =(this.symbol_names.slice(0));
    let symbol_slot3 =(this.symbol_names.slice(0));
    */

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
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    window.addEventListener("resize", resize);

    function resize() {
      let w = document.documentElement.clientWidth;

      let h = document.documentElement.clientHeight;

      renderer.resize(w, h);
      console.log(w, h);
    }

    var viewWidth = renderer.width / renderer.resolution;
    var back = new PIXI.Container();
    back.scale.x = 1920 / viewWidth;
    back.scale.y = back.scale.x;
    back.addChild(getBackroundSprite());
    stage.addChild(back);

    //stage za kontrole
    this.game_panel = new GamePanel(
      244 * 3,
      this.currency_sign,
      this.spinReels
    );
    this.game_panel.stage.y = 244 * 3;

    stage.addChild(this.game_panel.stage);

    //stage za rolne
    let reel_stage = new PIXI.Container();
    reel_stage.x = 200;
    const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
    mask.width = 244 * 3;
    mask.height = 244 * 3;
    reel_stage.addChild(mask);
    reel_stage.mask = mask;

    //iznos uloga
    this.bet_amount = 1;
    this.game_panel.updateBetAmountText(this.bet_amount);

    //instanciranje instanci reel objekta
    this.reel1 = new Reel(1, reel_stage, 244, 244, map1, symbol_slot1, 0);
    this.reel2 = new Reel(2, reel_stage, 244, 244, map2, symbol_slot2, 244);
    this.reel3 = new Reel(3, reel_stage, 244, 244, map3, symbol_slot3, 244 * 2);

    stage.addChild(reel_stage);

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
  //******************************** */
  spinReels = async () => {
    console.log("spin reels")
    //provera da li se rolne vrte, ako da ne radi ništa
    if (this.reel1.isSpinning || this.reel2.isSpinning || this.reel3.isSpinning){
      console.log("already spinning")
      return;
    }
      

    //prekini animaciju na rolnama ukoliko možda je u toku
    //i sačekaj da funkcija završi
    if (this.is_animation_running === true) {

      let animation_stopped =  new Promise((resolve) => {
        this.cb_notify_animation_stopped = () => {
          resolve();
        };
      });

      console.log("stopping currently running animation")
      //zaustavi animaciju
      this.cancel_animation = true;

      //sačekaj da završi
      await animation_stopped;

      //očisti cb
      this.cb_notify_animation_stopped=null;

      //vrati fleg
      this.cancel_animation=false;

      //nastavi dalje 
      console.log("awaited stopping process")
           
     
    }

    //umanji kredit za iznos uloga
    this.credit_amount -= this.bet_amount;
    this.game_panel.updateCreditAmountText(this.credit_amount);

    this.game_panel.updateWinAmountText(0);

    //odigravanje runde
    let [r1, r2, r3] = PlayRound();

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

    //console.log(this.symbol_names)
    //console.log(this.reel1.reelArray);
    //console.log(this.reel2.reelArray);
    //console.log(this.reel3.reelArray);

    let hit_list = checkTotalHits(reel_matrix, this.symbol_names);


    console.dir(hit_list);

    for await ( let element of hit_list) {
      let test = element.test;

      //ako postoji pogodak
      if (test.length > 0) {
        let data = test[0];

        //2 provera
        if (data.hit === true) {
          //this.reel1.setTexture(0,"01-lemon_low2")

          //dodaj iznos opklade na kredit
          this.credit_amount += this.bet_amount;

          //osveži ispis kredita
          this.game_panel.updateCreditAmountText(this.credit_amount);

          //oveži ispis dobitka
          this.game_panel.updateWinAmountText(this.bet_amount);
       
          //animacija
          await winSymbolsFlicker(this, element);

        }
      }
    };
  };

  //start
  startAnimation() {
    //start animacije
    this.ticker.start();
  }

  setCreditAmount(cr) {
    let c = Number.parseFloat(cr);
    if (c > 0) {
      this.credit_amount = c;
    }

    //ui update
    this.game_panel.updateCreditAmountText(this.credit_amount);
  }
}
