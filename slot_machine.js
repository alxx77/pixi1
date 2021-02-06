import { shuffleArray } from "./helper_fn.js";
import { Reel } from "./reel.js";
import {
  loadTextures,
  initSprites,
  getFrameSprite,
  sound,
  SYMBOL_WIDTH,
  SYMBOL_HEIGHT,
  REEL_X_OFFSET,
  SYMBOL_01_LEMON,
  SYMBOL_02_ORANGE,
  SYMBOL_03_PLUM,
  SYMBOL_04_CHERRY,
  SYMBOL_05_GRAPES,
  SYMBOL_06_WATERMELON,
  SYMBOL_07_SEVEN,
  SYMBOL_08_TRIPLE_SEVEN,
  SYMBOL_09_BELL,
  SYMBOL_10_CLOVER,
  SYMBOL_11_DOLLAR,
  SYMBOL_12_TRIPLE_BAR,
} from "./setup.js";

import { PlayRound } from "./backend.js";
import { checkTotalHits } from "./paytable.js";
import { GamePanel } from "./game_panel.js";
import { winSymbolsFlicker } from "./win_animations.js";

//slot mašina
export class SlotMachine {
  constructor(canvas, symbol_names, currency_sign) {
    this.canvas = canvas;

    //root stage
    this.stage = null;

    //stage za okvir rolni
    this.reel_frame = null;

    //stage za rolne
    this.reel_stage = null;

    //instance rolni
    this.reel1 = null;
    this.reel2 = null;
    this.reel3 = null;
    this.reel4 = null;
    this.reel5 = null;

    //nov ticker objekt
    this.ticker = new PIXI.Ticker();

    //lista imena simbola
    this.symbol_names = symbol_names;

    //simbol valute kredita
    this.currency_sign = currency_sign;

    //kredit
    this.credit_amount = 0;

    //ulog
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


    this.round_is_running=false;

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

  //inicijalizacija
  //******************************************************** */
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
      transparent: true,
    });

    //resize funkcija
    const resize = () => {
      this.viewRecalc(renderer);
    };

    //resize event
    window.addEventListener("resize", resize);

    //promena orijentacije uređaja
    window.addEventListener("orientationchange", resize);

    //stage za okvir rolni
    this.reel_frame = new PIXI.Container();
    this.reel_frame.addChild(getFrameSprite()); //1315x775

    //dodatak mesta za kontrole
    this.reel_frame.height = 775 + 150;
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

    //game panel
    this.game_panel = new GamePanel(this);

    //inicijalni iznos uloga
    this.bet_amount = 10;
    this.game_panel.updateBetAmountText(this.bet_amount);

    this.viewRecalc(renderer);

    //instanciranje instanci reel objekta
    this.createReelInstances(
      map1,
      map2,
      map3,
      map4,
      map5,
      symbol_slot1,
      symbol_slot2,
      symbol_slot3,
      symbol_slot4,
      symbol_slot5
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
  spinReels = async (bet_amount) => {
    console.log("spin reels");

    //zvuk - klik spin dugmeta
    this.spin_button_click.play();

    if(this.round_is_running) {
      console.log("previous round still running")
      return;
    }

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
    if (this.credit_amount - bet_amount < 0) {
      //nedovoljno kredita
      return;
    }

    //postavi fleg
    this.round_is_running=true;

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



    let hit_list = checkTotalHits(reel_matrix, this.symbol_names);

    console.dir(hit_list);

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
          this.setCreditAmount(this.credit_amount + payout_factor * this.bet_amount);

        }
      }
    }

    //nakon obračuna dobitka dozvoljeni su prekidi
    this.round_is_running=false;

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
          let win_amount= payout_factor * this.bet_amount;

          switch (data.id) {
            case "hit2Top":
            case "hit2Mid":
            case "hit2Low":
              await this.hit2Symbols(
                tests_for_symbol,
                win_amount
              );
              break;

            case "hit3Top":
            case "hit3Mid":
            case "hit3Low":
              console.log(data.symbol);
              await this.hit3Symbols(
                tests_for_symbol,
                win_amount,
                data.symbol
              );
              break;

            case "hit0Diag":
            case "hit1Diag":
              await this.hitDiags(tests_for_symbol, win_amount, data.symbol);
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
    if (c >= 0) {
      this.credit_amount = c;
    }

    //ui update
    this.game_panel.updateCreditAmountText(this.credit_amount);
  }

  //2 simbola
  async hit2Symbols(element, win_amount) {
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


    //oveži ispis dobitka
    this.game_panel.updateWinAmountText(win_amount);

    //sačekaj da se završi animacija i zvuk
    await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

    console.log("2hits promise awaited");

    //očisti cb
    this.cb_small_win_sound_ended = null;
  }

  //3 simbola
  async hit3Symbols(element, win_amount, symbol) {
    console.log("hit 3 symbols fn");
    //3 simbola osim "7"
    if (
      [
        SYMBOL_01_LEMON,
        SYMBOL_02_ORANGE,
        SYMBOL_03_PLUM,
        SYMBOL_04_CHERRY,
        SYMBOL_05_GRAPES,
        SYMBOL_06_WATERMELON,
        SYMBOL_08_TRIPLE_SEVEN,
        SYMBOL_09_BELL,
        SYMBOL_10_CLOVER,
        SYMBOL_11_DOLLAR,
        SYMBOL_12_TRIPLE_BAR,
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


      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(win_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      console.log("3hits promise awaited");

      //očisti cb
      this.cb_mid_win_sound_ended = null;
    } else if (symbol === SYMBOL_07_SEVEN) {
      let sound_ended = new Promise((resolve) => {
        this.cb_jackpot_sound_ended = () => {
          resolve();
        };
      });

      //pokrenti zvuk
      this.jackpot_sound.sound.currentTime = 0;
      this.jackpot_sound.play();


      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(win_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      //očisti cb
      this.cb_jackpot_sound_ended = null;
    }
  }

  //dijagonale
  async hitDiags(element, win_amount, symbol) {
    //dijagonale bez "7"
    if (
      [
        SYMBOL_01_LEMON,
        SYMBOL_02_ORANGE,
        SYMBOL_03_PLUM,
        SYMBOL_04_CHERRY,
        SYMBOL_05_GRAPES,
        SYMBOL_06_WATERMELON,
        SYMBOL_08_TRIPLE_SEVEN,
        SYMBOL_09_BELL,
        SYMBOL_10_CLOVER,
        SYMBOL_11_DOLLAR,
        SYMBOL_12_TRIPLE_BAR,
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

      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(win_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      //očisti cb
      this.cb_mid_win_sound_ended = null;
    } else if (symbol === SYMBOL_07_SEVEN) {
      //promise
      let sound_ended = new Promise((resolve) => {
        this.cb_jackpot_sound_ended = () => {
          resolve();
        };
      });

      //pokrenti zvuk
      this.jackpot_sound.sound.currentTime = 0;
      this.jackpot_sound.play();


      //oveži ispis dobitka
      this.game_panel.updateWinAmountText(win_amount);

      //sačekaj da se završi animacija i zvuk
      await Promise.all([winSymbolsFlicker(this, element), sound_ended]);

      //očisti cb
      this.cb_jackpot_sound_ended = null;
    }
  }


  //rekalkulacije veličine stejdža
  viewRecalc = (renderer) => {
    let w = document.documentElement.clientWidth;

    let h = document.documentElement.clientHeight;

    renderer.resize(w, h);

    let mx2 = w - 1315;
    let my2 = h - 925;

    let game_ratio=1315/925
    let renderer_ratio=w/h

    console.log("resize: ", renderer.width, renderer.height,mx2,my2);

    let game_height=0;
    let game_width=0;


    //ako je odnos Š/v veći kod renderera
    //znači da je on širi; tj. da je visina ograničavajući faktor
    if(renderer_ratio>game_ratio){

      //visina igre biće jednaka visini renderera, a max 925
      game_height=Math.min(h,925);

      //preračunaj širinu po njoj
      game_width=game_height*game_ratio

    }else{
    //ako je odnos Š/v manji kod renderera
    //znači da je on ; tj. da je širina ograničavajući faktor

      //uzima se prvo širina renderera a max 1315
      game_width=Math.min(w,1315)

      //po njoj se računa visina
      game_height=game_width/game_ratio

    }

    this.reel_frame.width=game_width;
    this.reel_frame.height=game_height;

    //margine po širini
    if (w < 1315) {
      //glavni panel
      this.reel_frame.x = 0;

    } else {
      //ako postoji pozitivna margina
      //podeli razliku po x osi
      this.reel_frame.x = (w-1315) / 2;

    }

    //margine po visini
    if (w > h) {
      //landscape

      //ako je y margina negativna
      if(h<925){
        //y ofset od 10 px
        this.reel_frame.y=10;
      }else{
        //inače podeli razliku
        this.reel_frame.y=(h-925)/2
      }

    } else {
    //portret
        this.reel_frame.y=Math.max((h*0.34-(game_height/2)),10)

    }
  };

  //instance reel objekata
  createReelInstances(
    map1,
    map2,
    map3,
    map4,
    map5,
    symbol_slot1,
    symbol_slot2,
    symbol_slot3,
    symbol_slot4,
    symbol_slot5
  ) {
    this.reel1 = new Reel(
      1,
      this.reel_stage,
      SYMBOL_WIDTH,
      SYMBOL_HEIGHT,
      map1,
      symbol_slot1,
      REEL_X_OFFSET * 0
    );
    this.reel2 = new Reel(
      2,
      this.reel_stage,
      SYMBOL_WIDTH,
      SYMBOL_HEIGHT,
      map2,
      symbol_slot2,
      REEL_X_OFFSET * 1
    );
    this.reel3 = new Reel(
      3,
      this.reel_stage,
      SYMBOL_WIDTH,
      SYMBOL_HEIGHT,
      map3,
      symbol_slot3,
      REEL_X_OFFSET * 2
    );
    this.reel4 = new Reel(
      4,
      this.reel_stage,
      SYMBOL_WIDTH,
      SYMBOL_HEIGHT,
      map4,
      symbol_slot4,
      REEL_X_OFFSET * 3
    );
    this.reel5 = new Reel(
      5,
      this.reel_stage,
      SYMBOL_WIDTH,
      SYMBOL_HEIGHT,
      map5,
      symbol_slot5,
      REEL_X_OFFSET * 4
    );
  }

  betUp = () => {


    //u zavisnosti od veličine uloga
    //uvećaj za 1,5 ili 10 jedinica

    //ako je ispod 10 jedinica
    if (this.bet_amount < 10) {
      //ako je ispod 5 uvećaj za 1
      if (this.bet_amount < 5) {
        this.bet_amount += 1;
      } else {
        this.bet_amount += 5;
      }
    } else {
      //ako je preko deset uvećaj za 10
      this.bet_amount += 10;
    }

    this.game_panel.updateBetAmountText(this.bet_amount);
  };

  betDown = () => {
    //ako nema kredita izađi
    if (this.bet_amount <= 1) return;

    //u zavisnosti od veličine uloga
    //uvećaj za 1,5 ili 10 jedinica

    //ako je ispod 10 jedinica
    if (this.bet_amount <= 10) {
      //ako je ispod 5 uvećaj za 1
      if (this.bet_amount <= 5) {
        this.bet_amount -= 1;
      } else {
        this.bet_amount -= 5;
      }
    } else {
      //ako je preko deset uvećaj za 10
      this.bet_amount -= 10;
    }

    this.game_panel.updateBetAmountText(this.bet_amount);
  };

  //max bet klik hendler
  maxBet = () => {
    this.bet_amount = this.credit_amount;
    this.game_panel.updateBetAmountText(this.bet_amount);
  }


}
