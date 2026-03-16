import { Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "zh", name: "中文" },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // location.reload();
  };

  return (
    <Select
      defaultValue={i18n.language}
      style={{ width: 120 }}
      onChange={changeLanguage}
    >
      {languages.map(({ code, name }) => (
        <Option key={code} value={code}>
          {name}
        </Option>
      ))}
    </Select>
  );
}
