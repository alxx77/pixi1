export class GamePanel {
  constructor(stage, currency_sign, cb_spin_button) {
    this.currency_sign = currency_sign;

    //glavni kontejner
    this.stage = stage;

    //dugme za pokretanje
    this.spin_button = new PIXI.Sprite(PIXI.utils.TextureCache["cp1_button"]);
    this.spin_button.scale.set(0.4);
    this.spin_button.x = 1030;
    this.spin_button.y=780
    this.spin_button.interactive = true;
    this.spin_button.buttonMode = true;

 

    //klik hendler
    this.spin_button.on("pointerdown", (event) => {
      if (cb_spin_button) {
        if (cb_spin_button instanceof Function) cb_spin_button();
      }
    });


    //text objekti
    let style = new PIXI.TextStyle({
        fontFamily: "Verdana, Geneva, sans-serif",
      });

      //kredit
    this.credit_amount_text_object=new PIXI.Text(`Credit: 0 ${this.currency_sign}`, style);
    this.credit_amount_text_object.x=780
    this.credit_amount_text_object.y=800
    this.stage.addChild(this.credit_amount_text_object);

    //ulog
    this.bet_amount_text_object=new PIXI.Text(`Bet: 0 ${this.currency_sign}`, style);
    this.bet_amount_text_object.x=780
    this.bet_amount_text_object.y=840

    this.stage.addChild(this.bet_amount_text_object);

    //dobitak
    this.win_amount_text_object=new PIXI.Text(`Win: 0 ${this.currency_sign}`, style);
    this.win_amount_text_object.x=600
    this.win_amount_text_object.y=820
    

    this.stage.addChild(this.win_amount_text_object);


    //dodavanje u stejdž
    this.stage.addChild(this.spin_button);
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
