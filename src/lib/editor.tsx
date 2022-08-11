import { useCreation } from "ahooks";
import { FunctionComponent, useCallback, KeyboardEvent } from "react";
import { BaseEditor, createEditor, Descendant, Editor, Text, Transforms } from "slate";
import { Editable, ReactEditor, RenderLeafProps, Slate, withReact } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import { renderSuit, Suit } from "./bridge";
import { modKey } from "./keys";

export type ParagraphElement = {
  type: "paragraph";
  children: Descendant[];
};

export type EditorElement = ParagraphElement;

export type EditorText = {
  text: string;
  bold?: true;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: EditorElement;
    Text: EditorText;
  }
}

export function useEditor() {
  return useCreation(() => withReact(createEditor()), []);
}

export type RichText = Descendant[];

function renderLeaf(props: RenderLeafProps) {
  if (props.leaf.bold) {
    return <strong className="font-semibold font-emoji" {...props.attributes}>
      {props.children}
    </strong>;
  } else {
    return <span className="font-emoji" {...props.attributes}>
      {props.children}
    </span>;
  }
}

export type TextEditorProps = {
  initialValue?: RichText;
  onChange?(value: RichText, editor: BaseEditor & ReactEditor): void;
  readOnly?: boolean;
} & Omit<EditableProps, "initialValue" | "onChange" | "readOnly">;

export const emptyRichText: RichText = [{ type: "paragraph", children: [{ text: "" }] }];

export const TextEditor: FunctionComponent<TextEditorProps> = ({ initialValue, onChange, readOnly, ...props }) => {
  initialValue ??= emptyRichText;

  const editor = useEditor();

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (["c", "d", "h", "s"].includes(e.key) && modKey(e) && e.altKey) {
      e.preventDefault();
      editor.insertText(renderSuit[e.key.toUpperCase() as Suit]);
    } else if (e.key === "b" && modKey(e)) {
      e.preventDefault();
      const [match] = Editor.nodes(editor, {
        match: n => Text.isText(n) && !!n.bold
      });
      Transforms.setNodes(
        editor,
        { bold: !!match ? null as any : true },
        { match: Text.isText, split: true },
      );
    }
  }, [editor]);

  const onSlateChange = useCallback((t: RichText) => {
    if (onChange && editor.operations.some(op => op.type !== "set_selection")) {
      onChange(t, editor);
    }
  }, [onChange, editor]);

  return <Slate
    editor={editor}
    value={initialValue}
    onChange={onSlateChange}
  >
    <Editable
      {...props}
      onKeyDown={onKeyDown}
      renderLeaf={renderLeaf}
      readOnly={readOnly}
    />
  </Slate>
};
