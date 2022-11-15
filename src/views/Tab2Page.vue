<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Tab 2</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Tab 2</ion-title>
                </ion-toolbar>
            </ion-header>
            <div id="container">
                <canvas id="canvas"></canvas>
                <div class="arrows">
                    <ion-button  shape="round" @click="clickLeft()">
                        <ion-icon slot="icon-only" :icon="caretBackOutline"></ion-icon>
                    </ion-button>
                    <ion-button shape="round" @click="clickUp()">
                        <ion-icon slot="icon-only" :icon="caretUpOutline"></ion-icon>
                    </ion-button>
                    <ion-button shape="round" @click="clickDown()">
                        <ion-icon slot="icon-only" :icon="caretDownOutline"></ion-icon>
                    </ion-button>
                    <ion-button shape="round" @click="clickRight()">
                        <ion-icon slot="icon-only" :icon="caretForwardOutline"></ion-icon>
                    </ion-button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
} from "@ionic/vue";
import {
    caretBackOutline,
    caretUpOutline,
    caretDownOutline,
    caretForwardOutline,
} from "ionicons/icons";
import { Snake } from "@/classes/snake";
let snake: Snake;
export default defineComponent({
    name: "Tab2Page",
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonPage,
        IonButton,
        IonIcon,
    },
    setup() {
        return {
            caretBackOutline,
            caretUpOutline,
            caretDownOutline,
            caretForwardOutline,
        };
    },
    methods: {
        clickLeft() {
            const canvas = document.getElementById(
                "canvas"
            ) as HTMLCanvasElement;
            canvas.dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "ArrowLeft",
                })
            );
        },
        clickRight() {
            const canvas = document.getElementById(
                "canvas"
            ) as HTMLCanvasElement;
            canvas.dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "ArrowRight",
                })
            );
        },
        clickUp() {
            const canvas = document.getElementById(
                "canvas"
            ) as HTMLCanvasElement;
            canvas.dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "ArrowUp",
                })
            );
        },
        clickDown() {
            const canvas = document.getElementById(
                "canvas"
            ) as HTMLCanvasElement;
            canvas.dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "ArrowDown",
                })
            );
        },
    },
    ionViewDidEnter() {
        const cellSize = 20;
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        const size = window.innerHeight / 2;
        canvas.width =
            Math.floor(
                (size > window.innerWidth ? window.innerWidth : size) / cellSize
            ) * cellSize;
        canvas.height =
            Math.floor(
                (size > window.innerHeight ? window.innerHeight : size) /
                    cellSize
            ) * cellSize;

        const ctx = canvas.getContext("2d")!;
        snake = new Snake(canvas, ctx, cellSize);
        snake.init();
    },
    ionViewDidLeave() {
        clearInterval(snake.gameLoop);
    },
});
</script>
<style scoped>
#container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
}
</style>
