import { BrowserRouter as Router } from "react-router-dom";
import BaseRoute from "./routes";
import { ThemeProvider } from "./components/theme/theme-provider";

function App() {

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <Router>
          <BaseRoute />
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
