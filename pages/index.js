import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";

import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";

// import coffeeStoresData from "../data/coffee-stores.json";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import {
  CoffeeStoreContext,
  ACTION_TYPES,
} from "../context/coffee-store-context";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { dispatch, state } = useContext(CoffeeStoreContext);
  const { coffeeStores, latLong } = state;

  const { handleTrackLocation, isFindingLocation, locationErrorMsg } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=15`
          );
          const coffeeStores = await response.json();
          // console.log({ coffeeStores });
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeeStoresError("");
        } catch (error) {
          console.error({ error });
          setCoffeeStoresError(error.message);
        }
      }
    }
    fetchData();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name="description"
          content="Discover the most popular coffee shops near you"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="Lady drinking coffee"
            width={700}
            height={400}
          />
        </div>
        <div className={styles.banner}>
          <Banner
            buttonText={isFindingLocation ? "Locating..." : "View shops nearby"}
            handleOnClick={handleOnBannerBtnClick}
          />
          {locationErrorMsg && (
            <div>
              <p>Something went wrong: {locationErrorMsg}</p>
            </div>
          )}
          {coffeeStoresError && (
            <div>
              <p>Something went wrong: {coffeeStoresError}</p>
            </div>
          )}
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Coffee shops near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    href={`/coffee-store/${coffeeStore.id}`}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      `https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80`
                    }
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>London coffee shops</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    href={`/coffee-store/${coffeeStore.id}`}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      `https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80`
                    }
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
