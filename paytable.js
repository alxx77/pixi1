function testHit1DArr (target_arr, symbol, hit_matrix_arr, mask_arr) {
    return target_arr.reduce(
      (acc, el, idx) => {
        //maskiranje delova niza koji nisu od interesa
        let masked_target = mask_arr[idx] === 1 ? el : "";
        
        //tranformacija u 0 ili 1
        let transformed_target = masked_target === symbol ? 1 : 0;
  
        //poređenje sa matricom pogodaka
        acc.match.push(transformed_target === hit_matrix_arr[idx] ? 1 : 0);
        acc.target.push(el);
        acc.hit.push(hit_matrix_arr[idx]);
        acc.mask.push(mask_arr[idx]);
        return acc;
      },
      { match: [], target: [], hit: [],mask:[]}
    );
  };

  
  function testHit2DArr(target, symbol, hit_matrix, mask) {
    return target.reduce((acc, el, idx) => {
      acc.push(testHit1DArr(el, symbol, hit_matrix[idx], mask[idx]));
  
      return acc;
    }, []);
  };
  






  
  let r = testHit2DArr(target, symbol, hit_matrix, mask);