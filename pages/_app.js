// pages/_app.js
import { ToastProvider } from "../components/Toast";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}
