"use client";

import { memo, useLayoutEffect } from "react";
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";
import { Blockquote } from "reactjs-tiptap-editor/blockquote";
import { Bold } from "reactjs-tiptap-editor/bold";
import { BulletList } from "reactjs-tiptap-editor/bulletlist";
import { Color } from "reactjs-tiptap-editor/color";
import { FontFamily } from "reactjs-tiptap-editor/fontfamily";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { Heading } from "reactjs-tiptap-editor/heading";
// import { Highlight } from "reactjs-tiptap-editor/highlight";
import { Indent } from "reactjs-tiptap-editor/indent";
import { Italic } from "reactjs-tiptap-editor/italic";
import { LineHeight } from "reactjs-tiptap-editor/lineheight";
import { Link } from "reactjs-tiptap-editor/link";
import { OrderedList } from "reactjs-tiptap-editor/orderedlist";
import { Strike } from "reactjs-tiptap-editor/strike";
import { Table } from "reactjs-tiptap-editor/table";
import { TaskList } from "reactjs-tiptap-editor/tasklist";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { TextUnderline } from "reactjs-tiptap-editor/textunderline";
import { TextDirection } from "reactjs-tiptap-editor/textdirection";
import { Video } from "reactjs-tiptap-editor/video";
import { Image } from "reactjs-tiptap-editor/image";
import { Attachment } from "reactjs-tiptap-editor/attachment";
import { locale } from "reactjs-tiptap-editor/locale-bundle";
import "reactjs-tiptap-editor/style.css";
import "./text-viewer.css";

interface TextViewerProps {
  content: string;
  contentClassName?: string;
}

export const TextViewer: React.FC<TextViewerProps> = memo(
  ({ content, contentClassName }) => {
    useLayoutEffect(() => {
      setTimeout(() => {
        locale.setLang("vi");
      }, 0);
    }, []);

    return (
      <RichTextEditor
        output="html"
        content={content}
        onChangeContent={() => { }}
        contentClass={contentClassName}
        removeDefaultWrapper
        disabled
        hideToolbar
        disableBubble
        hideBubble
        extensions={[
          BaseKit.configure({
            placeholder: { placeholder: "" },
            characterCount: false,
          }),
          Heading,
          FontFamily,
          FontSize,
          Bold,
          Italic,
          TextUnderline,
          Strike,
          Color.configure({ spacer: false }),
          BulletList,
          OrderedList,
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          Indent,
          LineHeight,
          TaskList.configure({
            taskItem: { nested: true },
          }),
          Link,
          Blockquote,
          TextDirection,
          Video,
          Image,
          Table,
          Attachment,
        ]}
        dark={false}
      />
    );
  },
);

TextViewer.displayName = "TextViewer";
