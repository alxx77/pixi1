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

  return x;
}

function getCombinationAndPositionValueMap() {
  let x = new Map();

  x.set("hit2Top", 1);
  x.set("hit2Mid", 2);
  x.set("hit2Low", 1);
  x.set("hit3Top", 5);
  x.set("hit3Mid", 10);
  x.set("hit3Low", 5);
  x.set("hit4Top", 20);
  x.set("hit4Mid", 40);
  x.set("hit4Low", 20);
  x.set("hit5Top", 50);
  x.set("hit5Mid", 100);
  x.set("hit5Low", 50);

  return x;
}

//obračun - u broju uloga
function GetPayout(symbol, hitCombination) {
  let symbol_value = getSymbolValueMap().get(symbol);

  let position_factor = getCombinationAndPositionValueMap().get(hitCombination);

  return symbol_value * position_factor;
}

//transponovanje 2D matrice
function transpose(array) {
  return array.reduce(
    (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
    []
  );
}

//suma
const sum = (xs) => xs.reduce((x, y) => x + y, 0);

//provere
const hit2TopCheck = { id: "hit2Top", mask_row: 2, sum_row: 2 };
const hit2MidCheck = { id: "hit2Mid", mask_row: 1, sum_row: 2 };
const hit2LowCheck = { id: "hit2Low", mask_row: 0, sum_row: 2 };

const hit3TopCheck = { id: "hit3Top", mask_row: 2, sum_row: 3 };
const hit3MidCheck = { id: "hit3Mid", mask_row: 1, sum_row: 3 };
const hit3LowCheck = { id: "hit3Low", mask_row: 0, sum_row: 3 };

const hit4TopCheck = { id: "hit4Top", mask_row: 2, sum_row: 4 };
const hit4MidCheck = { id: "hit4Mid", mask_row: 1, sum_row: 4 };
const hit4LowCheck = { id: "hit4Low", mask_row: 0, sum_row: 4 };

const hit5TopCheck = { id: "hit5Top", mask_row: 2, sum_row: 5 };
const hit5MidCheck = { id: "hit5Mid", mask_row: 1, sum_row: 5 };
const hit5LowCheck = { id: "hit5Low", mask_row: 0, sum_row: 5 };

const test_list_new = [
  hit2TopCheck,
  hit2MidCheck,
  hit2LowCheck,
  hit3TopCheck,
  hit3MidCheck,
  hit3LowCheck,
  hit4TopCheck,
  hit4MidCheck,
  hit4LowCheck,
  hit5TopCheck,
  hit5MidCheck,
  hit5LowCheck,
];

//provera pogodaka - 1 test 
function testMatrix(reel_matrix, check_obj, symbol) {
  //prolazak kroz matricu rolni
  let hit_matrix2D = reel_matrix.reduce((acc, reel_el) => {
    //maskiraj dati red i proveri poklapanje simbola
    acc.push(
      reel_el.map((s, idx) =>
        idx === check_obj.mask_row ? (s === symbol ? 1 : 0) : 0
      )
    );

    return acc;
  }, []);

  //da bi se proverile sume po redovima
  //najlakše je transponovati matricu
  let transposed2D_matrix = transpose(hit_matrix2D);

  //test je uspešan ako je suma pogodaka jednaka polju sum row
  let hit = sum(transposed2D_matrix[check_obj.mask_row]) === check_obj.sum_row;

  return {
    id: check_obj.id,
    symbol: symbol,
    hit: hit,
    hit_map: hit_matrix2D.flat(),
    payout: GetPayout(symbol, check_obj.id),
  };
}

//prođi kroz listu svih testova za 1 simbol
function checkAllTests(reel_matrix, symbol, test_list) {

  return test_list.reduce((acc, check_obj) => {
    let result = testMatrix(reel_matrix, check_obj, symbol);

    if (result.hit === true) {
      acc.push(result);
    }
    return acc;
  }, []);
}

//ukupno svi testovi za sve simbole
export function checkTotalHits(reel_matrix, symbol_list) {
  let test_list = test_list_new;
  //prođi kroz listu simbola
  return symbol_list.reduce((acc, el) => {
    acc.push({
      symbol: el,
      //uradi sve testove za 1 simbol
      test: checkAllTests(reel_matrix, el, test_list),
    });

    return acc;
  }, []);
}
