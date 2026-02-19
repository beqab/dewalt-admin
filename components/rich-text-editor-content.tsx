"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt("შეიყვანეთ URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50">
      {/* Headings */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const { from, to, empty } = editor.state.selection;
            // If text is selected, split paragraph and convert selected part to heading
            if (!empty && from !== to) {
              const selectedText = editor.state.doc.textBetween(from, to);
              // Delete selected text, split paragraph, and insert as heading
              editor
                .chain()
                .focus()
                .deleteSelection()
                .insertContent(`<h2>${selectedText}</h2>`)
                .run();
            } else {
              // No selection, apply heading to current paragraph (standard behavior)
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }
          }}
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
          }
          title="სათაური 2"
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const { from, to, empty } = editor.state.selection;
            // If text is selected, split paragraph and convert selected part to heading
            if (!empty && from !== to) {
              const selectedText = editor.state.doc.textBetween(from, to);
              // Delete selected text, split paragraph, and insert as heading
              editor
                .chain()
                .focus()
                .deleteSelection()
                .insertContent(`<h3>${selectedText}</h3>`)
                .run();
            } else {
              // No selection, apply heading to current paragraph (standard behavior)
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }
          }}
          className={
            editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""
          }
          title="სათაური 3"
        >
          H3
        </Button>
      </div>

      {/* Text Formatting */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-accent" : ""}
          title="სქელი"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-accent" : ""}
          title="კურსივი"
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-accent" : ""}
          title="ნიშნული სია"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-accent" : ""}
          title="დანომრილი სია"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Alignment */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
          title="მარცხნივ გასწორება"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""
          }
          title="ცენტრში გასწორება"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}
          title="მარჯვნივ გასწორება"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Link */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive("link") ? "bg-accent" : ""}
          title="ბმულის დამატება"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Separator */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="ჰორიზონტალური ხაზის ჩასმა"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="გაუქმება"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="გამეორება"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default function RichTextEditorContent({
  value,
  onChange,
  placeholder = "შეიყვანეთ ტექსტი...",
  className,
  id,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        paragraph: {
          HTMLAttributes: {
            class: "leading-7",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:underline cursor-pointer",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h2]:text-2xl [&_h3]:text-xl [&_p]:whitespace-pre-wrap",
        id: id || "",
        "data-placeholder": placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleWrapperClick = () => {
    if (editor) {
      editor.chain().focus().run();
    }
  };

  return (
    <div className={cn("rich-text-editor border rounded-md", className)}>
      <MenuBar editor={editor} />
      <div onClick={handleWrapperClick} className="cursor-text">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
