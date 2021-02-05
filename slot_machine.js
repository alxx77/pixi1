import { shuffleArray } from "./helper_fn.js";
import { Reel } from "./reel.js";
import {
  loadTextures,
  initSprites,
  getBackroundSprite,
  getFrameSprite,
  sound,
} from "./setup.js";

import { PlayRound } from "./backend.js";
import { checkTotalHits } from "./paytable.js";
import { GamePanel } from "./game_panel.js";
import { winSymbolsFlicker } from "./win_animations.js";

//slot mašina
export class SlotMachine {
  constructor(canvas, symbol_names, currency_sign) {
    this.canvas = canvas;

    this.reels_count = 3;

    this.symbols_per_reel_count = 3;

    //root stage
    this.stage = null;

    //background
    this.back = null;

    //stage za okvir rolni
    this.reel_frame = null;

    //stage za rolne
    this.reel_stage = null;

    //stage za game panel
    this.game_panel_stage = null;

    //instance rolni
    this.reel1 = null;
    this.reel2 = null;
    this.reel3 = null;
    this.reel4 = null;
    this.reel5 = null;

    //širina rolne u px
    this.reel_width = 0;

    //visina rolne u px
    this.reel_height = 0;

    //visina sprajta simbola
    this.symbol_width = 0;

    //širina sprajta simbola
    this.symbol_height = 0;

    //nov ticker objekt
    this.ticker = new PIXI.Ticker();

    //lista imena simbola
    this.symbol_names = symbol_names;

    //simbol valute kredita
    this.currency_sign = currency_sign;

    //kredit
    this.credit_amount = 0;
    this.bet_amount = 0;

    //brojač rundi
    this.counter = 0;

    //panel
    this.game_panel = null;

    //da li treba prekinuti animaciju
    this.cancel_animation = false;

    //da li je neka animacija trenutno u toku
    this._is_animation_running = false;

    //callback za obaveštenje o zaustavljanju animacije
    this.cb_notify_animation_stopped = null;

    //zvuk********************************************
    //klik zvuk dugmeta
    this.spin_button_click = new sound("./rsc/spin-button_click.mp3");

    //osnovni dobitak
    this.small_win_sound = new sound("./rsc/small_win.mp3");

    //kraj reprodukcije
    this.small_win_sound.sound.onended = (e) => {
      if (this.cb_small_win_sound_ended) {
        if (this.cb_small_win_sound_ended instanceof Function)
          this.cb_small_win_sound_ended();
      }
    };

    //cb
    this.cb_small_win_sound_ended = null;

    //srednji dobitak
    this.mid_win_sound = new sound("./rsc/mid_win.mp3");

    //kraj reprodukcije
    this.mid_win_sound.sound.onended = (e) => {
      if (this.cb_mid_win_sound_ended) {
        if (this.cb_mid_win_sound_ended instanceof Function)
          this.cb_mid_win_sound_ended();
      }
    };

    //cb
    this.cb_mid_win_sound_ended = null;

    //jackpot
    this.jackpot_sound = new sound("./rsc/jackpot.mp3");

    //kraj reprodukcije
    this.jackpot_sound.sound.onended = (e) => {
      if (this.cb_jackpot_sound_ended) {
        if (this.cb_jackpot_sound_ended instanceof Function)
          this.cb_jackpot_sound_ended();
      }
    };

    //cb
    this.cb_jackpot_sound_ended = null;

    //notifikacija
    this.accent_sound = new sound("./rsc/accent.mp3");
  }

  //getter
  get is_animation_running() {
    return this._is_animation_running;
  }

  //setter
  set is_animation_running(value) {
    this._is_animation_running = value;
    if (value === false) {
      if (this.cb_notify_animation_stopped) {
        if (this.cb_notify_animation_stopped instanceof Function)
          this.cb_notify_animation_stopped();
      }
      console.log("slot machine: animation stopped/ended");
    }
  }

  view_recalc = (renderer) => {

    let w = document.documentElement.clientWidth/renderer.resolution;

    let h = document.documentElement.clientHeight/renderer.resolution;

    let r=w/h    

    if (w < 768) {
      //w = 768;
      //h=w/r
    }

    if (h < 768) {
     // h = 768;

    }

    renderer.resize(w, h);

    //pozadina
    this.back.width=w
    this.back.height=h


    let mx2 = w - 1315;
    let my2 = h - 775;

    console.log(renderer.width,renderer.height,renderer.resolution)

    if (w > h) {
      //landscape

      //ako je ukupna x margina negativna
      //postaviti x ofset na 0
      if (mx2 < 0) {
        //glavni panel
        this.reel_frame.x = 0;
        this.reel_frame.y = 20;
        this.reel_frame.width = w;
        this.reel_frame.height = w / (1315 / 775);

        //panel sa kontrolama
        this.game_panel.stage.x = 0;
        //this.game_panel.stage.width=w;
        //this.game_panel.stage.height=w/(1315/100)
      } else {
        //ako postoji pozitivna margina
        this.reel_frame.x = mx2 / 2;
        this.reel_frame.width = 1315;
        this.reel_frame.height = 775;

        //panel sa kontrolama
        this.game_panel.stage.x = mx2 / 2;
        //this.game_panel.stage.width = 400;
        //this.game_panel.stage.height = 100
      }
    } else {
      //portret
      if (mx2 < 0) {
        //glavni panel
        this.reel_frame.x = 0;
        this.reel_frame.y = 100;
        this.reel_frame.width = w;
        this.reel_frame.height = w / (1315 / 775);

        //panel sa kontrolama
        this.game_panel.stage.x = 0;
        //this.game_panel.stage.width=w;
        //this.game_panel.stage.height=w/(1315/100)
      } else {
        //ako postoji pozitivna margina
        this.reel_frame.x = mx2 / 2;
        this.reel_frame.width = 1315;
        this.reel_frame.height = 775;

        //panel sa kontrolama
        this.game_panel.stage.x = mx2 / 2;
        //this.game_panel.stage.width = 400;
        //this.game_panel.stage.height = 100
      }
    }

    //vertikalno pozicioniranje kontrola
    this.game_panel.stage.y = this.reel_frame.y + this.reel_frame.height;
  };

  //inicijalizacija
  async initMachine() {
    //kreiranje slučajnog redosleda simbola na rolnama
    let symbol_slot1 = shuffleArray(this.symbol_names.slice(0));
    let symbol_slot2 = shuffleArray(this.symbol_names.slice(0));
    let symbol_slot3 = shuffleArray(this.symbol_names.slice(0));
    let symbol_slot4 = shuffleArray(this.symbol_names.slice(0));
    let symbol_slot5 = shuffleArray(this.symbol_names.slice(0));

    //učitavanje tekstura
    await loadTextures();

    //inicijalizacija sprajtova
    let map1 = initSprites();
    let map2 = initSprites();
    let map3 = initSprites();
    let map4 = initSprites();
    let map5 = initSprites();

    //root kontejner
    this.stage = new PIXI.Container();

    //renderer
    let renderer = new PIXI.Renderer({
      view: this.canvas,
      //autoResize: true,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    //resize funkcija
    const resize = () => {
      this.view_recalc(renderer);
    };

    //resize event
    window.addEventListener("resize", resize);

   
    //pozadina
    this.back = new PIXI.Container();
    this.back.width=renderer.width //scale.x = 1920 / viewWidth;
    this.back.height=renderer.height //scale.y = this.back.scale.x;
    this.back.addChild(getBackroundSprite());
    this.stage.addChild(this.back);

    //stage za okvir rolni
    this.reel_frame = new PIXI.Container();
    this.reel_frame.addChild(getFrameSprite());
    this.stage.addChild(this.reel_frame);

    //stage za rolne
    this.reel_stage = new PIXI.Container();
    const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
    mask.width = 1315;
    mask.height = 735;
    this.reel_stage.addChild(mask);
    this.reel_stage.mask = mask;
    //relativna pozicija u odnosu na frame
    this.reel_stage.x = 50;
    this.reel_stage.y = 20;
    this.reel_frame.addChild(this.reel_stage);

    //stage za kontrole
    let game_panel_stage = new PIXI.Container();
    game_panel_stage.width = 1315;
    game_panel_stage.height = 100;
    this.game_panel = new GamePanel(
      game_panel_stage,
      this.currency_sign,
      this.spinReels
    );
    this.stage.addChild(this.game_panel.stage);

    //console.log(game_panel_stage.width);

    //iznos uloga
    this.bet_amount = 10;
    this.game_panel.updateBetAmountText(this.bet_amount);

    this.view_recalc(renderer);

    //instanciranje instanci reel objekta
    this.reel1 = new Reel(1, this.reel_stage, 244, 244, map1, symbol_slot1, 0);
    this.reel2 = new Reel(
      2,
      this.reel_stage,
      244,
      244,
      map2,
      symbol_slot2,
      244
    );
    this.reel3 = new Reel(
      3,
      this.reel_stage,
      244,
      244,
      map3,
      symbol_slot3,
      244 * 2
    );

    this.reel4 = new Reel(
      4,
      this.reel_stage,
      244,
      244,
      map4,
      symbol_slot4,
      244 * 3
    );

    this.reel5 = new Reel(
      5,
      this.reel_stage,
      244,
      244,
      map5,
      symbol_slot5,
      244 * 4
    );

    //dodavanje render funkcija objekata u ticker obj.
    this.ticker.add(() => {
      //animacija 3 rolne
      this.reel1.animateReel();
      this.reel2.animateReel();
      this.reel3.animateReel();
      this.reel4.animateReel();
      this.reel5.animateReel();

      //rendering
      renderer.render(this.stage);
    });
  }

  //igranje runde
  //******************************** */
  //******************************** */
  spinReels = async () => {
    console.log("spin reels");

    //zvuk - klik spin dugmeta
    this.spin_button_click.play();

    //provera da li se rolne vrte, ako da ne radi ništa
    if (
      this.reel1.isSpinning ||
      this.reel2.isSpinning ||
      this.reel3.isSpinning ||
      this.reel4.isSpinning ||
      this.reel5.isSpinning
    ) {
      console.log("already spinning");
      return;
    }

    //proveri kredit
    if (this.credit_amount - this.bet_amount < 0) {
      //nedovoljno kredita
      return;
    }

    //prekini animaciju na rolnama ukoliko možda je u toku
    //i sačekaj da funkcija završi
    if (this.is_animation_running === true) {
      let animation_stopped = new Promise((resolve) => {
        this.cb_notify_animation_stopped = () => {
          resolve();
        };
      });

      console.log("stopping currently running animation");
      //zaustavi animaciju
      this.cancel_animation = true;

      //sačekaj da završi
      await animation_stopped;

      //očisti cb
      this.cb_notify_animation_stopped = null;

      //vrati fleg
      this.cancel_animation = false;

      //zaustavi zvuk
      this.small_win_sound.stop();
      this.mid_win_sound.stop();
      this.jackpot_sound.stop();

      //nastavi dalje
      console.log("awaited stopping process");
    }

    //umanji kredit za iznos uloga
    this.credit_amount -= this.bet_amount;
    this.game_panel.updateCreditAmountText(this.credit_amount);

    this.game_panel.updateWinAmountText(0);

    //odigravanje runde
    let [r1, r2, r3, r4, r5] = PlayRound(this);

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

    //kraj okretanja 4. rolne
    let promiseSpinCompleted4 = new Promise((resolve, reject) => {
      this.reel4.cbSpinCompleted = (reel_id) => {
        resolve(reel_id);
      };
    });

    //kraj okretanja 5. rolne
    let promiseSpinCompleted5 = new Promise((resolve, reject) => {
      this.reel5.cbSpinCompleted = (reel_id) => {
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

    setTimeout(() => {
      this.reel4.spinReel(r4);
    }, 150);

    setTimeout(() => {
      this.reel5.spinReel(r5);
    }, 200);

    //čekanje da sve rolne stanu završe...
    await Promise.all([
      promiseSpinCompleted1,
      promiseSpinCompleted2,
      promiseSpinCompleted3,
      promiseSpinCompleted4,
      promiseSpinCompleted5,
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

    //lista testova za sve kombinacije
    for (let tests_for_symbol of hit_list) {
      let test = tests_for_symbol.test;

      //ako postoji pogodak
      if (test.length > 0) {
        let data = test[0];

        console.dir(test);
        //2 provera
        if (data.hit === true) {
          let payout_factor = Number.parseInt(data.payout);

          //dodaj iznos opklade na kredit
          this.credit_amount += payout_factor * this.bet_amount;

          switch (data.id) {
            case "hit2Top":
            case "hit2Mid":
            case "hit2Low":
              await this.hit2Symbols(
                tests_for_symbol,
                payout_factor,
                data.symbol
              );
              break;

            case "hit3Top":
            case "hit3Mid":
            case "hit3Low":
              console.log(data.symbol);
              await this.hit3Symbols(
                tests_for_symbol,
                payout_factor,
                data.symbol
              );
              break;

            case "hit0Diag":
            case "hit1Diag":
              await this.hitDiags(tests_for_symbol, payout_factor, data.symbol);
              break;

            default:
              break;
          }
        }
      }
    }
    console.log("spin reels finished");
  };

  //start
  startAnimation() {
    //start animacije
    this.ticker.start();
  }

  //izmena kredita
  setCreditAmount(cr) {
    let c = Number.parseFloat(cr);
    if (c > 0) {
      this.credit_amount = c;
    }

    //ui update
    this.game_panel.updateCreditAmountText(this.credit_amount);
  }

  //2 simbola
  async hit2Symbols(element, payout_factor, symbol) {
    console.log("hit 2 symbols fn");

    //promis za čekanje kraja zvuka
    let sound_ended = new Promise((resolve) => {
      this.cb_small_win_sound_ended = () => {
        resolve();
      };
    });

    this.small_win_sound.sound.currentTime = 0;
    this.small_win_sound.play();

    //osveži UI
    //osveži ispis kredita
    this.game_panel.updateCreditAmountText(this.credit_amount);

    //oveži ispis dobitka
    this.game_panel.updateWinAmountText(payout_factor * this.bet_amount);

    //sačekaj da se završi animacija i zvuk
    await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

    console.log("2hits promise awaited");

    //očisti cb
    this.cb_small_win_sound_ended = null;
  }

  //3 simbola
  async hit3Symbols(element, payout_factor, symbol) {
    console.log("hit 3 symbols fn");
    //3 simbola osim "7"
    if (
      [
        "01-lemon",
        "02-orange",
        "03-plum",
        "04-cherry",
        "05-grapes",
        "06-watermelon",
        "08-triple_seven",
        "09-bell",
        "10-clover",
        "11-dollar",
        "12-triple_bar",
      ].includes(symbol)
    ) {
      let sound_ended = new Promise((resolve) => {
        this.cb_mid_win_sound_ended = () => {
          resolve();
        };
      });

      //pokrenti zvuk
      this.mid_win_sound.sound.currentTime = 0;
      this.mid_win_sound.play();

      //osveži UI
      //osveži ispis kredita
      this.game_panel.updateCreditAmountText(this.credit_amount);

      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(payout_factor * this.bet_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      console.log("3hits promise awaited");

      //očisti cb
      this.cb_mid_win_sound_ended = null;
    } else if (symbol === "07-seven") {
      let sound_ended = new Promise((resolve) => {
        this.cb_jackpot_sound_ended = () => {
          resolve();
        };
      });

      //pokrenti zvuk
      this.jackpot_sound.sound.currentTime = 0;
      this.jackpot_sound.play();

      //osveži UI
      //osveži ispis kredita
      this.game_panel.updateCreditAmountText(this.credit_amount);

      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(payout_factor * this.bet_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      //očisti cb
      this.cb_jackpot_sound_ended = null;
    }
  }

  //dijagonale
  async hitDiags(element, payout_factor, symbol) {
    //dijagonale bez "7"
    if (
      [
        "01-lemon",
        "02-orange",
        "03-plum",
        "04-cherry",
        "05-grapes",
        "06-watermelon",
        "08-triple_seven",
        "09-bell",
        "10-clover",
        "11-dollar",
        "12-triple_bar",
      ].includes(symbol)
    ) {
      let sound_ended = new Promise((resolve) => {
        this.cb_mid_win_sound_ended = () => {
          resolve();
        };
      });

      //pokrenti zvuk
      this.mid_win_sound.sound.currentTime = 0;
      this.mid_win_sound.play();

      //osveži UI
      //osveži ispis kredita
      this.game_panel.updateCreditAmountText(this.credit_amount);

      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(payout_factor * this.bet_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      //očisti cb
      this.cb_mid_win_sound_ended = null;
    } else if (symbol === "07-seven") {
      //promise
      let sound_ended = new Promise((resolve) => {
        this.cb_jackpot_sound_ended = () => {
          resolve();
        };
      });

      //pokrenti zvuk
      this.jackpot_sound.sound.currentTime = 0;
      this.jackpot_sound.play();

      //osveži UI
      //osveži ispis kredita
      this.game_panel.updateCreditAmountText(this.credit_amount);

      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(payout_factor * this.bet_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      //očisti cb
      this.cb_jackpot_sound_ended = null;
    }
  }
}
