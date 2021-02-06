
import {
  SYMBOL_01_LEMON,
  SYMBOL_02_ORANGE,
  SYMBOL_03_PLUM,
  SYMBOL_04_CHERRY,
  SYMBOL_05_GRAPES,
  SYMBOL_06_WATERMELON,
  SYMBOL_07_SEVEN,
  SYMBOL_08_TRIPLE_SEVEN,
  SYMBOL_09_BELL,
  SYMBOL_10_CLOVER,
  SYMBOL_11_DOLLAR,
  SYMBOL_12_TRIPLE_BAR,
} from "./setup.js";

//lista testova
function getHitTestList() {
  let hit2Top = {
    id: "hit2Top",
    tests: [
      [0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 0, 0, 1],
    ],
    mask: [0, 0, 1, 0, 0, 1, 0, 0, 1],
  };

  let hit2Mid = {
    id: "hit2Mid",
    tests: [
      [0, 1, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 0],
    ],
    mask: [0, 1, 0, 0, 1, 0, 0, 1, 0],
  };

  let hit2Low = {
    id: "hit2Low",
    tests: [
      [1, 0, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0],
    ],
    mask: [1, 0, 0, 1, 0, 0, 1, 0, 0],
  };

  let hit3Top = {
    id: "hit3Top",
    tests: [[0, 0, 1, 0, 0, 1, 0, 0, 1]],
    mask: [0, 0, 1, 0, 0, 1, 0, 0, 1],
  };

  let hit3Mid = {
    id: "hit3Mid",
    tests: [[0, 1, 0, 0, 1, 0, 0, 1, 0]],
    mask: [0, 1, 0, 0, 1, 0, 0, 1, 0],
  };

  let hit3Low = {
    id: "hit3Low",
    tests: [[1, 0, 0, 1, 0, 0, 1, 0, 0]],
    mask: [1, 0, 0, 1, 0, 0, 1, 0, 0],
  };

  let hit0Diag = {
    id: "hit0Diag",
    tests: [[1, 0, 0, 0, 1, 0, 0, 0, 1]],
    mask: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  };

  let hit1Diag = {
    id: "hit1Diag",
    tests: [[0, 0, 1, 0, 1, 0, 1, 0, 0]],
    mask: [0, 0, 1, 0, 1, 0, 1, 0, 0],
  };

  return [
    hit2Top,
    hit2Mid,
    hit2Low,
    hit3Top,
    hit3Mid,
    hit3Low,
    hit0Diag,
    hit1Diag,
  ];
}

function getSymbolValueMap() {
  let x = new Map();

  x.set(SYMBOL_01_LEMON, 1);
  x.set(SYMBOL_02_ORANGE, 1);
  x.set(SYMBOL_03_PLUM, 1);
  x.set(SYMBOL_04_CHERRY, 1);
  x.set(SYMBOL_05_GRAPES, 1);
  x.set(SYMBOL_06_WATERMELON, 1);
  x.set(SYMBOL_07_SEVEN, 10);
  x.set(SYMBOL_08_TRIPLE_SEVEN, 5);
  x.set(SYMBOL_09_BELL, 2);
  x.set(SYMBOL_10_CLOVER, 2);
  x.set(SYMBOL_11_DOLLAR, 3);
  x.set(SYMBOL_12_TRIPLE_BAR, 2);

  return x
}

function getCombinationAndPositionValueMap() {
  let x = new Map();

  x.set("hit2Top", 1);
  x.set("hit2Mid", 2);
  x.set("hit2Low", 1);
  x.set("hit3Top", 10);
  x.set("hit3Mid", 100);
  x.set("hit3Low", 10);
  x.set("hit0Diag", 20);
  x.set("hit1Diag", 20);

  return x;
}

function GetPayout(symbol,hitCombination){


  let symbol_value=getSymbolValueMap().get(symbol)

  let position_factor=getCombinationAndPositionValueMap().get(hitCombination)

  return symbol_value*position_factor;

}



//provera pogodaka
export function checkTotalHits(reel_matrix, symbol_list) {
  let test_list = getHitTestList();
  //prođi kroz listu simbola
  return symbol_list.reduce((acc, el) => {
    acc.push({
      symbol: el,
      //uradi sve testove za 1 simbol
      test: checkHitsForTestList(reel_matrix, el, test_list),
    });

    return acc;
  }, []);
}

//prolazak kroz listu testova
function checkHitsForTestList(reel_matrix, symbol, test_list) {
  let flat = [...reel_matrix[0], ...reel_matrix[1], ...reel_matrix[2]];

  return test_list.reduce((acc, t, idx) => {
    let result = checkHits(flat, t.tests, symbol, t.mask);

    result.forEach((el) => {
      if (el.hit === true) {
        acc.push({ id: t.id, symbol: symbol, hit: true, hit_map: el.test_map,payout:GetPayout(symbol,t.id)});
      }
    });

    return acc;
  }, []);
}

//provera 1 testa sa 1 simbolom
function checkHits(flat_reel_matrix, hit_test, symbol, mask) {
  return hit_test
    .map((t) => {
      //prođi kroz niz simbola koji su izvučeni u igri
      return flat_reel_matrix.reduce(
        (acc, x, idx) => {
          //transformacija u 0 i 1 (ostaje samo 1 simbol)
          let transformed = x === symbol ? 1 : 0;

          //maskiranje matrice
          let masked = mask[idx] === 1 && transformed === 1;

          //1. uslov - prisutnost datog obrasca
          let presence =
            (masked === true && t[idx] === 1) ||
            (masked === false && t[idx] === 0);

          acc.presence_map.push(presence);
          acc.masked_map.push(masked);
          acc.test_map.push(t[idx]);
          acc.flat_matrix.push(x);
          acc.transf_matrix.push(transformed);

          return acc;
        },
        {
          presence_map: [],
          masked_map: [],
          test_map: [],
          flat_matrix: [],
          transf_matrix: [],
        }
      );
    })
    .map((el) => {
      //nakon što se dobiju oba uslova za svaku test matricu
      //da bi se kombinacija smatrala pogođenom
      //svi elementi prvog uslova moraju biti true
      //svi elementi drugog uslova moraju biti false

      return {
        test_map: el.test_map,
        hit: el.presence_map.every((x) => x === true),
      };
    });
}

