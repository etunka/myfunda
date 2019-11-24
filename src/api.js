export function fetchHouseData(authKey, houseId) {
  // const url = `http://partnerapi.funda.nl/feeds/Aanbod.svc/json/detail/${authKey}/koop/${houseId}`;
  // Due to cors problem, I couldn't fetch from funda api,
  // I used mocky.io instead
  const url = "https://www.mocky.io/v2/5dda6f933100005000605e14";
  return fetch(url);
}
