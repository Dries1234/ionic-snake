<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="tab1" href="/tabs/tab1">
                    <ion-icon :icon="settingsOutline" />
                    <ion-label>Settings</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="tab2" href="/tabs/tab2">
                    <ion-icon :icon="gameControllerOutline" />
                    <ion-label>Game</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
} from "@ionic/vue";
import { settingsOutline, gameControllerOutline } from "ionicons/icons";

export default defineComponent({
    name: "TabsPage",
    components: {
        IonLabel,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonPage,
        IonRouterOutlet,
    },
    setup() {
        return {
            settingsOutline,
            gameControllerOutline,
        };
    },
});
</script>

<style scoped></style>
