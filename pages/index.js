import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";

// import coffeeStoresData from "../data/coffee-stores.json";
import { fetchCoffeeStores } from "../lib/coffee-stores";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const handleOnBannerBtnClick = () => {
    console.log("hi banner btn");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name="description"
          content="Discover amazing coffee shops near you"
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
            buttonText="View shops nearby"
            handleOnClick={handleOnBannerBtnClick}
          />
        </div>
        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>London coffee shops</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    href={`/coffee-store/${coffeeStore.id}`}
                    name={coffeeStore.name}
                    imgUrl={`https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
