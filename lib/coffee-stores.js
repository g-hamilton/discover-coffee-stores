const getUrlForCoffeeStores = (query, categories, near, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&categories=${categories}&exclude_chains=true&near=${near}&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

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

  return transformedData;
};
