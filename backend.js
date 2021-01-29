import { getReelSymbolTextureNames } from "./setup.js";
import { checkHits } from "./paytable.js"

export function PlayRound(symbol_slot1, symbol_slot2, symbol_slot3) {
  let r1 = Math.floor(Math.random() * 12);
  let r2 = Math.floor(Math.random() * 12);
  let r3 = Math.floor(Math.random() * 12);

  //podaci sa sve 3 rolne
  let reel_matrix = [
    [symbol_slot1.slice(0, 3)],
    [symbol_slot2.slice(0, 3)],
    [symbol_slot3.slice(0, 3)],
  ];

  let symbol_list = Array.from(getReelSymbolTextureNames().keys());

  let hit_list=checkHits(reel_matrix,symbol_list)

  return {hit_list:hit_list,  [r1, r2, r3]};
}
