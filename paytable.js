
//provera pogodaka 1D niz
function testHit1DArr(target_arr, symbol, hit_matrix_arr, mask_arr) {
  
  //prođi kroz simbole na na datom delu 1 rolne
  return target_arr.reduce(
    (acc, el, idx) => {

      //maskiranje delova niza koji nisu od interesa
      let masked_target = mask_arr[idx] === 1 ? el : "";

      //tranformacija u 0 ili 1
      let transformed_target = masked_target === symbol ? 1 : 0;

      //poređenje sa matricom pogodaka
      acc.match.push(transformed_target === hit_matrix_arr[idx] ? 1 : 0);

      //pohranjivanje podataka za izlaz
      acc.target.push(el);
      acc.hit.push(hit_matrix_arr[idx]);
      acc.mask.push(mask_arr[idx]);
      return acc;
    },
    { match: [], target: [], hit: [], mask: [] }
  );
}

//provera svih rolni
function testHit2DArr(target, symbol, hit_matrix, mask) {

    //za sve rolne poziva se funkcija
  return target.reduce((acc, el, idx) => {
    acc.push(testHit1DArr(el, symbol, hit_matrix[idx], mask[idx]));

    return acc;
  }, []);
}

let top_row_mask = [
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1],
];
let mid_row_mask = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
];
let btm_row_mask = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
];

let diag0_mask = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
let diag1_mask = [
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 0],
];

//matrice testiranja pogodaka
//za 2 pogotka u svakoj liniji postoje 3 moguće kombinacije
let hit_mid_101 = [
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0],
];

let hit_mid_110 = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 0, 0],
];

let hit_mid_011 = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 1, 0],
];

let hit_top_101 = [
  [0, 0, 1],
  [0, 0, 0],
  [0, 0, 1],
];

let hit_top_110 = [
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 0],
];

let hit_top_011 = [
  [0, 0, 0],
  [0, 0, 1],
  [0, 0, 1],
];

let hit_btm_101 = [
  [1, 0, 0],
  [0, 0, 0],
  [1, 0, 0],
];

let hit_btm_110 = [
  [1, 0, 0],
  [1, 0, 0],
  [0, 0, 0],
];

let hit_btm_011 = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
];

//tri ista u srednjoj liniji
let hit_mid_111 = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
];

let hit_top_111 = [
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1],
];

let hit_btm_111 = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
];

//2 dijagonale
let hit_diag_0 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

let hit_diag_1 = [
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 0],
];

//2 ista simbola u gornjem redu
let top_2_hits = {
  id: "top_2_hits",
  mask: top_row_mask,
  hit_test: [hit_top_110, hit_top_101, hit_top_011],
};

//2 ista simbola u srednjem redu
let mid_2_hits = {
  id: "mid_2_hits",
  mask: mid_row_mask,
  hit_test: [hit_mid_110, hit_mid_101, hit_mid_011],
};

//2 ista simbola u donjem redu
let btm_2_hits = {
  id: "btm_2_hits",
  mask: btm_row_mask,
  hit_test: [hit_btm_110, hit_btm_101, hit_btm_011],
};

//3 ista simbola u gornjem redu
let top_3_hits = {
  id: "top_3_hits",
  mask: top_row_mask,
  hit_test: [hit_top_111],
};

//3 ista simbola u srednjem redu
let mid_3_hits = {
  id: "mid_3_hits",
  mask: mid_row_mask,
  hit_test: [hit_mid_111],
};

//3 ista simbola u donjem redu
let btm_3_hits = {
  id: "btm_3_hits",
  mask: btm_row_mask,
  hit_test: [hit_btm_111],
};

//diagonala 0
let diag0_hits = { id: "diag0_hits", mask: diag0_mask, hit_test: [hit_diag_0] };

//diagonala 1
let diag1_hits = { id: "diag1_hits", mask: diag1_mask, hit_test: [hit_diag_1] };

//lista svih testova
let hit_list = [
  top_2_hits,
  mid_2_hits,
  btm_2_hits,
  top_3_hits,
  mid_3_hits,
  btm_3_hits,
  diag0_hits,
  diag1_hits,
];

//glavna funkcija provere pogodaka
export function checkHits(reel_matrix, symbol_list) {
  //za svaki simbol prođi sve testove
  symbol_list.reduce(
    acc_sym,
    (el_sym) => {
      //lista svih testova
      let x = hit_list.reduce((acc_hit_list, el_hit_list) => {
        //id testa
        let id = el_hit_list.id;

        //1 maska po testu
        let mask = el_hit_list.mask;

        //lista testova pogodaka
        let hit_test_arr = el_hit_list.hit_test;

        //prođi kroz listu
        let result = hit_test_arr.reduce((acc, el) => {
          acc.push(testHit2DArr(reel_matrix, el_sym, el, mask));
          return acc;
        }, []);

        //rezultat
        acc_hit_list.push({ id: id, hits: result });

        return acc_hit_list;
      }, []);

      //za svaki simbol sačuvaj objekt u listu
      acc_sym.push({ symbol: el_sym, hit_list: x });

      return acc_sym;
    },
    []
  );
}

