import { Vibration } from "@awesome-cordova-plugins/vibration";

export class VibrationMock {
    vibrate(value: number) {
        console.log(`Vibrating for ${value}ms`);
    }
}

export default {
    production: Vibration,
    development: new VibrationMock()
}
