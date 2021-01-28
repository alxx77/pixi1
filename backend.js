import { getReelSymbolTextureNames } from "./setup.js"

export function PlayRound(symbol_slot1, symbol_slot2, symbol_slot3) {
  let r1 = Math.floor(Math.random() * 12);
  let r2 = Math.floor(Math.random() * 12);
  let r3 = Math.floor(Math.random() * 12);

  //matrice testiranja pogodaka
  //za 2 pogotka u srednjoj liniji postoje 3 moguće kombinacije
  let hit_mid_20 = [
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
  ];

  let hit_mid_21 = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];

  
  let hit_mid_22 = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
  ];

  //tri ista u srednjoj liniji
  let hit_mid_3 = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
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

  let hit_matrices_arr=[
    hit_mid_20, hit_mid_21,hit_mid_22,hit_mid_3,hit_diag_0,hit_diag_1
  ]

  let reel_matrix = [
    [symbol_slot1.slice(0, 3)],
    [symbol_slot2.slice(0, 3)],
    [symbol_slot3.slice(0, 3)],
  ];

  let symbols=Array.from(getReelSymbolTextureNames().keys())

  let check_mask_fn=(mask,symbol,target)=>{

    let sym_mask=mask.map((el,idx)=>{
        
        let result=false;
        
        if(el===1){
           result = target[idx]===symbol ? true : false
        } else if(el===0) {
            result=target[idx]!==symbol 
        }
    }
    )




  }

  symbols.reduce((acc_sym,el_sym,idx_sym,arr_sym)=>{

    hit_matrices_arr.reduce((acc_hm,el_hm)=>{
            
        //svaki element je jedna matrica pogodaka sa 3 niza
            el_hm.reduce((acc_el_hm,el_el_hm,idx_el_hm)=>{

                //svaku rolnu uporedi sa odgovarajućim nizom matrice pogotka 
                let r=reel_matrix[idx].map((el_rmx,idx_rmx)=>{
                    
                    let transform_fn=(el_el_hm)=>

                }
            )

        return acc;
    },[])

    return acc;
  },[])


  return [r1, r2, r3];
}
