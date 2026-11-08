import { useEffect } from "react";
import type { AppProps } from "next/app";
import "./index.css";

let greeted = false; // strict mode runs effects twice in dev

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(
      "%cMCSS%c\n\npoking around the console? respect.\nthe tech team is recruiting → https://discord.gg/KTdrQkjgjb\n\nthis site has 0 bugs. proof left as an exercise to the reader.",
      "font: 48px/1 Dagestan, Impact, sans-serif; color: #9bd6f3; text-shadow: 3px 3px 0 #8d93c7;",
      "font: 13px/1.5 ui-monospace, Consolas, monospace; color: #8d93c7;",
    );
  }, []);

  return <Component {...pageProps} />;
}
