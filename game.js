
import { SlotMachine } from "./slot_machine.js"




async function StartGame() {

     //canvas
     const canvas1 = document.getElementById("mycanvas1");


    let slot_machine=new SlotMachine(canvas1);

    await slot_machine.InitMachine();

    slot_machine.StartSlotMachine();

}

//StartGame()
