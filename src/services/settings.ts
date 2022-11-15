import { Color } from "@ionic/core";

class Settings {
    color : Color = "#458588";
    Settings(){
        this.highScore = parseInt(localStorage.getItem("score") || "0");
    }
    set highScore(score: number){
        localStorage.setItem("score", score.toString());
    }
    get highScore(){
        return parseInt(localStorage.getItem("score") || "0");
    }
}

export default new Settings();
