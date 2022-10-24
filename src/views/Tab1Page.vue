<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Tab 1</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Tab 1</ion-title>
                </ion-toolbar>
            </ion-header>
                <ion-list id="list" :inset="true">
                    <ion-item>
                        <ion-label>Pick a color</ion-label>
                        <input id="colorpicker" type="color" value="#34b4eb"/>
                    </ion-item>
                    <ion-item id="button">
                        <ion-button id="start">Start game</ion-button>
                    </ion-item>
                </ion-list> 
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent  } from '@ionic/vue';

export default  defineComponent({
    name: 'Tab1Page',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage  }
});
</script>

<style scoped>
#colorpicker {
    padding: 0;
}

#start {
    text-align: center;
    width: 50%;
    height: 75%;
    margin: auto;
}

#list {
    display: flex;
    flex-direction: column;
    justify-self: center;
    justify-content: space-around;
    height: 100%; 
}
#button {
    padding: 2rem;
}


</style>
