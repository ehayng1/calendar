export function Dashboardx() {
  function getPostScores() {
    const spreadsheetId = "1QSfC93wc9qgCw2iLbBOF383olLFpoUrM06J4iV4HUxw";
    const sheetName = "Pre";
    const cell = "C2:C";
    const apiKey = "AIzaSyAp8_HwLtdbUOG6oLOuNKJ2VqSHHNl97TY";
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cell}?key=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const value = data.values[0][0];
        console.log(data);
        console.log("Value of C2:", value);
        return data.values;
      })
      .catch((error) => console.error("Error:", error));
  }

  function getPostEmails() {
    const spreadsheetId = "1QSfC93wc9qgCw2iLbBOF383olLFpoUrM06J4iV4HUxw";
    const sheetName = "Pre";
    const cell = "B2:C";
    const apiKey = "AIzaSyAp8_HwLtdbUOG6oLOuNKJ2VqSHHNl97TY";

    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cell}?key=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const value = data.values[0][0];
        console.log(data);
        console.log("Value of C2:", value);
        return data.values;
      })
      .catch((error) => console.error("Error:", error));
  }

  getPostScores();
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={getPostScores}>getScores</button>
    </>
  );
}
