import {useEffect, useState} from "react";
import columns from "./columnClasses";

export function TableHeaderSortable({name, handleSort, sorts}) {
  const [arrow, setArrow] = useState("▪");
  const [priority, setPriority] = useState(null);

  useEffect(() => {
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
    <th onClick={() => handleSort(name)}>
      {columns[name]['name']} <p className={`${name} sortableTableHeader`}>{arrow}{priority && `(${priority})`} </p>
    </th>
  )
}