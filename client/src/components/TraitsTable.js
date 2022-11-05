import {useEffect, useRef, useState} from "react";
import {Checkbox, FormControl, ListItemText, MenuItem, Select} from "@mui/material";
import columns from './columnClasses.js';
import {TableHeaderSortable} from "./TableHelpers";
import {upperFirstLetter} from "./helpers";

function MultiSelectDropdown({name, databases, filters, setFilters}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(['Clear']);
  const [options, setOptions] = useState([]);
  const ref = useRef();
  const upperName = upperFirstLetter(name);

  useEffect(() => {
    setSelected(['Clear']);
  }, [databases['globalRarity']]);


  useEffect(() => {
    let total = 0;
    let newOptions = [];
    for (const key of Object.keys(databases['traitToID'][upperName])) {
      if (key === '') {
        continue;
      }
      const rarity = databases['globalRarity'][upperName][key];
      total += rarity;
      newOptions.push([key, rarity]);
    }
    newOptions.sort((a, b) => b[1] - a[1]);
    newOptions.splice(0, 0, ['Empty', window['allDucks'].length - total]);
    newOptions.splice(0, 0, ['Select All', window['allDucks'].length]);
    newOptions.splice(0, 0, ['Clear', window['allDucks'].length]);
    setOptions(newOptions);
  }, [databases]);

  useEffect(() => {
    if (selected[0] === 'Clear') {
      let newFilters = {...filters};
      delete newFilters[name];
      setFilters(newFilters);
    } else {
      setFilters({...filters, [name]: selected});
    }
  }, [selected]);

  function handleSelect(event) {
    const lastSelected = event.target.value[event.target.value.length - 1];
    if (lastSelected === 'Clear' || lastSelected === undefined) {
      if (selected.includes('Clear')) {
        return;
      }
      setSelected(['Clear']);
    } else if (lastSelected === 'Select All') {
      setSelected(options.map(option => option[0]).slice(2));
    } else {
      setSelected(event.target.value.filter(value => value !== 'Clear'));
    }
  }

  return (
    <th ref={ref}>
      <p className="columnTitle" onClick={() => setOpen(!open)}>
        {columns[name]['name']}
      </p>
      <FormControl>
        <Select
          multiple
          value={selected}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          onChange={(event) => {
            handleSelect(event);
          }}
          style={{display: 'none'}}
          MenuProps={{
            anchorEl: ref.current,
            transitionDuration: 150,
            // hide scrollbar in material-ui

            PaperProps: {
              sx: {
                border: '3px solid #400000',
                borderRadius: '10px',
                maxHeight: "50vh",
                marginTop: -2,
                backgroundColor: '#FFFBC1',
                overflowY: 'overlay',

                // Chrome scrollbar
                '&::-webkit-scrollbar': {
                  width: '5px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#400000',
                  borderRadius: '10px',
                  border: 'transparent'
                },

                // Firefox scrollbar
                scrollbarColor: '#400000 transparent',

                '& .Mui-selected': {
                  color: '#FFFBC1',
                  backgroundColor: '#400000 !important',
                }
              },
            },
          }}


        >
          {options.map((option) => (
            <MenuItem disableRipple key={option} value={option[0]} style={{height: 30}}>
              <ListItemText primary={`${option[0]} (${option[1]})`}/>
            </MenuItem>
          ))}

        </Select>
      </FormControl>

    </th>
  )

}

function getTrait(duck, traitType) {
  for (const attribute of duck['attributes']) {
    if (attribute['trait_type'] === traitType) {
      return attribute['value'];
    }
  }
}

function getTraitLabel(duck, traitType) {
  const trait = getTrait(duck, traitType);
  if (trait === undefined) {
    return 'Empty';
  }
  return trait;
}

function getImageURL(traitType, traitName) {
  let extension = 'png';
  if (traitType === 'background' && traitName === '95') {
    extension = 'gif';
  } else if (traitType === 'body' && traitName === '99') {
    extension = 'gif';
  }
  if (traitName === undefined) {
    return `https://duck.art/img/traits/body/01.png`;
  }
  return `https://duck.art/img/traits/${traitType}/${traitName}.${extension}`;
}

function TraitsTable({databases, amountToLoad, handleSort, sorts, filters, setFilters}) {
  let traitToID = {};
  for (const [traitType, traits] of Object.entries(databases['traits'])) {
    traitToID[traitType] = {};
    for (const trait of traits) {
      traitToID[traitType][trait['name']] = (trait['id'].length < 2 ? '0' + trait['id'] : trait['id']);
    }
  }


  return (
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
        <MultiSelectDropdown name="background" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="body" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="tattoo" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="head" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="shirt" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="neck" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="beak" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="eyes" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="cover" databases={databases} filters={filters} setFilters={setFilters}/>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
            <td>{columns['rank'].value(duck)}</td>
            <td>
              <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                <img src={duck.history[0].image} alt="duck" className='duckImage'/>
              </a>
              <p>{columns['id'].value(duck)}</p></td>
            <td><img src={getImageURL('background', traitToID['Background'][getTrait(duck, 'Background')])}
                     alt={traitToID['Background'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Background')}</p></td>
            <td><img src={getImageURL('body', traitToID['Body'][getTrait(duck, 'Body')])}
                     alt={traitToID['Body'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Body')}</p></td>
            <td><img src={getImageURL('tattoo', traitToID['Tattoo'][getTrait(duck, 'Tattoo')])}
                     alt={traitToID['Tattoo'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Tattoo')}</p></td>
            <td><img src={getImageURL('head', traitToID['Head'][getTrait(duck, 'Head')])}
                     alt={traitToID['Head'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Head')}</p></td>
            <td><img src={getImageURL('shirt', traitToID['Shirt'][getTrait(duck, 'Shirt')])}
                     alt={traitToID['Shirt'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Shirt')}</p></td>
            <td><img src={getImageURL('neck', traitToID['Neck'][getTrait(duck, 'Neck')])}
                     alt={traitToID['Neck'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Neck')}</p></td>
            <td><img src={getImageURL('beak', traitToID['Beak'][getTrait(duck, 'Beak')])}
                     alt={traitToID['Beak'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Beak')}</p></td>
            <td><img src={getImageURL('eyes', traitToID['Eyes'][getTrait(duck, 'Eyes')])}
                     alt={traitToID['Eyes'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Eyes')}</p></td>
            <td><img src={getImageURL('cover', traitToID['Cover'][getTrait(duck, 'Cover')])}
                     alt={traitToID['Cover'][getTrait(duck)]} className='duckImage'/><p>{getTraitLabel(duck, 'Cover')}</p></td>
            <td><a href={`https://opensea.io/assets/0x7a4d1b54dd21dde804c18b7a830b5bc6e586a7f6/${duck.duck}`}
                   target="_blank" rel="noreferrer"><img src={"/img/opensea.svg"} alt="opensea"
                                                         style={{width: '45px'}}/></a></td>
          </tr>
        )
      })}
      </tbody>
    </table>

  );
}

export default TraitsTable;
