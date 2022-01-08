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

const getUrlForCoffeeStores = (query, categories, near, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&categories=${categories}&exclude_chains=true&near=${near}&limit=${limit}`;
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

export const fetchCoffeeStores = async () => {
  const response = await fetch(
    getUrlForCoffeeStores("coffee%20shop", "13035", "london%2C%20UK", 9),
    options
  );

  const data = await response.json();

  const transformedData =
    data?.results?.map((place) => {
      return {
        id: place.fsq_id,
        address: place.location.address,
        neighbourhood: place.location.neighborhood,
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
