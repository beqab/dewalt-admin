"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { Mark, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect, useState, useCallback } from "react";
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

const TextLarge = Mark.create({
  name: "textLarge",
  excludes: "textMedium",
  parseHTML() {
    return [{ tag: 'span[data-type="text-large"]' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "text-large",
        style: "font-size:1.5em;font-weight:700;",
      }),
      0,
    ];
  },
});

const TextMedium = Mark.create({
  name: "textMedium",
  excludes: "textLarge",
  parseHTML() {
    return [{ tag: 'span[data-type="text-medium"]' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "text-medium",
        style: "font-size:1.25em;font-weight:600;",
      }),
      0,
    ];
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const ACTIVE_BTN = "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!editor) return;
    editor.on("selectionUpdate", forceUpdate);
    editor.on("transaction", forceUpdate);
    return () => {
      editor.off("selectionUpdate", forceUpdate);
      editor.off("transaction", forceUpdate);
    };
  }, [editor, forceUpdate]);

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
      {/* Text Size */}
      <div className="flex gap-1 border-r pr-2 mr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleMark("textLarge").run()}
          className={editor.isActive("textLarge") ? ACTIVE_BTN : ""}
          title="დიდი ტექსტი"
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleMark("textMedium").run()}
          className={editor.isActive("textMedium") ? ACTIVE_BTN : ""}
          title="საშუალო ტექსტი"
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
          className={editor.isActive("bold") ? ACTIVE_BTN : ""}
          title="სქელი"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? ACTIVE_BTN : ""}
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
          className={editor.isActive("bulletList") ? ACTIVE_BTN : ""}
          title="ნიშნული სია"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? ACTIVE_BTN : ""}
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
          className={editor.isActive({ textAlign: "left" }) ? ACTIVE_BTN : ""}
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
            editor.isActive({ textAlign: "center" }) ? ACTIVE_BTN : ""
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
          className={editor.isActive({ textAlign: "right" }) ? ACTIVE_BTN : ""}
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
          className={editor.isActive("link") ? ACTIVE_BTN : ""}
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
        heading: false,
        paragraph: {
          HTMLAttributes: {
            class: "leading-7",
          },
        },
      }),
      TextLarge,
      TextMedium,
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
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_p]:whitespace-pre-wrap",
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
