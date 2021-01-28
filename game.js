
import { SlotMachine } from "./slot_machine.js"




async function StartGame() {

     //canvas
     const canvas1 = document.getElementById("mycanvas1");


    let slot_machine=new SlotMachine(canvas1);

    await slot_machine.initMachine();

    slot_machine.startSlotMachine();

}

//StartGame()
