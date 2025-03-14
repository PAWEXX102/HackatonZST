"use client";
import { useTheme } from "next-themes";
import { Tab, Tabs } from "@heroui/react";
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  return (
    <Tabs
      aria-label="ThemeSwitch"
      classNames={{
        tabList: "bg-gray-50 dark:bg-zinc-800",
      }}
      size="sm"
      fullWidth
      selectedKey={theme}
      onSelectionChange={(key) => handleThemeChange(key.toString())}
    >
      <Tab
        className="font-extrabold dark:bg-gray-300 border border-gray-300 "
        key={"light"}
        title={
          <div className=" flex space-x-2 pr-2 ">
            <span>Tryb jasny</span>
          </div>
        }
        onClick={() => handleThemeChange("light")}
      />
      <Tab
        className="font-extrabold bg-zinc-800 border border-gray-300 dark:border-gray-600"
        key={"dark"}
        title={
          <div className=" flex items-center space-x-2 ">
            <span>Tryb ciemny</span>
          </div>
        }
        onClick={() => handleThemeChange("dark")}
      />
    </Tabs>
  );
}
