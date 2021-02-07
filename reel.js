//klasa koja obuhvata sve funkcionalnosti 1 rolne (reel) slota
export class Reel {
  constructor(
    reel_id,
    container,
    symbol_width,
    symbol_height,
    reel_sprite_map,
    reel_array,
    x_pos
  ) {
    //parent kontejner
    this.container = container;

    //reel id
    this.reelId = reel_id;

    //visina sprajta simbola u px
    this.symbolHeight = symbol_height;

    this.symbolWidth = symbol_width;

    //broj vidljivih simbola
    this.visibleReelSymbolCount = 3;

    //svaka instanca klase ima svoj stage
    this.stage = new PIXI.Container();
    this.stage.height = (symbol_height + 1) * this.visibleReelSymbolCount;

    //niz koji skladišti redosled simbola na rolni
    this.reelArray = reel_array;

    //veličina rolne
    this.reelSize = this.reelArray.length;

    //mapa sa sprajtovima simbola
    this.reelSpriteMap = reel_sprite_map;

    //da li se trenutno vrti
    this.isSpinning = false;

    //referenca na trenutno aktivan generator y pomaka
    this.yStepGenerator = null;

    //kolbek za završetak
    this.cbSpinCompleted = null;

    //inicijalno postavljanje sprajtova u stage
    for (let i = 0; i < this.reelSize; i++) {
      //nađi sprajt za dati simbol
      let sprite = this.reelSpriteMap.get(this.reelArray[i]);

      //x koordinata je nula
      sprite.x = 0;

      //y koordinata zavisi od pozicije simbola
      sprite.y = (this.visibleReelSymbolCount - i - 1) * this.symbolHeight;

      //ako je y negativan isključi vidljivost
      if (sprite.y < this.symbolHeight * -1) sprite.visible = false;

      this.stage.addChild(sprite);
    }

    //postavljanje odgovarajuće pozicije kontejnera
    this.stage.x = x_pos;

    //dodavanje u parent kontejner
    this.container.addChild(this.stage);

    //fleg za inicijalizaciju generatora
    this.isGeneratorInitialised=false;

  }

  //funkcija za linearnu interpolaciju
  lerp = (x, y, a) => x * (1 - a) + y * a;


  //funkcija koja kreira odgovarajući generator
  //koji generiše korake promene y-koordinate na sprajtovima
  getYStepGenerator = function* (r) {

    //potrebno je da broj rotacija bude neka relativno razumna brojka
    if (r < 1 || r > 100) return;

    let acc_speed_list = [1,3,6];

    let prev_actual_dy = 0;

    let reel_speed=0;

    //ukupan broj rotacija
    for (let ir = 0; ir < r; ir++) {
      //vertikalni pomak rolne u 1 frejmu
      let projected_dy = 10;
      let total_y_shift = this.symbolHeight;
      reel_speed=7;

      //brzina rotacije ako je početak
      if([0,1,2].includes(ir)){
        reel_speed = acc_speed_list[ir]
      }

      //ako je kraj
      if(ir===r-3){
        reel_speed = 2+Math.random()*2
      }else if(ir===r-2){
        reel_speed=1+Math.random()*1
      } else if(ir===r-1){
        reel_speed=0.1+Math.random()*0.3
      }

      //frame_counter
      let fc=0;//frame_counter
      

      //radi dok se ne potroši ceo y put sprajta 
      while (total_y_shift > 0.1) {
        //delta time
        let dt = yield;

        let actual_dy = projected_dy * dt * reel_speed;

        //ako nema mesta za pun pomak
        if (total_y_shift < actual_dy) {
          actual_dy = total_y_shift;
        }

        //poslednji frame simbola
        let last_symbol_frame=(total_y_shift===actual_dy)

        //vrati y pomak
        yield { y_step_delta: true, delta: actual_dy,fc:fc++,rotation:ir,last_symbol_frame:last_symbol_frame };

        //oduzmi od ukupnog pomaka
        total_y_shift -= actual_dy;

        //sačuvaj info za sledeću iteraciju
        prev_actual_dy = actual_dy;
      }

    }
  };

  //rendering funkcija koja ide u ticker
  animateReel = (dt) => {

    //ako je postavljen generator promene y koordinate
    if (this.yStepGenerator) {

    //pokretanje generatora      
     if(this.isGeneratorInitialised===false){
       this.yStepGenerator.next(dt);
       this.isGeneratorInitialised=true;
     }

     //vrednosti generatora
      let gen_y_step=this.yStepGenerator.next(dt)

      this.yStepGenerator.next();

      //proveri da li je došao do kraja
      //promeni y koordinatu svim sprajtovima u kontejneru
      if (!gen_y_step.done) {
        //ako je u pitanju pomeranje po y osi
        if (gen_y_step.value.y_step_delta===true) {
          for (
            let symbol_slot = 0;
            symbol_slot < this.reelSize;
            symbol_slot++
          ) {
            const spr = this.stage.children[symbol_slot];
            spr.y += gen_y_step.value.delta;
          }
        } 

        //ako je zadnji frejm za simbol
        //podesi stari i novi simbol
        if(gen_y_step.value.last_symbol_frame===true)
        {
          //ako je donji sprajt u potpunosti izašao iz vidljivog dela kontejnera

          //vidljivost njegovog sprajta se gasi
          this.stage.children[0].visible = false;

          this.stage.children.push(this.stage.children.shift());

          //vidljivost sprajta this.VisibleSymbolSlotNumber se postavlja
          let next_sprite = this.stage.children[this.visibleReelSymbolCount];

          next_sprite.visible = true;

          //postavlja mu se ispravna y koordinata
          next_sprite.y = -1 * this.symbolHeight;

          //prvi simbol prebaci na kraj rolne (rotacija)
          this.reelArray.push(this.reelArray.shift());
        }
      } else {
        //kraj rotacije

        //kraj rotacije
        //ukloni generator
        this.clearYStepGenerator();


        //kraj
        if (this.cbSpinCompleted) {
          if (this.cbSpinCompleted instanceof Function)
            this.cbSpinCompleted(this.reelId);
        }
      }
    }
  };

  //pokretanje rolne
  spinReel(r) {
    //proveera da li se rolna možda vrti, ako da ne radi ništa
    if (this.isSpinning) return;
    this.setYStepGeneratorInstance(r);
    this.isSpinning = true;
  }

  //Kreiraj novu instancu generatora
  setYStepGeneratorInstance(r) {
    this.yStepGenerator = this.getYStepGenerator(r + 12, []);
  }

  //ukloni generator
  clearYStepGenerator() {
    this.yStepGenerator = null;
    this.isSpinning = false;
    this.isGeneratorInitialised=false
  }

  //izmena teksture simbola
  setTexture(visible_symbol_position, texture_state) {
    if (this.isSpinning) return;
    this.stage.children[visible_symbol_position].texture =
      PIXI.utils.TextureCache[
        this.reelArray[visible_symbol_position] + texture_state
      ];
  }
}
