export async function winSymbolsFlicker(slot_machine, hit_test_element) {

  console.dir("fn - animation started");

  if (slot_machine.reel1.isSpinning || slot_machine.reel2.isSpinning || slot_machine.reel3.isSpinning){
    console.log("fn - animation: reels spinning; exit")
    return;
  }

  //ako neka animacija već traje izađi
  if (slot_machine.is_animation_running === true) {
    console.log("fn - animation already running");
    return;
  }

  //postavi fleg
  slot_machine.is_animation_running = true;

  let symbol = hit_test_element.symbol;
  let hit_map = hit_test_element.test[0].hit_map;

  //svi vidljivi delovi rolni prebačeni u niz
  let flatmatrix = [
    ...slot_machine.reel1.reelArray.slice(0, 3),
    ...slot_machine.reel2.reelArray.slice(0, 3),
    ...slot_machine.reel3.reelArray.slice(0, 3),
  ];

  //ciklusi treperenja
  for await (let i of [1, 2, 3, 4, 5]) {
    //proveri zahtev za prekidom
    //ako postoji postavi fleg i izađi
    if (slot_machine.cancel_animation === true) {
      slot_machine.is_animation_running = false;
      console.log("fn - animation early exit");
      return;
    }

    //animacija
    await Delay(50);

    //postavljanje svega na hi
    switchTextures(slot_machine, hit_map, "_hi");

    await Delay(100);

    //low2
    switchTextures(slot_machine, hit_map, "_low2");

    await Delay(100);

    //normal
    switchTextures(slot_machine, hit_map, "_low");

    await Delay(50);
  }
  //postavi fleg da je gotovo
  console.dir("fn - animation finished");
  slot_machine.is_animation_running = false;

  return;
}

async function Delay(n) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, n)
  );
}

function switchTextures(slot_machine, hit_map, texture_state) {
  for (let [idx, value] of hit_map.entries()) {
    if (value === 1) {
      if (idx >= 0 && idx <= 2) {
        slot_machine.reel1.setTexture(idx, texture_state);
      }
      if (idx >= 3 && idx <= 5) {
        slot_machine.reel2.setTexture(idx - 3, texture_state);
      }

      if (idx >= 6 && idx <= 8) {
        slot_machine.reel3.setTexture(idx - 6, texture_state);
      }
    }
  }
}
