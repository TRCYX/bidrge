import { useCreation } from "ahooks";
import { FunctionComponent, useCallback, KeyboardEvent, useRef } from "react";
import { BaseEditor, createEditor, Descendant, Editor, Element, Text, Transforms } from "slate";
import { DefaultElement, Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";
import { renderSuit, Suit } from "./bridge";

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
  initialValue?: RichText | null;
  onChange(value: RichText | null): void;
};

const emptyValue: RichText = [{ type: "paragraph", children: [{ text: "" }] }];

export const TextEditor: FunctionComponent<TextEditorProps> = ({ initialValue, onChange }) => {
  initialValue ??= emptyValue;

  const editor = useEditor();
  const value = useRef(initialValue);
  const changed = useRef(false);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (["c", "d", "h", "s"].includes(e.key) && e.ctrlKey && e.altKey) {
      e.preventDefault();
      editor.insertText(renderSuit[e.key.toUpperCase() as Suit]);
    } else if (e.key === "b" && e.ctrlKey) {
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
    value.current = t;
    changed.current = true;
  }, []);

  const onBlur = useCallback(() => {
    if (changed.current) {
      const [match] = Editor.nodes(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
        match: n => Text.isText(n) && !!n.text,
      });
      onChange(!!match ? value.current : null);
      changed.current = false;
    }
  }, [editor, onChange]);

  return <Slate
    editor={editor}
    value={initialValue}
    onChange={onSlateChange}
  >
    <Editable
      onKeyDown={onKeyDown}
      renderLeaf={renderLeaf}
      onBlur={onBlur}
    />
  </Slate>
};
