const columns = {
  rank: {
    name: 'rank',
    sort: (a, b) => a.history[0].rank - b.history[0].rank,
    value: (duck) => duck.history[0].rank,
  },
  id: {
    name: 'id',
    sort: (a, b) => a.duck - b.duck,
    value: (duck) => duck.duck,
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

export default columns