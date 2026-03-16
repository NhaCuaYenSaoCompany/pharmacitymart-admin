import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ThemeContext, type Theme, type ThemeContextType } from '../../contexts/ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Lấy theme từ localStorage hoặc mặc định là 'light'
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  // Cập nhật CSS class cho document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev: Theme) => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  // Cấu hình theme cho Ant Design
  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      ...(currentTheme === 'dark' && {
        colorBgContainer: '#141414',
        colorBgElevated: '#1f1f1f',
        colorBgLayout: '#000000',
        colorText: '#ffffff',
        colorTextSecondary: '#a6a6a6',
        colorBorder: '#303030',
      }),
    },
  };

  const value: ThemeContextType = {
    currentTheme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
