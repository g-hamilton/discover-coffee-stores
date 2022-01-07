import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";

import coffeeStores from "../data/coffee-stores.json";

export default function Home() {
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
        <div className={styles.cardLayout}>
          {coffeeStores.map((coffeeStore) => {
            return (
              <Card
                key={coffeeStore.id}
                href={`/coffee-store/${coffeeStore.id}`}
                name={coffeeStore.name}
                imgUrl={coffeeStore.imgUrl}
                className={styles.card}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
