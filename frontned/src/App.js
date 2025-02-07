import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddJob from "./Design/Components/AddJob";
import ViewJobs from "./Design/Components/ViewJobs";
import EditJob from "./Design/Components/EditJob";
import Summary from "./Design/Components/Summary";
import UploadCV from "./Design/Components/UploadCV";
import WebSummary from "./Design/Components/WebSummary";

function App() {
  return (
    <div>
      <AddJob />
      <ViewJobs />
      {/* <Summary /> */}
      {/* <UploadCV /> */}
      {/* <WebSummary /> */}
    </div>
  );
}

export default App;
