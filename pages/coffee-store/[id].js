import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";

import styles from "../../styles/coffee-store.module.css";

import coffeeStoresData from "../../data/coffee-stores.json";

export function getStaticPaths() {
  const paths = coffeeStoresData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

export function getStaticProps(staticProps) {
  return {
    props: {
      coffeeStore: coffeeStoresData.find((coffeeStore) => {
        return coffeeStore.id.toString() === staticProps.params.id;
      }),
    },
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { address, name, neighbourhood, imgUrl } = props.coffeeStore;

  const handleUpvoteButton = () => {
    console.log("handle up vote");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            className={styles.storeImg}
            alt={`Coffee shop ${name}`}
            src={imgUrl}
            width={600}
            height={360}
            objectFit="cover"
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              alt="address icon"
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              alt="neighbourhood icon"
              src="/static/icons/places.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              alt="votes icon"
              src="/static/icons/star.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
