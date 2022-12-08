import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ScreenMain } from "./screens/screen";
import { AcreditionSystem } from "./accreditation/acredition-system";
import { DJView } from "./dj/dj";
import { HelloWorld } from "./hello-world";
import { AuthScreen } from "./screens/auth-screen";
import { AdminPanel } from "./screen-admin/admin-panel";
import "bootstrap/dist/css/bootstrap.min.css";
import { FursuitPage } from "./fursuits/fursuit.page";

function App() {
  return (<>
      <Router>
        <Routes>
          <Route path="/" element={<FursuitPage />} />
          <Route path="/hello" element={<HelloWorld />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/wsscreen" element={<ScreenMain wsEnabled={true} />} />
          <Route path="/screen" element={<ScreenMain wsEnabled={false} />} />
          <Route path="/screen/:screenid" element={<ScreenMain wsEnabled={false} />} />
          <Route path="/acc" element={<AcreditionSystem />} />
          <Route path="/dj" element={<DJView />} />
          <Route path="/fursuits" element={
            <FursuitPage />
          } />
        </Routes>
    </Router>
    </>
  );
}

export default App;
