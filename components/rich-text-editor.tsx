"use client";

import dynamic from "next/dynamic";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

// Dynamically import the editor component to avoid SSR issues
const TipTapEditor = dynamic(() => import("./rich-text-editor-content"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md min-h-[200px] flex items-center justify-center bg-muted/50">
      <p className="text-muted-foreground">რედაქტორი იტვირთება...</p>
    </div>
  ),
}) as React.ComponentType<RichTextEditorProps>;

export function RichTextEditor(props: RichTextEditorProps) {
  return <TipTapEditor {...props} />;
}
