export function PlayRound(symbol_slot1, symbol_slot2, symbol_slot3) {
  let r1 = Math.floor(Math.random() * 12);
  let r2 = Math.floor(Math.random() * 12);
  let r3 = Math.floor(Math.random() * 12);

  let m=[symbol_slot1]

  return [r1, r2, r3];
}
