import type { IceCandidateDescription } from "./ice-candidate-description";
import type { SessionDescription } from "./session-description";

export interface Call {
  uuid: string;
  offer?: SessionDescription;
  offeringPeer?: string;
  answer?: SessionDescription;
  answeringPeer?: string;
  iceCandidates: IceCandidateDescription[];
}
