"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../theme-provider";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ReactNode;
};

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: <Sun className="h-4 w-4" />,
  },
  {
    value: "dark",
    label: "Dark",
    icon: <Moon className="h-4 w-4" />,
  },
  {
    value: "system",
    label: "System",
    icon: <Monitor className="h-4 w-4" />,
  },
];

const styles: { [key: string]: React.CSSProperties } = {
  menuButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.375rem',
    padding: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  darkMenuButton: {
    color: '#D1D5DB',
  },
  hoverMenuButton: {
    backgroundColor: '#F3F4F6',
  },
  darkHoverMenuButton: {
    backgroundColor: '#1F2937',
  },
  focusMenuButton: {
    outline: 'none',
    boxShadow: '0 0 0 2px #3B82F6, 0 0 0 4px white',
  },
  darkFocusMenuButton: {
    boxShadow: '0 0 0 2px #60A5FA, 0 0 0 4px black',
  },
  menuItems: {
    position: 'absolute',
    right: 0,
    marginTop: '0.5rem',
    width: '9rem',
    transformOrigin: 'top right',
    borderRadius: '0.375rem',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    outline: 'none',
    zIndex: 10,
  },
  darkMenuItems: {
    backgroundColor: '#1F2937',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  menuItemsContainer: {
    padding: '0.25rem 0',
  },
  menuItem: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    color: '#4B5563',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  darkMenuItem: {
    color: '#D1D5DB',
  },
  activeMenuItem: {
    backgroundColor: '#F3F4F6',
    color: '#111827',
  },
  darkActiveMenuItem: {
    backgroundColor: '#374151',
    color: '#FFFFFF',
  },
  iconContainer: {
    marginRight: '0.5rem',
    display: 'flex',
    height: '1.25rem',
    width: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  srOnly: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
};

const combineStyles = (...styles: React.CSSProperties[]): React.CSSProperties => {
  return Object.assign({}, ...styles);
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Menu as="div" style={{ position: 'relative', display: 'inline-block', textAlign: 'left' }}>
      <div>
        <Menu.Button 
          style={combineStyles(
            styles.menuButton,
            isDarkMode ? styles.darkMenuButton : {}
          )}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#1F2937' : '#F3F4F6';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {theme === "dark" ? (
            <Moon style={{ height: '1.25rem', width: '1.25rem' }} />
          ) : theme === "light" ? (
            <Sun style={{ height: '1.25rem', width: '1.25rem' }} />
          ) : (
            <Monitor style={{ height: '1.25rem', width: '1.25rem' }} />
          )}
          <span style={styles.srOnly}>Change theme</span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items style={combineStyles(
          styles.menuItems,
          isDarkMode ? styles.darkMenuItems : {}
        )}>
          <div style={styles.menuItemsContainer}>
            {themeOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => setTheme(option.value)}
                    style={combineStyles(
                      styles.menuItem,
                      isDarkMode ? styles.darkMenuItem : {},
                      (active || theme === option.value) ? styles.activeMenuItem : {},
                      (active || theme === option.value) && isDarkMode ? styles.darkActiveMenuItem : {}
                    )}
                  >
                    <span style={styles.iconContainer}>
                      {option.icon}
                    </span>
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 