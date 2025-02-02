import { extendTheme } from "@mui/joy/styles";
import { colors } from "@mui/joy";

const commonLightPalette = {
  fact: {
    softBg: "#eeeeee",
    color: "#000",
  },
  factType: {
    color: "#000",
    fontWeight: "bold",
  },
  personNodeFemale: {
    background: colors.red[50],
    border: `1px solid ${colors.red[400]}`,
  },
  personNodeMale: {
    background: colors.blue[50],
    border: `1px solid ${colors.blue[400]}`,
  },
  name: {
    altName: '#6d6d6d',
    prefix: '#8a5300',
    given: '#000000',
    surname: '#400180',
    suffix: '#9c9c9c'
  },
  isPrincipal: {
    color: "#171A1C"
  }
};

const commonDarkPalette = {
  fact: {
    softBg: "#4f4f4f",
    color: "#eef4ed"
  },
  factType: {
    color: "#eef4ed",
    fontWeight: "bold",
  },
  personNodeFemale: {
    background: colors.red[800],
    border: `1px solid ${colors.red[300]}`,
  },
  personNodeMale: {
    background: colors.blue[800],
    border: `1px solid ${colors.blue[300]}`,
  },
  name: {
    altName: '#a9a9a9',
    prefix: '#ffa500',
    given: '#ffffff',
    surname: '#bf80ff',
    suffix: '#d3d3d3'
  },
  isPrincipal: {
    color: "#F0F4F8"
  }
};

const themes = {
  standard: extendTheme({
    cssVarPrefix: 'mode-toggle',
    colorSchemeSelector: '.demo_mode-toggle-%s',
    colorSchemes: {
      light: {
        palette: {
          ...commonLightPalette,
          diff: {
            background: "#fff6f6",
            color: "#760000",
          },
        },
      },
      dark: {
        palette: {
          ...commonDarkPalette,
          diff: {
            background: "#230000",
            color: "#ffbebe",
          },
        },
      },
    },
    spacing: 6,
  }),

  colorBlind: extendTheme({
    cssVarPrefix: 'mode-toggle',
    colorSchemeSelector: '.demo_mode-toggle-%s',
    colorSchemes: {
      light: {
        palette: {
          ...commonLightPalette,
          diff: {
            background: "#fff1c8",
            color: "#0461b3",
          },
        },
      },
      dark: {
        palette: {
          ...commonDarkPalette,
          diff: {
            background: "#4d3600",
            color: "#9bd2ff",
          },
        },
      },
    },
    spacing: 6,
  }),
};

export const { standard, colorBlind } =
  themes;
