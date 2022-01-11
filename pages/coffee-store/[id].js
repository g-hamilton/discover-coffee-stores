import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import cls from "classnames";
import useSWR from "swr";

import styles from "../../styles/coffee-store.module.css";

// import coffeeStores from "../../data/coffee-stores.json";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { CoffeeStoreContext } from "../../context/coffee-store-context";
import { isEmpty } from "../../utils";

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
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

export async function getStaticProps(staticProps) {
  const coffeeStores = await fetchCoffeeStores();

  const foundCoffeeStore = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === staticProps.params.id;
  });

  return {
    props: {
      coffeeStore: foundCoffeeStore ? foundCoffeeStore : {},
    },
  };
}

const CoffeeStore = (initialProps) => {
  // console.log({ initialProps });

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore ? initialProps.coffeeStore : {}
  );

  const { address, name, neighbourhood, imgUrl } = coffeeStore;

  const [votingCount, setVotingcount] = useState(0);

  const {
    state: { coffeeStores },
  } = useContext(CoffeeStoreContext);

  const router = useRouter();

  const id = router.query.id;

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (
      data &&
      data.records &&
      data.records.length &&
      data.records.length > 0
    ) {
      console.log("Data from SWR:", data.records[0]);
      setCoffeeStore(data.records[0]);
      setVotingcount(data.records[0].voting);
    }
  }, [data]);

  useEffect(() => {
    async function initClientSide() {
      if (isEmpty(initialProps.coffeeStore)) {
        if (coffeeStores.length > 0) {
          const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
            return coffeeStore.id.toString() === id;
          });
          if (coffeeStoreFromContext) {
            setCoffeeStore(coffeeStoreFromContext);
            handleCreateCoffeeStore(coffeeStoreFromContext);
          }
        }
      } else {
        // SSG
        handleCreateCoffeeStore(initialProps.coffeeStore);
      }
    }
    initClientSide();
  }, [coffeeStores, id, initialProps.coffeeStore]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong retrieving this page</div>;
  }

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, address, neighbourhood, imgUrl } = coffeeStore;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          neighbourhood: neighbourhood || "",
          voting: 0,
          imgUrl,
        }),
      });

      const dbCoffeeStore = await response.json();
      console.log(dbCoffeeStore.message);
      return dbCoffeeStore;
    } catch (err) {
      console.log("Error creating coffee store", err);
    }
  };

  const handleUpvoteButton = () => {
    console.log("handle up vote");
    let count = votingCount + 1;
    setVotingcount(count);
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
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            className={styles.storeImg}
            alt={`Coffee shop ${name}`}
            src={
              imgUrl ||
              `https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80`
            }
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
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                alt="neighbourhood icon"
                src="/static/icons/places.svg"
                width={24}
                height={24}
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              alt="votes icon"
              src="/static/icons/star.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{votingCount}</p>
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
