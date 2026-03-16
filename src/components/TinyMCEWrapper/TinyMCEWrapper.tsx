// TinyMCEWrapper.tsx
import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import { useTheme } from "~/hooks/useTheme";

interface TinyMCEWrapperProps {
  value?: string;
  onChange?: (content: string) => void;
  apiKey: string;
  init?: any;
  theme?: "silver" | "oxide" | "oxide-dark";
}

const TinyMCEWrapper = forwardRef<any, TinyMCEWrapperProps>(
  ({ value, onChange, apiKey, init, theme }, ref) => {
    const editorRef = useRef<any>(null);
    const { currentTheme } = useTheme();
    const [key, setKey] = useState(0); // Key để force re-render editor

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.getContent(),
      setContent: (content: string) => editorRef.current?.setContent(content),
    }));

    // Tự động sử dụng theme hiện tại nếu không có theme prop
    const editorTheme = theme || (currentTheme === 'dark' ? 'oxide-dark' : 'oxide');

    // Reload editor khi theme thay đổi
    useEffect(() => {
      setKey(prev => prev + 1);
    }, [currentTheme]);

    // Merge theme với init config
    const editorInit = {
      ...init,
      skin: editorTheme === "oxide-dark" ? "oxide-dark" : "oxide",
      content_css: editorTheme === "oxide-dark" ? "dark" : "default",
    };

    return (
      <Editor
        key={key} // Force re-render khi key thay đổi
        apiKey={apiKey}
        onInit={(_, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={onChange}
        init={editorInit}
      />
    );
  }
);

export default TinyMCEWrapper;
