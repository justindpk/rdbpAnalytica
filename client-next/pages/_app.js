import '../styles/globals.css'
import Script from "next/script";
import {useState} from "react";

function MyApp({Component, pageProps}) {
  const [allDucks, setAllDucks] = useState(false);
  const [globalRarity, setGlobalRarity] = useState(false);
  const [allBackpacks, setAllBackpacks] = useState(false);
  const [backpackRarity, setBackpackRarity] = useState(false);
  const [traits, setTraits] = useState(false);

  return (
    <>
      <Script src="https://duck.art/rarity-data/v9/allDucks.js" beforeInteractive onLoad={() => setAllDucks(true)}/>
      <Script src="https://duck.art/rarity-data/v9/globalRarity.js" beforeInteractive onLoad={() => setGlobalRarity(true)}/>
      <Script src="https://duck.art/rarity-data/v9/allBackpacks.js" beforeInteractive onLoad={() => setAllBackpacks(true)}/>
      <Script src="https://duck.art/rarity-data/v9/backpackRarity.js" beforeInteractive onLoad={() => setBackpackRarity(true)}/>
      <Script src="https://duck.art/rarity-data/traits.js" beforeInteractive onLoad={() => setTraits(true)}/>
      {(allDucks && globalRarity && allBackpacks && backpackRarity && traits) && <Component {...pageProps} />}
    </>
  )
}

export default MyApp