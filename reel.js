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
    this.isGeneratorInitialised = false;
  }

  //funkcija za linearnu interpolaciju
  lerp = (x, y, a) => x * (1 - a) + y * a;

  //funkcija koja kreira odgovarajući generator
  //koji generiše korake promene y-koordinate na sprajtovima
  getYStepGenerator = function* (r) {
    //potrebno je da broj rotacija bude neka relativno razumna brojka
    if (r < 1 || r > 100) return;

    //promena brzine pri pokretanju rolni
    let acc_speed_list = [2.5, 3.5, 7, 9.5, 12, 9];

    //3 stepena linearna interpolacija pokreta po y osi
    let prev_actual_dy1 = 0;
    let prev_actual_dy2 = 0;
    let prev_actual_dy3 = 0;

    let reel_speed = 0;

    //ukupan broj rotacija
    for (let ir = 0; ir < r; ir++) {
      //vertikalni pomak rolne u 1 frejmu
      let nominal_dy = 10;

      //ukupan pomak po simbolu
      let total_y_shift = this.symbolHeight;

      //default brzina okretanja rolne
      reel_speed = 8;

      //brzina rotacije ako je početak
      if ([0, 1, 2, 3, 4, 5].includes(ir)) {
        reel_speed = acc_speed_list[ir];
      }

      //ako je kraj
      if (ir === r - 3) {
        reel_speed = 5;
      } else if (ir === r - 2) {
        reel_speed = 3; 
      } else if (ir === r - 1) {
        reel_speed = 0.1 + Math.random() * 2;
      }

      //frame_counter
      let fc = 0;

      //radi dok se ne potroši ceo y put sprajta
      while (total_y_shift > 0) {
        //delta time
        let dt = yield;

        //fleg zadnjeg frejma po simbolu
        let last_frame = false;

        //stvarni put po y osi korigovan za delta time
        let actual_dy = nominal_dy * dt * reel_speed;

        //interpoliraj sa starim pomakom
        let avg2 = this.lerp(prev_actual_dy3, prev_actual_dy2, 0.45);
        let avg1 = this.lerp(prev_actual_dy1, avg2, 0.35);
        actual_dy = this.lerp(actual_dy, avg1, 0.25);

        //ako nema mesta za pun pomak
        if (total_y_shift < actual_dy) {
          //smanji pomak na ostatak puta do kraja
          actual_dy = total_y_shift;

          //označi zadnji frame
          last_frame = true;
        }

        //oduzmi od ukupnog pomaka
        total_y_shift -= actual_dy;

        //sačuvaj info za sledeću iteraciju
        prev_actual_dy3 = prev_actual_dy2;
        prev_actual_dy2 = prev_actual_dy1;
        prev_actual_dy1 = actual_dy;

        //vrati y pomak
        yield {
          delta: actual_dy,
          fc: fc++,
          rotation_end: ir === r - 1,
          last_symbol_frame: last_frame,
        };
      }
    }

    //ovde je regularni deo pokreta završen

    //ukrasni pokret nadole br.1
    let total_y_shift = this.symbolHeight * 0.1;

    let dy = 5;

    yield* this.reelSoftMove(total_y_shift, dy, 1);

    //pokret nagore br1
    total_y_shift = this.symbolHeight * 0.15;
    dy = 7.65;
    yield* this.reelSoftMove(total_y_shift, dy, -1);

    //pokret nadole br. 2
    total_y_shift = this.symbolHeight * 0.1;
    dy = 5;
    yield* this.reelSoftMove(total_y_shift, dy, 1);

    //pokret nagore br. 2
    total_y_shift = this.symbolHeight * 0.05;
    dy = 2.4;
    yield* this.reelSoftMove(total_y_shift, dy, -1);
  };

  //meko zaustavljanje rolni
  reelSoftMove = function* (total_y_shift, dy, direction) {
    let prev_actual_dy = 0;

    while (total_y_shift > 0) {
      //delta time
      let dt = yield;

      //stvarni put po y osi korigovan za delta time
      let actual_dy = dy * dt;

      dy = dy * 0.9;

      if (actual_dy < 0.1) actual_dy = 0.1;

      //interpoliraj sa starim pomakom
      actual_dy = this.lerp(actual_dy, prev_actual_dy, 0.3);

      //ako nema mesta za pun pomak
      if (total_y_shift < actual_dy) {
        //smanji pomak na ostatak puta do kraja
        actual_dy = total_y_shift;
      }

      //oduzmi od ukupnog pomaka
      total_y_shift -= actual_dy;

      //sačuvaj info za sledeću iteraciju
      prev_actual_dy = actual_dy;

      //vrati y pomak
      yield { delta: actual_dy * direction, last_symbol_frame: false };
    }
  };

  //rendering funkcija koja ide u ticker
  animateReel = (dt) => {
    //ako je postavljen generator radi...
    if (this.yStepGenerator) {
      //inicijalizacija generatora
      if (this.isGeneratorInitialised === false) {
        this.yStepGenerator.next(dt);
        this.isGeneratorInitialised = true;
      }

      //vrednosti generatora
      let gen_y_step = this.yStepGenerator.next(dt);

      this.yStepGenerator.next();

      //dok generator radi
      if (!gen_y_step.done) {
        //pomeri sve vidljive simbole za datu vrednost
        for (let symbol_slot = 0; symbol_slot < this.reelSize; symbol_slot++) {
          const spr = this.stage.children[symbol_slot];
          spr.y += gen_y_step.value.delta;
        }

        //ako je zadnji frejm za simbol
        //podesi stari i novi simbol
        if (gen_y_step.value.last_symbol_frame === true) {
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
        //kraj rotacije kada generator završi sa radom

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
    this.yStepGenerator = this.getYStepGenerator(r + 24, []);
  }

  //ukloni generator
  clearYStepGenerator() {
    this.yStepGenerator = null;
    this.isSpinning = false;
    this.isGeneratorInitialised = false;
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
