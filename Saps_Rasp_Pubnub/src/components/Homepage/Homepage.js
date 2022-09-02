import { BrowserRouter, Routes, Route } from "react-router-dom";
import Display1screen from "../Displays/Display1screen";
import Display2screens from "../Displays/Display2screens";
import Display4screens from "../Displays/Display4screens";


  export default function Homepage()
  {
      return (
          <>
    <Routes>
      <Route path="/" element={<Display1screen />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
    </Routes>
          </>
      )
  }