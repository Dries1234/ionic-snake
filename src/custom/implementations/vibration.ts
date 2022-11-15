import { Vibration, VibrationOriginal } from "@awesome-cordova-plugins/vibration";
import { Capacitor } from "@capacitor/core";

export class VibrationMock {
    vibrate(value: number) {
        console.log(`Vibrating for ${value}ms`);
    }
}


let Vibrator: VibrationMock | VibrationOriginal;
if (Capacitor.isNativePlatform()) {
    Vibrator = Vibration;
} else {
    Vibrator = new VibrationMock;
}
export default Vibrator;
