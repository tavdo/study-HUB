import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "../comp/nav/Navigation";
import Setting from "../pages/Setting/Settings";
import Notes from "../pages/notes/Notes";
import Dashboard from "../pages/Dashboard/Dashboard";
import AI from "../pages/AI/AI";
import Library from "../pages/Libery/Library";
import Group from "../pages/Group/Groups";

function Study() {
  return (
    <BrowserRouter>
      <div className="flex h-265 bg-white-50">
        <div className="w-64 bg-gray-100 p-4 border-r border-gray-200">
          <h1 className="text-left text-xl font-semibold mb-6">Study hub</h1>
          <Navigation />
        </div>

        {/* Main content */}
        <div className="">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/Group" element={<Group />} />
            <Route path="/Library" element={<Library />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Study;
