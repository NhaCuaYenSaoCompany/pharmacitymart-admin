import React from 'react';
import { Button } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={currentTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={currentTheme === 'light' ? 'Chuyển sang Dark theme' : 'Chuyển sang Light theme'}
    />
  );
};
