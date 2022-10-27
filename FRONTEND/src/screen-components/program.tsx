export function showProgram(rows: Array<{ startTime: string, newStartTime: string | null, endTime: string | null, newEndTime: string | null, type: string, description: string, room: string }>) {
  return (
    <table>
      <tr>
        <th className="table-background table-header">
          <h1>Godzina</h1>
        </th>
        <th className="table-background table-header">
          <h1>Punkt Programu</h1>
        </th>
        <th className="table-background table-header">
          <h1>Sala</h1>
        </th>
      </tr>

      {
        rows.map((o) => GenerateRow(o))
      }


    </table>
  );
};

function TypeTime(time: string, newTime: string | null, type: string) {
  if (type === "normal") {
    return (<>{time}</>);
  } else if (type === "changed") {
    return (
      <>
        <s>{time}</s>
        <strong>{newTime}</strong>
      </>
    );
  } else {
    return (
      <>
        <s>{time}</s>
        <strong> ODWOŁANY </strong>
      </>
    );
  }
}

function Stroke(text: string, type: string) {
  if (type === "deleted") {
    return (<div><s>{text}</s></div>);
  } else {
    return (<div>{text}</div>);
  }
}

function GenerateRow(RowData: { startTime: string, newStartTime: string | null, endTime: string | null, newEndTime: string | null, type: string, description: string, room: string }) {

  return (
    <tr>
      <td className="table-background table-content">
        {TypeTime(RowData.startTime, RowData.newStartTime, RowData.type)}
      </td>
      <td className="table-background table-content">
        {Stroke(RowData.description, RowData.type)}
      </td>
      <td className="table-background table-content">
        {Stroke(RowData.room, RowData.type)}
      </td>
    </tr>
  );
}
