import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Code,
  Minus,
  PaintBucket,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: Props) {
  // const [url, setUrl] = useState("");
  if (!editor) return null;

  // const applyLink = () => {
  //   if (url.trim().length === 0) return;
  //   editor.chain().focus().setLink({ href: url }).run();
  // };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Text Styles */}
      <ToggleGroup
        type="multiple"
        className="border"
        value={[
          editor.isActive("bold") ? "bold" : "",
          editor.isActive("italic") ? "italic" : "",
          editor.isActive("underline") ? "underline" : "",
          editor.isActive("strike") ? "strike" : "",
        ].filter(Boolean)}
        onValueChange={(values) => {
          // Toggle based on presence in array
          if (values.includes("bold")) editor.chain().focus().setBold().run();
          else editor.chain().focus().unsetBold().run();

          if (values.includes("italic"))
            editor.chain().focus().setItalic().run();
          else editor.chain().focus().unsetItalic().run();

          if (values.includes("underline"))
            editor.chain().focus().setUnderline().run();
          else editor.chain().focus().unsetUnderline().run();

          if (values.includes("strike"))
            editor.chain().focus().setStrike().run();
          else editor.chain().focus().unsetStrike().run();
        }}
      >
        {[
          { value: "bold", icon: <Bold /> },
          { value: "italic", icon: <Italic /> },
          { value: "underline", icon: <Underline /> },
          { value: "strike", icon: <Strikethrough /> },
        ].map((item) => (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            className={"border-r last:border-0"}
          >
            {item.icon}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Headings */}
      <ToggleGroup
        className="border"
        type="single"
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
            ? "h2"
            : editor.isActive("heading", { level: 3 })
            ? "h3"
            : editor.isActive("heading", { level: 4 })
            ? "h4"
            : ""
        }
        onValueChange={(value) => {
          if (!value) return;
          const level =
            value === "h1" ? 1 : value === "h2" ? 2 : value === "h3" ? 3 : 4; // value === "h4"

          editor.chain().focus().toggleHeading({ level }).run();
        }}
      >
        {[1, 2, 3, 4].map((level, i) => {
          const Icon = [Heading1, Heading2, Heading3, Heading4][i];
          return (
            <ToggleGroupItem
              className="border-r last:border-0"
              key={level}
              value={`h${level}`}
            >
              <Icon />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {/* Lists */}
      <ToggleGroup
        type="multiple"
        className="border"
        value={[
          editor.isActive("bulletList") ? "bullet" : "",
          editor.isActive("orderedList") ? "ordered" : "",
        ].filter(Boolean)}
        onValueChange={(values) => {
          // bullet list
          if (values.includes("bullet")) {
            editor.chain().focus().toggleBulletList().run();
          } else if (editor.isActive("bulletList")) {
            editor.chain().focus().toggleBulletList().run();
          }

          // ordered list
          if (values.includes("ordered")) {
            editor.chain().focus().toggleOrderedList().run();
          } else if (editor.isActive("orderedList")) {
            editor.chain().focus().toggleOrderedList().run();
          }
        }}
      >
        {[
          { value: "bullet", icon: <List /> },
          { value: "ordered", icon: <ListOrdered /> },
        ].map(({ value, icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className={"border-r last:border-0"}
          >
            {icon}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Sub/Super */}
      <ToggleGroup
        type="multiple"
        className="border"
        value={[
          editor.isActive("subscript") ? "sub" : "",
          editor.isActive("superscript") ? "sup" : "",
        ].filter(Boolean)}
        onValueChange={(values) => {
          if (values.includes("sub")) {
            editor.chain().focus().setSubscript().run();
          } else if (editor.isActive("subscript")) {
            editor.chain().focus().unsetSubscript().run();
          }

          if (values.includes("sup")) {
            editor.chain().focus().setSuperscript().run();
          } else if (editor.isActive("superscript")) {
            editor.chain().focus().unsetSuperscript().run();
          }
        }}
      >
        <ToggleGroupItem value="sub" className={"border-r last:border-0"}>
          <Subscript />
        </ToggleGroupItem>

        <ToggleGroupItem value="sup" className={"border-r last:border-0"}>
          <Superscript />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Alignment */}
      <ToggleGroup
        type="single"
        className="border"
        value={
          editor.isActive({ textAlign: "left" })
            ? "left"
            : editor.isActive({ textAlign: "center" })
            ? "center"
            : editor.isActive({ textAlign: "right" })
            ? "right"
            : ""
        }
        onValueChange={(value) => {
          if (!value) return;
          editor.chain().focus().setTextAlign(value).run();
        }}
      >
        <ToggleGroupItem className={"border-r last:border-0"} value="left">
          <AlignLeft />
        </ToggleGroupItem>

        <ToggleGroupItem className={"border-r last:border-0"} value="center">
          <AlignCenter />
        </ToggleGroupItem>

        <ToggleGroupItem className={"border-r last:border-0"} value="right">
          <AlignRight />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Link */}
      {/* <div className="flex border rounded-md overflow-hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={editor.isActive("link") ? "bg-accent" : ""}
            >
              <Link />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex gap-2 p-2">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-48"
            />
            <Button size="sm" onClick={applyLink}>
              Apply
            </Button>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className="border-l"
        >
          <Link2Off />
        </Button>
      </div> */}

      {/* Extra */}
      <div className="flex border rounded-md overflow-hidden">
        {[
          { icon: <Undo />, action: () => editor.chain().focus().undo().run() },
          { icon: <Redo />, action: () => editor.chain().focus().redo().run() },
          {
            icon: <Code />,
            action: () => editor.chain().focus().toggleCode().run(),
            active: editor.isActive("code"),
          },
          {
            icon: <Minus />,
            action: () => editor.chain().focus().setHorizontalRule().run(),
          },
          {
            icon: <PaintBucket />,
            action: () => editor.chain().focus().toggleHighlight().run(),
            active: editor.isActive("highlight"),
          },
        ].map((item, index) => (
          <Button
            key={index}
            size="icon"
            variant={item.active ? "default" : "ghost"}
            onClick={item.action}
            className="rounded-none border-r last:border-0"
          >
            {item.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}
