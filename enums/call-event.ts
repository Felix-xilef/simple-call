export enum CallEvent {
  OfferToServer = 'offer-to-server',

  AnswerToServer = 'answer-to-server',
  AnswerToClient = 'answer-to-client',

  IceCandidateToServer = 'ice-candidate-to-server',
  IceCandidateToClient = 'ice-candidate-to-client',

  FetchIceCandidates = 'fetch-ice-candidates',
}
