import '../src/main.css'
import Script from "next/script";
import {useState} from "react";

function MyApp({Component, pageProps}) {
  const [allDucksLoaded, setAllDucksLoaded] = useState(false);
  const [globalRarityLoaded, setGlobalRarityLoaded] = useState(false);
  const [allBackpacksLoaded, setAllBackpacksLoaded] = useState(false);
  const [backpackRarityLoaded, setBackpackRarityLoaded] = useState(false);
  const [traitsLoaded, setTraitsLoaded] = useState(false);

  return (
    <>
      <Script src="https://duck.art/rarity-data/v9/allDucks.js"
              strategy="beforeInteractive"/>
      <Script src="https://duck.art/rarity-data/v9/globalRarity.js"
              strategy="beforeInteractive"/>
      <Script src="https://duck.art/rarity-data/v9/allBackpacks.js"
              strategy="beforeInteractive"/>
      <Script src="https://duck.art/rarity-data/v9/backpackRarity.js"
              strategy="beforeInteractive"/>
      <Script src="https://duck.art/rarity-data/traits.js"
              strategy="beforeInteractive"/>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp