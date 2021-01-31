export class GamePanel{

    constructor(width,cb_spin_button){
    

        this.stage=new PIXI.Container()

        this.stage.width=width
        this.stage.height=100
        this.stage.x=200

        this.spin_button=new PIXI.Sprite(PIXI.utils.TextureCache["cp1_button"]);

        this.spin_button.scale.set(0.3,0.3)
        this.spin_button.x=550
        this.spin_button.interactive=true;
        this.spin_button.buttonMode = true;

        let reel_stage=new PIXI.Container();
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        mask.width = 244*3;
        mask.height =100;
        this.stage.addChild(mask);
        this.stage.mask = mask;

        this.spin_button.on('click', (event) => {
            if (cb_spin_button) {
                if (cb_spin_button instanceof Function) cb_spin_button();
              }
           console.log("klik")
         });

        this.stage.addChild(this.spin_button)

        const style = new PIXI.TextStyle({
            fontFamily: "Verdana, Geneva, sans-serif"
        });
        const text = new PIXI.Text('credit: 000', style);
        text.x=250
        this.stage.addChild(text)
        

    }




}