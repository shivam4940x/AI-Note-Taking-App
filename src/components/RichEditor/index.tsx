import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Code from "@tiptap/extension-code";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import { useEffect, useRef, useState } from "react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "./index.css";
import { EditorToolbar } from "./EditorToolbar";

type RichTextEditorProps = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function RichTextEditor({
  content,
  setContent,
}: RichTextEditorProps) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    content,
    onUpdate: ({ editor }) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        setContent(editor.getHTML());
      }, 300);
    },
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Underline,
      Subscript,
      Superscript,
      Code,
      HorizontalRule,
      Highlight,
      TextStyle,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Write your content...",
        emptyEditorClass: "is-empty",
      }),
    ],
  });

  const [, setEditorState] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setEditorState((prev) => prev + 1);
    };

    editor.on("transaction", update);

    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);
  if (!editor) return null;

  return (
    <Card className="rounded-md p-0 shadow-none border-0 gap-2 md:gap-0 min-h-full md:min-h-0 flex flex-row md:flex-col">
      <CardHeader className="md:p-2 p-0 w-12 md:w-full">
        <EditorToolbar editor={editor} />
      </CardHeader>
      <Separator className="hidden md:block" />
      <CardContent className="md:px-2 grow">
        {/* <Separator className="mb-2" /> */}
        <EditorContent
          editor={editor}
          // className="min-h-[200px] focus:outline-none"
        />
      </CardContent>
    </Card>
  );
}
