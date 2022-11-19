function parseAllDucks({backpackRarity, allDucks, allBackpacks}) {
  let backpackTypesCount = {};
  for (let [backpackId, backpack] of Object.entries(backpackRarity)) {
    if (backpackId !== "traitCount") {
      backpackTypesCount[backpackId] = Object.keys(backpack).length;
    }
  }


  let parsedDucks = [];

  allDucks.sort((a, b) => a["duck"] - b["duck"])
  allBackpacks.sort((a, b) => a["duck"] - b["duck"])

  for (const i in allDucks) {
    let duck = allDucks[i];
    let backpack = allBackpacks[i];
    let duckData = {
      "id": duck.duck,
      "rank": duck.history[0].rank,
      "version": duck.history.length,
      "rarityChange": (duck.history.length < 2) ? 0 : duck.history[1].rank - duck.history[0].rank,
      "img": duck.history[0].image,
      "parties": duck.attributes[0].value,
      "background": null,
      "body": null,
      "tattoo": null,
      "head": null,
      "shirt": null,
      "neck": null,
      "beak": null,
      "eyes": null,
      "cover": null,
      "water": null,
      "bag of sand": null,
      "paint bucket": null,
      "egg": 0,
      "seed": 0,
      "chest": 0
    };

    for (let [key, value] of Object.entries(duck.attributes)) {
      if (key > 0) {
        duckData[value.trait_type.toLowerCase()] = value.value;
      }
    }

    // Backpacks
    for (let [backpackId, backpackTypeCount] of Object.entries(backpackTypesCount)) {
      if (backpackTypeCount > 1) {
        duckData[backpackId] = 0;
      }
    }
    for (const [key, value] of Object.entries(backpackTypesCount)) {
      if (value === 1) {
        duckData[key] = 0;
      }
    }
    for (let attribute of backpack.attributes) {
      if (backpackTypesCount[attribute.trait_type] === 1) {
        duckData[attribute.trait_type.toLowerCase()] += 1;
      } else {
        duckData[attribute.trait_type.toLowerCase()] = attribute.value;
      }
    }
    parsedDucks.push(duckData);
  }
  return parsedDucks;
}

export function scrollToTop() {
  document.getElementsByClassName("mainContainer")[0].scrollTo(0, 0);
}

export function upperFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

const columns = {
  rank: {
    name: 'rank',
    sort: (a, b) => a.history[0].rank - b.history[0].rank,
    value: (duck) => duck.history[0].rank,
  },
  id: {
    name: (<img src="/img/duckIcon.svg" alt="duck" className='duckIcon'/>),
    sort: (a, b) => a.duck - b.duck,
    value: (duck) => duck.duck,
  },
   paintBucket: {
    name: (<img src="/img/emptyPaint.png" alt="duck" className='traitIcon'/>),
  },
   water: {
    name: (<img src="/img/emptyWater.png" alt="water" className='traitIcon'/>),
  },
   sand: {
    name: (<img src="/img/sandBag.png" alt="sand" className='traitIcon'/>),
  },
  egg: {
    name: (<img src="/img/egg.png" alt="egg" className='traitIcon'/>),
    sort: (a, b) => a.egg - b.egg,
    value: (duck) => duck.egg,
  },
  seed: {
    name: (<img src="/img/seed.png" alt="seed" className='traitIcon'/>),
    sort: (a, b) => a.seed - b.seed,
    value: (duck) => duck.seed,
  },
  chest: {
    name: (<img src="/img/chest.png" alt="chest" className='traitIcon'/>),
    sort: (a, b) => a.chest - b.chest,
    value: (duck) => duck.chest,
  },
  version: {
    name: 'version',
    sort: (a, b) => a.history[0].version - b.history[0].version,
    value: (duck) => duck.history[0].version,
  },
  parties: {
    name: 'parties',
    sort: (a, b) => a.attributes[0].value - b.attributes[0].value,
    value: (duck) => `${duck.attributes[0].value} / ${duck.attributes[0].max_value}`,
  },
  rankChange: {
    name: 'rank change',
    sort: (a, b) =>
      (a.history.length > 1 ? a.history[1].rank - a.history[0].rank : 0) -
      (b.history.length > 1 ? b.history[1].rank - b.history[0].rank : 0),
    value: (duck) => (duck.history.length > 1 ? duck.history[1].rank - duck.history[0].rank : 0),
  },
  totalTraits: {
    name: 'total traits',
    sort: (a, b) => a.attributes.length - b.attributes.length,
    value: (duck) => duck.attributes.length - 1,
  },
  background: {
    name: 'background',
  },
  body: {
    name: 'body',
  },
  tattoo: {
    name: 'tattoo',
  },
  head: {
    name: 'head',
  },
  shirt: {
    name: 'shirt',
  },
  neck: {
    name: 'neck',
  },
  beak: {
    name: 'beak',
  },
  eyes: {
    name: 'eyes',
  },
  cover: {
    name: 'cover',
  },
}
export default columns;