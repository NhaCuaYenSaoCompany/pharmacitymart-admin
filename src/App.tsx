import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "~/store";
import { GlobalStyle } from "./components/GlobalStyle/GlobalStyle";
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider";
import AppRoute from "./routes/AppRoute";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <GlobalStyle>
            <AppRoute />
          </GlobalStyle>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
