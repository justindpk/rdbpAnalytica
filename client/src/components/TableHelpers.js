import {useEffect, useRef, useState} from "react";
import columns from "./helpers";
import {FormControl, ListItemText, MenuItem, Select} from "@mui/material";

export function TableHeaderSortable({name, handleSort, sorts}) {
  const [arrow, setArrow] = useState("▪");
  const [priority, setPriority] = useState(null);

  useEffect(() => {
    console.log(sorts);
    if (sorts[name]) {
      setPriority(sorts[name]['priority']);
      if (sorts[name]['ascending']) {
        setArrow("▼");
      } else {
        setArrow("▲");
      }
    } else {
      setArrow("▪");
      setPriority(null);
    }

  }, [sorts]);
  return (
    <th className="helpMe" onClick={() => handleSort(name)}>
      {columns[name]['display']} <p className={`${name} sortableTableHeader`}>{arrow}{priority && `(${priority})`} </p>
    </th>
  )
}

export function MultiSelectDropdown({name, databases, filters, setFilters, attrType = 'trait'}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(['Clear']);
  const [options, setOptions] = useState([]);
  const ref = useRef();
  const upperName = columns[name]['name'];

  let rarityDatabase = databases['globalRarity'];
  if (attrType === 'backpack') {
    rarityDatabase = databases['backpackRarity'];
  }

  useEffect(() => {
    setSelected(['Clear']);
  }, [rarityDatabase]);

  useEffect(() => {
    let total = 0;
    let newOptions = [];
    for (const key of Object.keys(rarityDatabase[upperName])) {
      if (key === '') {
        continue;
      }
      const rarity = rarityDatabase[upperName][key];
      total += parseInt(rarity);
      newOptions.push([key, rarity]);
    }
    newOptions.sort((a, b) => b[1] - a[1]);
    if (attrType === 'trait') {
      newOptions.splice(0, 0, ['None', window['allDucks'].length - total]);
    }
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
      setFilters({...filters, [name]: [attrType, selected]});
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
        {columns[name]['display']}
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