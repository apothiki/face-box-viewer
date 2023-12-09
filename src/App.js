import { useEffect, useState } from "react";
import "./App.css";

const {
  compareModels,
  ping,
  onCompareModelsError,
  onCompareModelsReply,
  onPingReply,
  removeCompareModelsListener,
  removePingListener,
} = window.electronAPI;

ping();
onPingReply((event, arg) => {
  console.log(arg); // prints "pong"
  removePingListener();
});

function App() {
  const [model1CSV, setModel1CSV] = useState("");
  const [model2CSV, setModel2CSV] = useState("");
  const [model1Dir, setModel1Dir] = useState("");
  const [model2Dir, setModel2Dir] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    onCompareModelsReply((event, comparisonResults) => {
      setResults(comparisonResults);
    });

    onCompareModelsError((event, error) => {
      console.error(error);
    });

    return () => {
      removeCompareModelsListener();
    };
  }, []);

  const allInputsSelected = model1CSV && model2CSV && model1Dir && model2Dir;

  const handleSubmit = () => {
    console.log(model1CSV, model2CSV, model1Dir, model2Dir);
    compareModels({ model1CSV, model2CSV, model1Dir, model2Dir });
  };

  const openImageInNewWindow = (base64Image) => {
    const imageWindow = window.open();
    imageWindow.document.write(
      `<img src="${base64Image}" style="max-width: 100%;" alt="Opened Image"/>`
    );
  };

  const imageStyle = {
    maxWidth: "100%",
    height: "auto",
    cursor: "pointer",
  };

  return (
    <div>
      <div>
        <label htmlFor="model1csv">Model 1 CSV File:</label>
        <input
          id="model1csv"
          type="file"
          accept=".csv"
          onChange={(e) =>
            setModel1CSV(e.target.files && e.target.files[0].path)
          }
        />
      </div>
      <div>
        <label htmlFor="model1dir">Model 1 Bounding Box Image Directory:</label>
        <input
          id="model1dir"
          type="file"
          webkitdirectory=""
          directory=""
          onChange={(e) =>
            setModel1Dir(e.target.files && e.target.files[0].path)
          }
        />
      </div>
      <div>
        <label htmlFor="model2csv">Model 2 CSV File:</label>
        <input
          id="model2csv"
          type="file"
          accept=".csv"
          onChange={(e) =>
            setModel2CSV(e.target.files && e.target.files[0].path)
          }
        />
      </div>
      <div>
        <label htmlFor="model2dir">Model 2 Bounding Box Image Directory:</label>
        <input
          id="model2dir"
          type="file"
          webkitdirectory=""
          directory=""
          onChange={(e) =>
            setModel2Dir(e.target.files && e.target.files[0].path)
          }
        />
      </div>
      <button onClick={handleSubmit} disabled={!allInputsSelected}>
        Submit
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "auto",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: "10px" }}>Image Path</div>
        <div>Model 1 Bounding Box Image</div>
        <div>Model 2 Bounding Box Image</div>
        {results.map((result, index) => (
          <>
            <div style={{ marginBottom: "10px" }}>{result.original}</div>
            <img
              src={result.model1Path}
              alt="Model 1 Bounding Box"
              style={imageStyle}
              onClick={() => openImageInNewWindow(result.model1Path)}
            />
            <img
              src={result.model2Path}
              alt="Model 2 Bounding Box"
              style={imageStyle}
              onClick={() => openImageInNewWindow(result.model2Path)}
            />
          </>
        ))}
      </div>
    </div>
  );
}

export default App;
