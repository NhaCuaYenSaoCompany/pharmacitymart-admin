import { Button, Form, Input, Space } from "antd";
import type { FormInstance } from "antd/es/form";
import React from "react";
import { generateSlug } from "~/utils/generateSlug";

interface WorkingSlugInputProps {
  form: FormInstance;
  sourceField: string;
  targetField: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function WorkingSlugInput({
  form,
  sourceField,
  targetField,
  label = "Slug",
  placeholder = "Enter slug",
  required = false,
}: WorkingSlugInputProps) {
  const [slugValue, setSlugValue] = React.useState("");

  // Watch title để auto-generate
  const titleValue = Form.useWatch(sourceField, form);
  // Watch slug để sync với form khi reset
  const formSlugValue = Form.useWatch(targetField, form);

  // Sync local state với form state khi form reset
  React.useEffect(() => {
    if (formSlugValue !== slugValue) {
      setSlugValue(formSlugValue || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSlugValue]);

  // Auto generate khi title thay đổi
  React.useEffect(() => {
    if (titleValue && typeof titleValue === "string" && titleValue.trim()) {
      const newSlug = generateSlug(titleValue);
      setSlugValue(newSlug);
      form.setFieldValue(targetField, newSlug);
    } else if (!titleValue) {
      // Reset slug khi title bị xóa
      setSlugValue("");
      form.setFieldValue(targetField, "");
    }
  }, [titleValue, form, targetField]);

  const handleGenerate = () => {
    console.log("🚀 Generate clicked");
    const currentTitle = form.getFieldValue(sourceField);
    console.log("📝 Current title:", currentTitle);

    if (
      currentTitle &&
      typeof currentTitle === "string" &&
      currentTitle.trim()
    ) {
      const newSlug = generateSlug(currentTitle.trim());
      console.log("✨ New slug:", newSlug);

      setSlugValue(newSlug);
      form.setFieldValue(targetField, newSlug);

      console.log("✅ Updated!");
    } else {
      alert("Vui lòng nhập title trước!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlugValue(value);
    form.setFieldValue(targetField, value);
  };

  const rules = required
    ? [{ required: true, message: `${label} là bắt buộc` }]
    : [];

  return (
    <Form.Item
      label={`${label} (tự động từ title)`}
      name={targetField}
      rules={rules}
    >
      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder={placeholder}
          value={slugValue}
          onChange={handleInputChange}
        />
        <Button
          type="primary"
          onClick={handleGenerate}
          style={{ backgroundColor: "#52c41a" }}
        >
          Generate
        </Button>
      </Space.Compact>
    </Form.Item>
  );
}
