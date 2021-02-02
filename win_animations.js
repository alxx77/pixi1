export async function winSymbolsFlicker2Hits(
  slot_machine,
  hit_test_element,
  is_running,
  cancel
) {

  is_running.value=true;

  let symbol = hit_test_element.symbol;
  let test = hit_test_element.test[0];

  let reel1hitmap = test.hit_map.slice(0, 3);
  let reel2hitmap = test.hit_map.slice(3, 6);
  let reel3hitmap = test.hit_map.slice(6, 9);

  let hit_test_list = [reel1hitmap, reel2hitmap, reel3hitmap];
  let reels = [slot_machine.reel1, slot_machine.reel2, slot_machine.reel3];

  //prođi kroz sve rolne
  [0, 1, 2].forEach((reel) => {
    //kroz svaku poziciju
    [0, 1, 2].forEach(async (position) => {
      //ako postoji poklapanje
      if (hit_test_list[reel][position] === 1) {
        //kruži različite teksture
        for (let i of [1, 2, 3, 4, 5, 6, 7]) {
          if (cancel.value === true) {
            console.log("canceled")
            is_running.value=false;
            return;
          }
          await cycleSymbolTexture(reels[reel], position, symbol);
        }
      }
    });
  });

  is_running.value=false;

}

export function winSymbolsFlicker3Hits(slot_machine, hit_test_element) {
  console.log("hit 3 animation");
  let symbol = hit_test_element.symbol;
  let test = hit_test_element.test[0];

  let reel1hitmap = test.hit_map.slice(0, 3);
  let reel2hitmap = test.hit_map.slice(3, 6);
  let reel3hitmap = test.hit_map.slice(6, 9);

  let hit_test_list = [reel1hitmap, reel2hitmap, reel3hitmap];
  let reels = [slot_machine.reel1, slot_machine.reel2, slot_machine.reel3];

  //prođi kroz sve rolne
  [0, 1, 2].forEach(async (reel) => {
    //kroz svaku poziciju
    for await (let position of [0, 1, 2]) {
      let p = new Promise(async (resolve) => {
        //ako postoji poklapanje
        if (hit_test_list[reel][position] === 1) {
          //kruži različite teksture
          for (let i of [1, 2, 3]) {
            await cycleSymbolTexture(reels[reel], position, symbol);
          }
        }
        resolve();
      });
    }
  });
}

async function cycleSymbolTexture(reel, position, symbol) {
  async function Delay(n) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, n)
    );
  }

  await Delay(50);

  reel.setTexture(position, symbol + "_hi");

  await Delay(250);

  reel.setTexture(position, symbol + "_low2");

  await Delay(100);

  reel.setTexture(position, symbol + "_low");

  await Delay(50);
}
