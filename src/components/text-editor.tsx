"use client";

import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { useTheme } from "next-themes";

function TextEditor({
  setData,
  initialData
}: {
  setData: React.Dispatch<React.SetStateAction<string>>,
  initialData?: string;
}) {
  const {theme} = useTheme();

  const editorConfiguration = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "alignment",
        "code",
        "codeBlock",
        "findAndReplace",
        "fontColor",
        "fontFamily",
        "fontSize",
        "fontBackgroundColor",
        "highlight",
        "horizontalLine",
        "htmlEmbed",
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toogleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    }
  };

  return (
    <>
      <CKEditor
        editor={Editor as any}
        data={initialData ? initialData : ``}
        config={editorConfiguration}
        onChange={(event, editor) => setData(editor.getData())}
      />
    </>
  );
}

export default TextEditor;
