//lista testova
function getTestList() {
  let hit2Top = {
    id: "hit2Top",
    tests: [
      [0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 0, 0, 1],
    ],
  };

  let hit2Mid = {
    id: "hit2Mid",
    tests: [
      [0, 1, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 0],
    ],
  };

  let hit2Low = {
    id: "hit2Low",
    tests: [
      [1, 0, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0],
    ],
  };

  let hit3Top = { id: "hit3Top", tests: [[0, 0, 1, 0, 0, 1, 0, 0, 1]] };

  let hit3Mid = { id: "hit3Mid", tests: [[0, 1, 0, 0, 1, 0, 0, 1, 0]] };

  let hit3Low = { id: "hit3Low", tests: [[1, 0, 0, 1, 0, 0, 1, 0, 0]] };

  let hit0Diag = { id: "hit0Diag", tests: [[1, 0, 0, 0, 1, 0, 0, 0, 1]] };

  let hit1Diag = { id: "hit1Diag", tests: [[0, 0, 1, 0, 1, 0, 1, 0, 0]] };

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

//provera pogodaka
export function checkTotalHits(reel_matrix, symbol_list) {
  let test_list=getTestList();
  return symbol_list.reduce((acc, el) =>{ 
      
    acc.push({symbol:el, test: checkHitsForTestList(reel_matrix, el,test_list)});

    return acc;
  
  },[]);
}

function checkHitsForTestList(reel_matrix, symbol,test_list) {
  let flat = [...reel_matrix[0], ...reel_matrix[1], ...reel_matrix[2]];

  return test_list.reduce((acc, t, idx) => {
    let result = checkHits(flat, t.tests, symbol);

    result.forEach((el) => {
      if (el.hit === true) {
        acc.push({ id: t.id,symbol:symbol, hit: true, hit_map: el.test_map });
      }
    });

    return acc;
  }, []);
}

//provera 1 testa sa 1 simbolom
function checkHits(flat_reel_matrix, hit_test, symbol) {
  return hit_test
    .map((t) => {
      //prođi kroz niz simbola koji su izvučeni u igri
      return flat_reel_matrix.reduce(
        (acc, x, idx) => {
          let inside_map =
            //1. uslov - niz mora biti jednak simbolu tamo gde je u test matrici obeležen sa 1
            //ili mora biti različit od simbola tamo gde je test matrica 0
            (x === symbol && t[idx] === 1) || (x !== symbol && t[idx] === 0);

          //2. uslov - testiranje promašaja -> javljanje simbola a da je matrica o
          let outside_map = x === symbol && t[idx] === 0;

          acc.inside_map.push(inside_map);
          acc.outside_map.push(outside_map);
          acc.test_map.push(t[idx]);

          return acc;
        },
        { inside_map: [], outside_map: [], test_map: [] }
      );
    })
    .map((el) => {
      //nakon što se dobiju oba uslova za svaku test matricu
      //da bi se kombinacija smatrala pogođenom
      //svi elementi prvog uslova moraju biti true
      //svi elementi drugog uslova moraju biti false

      return {
        test_map: el.test_map,
        hit:
          el.inside_map.every((x) => x === true) &&
          el.outside_map.every((x) => x === false),
      };
    });
}




let rmx31=[["01-lemon", "02-orange", "03-plum"],["01-lemon", "02-orange", "03-plum"],["01-lemon", "02-orange", "03-plum"]]
let rmx32=[["04-cherry", "05-grapes", "06-watermelon"],["04-cherry", "05-grapes", "06-watermelon"],["01-lemon", "02-orange", "03-plum"]]
let rmx33=[["04-cherry", "05-grapes", "06-watermelon"],[ "09-bell", "10-clover", "11-dollar"],["01-lemon", "02-orange", "03-plum"]]

let rmx21=[ ["07-seven", "08-triple_seven", "09-bell"],[ "07-seven", "08-triple_seven", "09-bell"],["10-clover", "11-dollar", "12-triple_bar"]]
let rmx22=[ ["07-seven", "08-triple_seven", "09-bell"],[ "10-clover", "11-dollar", "12-triple_bar"],[ "07-seven", "08-triple_seven", "09-bell"]]
let rmx23=[ [  "03-plum", "04-cherry", "05-grapes"],["10-clover", "11-dollar", "12-triple_bar"],["10-clover", "11-dollar", "12-triple_bar"]]

let rmx41=[ [  "03-plum", "04-cherry", "05-grapes"],["10-clover", "03-plum", "12-triple_bar"],["10-clover", "11-dollar",  "03-plum"]]
let rmx42=[ [  "03-plum", "04-cherry", "05-grapes"],["10-clover", "05-grapes", "12-triple_bar"],["05-grapes", "11-dollar",  "03-plum"]]

let symbol_list=["01-lemon", "02-orange", "03-plum", "04-cherry", "05-grapes", "06-watermelon", "07-seven", "08-triple_seven", "09-bell", "10-clover", "11-dollar", "12-triple_bar"]

export function testPayTable(){
    
    console.dir(checkTotalHits(rmx31,symbol_list))
    console.dir(checkTotalHits(rmx32,symbol_list))
    console.dir(checkTotalHits(rmx33,symbol_list))

    console.dir(checkTotalHits(rmx21,symbol_list))
    console.dir(checkTotalHits(rmx22,symbol_list))
    console.dir(checkTotalHits(rmx23,symbol_list))

    console.dir(checkTotalHits(rmx41,symbol_list))
    console.dir(checkTotalHits(rmx42,symbol_list))

}
