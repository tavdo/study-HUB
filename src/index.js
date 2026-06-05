import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { FileViewerProvider } from "./context/FileViewerContext";
import { ToastProvider } from "./context/ToastContext";
import { I18nProvider } from "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <FileViewerProvider>
            <App />
          </FileViewerProvider>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  </React.StrictMode>
);
