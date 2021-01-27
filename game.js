
import { SlotMachine } from "./slot_machine.js"




async function StartGame() {

    let slot_machine=new SlotMachine();

    await slot_machine.InitMachine();

    slot_machine.StartSlotMachine();

}

StartGame()
