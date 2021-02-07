import {getGamePanelBackgroundSprite} from "./setup.js"

export class GamePanel {
  constructor(slot_machine){ //stage, currency_sign, cb_spin,cb_max_bet,cb_bet_up,cb_bet_down) {
    this.currency_sign = slot_machine.currency_sign

    //stage
    let stage = slot_machine.reel_frame;

    let cb_spin=slot_machine.spinReels
    let cb_max_bet=slot_machine.maxBet
    let cb_bet_up=slot_machine.betUp
    let cb_bet_down=slot_machine.betDown

    //bela pozadina
    const bg = getGamePanelBackgroundSprite();
    bg.y=755
    stage.addChild(bg)

    //dugme za pokretanje
    this.spin_button = new PIXI.Sprite(PIXI.utils.TextureCache["spin_button"]);
    this.spin_button.scale.set(0.36);
    this.spin_button.x = 1040;
    this.spin_button.y=780
    this.spin_button.interactive = true;
    this.spin_button.buttonMode = true;

    //max bet dugme
    this.max_bet_button = new PIXI.Sprite(PIXI.utils.TextureCache["max_bet_button"]);
    this.max_bet_button.scale.set(0.36);
    this.max_bet_button.x = 70;
    this.max_bet_button.y=780
    this.max_bet_button.interactive = true;
    this.max_bet_button.buttonMode = true;

    //uvećanje uloga
    this.bet_up_button = new PIXI.Sprite(PIXI.utils.TextureCache["bet_up_button"]);
    this.bet_up_button.scale.set(0.17);
    this.bet_up_button.x = 500;
    this.bet_up_button.y=830
    this.bet_up_button.interactive = true;
    this.bet_up_button.buttonMode = true;

    //umanjenje uloga
    this.bet_down_button = new PIXI.Sprite(PIXI.utils.TextureCache["bet_down_button"]);
    this.bet_down_button.scale.set(0.17);
    this.bet_down_button.x = 360;
    this.bet_down_button.y=830
    this.bet_down_button.interactive = true;
    this.bet_down_button.buttonMode = true;

 

    //klik hendler za spin dugme
    this.spin_button.on("pointerdown", (event) => {
      if (cb_spin) {
        if (cb_spin instanceof Function) cb_spin(slot_machine.bet_amount);
      }
    });

    //klik hendler za max bet
    this.max_bet_button.on("pointerdown", (event) => {
      if (cb_max_bet) {
        if (cb_max_bet instanceof Function) cb_max_bet();
      }
    });

    //klik hendler za uvećanje uloga
    this.bet_up_button.on("pointerdown", (event) => {
      if (cb_bet_up) {
        if (cb_bet_up instanceof Function) cb_bet_up();
      }
    });

    //klik hendler za umanjenje uloga
    this.bet_down_button.on("pointerdown", (event) => {
      if (cb_bet_down) {
        if (cb_bet_down instanceof Function) cb_bet_down();
      }
    });


    //text objekti
    let style1 = new PIXI.TextStyle({
        fontFamily: "Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif; ",
        fontSize:"32px"
      });

      let style2 = new PIXI.TextStyle({
        fontFamily: "Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif; ",
        fontSize:"32px",
        fontWeight:"bold"
      });

      //kredit
    this.credit_amount_text_object=new PIXI.Text(`Credit: 0 ${this.currency_sign}`, style1);
    this.credit_amount_text_object.x=710
    this.credit_amount_text_object.y=835
    stage.addChild(this.credit_amount_text_object);

    //ulog
    this.bet_amount_text_object=new PIXI.Text(`Bet: 0 ${this.currency_sign}`, style2);
    this.bet_amount_text_object.x=420
    this.bet_amount_text_object.y=785

    stage.addChild(this.bet_amount_text_object);

    //dobitak
    this.win_amount_text_object=new PIXI.Text(`Win: 0 ${this.currency_sign}`, style1);
    this.win_amount_text_object.x=740
    this.win_amount_text_object.y=785
    

    stage.addChild(this.win_amount_text_object);


    //dodavanje u stejdž
    stage.addChild(this.spin_button);
    stage.addChild(this.max_bet_button);
    stage.addChild(this.bet_up_button);
    stage.addChild(this.bet_down_button);

    //tekst
    this.updateCreditAmountText(0);
    this.updateBetAmountText(0);
    this.updateWinAmountText(0);
  }

  refreshText(credit,bet,win){
    this.updateCreditAmountText(credit)
    this.updateBetAmountText(bet)
    this.updateWinAmountText(win)
  }

  //ispis kredita
  updateCreditAmountText(amount) {
    this.credit_amount_text_object.text=`Credit: ${amount} ${this.currency_sign}`;
  }

  //ispis iznosa trenutne opklade
  updateBetAmountText(amount) {
    this.bet_amount_text_object.text=`Bet: ${amount} ${this.currency_sign}`;
  }

  //ispis iznosa trenutne opklade
  updateWinAmountText(amount) {
    this.win_amount_text_object.text=`Win: ${amount} ${this.currency_sign}`;
  }
}
