<script setup lang="ts">
import { useUuidValidation } from '~/composables/validations/uuid-validation';

const { smAndDown, xs } = useDisplay();

const callUuid = ref('');

const joinCallBtnStateClass = ref<string>('');

const joinCallBtnError = ref<string | undefined>(undefined);

async function startNewCall() {
  callUuid.value = await $fetch<string>(
    '/api/create-call',
  );

  goToCall(
    true,
  );
}

async function joinExistingCall() {
  let validationState = useUuidValidation(
    callUuid.value,
  );

  if (validationState !== true) {
    joinCallBtnError.value = validationState;
    joinCallBtnStateClass.value = 'join-existing-call-btn-error';

    setTimeout(
      () => joinCallBtnStateClass.value = '',
      1000,
    );

    return;
  }

  goToCall(
    false,
  );
}

function goToCall(isOfferingPeer: boolean) {
  useRouter().push({
    path: '/call',
    query: {
      callUuid: callUuid.value.trim(),
      isOfferingPeer: `${isOfferingPeer}`,
    },
  });
}


watch(
  callUuid,
  () => joinCallBtnError.value = undefined,
);
</script>

<template>
  <v-container
    class="wrapper"
    :style="{
      alignItems: smAndDown ? 'stretch' : 'center',
    }"
  >
    <v-row
      align="center"
      justify="space-around"
      no-gutters
    >
      <v-col cols="auto">
        <h2>
          Start a new Call
        </h2>

        <v-spacer></v-spacer>

        <v-btn
          variant="flat"
          color="primary"
          prepend-icon="mdi-phone-plus"
          text="Start"
          @click="startNewCall()"
        ></v-btn>
      </v-col>

      <v-divider
        :vertical="!smAndDown"
        thickness="5"
        class="actions-divider"
      ></v-divider>

      <v-col cols="auto">
        <h2>
          Join an existing Call
        </h2>

        <v-text-field
          v-bind="xs ? {} : { minWidth: '370' }"
          v-model="callUuid"
          variant="outlined"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          max-width="370"
          clearable
          :error-messages="joinCallBtnError"
          class="call-uuid-input"
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-btn
          variant="flat"
          color="secondary"
          prepend-icon="mdi-phone-incoming"
          text="Join"
          :class="joinCallBtnStateClass"
          :disabled="!callUuid"
          @click="joinExistingCall()"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.wrapper {
  min-height: 100vh;

  display: flex;

  .actions-divider {
    border-radius: 10px;
  }

  .v-col {
    padding: 10px !important;
    text-align: center;

    h2 {
      margin-bottom: 10px;
      font-size: 30px;
    }

    .v-spacer {
      height: 60px;
    }


    .join-existing-call-btn-error {
      animation: join-existing-call-btn-shake .8s both;
    }

    @keyframes join-existing-call-btn-shake {
      10%,
      90% {
        transform: translateX(-1px);
      }

      20%,
      80% {
        transform: translateX(2px);
      }

      30%,
      50%,
      70% {
        transform: translateX(-4px);
      }

      40%,
      60% {
        transform: translateX(4px);
      }
    }
  }
}
</style>
