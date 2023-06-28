import { useEffect, useState } from "react";
import Main from "./components/Main";
/* eslint-disable react/prop-types */
function App() {
  const [theme, setTheme] = useState();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <>
      
        <Main theme={theme} setTheme={setTheme} />;
      ;
    </>
  );
}

export default App;
