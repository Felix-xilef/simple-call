import { v4 } from "uuid";

export default defineEventHandler(async _ => {
  const uuid = v4();

  await useCallStorage().setItem(
    uuid,
    {
      uuid,
      iceCandidates: [],
    },
  );

  return uuid;
});
