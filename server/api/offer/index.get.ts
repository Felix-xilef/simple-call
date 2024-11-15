export default defineEventHandler(async event => {
  const { uuid } = getQuery(
    event,
  );

  const call = await useCallStorage().getItem(
    `${uuid}`,
  );

  return call?.offer;
});
