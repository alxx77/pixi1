export function PlayRound(slot_machine) {
  console.log("round " + slot_machine.counter + " played");

  //zbog testiranja
  //prve 4 runde su nameštene

  let r1 = Math.floor(Math.random() * 12);
  let r2 = Math.floor(Math.random() * 12);
  let r3 = Math.floor(Math.random() * 12);
  let r4 = Math.floor(Math.random() * 12);
  let r5 = Math.floor(Math.random() * 12);

  //1 runda - 2 x 7
  if (slot_machine.counter === 0) {
    let i1 = slot_machine.reel1.reelArray.indexOf("07-seven");
    let i2 = slot_machine.reel2.reelArray.indexOf("07-seven");

    r1 = i1 >= 1 && i1 <= 11 ? i1 - 1 : 11;
    r2 = i2 >= 1 && i2 <= 11 ? i2 - 1 : 11;
  }

  //2 runda 3x777
  if (slot_machine.counter === 2) {
    let i1 = slot_machine.reel1.reelArray.indexOf("08-triple_seven");
    let i2 = slot_machine.reel2.reelArray.indexOf("08-triple_seven");
    let i3 = slot_machine.reel3.reelArray.indexOf("08-triple_seven");

    r1 = i1 >= 1 && i1 <= 11 ? i1 - 1 : 11;
    r2 = i2 >= 1 && i2 <= 11 ? i2 - 1 : 11;
    r3 = i3 >= 1 && i3 <= 11 ? i3 - 1 : 11;
  }

  //3 runda 3x7
  if (slot_machine.counter === 4) {
    let i1 = slot_machine.reel1.reelArray.indexOf("07-seven");
    let i2 = slot_machine.reel2.reelArray.indexOf("07-seven");
    let i3 = slot_machine.reel3.reelArray.indexOf("07-seven");

    r1 = i1 >= 1 && i1 <= 11 ? i1 - 1 : 11;
    r2 = i2 >= 1 && i2 <= 11 ? i2 - 1 : 11;
    r3 = i3 >= 1 && i3 <= 11 ? i3 - 1 : 11;
  }

  //4 runda 3x7 dijagonalno
  if (slot_machine.counter === 6) {
    let i1 = slot_machine.reel1.reelArray.indexOf("07-seven");
    let i2 = slot_machine.reel2.reelArray.indexOf("07-seven");
    let i3 = slot_machine.reel3.reelArray.indexOf("07-seven");

    r1 = i1;
    r2 = i2 >= 1 && i2 <= 11 ? i2 - 1 : 11;
    r3 = i3 >= 2 && i3 <= 11 ? i3 - 2 : (i3===0 ? 10 : 11);
  }

  slot_machine.counter++

  return [r1, r2, r3,r4,r5];
}


export function getCredit(){
  return 100;
}