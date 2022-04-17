import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/ext-language_tools";

interface ICodeEditorProps {
  name: string;
  code: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeEditor: React.FC<ICodeEditorProps> = ({
  name,
  code,
  onChange,
  language,
}) => {
  return (
    <AceEditor
      name={name}
      value={code}
      mode={language}
      theme="kuroir"
      className="border-2 border-black w-max"
      onChange={(value, e) => onChange(value)}
      width="auto"
      height="auto"
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      }}
    />
  );
};

export default CodeEditor;
