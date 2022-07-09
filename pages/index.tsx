import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
const CodeEditor = dynamic(import("../Components/CodeEditor"), { ssr: false });

const Home: NextPage = () => {
  const [html, setHtml] = useState("");
  const [mjml, setmjml] = useState(`<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          Hello {{test}}!
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
  </mjml>`);

  const [context, setContext] = useState(`{
    "test":"Jarvis"
  }`);

  const getData = async () => {
    const rawResponse = await fetch("api/convert-mjml", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mjml: mjml, context: context }),
    });
    const data = await rawResponse.json();
    setHtml(data.html);
  };
  useEffect(() => {
    getData();
  });
  return (
    <div>
      <Head>
        <title>mjml converter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-2 gap-2 h-screen">
        <div className="grid grid-rows-2 gap-2 border-2">
          <CodeEditor
            name="mjmlEditor"
            code={mjml}
            onChange={(value) => setmjml(value)}
            language="html"
          />
          <CodeEditor
            name="contextJson"
            code={context}
            language="json"
            onChange={(value) => setContext(value)}
          />
        </div>
        <div className="border-2" style={{ width: "auto" }}>
          <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
      </main>
    </div>
  );
};

export default Home;
