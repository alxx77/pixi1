
import { SlotMachine } from "./slot_machine.js"
import { SYMBOL_NAMES,CURRENCY_SIGN } from "./setup.js"
import { sound } from "./setup.js";



async function StartGame() {

    //new sound("./rsc/casino_ambience1.mp3").play();

     //canvas
     const canvas1 = document.getElementById("mycanvas1");


    let slot_machine=new SlotMachine(canvas1,SYMBOL_NAMES,CURRENCY_SIGN);

    await slot_machine.initMachine();

    slot_machine.setCreditAmount(100)

    slot_machine.startAnimation();

}

StartGame()
