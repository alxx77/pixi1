export class GamePanel {
  constructor(stage, currency_sign, cb_spin_button) {
    this.currency_sign = currency_sign;

    //glavni kontejner
    this.stage = stage;

    //dugme za pokretanje
    this.spin_button = new PIXI.Sprite(PIXI.utils.TextureCache["cp1_button"]);
    this.spin_button.scale.set(0.3);
    this.spin_button.x = 500;
    this.spin_button.interactive = true;
    this.spin_button.buttonMode = true;

    //maska
    const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
    mask.width = 1315;
    mask.height = 100;
    this.stage.addChild(mask);
    this.stage.mask = mask;

    //klik hendler
    this.spin_button.on("click", (event) => {
      if (cb_spin_button) {
        if (cb_spin_button instanceof Function) cb_spin_button();
      }
    });

    this.spin_button.on("tap", (event) => {
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
    this.credit_amount_text_object.x=250
    this.stage.addChild(this.credit_amount_text_object);

    //ulog
    this.bet_amount_text_object=new PIXI.Text(`Bet: 0 ${this.currency_sign}`, style);
    this.bet_amount_text_object.x=280
    this.bet_amount_text_object.y=30

    this.stage.addChild(this.bet_amount_text_object);

    //dobitak
    this.win_amount_text_object=new PIXI.Text(`Win: 0 ${this.currency_sign}`, style);
    this.win_amount_text_object.x=280
    this.win_amount_text_object.y=60

    this.stage.addChild(this.win_amount_text_object);


    //dodavanje u stejdž
    this.stage.addChild(this.spin_button);
    this.updateCreditAmountText(0);
    this.updateBetAmountText(0);
    this.updateWinAmountText(0);
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
