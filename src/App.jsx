import { AppProvider } from "./context/AppContext.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
}
