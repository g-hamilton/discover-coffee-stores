/*
  https://developer.foursquare.com/reference/place-search
  https://developer.foursquare.com/reference/place-photos
*/

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
  },
};

const getUrlForCoffeeStores = (query, categories, latLong, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&categories=${categories}&exclude_chains=true&ll=${latLong}&limit=${limit}`;
};

const getCoffeeStorePhoto = async (storeId) => {
  const response = await fetch(
    `https://api.foursquare.com/v3/places/${storeId}/photos?limit=1`,
    options
  );

  const data = await response.json();

  if (!data || !data.length) {
    return null;
  }

  const photoUrl = `${data[0].prefix}original${data[0].suffix}`;

  return photoUrl;
};

export const fetchCoffeeStores = async (
  latLong = "51.50699641739089,-0.12580821733954373", // defaults to London
  limit = 9
) => {
  const response = await fetch(
    getUrlForCoffeeStores("coffee%20shop", "13035", latLong, limit),
    options
  );

  const data = await response.json();

  const transformedData =
    data?.results?.map((place) => {
      return {
        id: place.fsq_id,
        address: place.location.address,
        neighbourhood: place.location.neighborhood
          ? place.location.neighborhood
          : null,
        ...place,
      };
    }) || [];

  for (const coffeeShop of transformedData) {
    const photoUrl = await getCoffeeStorePhoto(coffeeShop.id);
    coffeeShop.imgUrl = photoUrl;
  }

  // console.log(transformedData);

  return transformedData;
};
