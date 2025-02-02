import {
  Button,
  CssBaseline,
  CssVarsProvider,
  Option,
  Select,
  Sheet,
  Stack,
  useColorScheme,
} from "@mui/joy";
import { useEffect, useState } from "react";
import VisualGedcomxDiffer from "./gx-differ/VisualGedcomxDiffer";
import { colorBlind, standard } from "./Theme";

const DIFF_THEME = "diffTheme";
const DIFF_THEMES = {
  standard,
  colorBlind,
};

export default function DifferApp() {
  const [theme, setTheme] = useState(
    () => DIFF_THEMES[localStorage.getItem(DIFF_THEME) || "standard"]
  );

  const handleThemeChange = () => {
    if (theme === standard) {
      setTheme(colorBlind);
      localStorage.setItem(DIFF_THEME, "colorBlind");
    } else {
      setTheme(standard);
      localStorage.setItem(DIFF_THEME, "standard");
    }
  };

  const usingColorBlindTheme = theme === colorBlind;

  return (
    <CssVarsProvider theme={theme} modeStorageKey="mode-toggle">
      <CssBaseline />
      <Sheet
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            onClick={handleThemeChange}
            variant="soft"
            color={usingColorBlindTheme ? "warning" : "primary"}
          >
            Using {usingColorBlindTheme ? "Accessible" : "Standard"} Theme
          </Button>
          <ModeSwitcher />
        </Stack>
      </Sheet>
      <VisualGedcomxDiffer />
    </CssVarsProvider>
  );
}

function ModeSwitcher() {
  const { mode, setMode } = useColorScheme("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(_event, newMode) => {
        setMode(newMode);
      }}
    >
      <Option value="system">System</Option>
      <Option value="light">Light</Option>
      <Option value="dark">Dark</Option>
    </Select>
  );
}
