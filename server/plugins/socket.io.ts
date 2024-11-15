import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { CallEvent } from "~/enums/call-event";

export default defineNitroPlugin(app => {
  const engine = new Engine();
  const io = new Server();

  io.bind(
    engine,
  );

  io.on(
    'connection',
    socket => {
      const peerId = socket.id;

      socket.on(
        CallEvent.OfferToServer,
        async (callUuid, offer) => {
          const call = await useCallStorage().getItem(
            callUuid,
          );

          if (call) {
            call.offer = offer;
            call.offeringPeer = peerId;

            useCallStorage().setItem(
              callUuid,
              call,
            );
          }
        },
      );

      socket.on(
        CallEvent.AnswerToServer,
        async (callUuid, answer) => {
          const call = await useCallStorage().getItem(
            callUuid,
          );

          if (call) {
            call.answer = answer;
            call.answeringPeer = peerId;

            await useCallStorage().setItem(
              call.uuid,
              call,
            );

            if (call.offeringPeer) {
              socket.to(
                call.offeringPeer,
              ).emit(
                CallEvent.AnswerToClient,
                answer,
              );
            }
          }
        },
      );

      socket.on(
        CallEvent.IceCandidateToServer,
        async (callUuid, iceCandidate) => {
          const call = await useCallStorage().getItem(
            callUuid,
          );

          if (call) {
            call.iceCandidates.push({
              ownerPeer: peerId,
              iceCandidate,
            });

            await useCallStorage().setItem(
              call.uuid,
              call,
            );

            socket.to(
              `${
                peerId == call.offeringPeer ?
                  call.answeringPeer :
                call.offeringPeer
              }`,
            ).emit(
              CallEvent.IceCandidateToClient,
              iceCandidate,
            );
          }
        },
      );

      socket.on(
        CallEvent.FetchIceCandidates,
        async callUuid => {
          const call = await useCallStorage().getItem(
            callUuid,
          );

          if (call) {
            call.iceCandidates.forEach(iceCandidate => {
              if (iceCandidate.ownerPeer != peerId) {
                socket.emit(
                  CallEvent.IceCandidateToClient,
                  iceCandidate,
                );
              }
            });
          }
        },
      );
    },
  );


  app.router.use(
    '/socket.io/',
    defineEventHandler({
      handler(event) {
        engine.handleRequest(
          // @ts-ignore
          event.node.req,
          event.node.res,
        );
        event._handled = true;
      },

      websocket: {
        open(peer) {
          // @ts-ignore
          engine.prepare(
            // @ts-ignore
            peer._internal.nodeReq,
          );

          // @ts-ignore
          engine.onWebSocket(
            // @ts-ignore
            peer._internal.nodeReq,
            // @ts-ignore
            peer._internal.nodeReq.socket,
            peer.websocket,
          );
        },
      },
    }),
  );
});
