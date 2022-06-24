import React from "react";

const TrackerTable = ({ data, column, callbacks }) => {
    return (
      <table>
        <thead key="tHead">
          <tr key="headTR">
            {column.map((item, index) => <TableHeadItem item={item} />)}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => <TableRow item={item} column={column} callbacks={callbacks} />)}
        </tbody>
      </table>
    )
  }
  
  const TableHeadItem = ({ item }) => <th key={item.heading}>{item.heading}</th>
  const TableRow = ({ item, column, callbacks }) => (
    <tr key={item['id']} onClick={() => callbacks.showTrackerModel(item)}>
      {column.map((columnItem, index) => {
        return <td>{item[`${columnItem.value}`]}</td>
      })}
    </tr>
  )
  
  export default TrackerTable