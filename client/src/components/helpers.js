export function scrollToTop() {
  document.getElementsByClassName("mainContainer")[0].scrollTo(0, 0);
}

export function scrollToLeft() {
  document.getElementsByClassName("mainContainer")[0].scrollLeft = 0;
}

export function upperFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

const findPartiesAttendedAttribute = (attributes) => attributes.find(attr => attr.trait_type === 'Parties Attended');

const columns = {
  rank: {
    name: 'rank',
    display: 'rank',
    sort: (a, b) => a.rank - b.rank,
    value: (duck) => duck.rank,
  },
  id: {
    name: (<img src="/img/duckIcon.svg" alt="id" className='duckIcon'/>),
    display: (<img src="/img/duckIcon.svg" alt="id" className='duckIcon'/>),
    sort: (a, b) => a.duck - b.duck,
    value: (duck) => duck.duck,
  },
   paintBucket: {
    name: 'Paint',
     display: (<img src="/img/emptyPaint.png" alt="paint bucket" className='bpIcon'/>),
  },
   water: {
    name: 'Water',
     display: (<img src="/img/emptyWater.png" alt="water" className='bpIcon'/>),
  },
   bagOfSand: {
    name: 'Sand',
     display: (<img src="/img/sandBag.png" alt="sand" className='bpIcon'/>),
  },
  egg: {
    name: (<img src="/img/egg.png" alt="egg" className='traitIcon'/>),
    display: (<img src="/img/egg.png" alt="egg" className='traitIcon'/>),
    sort: (a, b) => columns.egg.value(a) - columns.egg.value(b),
    value: (duck) => duck.backpacks['Egg']?.length || 0,
  },
  seed: {
    name: (<img src="/img/seed.png" alt="seed" className='traitIcon'/>),
    display: (<img src="/img/seed.png" alt="seed" className='traitIcon'/>),
    sort: (a, b) => columns.seed.value(a) - columns.seed.value(b),
    value: (duck) => duck.backpacks['Seed']?.length || 0,
  },
  chest: {
    name: (<img src="/img/chest.png" alt="chest" className='traitIcon'/>),
    display: (<img src="/img/chest.png" alt="chest" className='traitIcon'/>),
    sort: (a, b) => columns.chest.value(a) - columns.chest.value(b),
    value: (duck) => duck.backpacks['Chest']?.length || 0,
  },
  version: {
    name: 'version',
    display: 'versions',
    sort: (a, b) => a.history[0].version - b.history[0].version,
    value: (duck) => duck.history[0].version,
  },
  parties: {
    name: 'parties',
    display: 'parties',
   sort: (a, b) =>  a.attributes.find(attr => attr.trait_type === 'Parties Attended').max_value - b.attributes.find(attr => attr.trait_type === 'Parties Attended').max_value,
  value: (duck) => `${findPartiesAttendedAttribute(duck.attributes).max_value} / ${findPartiesAttendedAttribute(duck.attributes).value}`,
},
  rankChange: {
    name: 'rank change',
    display: 'rank change',
    sort: (a, b) =>
      (a.history.length > 1 ? a.rank - a.history[0].rank : 0) -
      (b.history.length > 1 ? b.rank - b.history[0].rank : 0),
    value: (duck) => (duck.history.length > 1 ? duck.rank - duck.history[0].rank : 0),
  },
  totalTraits: {
    name: 'total traits',
    display: 'traits',
    sort: (a, b) => a.attributes.length - b.attributes.length,
    value: (duck) => duck.attributes.length - 1,
  },
  
  totalDucks:{
    name: 'total ducks',
    display: 'tub count',
    sort: (a, b) =>{
},
    value: (duck) => duck.numOwned,
  },
  background: {
    name: 'Background',
    display: 'Background',
  },
  body: {
    name: 'Body',
    display: 'Body',
  },
  tattoo: {
    name: 'Tattoo',
    display: 'Tattoo',
  },
  head: {
    name: 'Head',
    display: 'Head',
  },
  shirt: {
    name: 'Shirt',
    display: 'Shirt',
  },
  neck: {
    name: 'Neck',
    display: 'Neck',
  },
  beak: {
    name: 'Beak',
    display: 'Beak',
  },
  eyes: {
    name: 'Eyes',
    display: 'Eyes',
  },
  cover: {
    name: 'Cover',
    display: 'Cover',
  },
}
export default columns;