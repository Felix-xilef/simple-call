<script setup lang="ts">
import { toDataURL } from 'qrcode';
import { io } from 'socket.io-client';
import Stream from '~/components/Stream.vue';
import { AlertType } from '~/enums/alert-type';
import { CallEvent } from '~/enums/call-event';
import { DomExceptionName } from '~/enums/dom-exception-name';
import { useAlertsStore } from '~/stores/alerts';


const iceServers: RTCIceServer[] = [
  {
    urls: [
      'stun:stun.l.google.com:19302',
    ],
  },
];



const router = useRouter();

const alertsStore = useAlertsStore();


const callUuid = ref<string>('');
const callQrCode = ref<string>('');

const showQrCode = ref(false);

const isOfferingPeer = ref<boolean>();

const isVideoOn = ref<boolean>(true);
const isAudioOn = ref<boolean>(true);


const localStream = ref<MediaStream>();
const remoteStream = ref<MediaStream>();


let socket: ReturnType<typeof io>;

let peerConnection: RTCPeerConnection;


async function getQueryData() {
  const { query } = useRoute();

  callUuid.value = `${query.callUuid}`;
  isOfferingPeer.value = query.isOfferingPeer === 'true';
  
  try {
    callQrCode.value = await toDataURL(
      `${useRequestURL().origin}/call?callUuid=${callUuid.value}`,
    );

  } catch (error) {
    callQrCode.value = '';

    console.error(
      'Error when generating URL:',
      error,
    );
  }
}

async function startLocalStream() {
  const {
    height: displayHeight,
    width: displayWidth,
  } = useDisplay();

  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({
      video: isVideoOn.value ?
        {
          aspectRatio: displayHeight.value < displayWidth.value ?
            16/9 :
          9/16,
          facingMode: 'user',
        } :
      false,
      audio: isAudioOn.value,
    });

  } catch (error) {
    localStream.value = new MediaStream();

    if (
      error instanceof DOMException &&
      error?.name == DomExceptionName.NotAllowedError
    ) {
      alertsStore.addAlert({
        type: AlertType.Error,
        message: 'It is necessary to allow microphone and/or camera permission to be able to comunicate during the call!',
      });

    } else {
      alertsStore.addAlert({
        type: AlertType.Error,
        message: `Unexpected error when trying to access microphone and/or camera: ${error}`,
      });
    }
  }
}

function stopLocalStream() {
  localStream.value?.getTracks().forEach(
    track => track.stop(),
  );
}

function createPeerConnection() {
  peerConnection = new RTCPeerConnection({
    iceServers,
  });

  localStream.value?.getTracks().forEach(
    track => peerConnection.addTrack(
      track,
      localStream.value!,
    ),
  );

  socket.on(
    CallEvent.IceCandidateToClient,
    (iceCandidate: any) => peerConnection.addIceCandidate(
      iceCandidate,
    ),
  );

  socket.emit(
    CallEvent.FetchIceCandidates,
  );

  peerConnection.addEventListener(
    'icecandidate',
    event => {
      if (event.candidate) {
        socket.emit(
          CallEvent.IceCandidateToServer,
          callUuid.value,
          event.candidate,
        );
      }
    },
  );

  peerConnection.addEventListener(
    'track',
    event => remoteStream.value = event.streams[0],
  );
}

async function getDescriptions() {
  if (isOfferingPeer.value) {
    const offer = await peerConnection.createOffer();

    peerConnection.setLocalDescription(
      offer,
    );

    socket.emit(
      CallEvent.OfferToServer,
      callUuid.value,
      offer,
    );

    socket.on(
      CallEvent.AnswerToClient,
      (answer: any) => peerConnection.setRemoteDescription(
        answer,
      ),
    );

  } else {
    const offer = await $fetch<any>(
      '/api/offer',
      {
        method: 'GET',
        query: {
          uuid: callUuid.value,
        },
      },
    );

    peerConnection.setRemoteDescription(
      offer,
    );

    const answer = await peerConnection.createAnswer();

    peerConnection.setLocalDescription(
      answer,
    );

    socket.emit(
      CallEvent.AnswerToServer,
      callUuid.value,
      answer,
    );
  }
}

function hangup() {
  socket.close();
  stopLocalStream();

  router.replace('/');
}


onMounted(async () => {
  getQueryData();

  if (!callUuid.value) {
    router.replace('/');
  }

  socket = io();

  await startLocalStream();

  createPeerConnection();

  try {
    await getDescriptions();

  } catch (error) {
    alertsStore.addAlert({
      type: AlertType.Error,
      message: `Error when getting call data: ${error}`,
    });
  }
});

onBeforeUnmount(
  () => hangup(),
);


watch(
  isVideoOn,
  async (newValue, oldValue) => {
    if (newValue != oldValue) {
      localStream.value?.getVideoTracks().forEach(
        track => track.enabled = newValue,
      );
    }
  },
);

watch(
  isAudioOn,
  async (newValue, oldValue) => {
    if (newValue != oldValue) {
      localStream.value?.getAudioTracks().forEach(
        track => track.enabled = newValue,
      );
    }
  },
);
</script>

<template>
  <v-container class="call-wrapper">
    <v-row
      no-gutters
      justify="center"
      align="center"
      class="call-code-container"
    >
      <h3>
        Código da chamada:
      </h3>

      <CopyButton
        variant="flat"
        color="primary"
        :text="callUuid"
      />

      <v-btn
        v-if="callQrCode"
        variant="tonal"
        @click="showQrCode = !showQrCode"
      >
        <Transition
          name="y-flip-transition"
          mode="out-in"
        >
          <v-icon
            v-if="showQrCode"
            icon="mdi-eye-off"
          ></v-icon>
          <v-icon
            v-else
            icon="mdi-eye"
          ></v-icon>
        </Transition>

        <span class="qrcode-toggle-text">
          {{ showQrCode ? 'Hide' : 'Show' }} QRCode
        </span>
      </v-btn>
    </v-row>

    <v-expand-transition>
      <img
        v-if="showQrCode"
        :src="callQrCode"
        :alt="`QrCode with the call link`"
        class="call-qrcode-img"
      >
    </v-expand-transition>

    <v-row no-gutters>
      <v-col
        v-if="localStream?.active"
        cols="6"
      >
        <Stream
          :stream="localStream"
          muted
        />
      </v-col>

      <v-col
        v-if="remoteStream?.active"
        cols="6"
      >
        <Stream :stream="remoteStream"/>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      justify="center"
      align="center"
      class="actions-container"
    >
      <v-col cols="auto">
        <MediaToggle
          v-model="isVideoOn"
          icon-active="mdi-video-outline"
          icon-inactive="mdi-video-off-outline"
          media-name="camera"
        />
      </v-col>

      <v-col cols="auto">
        <MediaToggle
          v-model="isAudioOn"
          icon-active="mdi-microphone"
          icon-inactive="mdi-microphone-off"
          media-name="microphone"
        />
      </v-col>

      <v-col cols="auto">
        <v-btn
          variant="flat"
          icon="mdi-phone-hangup"
          color="error"
          aria-label="Hangup Call"
          @click="hangup()"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.call-wrapper {
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  gap: 10px;

  .call-code-container,
  .actions-container {
    gap: 20px;
    flex-grow: 0;
  }

  .qrcode-toggle-text {
    margin-left: 5px;
  }

  .call-qrcode-img {
    height: 200px;
    width: 200px;

    align-self: center;
  }
}
</style>
