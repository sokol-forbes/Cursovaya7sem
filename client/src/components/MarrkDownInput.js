// import { Button } from "@mui/material";
// import { UseFormSetValue } from 'react-hook-form';
import { ReactElement, useState } from "react";
import Markdown from "markdown-to-jsx";

import "./MarkDown.css";
// import { EFaqTopic } from "../../trpc/queries";

// export interface IFAQData {
//   answer: string;
//   question: string;
// }

// interface IMarkdownInputProps {
//   description: string;
//   setDescription: (description: string) => void;
//   invalid?: boolean;
//   setFormValue?: UseFormSetValue<{
//     title: string;
//     description: string;
//     topic: EFaqTopic;
//   }>;
// }

export const MarkdownInput = ({
  description = '',
  setDescription,
  invalid,
  setFormValue,
  disabled
}) => {
  const [previewMode, setPreviewMode] = useState(!!disabled);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${invalid ? "red" : "rgba(0, 0, 0, 0.23)"}`,
        borderRadius: "4px",
        padding: "20px",
        paddingTop: "0",
        height: "300px",
        width: "100%",
      }}
    >
      <div
        style={{
          // margiRight: "auto",
          display: "flex",
          justifyContent: "center",
          columnGap: "5px",
        }}
      >
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => disabled !== true && setPreviewMode(false)}
        >
          Write
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => disabled !== true && setPreviewMode(true)}
        >
          Preview
        </button>
      </div>
      {previewMode ? (
        <Markdown className="markdown" children={description} />
      ) : (
        <textarea
          style={{
            padding: "6px 8px",
            height: "100%",
            width: "100%",
          }}
          value={description}
          onChange={(e) => {
            setDescription && setDescription(e.target.value);
            if (setFormValue) setFormValue("description", e.target.value);
          }}
        />
      )}
    </div>
  );
};
