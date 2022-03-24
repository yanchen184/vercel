/* eslint-disable jsx-a11y/anchor-is-valid */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // switch

import DeliveryQuota from "./Scenes/DeliveryQuota.jsx";
import DefaultPickpackQuota from "./Scenes/DefaultPiclPack/DefaultPickpackQuota.jsx";
import Login from "./Scenes/Login/Login";
import AuthenticationService from "./Scenes/Login/AuthenticationService.js";
import PickpackQuota from "./Scenes/PickPack/PickpackQuota.jsx";
import QuotaExceeded from "./Scenes/PickpackQuotaExceeded/PickpackQuotaExceeded.jsx";
import QuotaSummary from "./Scenes/PickpackQuotaSummary/PickpackQuotaSummary.jsx";
import QuotaSummaryDetail from "./Scenes/PickpackQuotaSummaryDetail/PickpackQuotaSummaryDetail.jsx";
import Sidebar from "./Common/Components/Sidebar/Sidebar.js";

const App = () => {
  const authed = AuthenticationService.isUserLoggedIn();
  console.log("authed :", authed);

  if (!authed) {
    return (
      <div class="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </div>
    );
  } else {
    return (
      <>
        <Router>
          <Sidebar />
          <Routes>
            <Route path="/pickpackQuota" element={<PickpackQuota />} />
            <Route path="/deliveryQuota" element={<DeliveryQuota />} />
            <Route path="/quotaExceeded" element={<QuotaExceeded />} />
            <Route path="/quotaSummary" element={<QuotaSummary />} />
            <Route
              path="/quotaSummaryDetail"
              element={<QuotaSummaryDetail />}
            />
            <Route
              path="/defaultPickpackQuota"
              element={<DefaultPickpackQuota />}
            />
          </Routes>
        </Router>
      </>
    );
  }
};

export default App;
