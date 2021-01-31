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

    //svaka instanca klase ima svoj stage
    this.stage = new PIXI.Container();
    this.stage.height=244*3

    //niz koji skladišti redosled simbola na rolni
    this.reelArray = reel_array;

    //veličina rolne
    this.reelSize = this.reelArray.length;

    //broj vidljivih simbola
    this.visibleReelSymbolSize = 3;

    //mapa sa sprajtovima simbola
    this.reelSpriteMap = reel_sprite_map;

    //da li se trenutno vrti
    this.isSpinning = false;

    //referenca na trenutno aktivan generator y pomaka
    this.yStepGenerator = null;

    //kolbek za završetak
    this.cbSpinCompleted=null;
  

    //inicijalno postavljanje sprajtova u stage
     for (let i = 0; i < this.reelSize; i++) {
      //nađi sprajt za dati simbol
      let sprite = this.reelSpriteMap.get(this.reelArray[i]);

      //x koordinata je nula
      sprite.x = 0;

      //y koordinata zavisi od pozicije simbola
      sprite.y = (this.visibleReelSymbolSize - i - 1) * this.symbolHeight;

      //ako je y negativan isključi vidljivost
      if (sprite.y < this.symbolHeight * -1) sprite.visible = false;

      this.stage.addChild(sprite);
    }

    //postavljanje odgovarajuće pozicije kontejnera
    this.stage.x=x_pos;

    //dodavanje u parent kontejner
    this.container.addChild(this.stage);



  }

  //funkcija koja kreira odgovarajući generator
  //koji generiše korake promene y-koordinate na sprajtovima
  getYStepGenerator = function* (r, speed_list) {

    //potrebno je da broj rotacija bude neka relativno razumna brojka
    if (r < 1 || r > 100) return;

    //ukupan broj rotacija
    for (let ir = 0; ir < r; ir++) {

      //vertikalni pomak rolne u 1 frejmu
      let vy = (this.symbolHeight / 6.0) * (speed_list[ir] ?? 2);

      //celobrojni ostatak visine sprajta nakon vertikalne translacije vy puta
      let rem = this.symbolHeight % vy;

      //broj koraka y translacije
      let step = Math.floor(this.symbolHeight / vy);

      //y korak pojedinačne translacije
      for (let y = 0; y < step; y++) {
        
        //vrati fleg, i vrednost za delta y
        yield { y_step_delta: true, delta: vy };
      }

      //ako postoji ostatak veći od 1 piksela
      //prosledi ga
      if (rem > 1) {
        yield { y_step_delta: true, delta: rem };
      }

      //vrati fleg da je završeno animiranje 1 simbola
      yield { y_step_delta: false, rotate_sprites: true };
    }
  };

  //rendering funkcija koja ide u ticker
  animateReel = () => {
    //ako je postavljen generator promene y koordinate
    if (this.yStepGenerator) {
      //uzmi sledeću vrednost generatora
      let g = this.yStepGenerator.next();

      //console.log(delta)

      //proveri da li je došao do kraja
      //promeni y koordinatu svim sprajtovima u kontejneru
      if (!g.done) {
        //ako je promena y koord na redu
        if (g.value.y_step_delta) {
          for (
            let symbol_slot = 0;
            symbol_slot < this.reelSize;
            symbol_slot++
          ) {
            const spr = this.stage.children[symbol_slot];
            spr.y += g.value.delta;
          }
        } else {
          //ako je donji sprajt u potpunosti izašao iz vidljivog dela kontejnera

          //vidljivost njegovog sprajta se gasi
          this.stage.children[0].visible = false;

          this.stage.children.push(this.stage.children.shift());

          //vidljivost sprajta this.VisibleSymbolSlotNumber se postavlja
          let next_sprite = this.stage.children[this.visibleReelSymbolSize];

          next_sprite.visible = true;

          //postavlja mu se ispravna y koordinata
          next_sprite.y = -1 * this.symbolHeight;

          //prvi simbol prebaci na kraj rolne (rotacija)
          this.reelArray.push(this.reelArray.shift());
        }
      } else {
        //kraj rotacije

        //zaokruživanje y koord na celobrojnu vrednost
        for (
          let symbol_slot = 0;
          symbol_slot < this.visibleReelSymbolSize + 1;
          symbol_slot++
        ) {
          const spr = this.stage.children[symbol_slot];
          spr.y = Math.round(spr.y);
        }

        //kraj rotacije
        //ukloni generator
        this.clearYStepGenerator();

        //console.log("id: "+ this.reelId+" " + this.reelArray)

        //kraj
        if (this.cbSpinCompleted) {
          if (this.cbSpinCompleted instanceof Function) this.cbSpinCompleted(this.reelId);
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
    this.yStepGenerator = this.getYStepGenerator(r + 0, []);
  }

  //ukloni generator
  clearYStepGenerator() {
    this.yStepGenerator = null;
    this.isSpinning = false;
  }
}
