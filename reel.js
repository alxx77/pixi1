export class Reel {
  constructor(
    reel_id,
    container,
    symbol_width,
    symbol_height,
    reel_sprite_map,
    symbol_slots,
    x_pos,
    cb_finished
  ) {
    //renderer
    this.container = container;

    //reel id
    this.reel_id = reel_id;

    //visina sprajta simbola u px
    this.symbol_height = symbol_height;

    this.symbol_width = symbol_width;

    //svaka instanca klase ima svoj stage
    this.stage = new PIXI.Container();

    this.SymbolSlots = symbol_slots;

    //console.log(this.SymbolSlots)

    this.reel_size = this.SymbolSlots.length;

    this.VisibleSymbolSlotNumber = 3;

    this.reel_sprite_map = reel_sprite_map;

    this.is_spinning = false;

    this.YStepGenerator = null;
  
    //inicijalno postavljanje sprajtova u stage
    //prođi kroz sva mesta za sprajtove +1
    for (let i = 0; i < this.reel_size; i++) {
      //nađi sprajt za dati simbol
      let sprite = this.reel_sprite_map.get(this.SymbolSlots[i]);

      //x koordinata je nula
      sprite.x = 0;

      //y koordinata zavisi od pozicije simbola
      sprite.y = (this.VisibleSymbolSlotNumber - i - 1) * this.symbol_height;

      //ako je y negativan isključi vidljivost
      if (sprite.y < this.symbol_height * -1) sprite.visible = false;

      this.stage.addChild(sprite);
    }

    this.stage.x=x_pos;
    this.container.addChild(this.stage);

    //console.dir(this.reel_id+":" + this.stage.children)

  }

  GetYStepGenerator = function* (r, speed_list) {
    //potrebno je da broj rotacija bude neka relativno razumna brojka
    if (r < 1 || r > 100) return;

    //ukupan broj rotacija
    for (let ir = 0; ir < r; ir++) {
      //vertikalni pomak rolne u 1 frejmu
      let vy = (this.symbol_height / 6.0) * (speed_list[ir] ?? 1);

      //celobrojni ostatak visine sprajta nakon vertikalne translacije vy puta
      let rem = this.symbol_height % vy;

      let step = Math.floor(this.symbol_height / vy);

      //y korak pojedinačne rotacije
      for (let y = 0; y < step; y++) {
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
  Animate = () => {
    //ako je postavljen generator promene y koordinate
    if (this.YStepGenerator) {
      //uzmi sledeću vrednost generatora
      let g = this.YStepGenerator.next();

      //console.log(delta)

      //proveri da li je došao do kraja
      //promeni y koordinatu svim sprajtovima u kontejneru
      if (!g.done) {
        //ako je promena y koord na redu
        if (g.value.y_step_delta) {
          for (
            let symbol_slot = 0;
            symbol_slot < this.reel_size;
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
          let next_sprite = this.stage.children[this.VisibleSymbolSlotNumber];

          next_sprite.visible = true;

          //postavlja mu se ispravna y koordinata
          next_sprite.y = -1 * this.symbol_height;

          //prvi simbol prebaci na kraj rolne (rotacija)
          this.SymbolSlots.push(this.SymbolSlots.shift());
        }
      } else {
        //kraj rotacije

        //zaokruživanje y koord na celobrojnu vrednost
        for (
          let symbol_slot = 0;
          symbol_slot < this.VisibleSymbolSlotNumber + 1;
          symbol_slot++
        ) {
          const spr = this.stage.children[symbol_slot];
          spr.y = Math.round(spr.y);
          //console.log(spr.y)
        }

        //kraj rotacije
        //ukloni generator
        this.ClearYStepGenerator();

        console.log("id: "+ this.reel_id+" " + this.SymbolSlots)

        //kraj
        if (this.cb_finished) {
          if (this.cb_finished instanceof Function) cb_finished(this.reel_id);
        }
      }



    }

  };

  //pokretanje rolne
  SpinReel(r) {
    //proveera da li se rolna možda vrti, ako da ne radi ništa
    if (this.is_spinning) return;
    this.SetYStepGeneratorInstance(r);
    this.is_spinning = true;
  }

  //Kreiraj novu instancu generatora
  SetYStepGeneratorInstance(r) {
    this.YStepGenerator = this.GetYStepGenerator(r + 12, []);
  }

  //ukloni generator
  ClearYStepGenerator() {
    this.YStepGenerator = null;
    this.is_spinning = false;
  }
}
