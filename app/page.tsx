import '../app/globals.css';
import Home from "@/components/Home";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Interview Alchemist</title>
        <link rel="icon" href="../icon.svg" />
      </Head>
      <Home />
    </>
  );
}
