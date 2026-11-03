import merge from 'lodash/merge';
import { alpha, lighten } from '@mui/material/styles';

import overrides from './theme.overrides.json';

// Input background used to be a standalone literal (#2e2e2e) duplicated across
// MuiOutlinedInput (Text field/Select), MuiAutocomplete (Autocomplete), and the custom
// buttonHoverBg key (button/sidebar hover fills, ~10 usages across admin pages) — three
// independent copies of the same color, none derived from any palette value. 0.14 is tuned
// to reproduce that exact literal from palette.background.paper (BACKGROUND_PAPER below):
// lighten() adds (255-channel)*coefficient per channel, so 12 + (255-12)*0.14 ≈ 46 = 0x2e.
const BACKGROUND_PAPER = '#0c0c0c';
const INPUT_SURFACE_LIGHTEN = 0.14;
// MuiOutlinedInput/MuiAutocomplete below read theme.palette.background.paper live (via a
// function-valued style override), so they stay in sync with the Style Guide's live
// draft/bake preview. buttonHoverBg can't do that — it's a plain custom theme key read
// directly as a string by component stylesheets, not one of MUI's styleOverrides slots — so
// it's computed once here, from the same BACKGROUND_PAPER literal, instead.
const INPUT_SURFACE_BG = lighten(BACKGROUND_PAPER, INPUT_SURFACE_LIGHTEN);

// The system's one subtle-separator-line color — already named as such via the top-level
// borderColor key below, but header.borderBottom and navigator.borderBottom/
// drawerPaper.borderRight each independently hardcoded their own copy instead of reading it,
// and one had silently drifted to '#4E4E4F' (one hex digit off). Consolidated onto this one
// constant so there's a single source again.
const BORDER_COLOR = '#4E4E4E';

const baseTheme = {
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  direction: 'ltr',
  mixins: {
    toolbar: {
      minHeight: 48
    }
  },
  overrides: {
    PageSizeSelector: {
      label: {
        paddingRight: 8,
        fontSize: '16px'
      }
    },
    Pagination: {
      pagination: {
        alignItems: 'center',
        display: 'flex'
      },
      rowsLabel: {
        fontSize: '16px'
      }
    },
    MuiToolbar: {
      gutters: {
        paddingLeft: 24,
        paddingRight: 24
      }
    },
    MuiFormLabel: {
      root: {
        opacity: 0.5,
        '&.Mui-disabled': {
          color: 'rgba(255, 255, 255, 0.38)'
        },
        '&$disabled': {
          color: 'rgba(255, 255, 255, 0.38)'
        }
      }
    },
    // "Reddit style" input exploration (see packages/front-core/modules/styleGuide) lives as
    // a one-off styled(TextField) wrapper local to that file, not a global MuiFilledInput/
    // MuiInputLabel override — a global override here affected every variant="filled" input
    // app-wide, including the Header's own existing search field (its own custom background/
    // radius/underline handling, components/admin-front/.../layouts/components/Header.jsx),
    // adding an unintended border and a redundant second focus ring on top of it. Reverted;
    // see StyleGuide.jsx's RedditTextField for the current approach.
    MuiInputLabel: {
      root: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: '100%'
      }
    },
    MuiSvgIcon: {
      root: {
        fill: 'rgba(255, 255, 255, 0.7)'
      },
      colorPrimary: {
        color: '#1aaa55'
      },
      colorSecondary: {
        color: '#fc9403'
      }
    },
    MuiTabs: {
      root: {
        // marginBottom: 40,
      },
      indicator: {
        height: 2,
        backgroundColor: '#BB86FC'
      }
    },
    MuiTab: {
      textColorPrimary: {
        color: 'rgba(255, 255, 255, 0.7)',
        opacity: 1,
        '&.Mui-selected': {
          color: '#BB86FC'
        }
      },
      textColorInherit: {
        color: 'rgba(255, 255, 255, 0.7)',
        opacity: 1,
        '&.Mui-selected': {
          color: '#BB86FC'
        }
      },
      root: {
        textTransform: 'initial',
        marginRight: 8
      },
      labelContainer: {
        padding: 0,
        '@media (min-width:960px)': {
          padding: 0
        }
      }
    },
    MuiList: {
      root: {
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), #121212'
      }
    },
    MuiDialogTitle: {
      root: {
        fontSize: 32,
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        padding: 12
      }
    },
    MuiDialogContent: {
      root: {
        padding: 12,
        '.MuiDialogTitle-root + &': {
          paddingTop: 12
        }
      }
    },
    MuiDialogActions: {
      root: {
        justifyContent: 'flex-end',
        margin: 0,
        padding: 12,
        borderTop: '1px solid rgba(255, 255, 255, 0.12)'
      }
    },
    MuiIconButton: {
      root: {
        padding: 8
      },
      // Mirrors Button's own per-size padding scale (theme.buttonIconPadding) instead of
      // MUI's default icon-button padding steps, so Icon Button and Button read as the same
      // family at each size — matches "Icon Button / Primary" in the Figma design system.
      // Medium needs no entry: it already matches root's existing flat padding: 8 above.
      sizeSmall: ({ theme }) => ({
        padding: theme.buttonIconPadding.small
      }),
      sizeLarge: ({ theme }) => ({
        padding: theme.buttonIconPadding.large
      }),
      // Primary-colored Icon Button: transparent at rest (the icon itself already reads
      // palette.primary.main via MUI's own IconButtonRoot — no color override needed here),
      // with a primary-tinted hover/press wash instead of the generic grey ripple. Matches
      // "Icon Button / Primary" in the Figma design system (hover: 10% primary.main, press:
      // 30% primary.main + a tight drop shadow — the same wash Button's own outlined/text
      // variants use below).
      colorPrimary: ({ theme }) => ({
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1)
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)'
        }
      })
    },
    MuiButton: {
      root: {
        minWidth: 32,
        // A Button's icons always follow its label color, in every variant. Needed because
        // the global MuiSvgIcon.root.fill override (above) would otherwise paint every
        // @mui/icons-material icon white-ish regardless of the button it sits in (Material
        // Symbols are immune: their <path> sets fill="currentColor" itself). This used to be
        // scoped to outlinedPrimary only, which left Contained's icons white.
        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
          color: 'inherit'
        },
        '& .MuiButton-startIcon svg, & .MuiButton-endIcon svg': {
          fill: 'currentColor'
        }
      },
      // theme.typography.button is the single source of truth for the Buttons label
      // typography. MUI's own Button.js hardcodes a different fontSize per size by default
      // (13px/15px for small/large via pxToRem, overriding the token) — medium is the only
      // size MUI leaves alone. Reading theme.typography.button.fontSize here (rather than
      // duplicating its current value as a literal) keeps small/large permanently in sync
      // with the token instead of silently drifting if it's ever changed. `small` now has
      // its own distinct value via theme.typography.button.small (1rem base for medium/
      // large, 0.875rem for small — a deliberate design decision, not the default MUI
      // spacing). `large` still falls back to the shared base since it has no `.large`
      // override of its own — add theme.typography.button.large the same way if that ever
      // needs to differ too. borderRadius is shared across every variant at a given size
      // (theme.buttonCornerRadius — Button / Primary in the Figma design system scales
      // radius with size, 6/8/10px); padding differs per variant below instead (see
      // containedSizeSmall &c.) — both to offset Contained/Outlined's 1px border, and to
      // give the label itself extra horizontal room independent of the button's own edge.
      sizeSmall: ({ theme }) => ({
        fontSize: theme.typography.button.small?.fontSize ?? theme.typography.button.fontSize,
        minHeight: 32,
        borderRadius: theme.buttonCornerRadius.small
      }),
      // MUI has no size-specific style for medium at all (it's the one size MUI itself
      // never touches), but `MuiButton-sizeMedium` is still a real class every medium
      // Button carries — this override slot works exactly like sizeSmall/sizeLarge.
      sizeMedium: ({ theme }) => ({
        minHeight: 36,
        borderRadius: theme.buttonCornerRadius.medium
      }),
      sizeLarge: ({ theme }) => ({
        fontSize: theme.typography.button.large?.fontSize ?? theme.typography.button.fontSize,
        minHeight: 42,
        borderRadius: theme.buttonCornerRadius.large
      }),
      // Fixed per-size height, independent of whether the button shows an icon or just a
      // label — a plain-label button must render at exactly the same height as an
      // icon+label button of the same size, not grow/shrink to fit whichever content is
      // present. Without this fixed minHeight, height would come from content instead:
      // padding + max(label line-height, icon size).
      //
      // These three numbers (32/36/42) are taken directly from the Figma design system's own
      // per-size frame heights — confirmed identical across Contained/Outlined/Text and
      // across Default/Hover/Pressed there, so not something specific to one variant/state.
      // containedSizeSmall &c. below set *vertical* padding (theme.buttonCornerRadius minus
      // 1px for Contained/Outlined specifically, to offset their 1px border — Text has no
      // border, so it keeps the full value); combined with MUI's own real per-size icon
      // glyph size (commonIconStyles: 18/20/22px, unchanged here — Figma's own mockup icons
      // are a flat 20px at every size, not a source of truth for this app's real rendering)
      // and a 1px/side border on Contained/Outlined, that padding naturally produces 36/42
      // for medium/large, matching Figma exactly without needing minHeight to do any work —
      // small's natural content height comes out to 30, 2px short of Figma's 32, which is
      // where the fixed minHeight below actually earns its keep (the gap is absorbed by the
      // button's own flex-centering, same mechanism that already keeps icon vs. label-only
      // buttons the same height regardless of which is naturally taller).
      //
      // *Horizontal* padding is 8px (the same "s2" spacing token the Figma design system's
      // own Label Wrapper uses) more than vertical, on top of the border/no-border split
      // above — giving the label breathing room independent of the button's own edge. In
      // Figma this 8px lives on a dedicated wrapper around just the label text, inside the
      // icon/label/icon row; MUI's Button has no such intermediate element to target (the
      // label is a bare text child, not wrapped), so it's folded into the button's own
      // horizontal padding instead — the visible effect (a label-only button isn't
      // cramped against its own edges, and height never depends on whether an icon is
      // present) is the same either way.
      //
      // Padding/radius/colors below recreate Button / Primary / Contained, Outlined, and
      // Text from the Figma design system exactly (Default/Hover/Pressed) — see CHANGES.md.
      // Disabled is intentionally left as this app's own (dimmed) treatment: Figma's own
      // Disabled variant renders identically to Default (no dimming at all), which reads as
      // an unfinished placeholder state there rather than a deliberate design choice.
      containedPrimary: ({ theme }) => ({
        marginRight: 4,
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.light}`,
        boxShadow: `0 2px 2px rgba(0, 0, 0, 0.15), 0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          borderColor: theme.palette.primary.light,
          boxShadow: `0 2px 2px rgba(0, 0, 0, 0.15), 0 2px 16px ${alpha(theme.palette.primary.main, 0.5)}`
        },
        // A real `border` always paints on top of an inset box-shadow on the same box, so
        // the hover glow's bottom-edge highlight — meant to sit on top of the border, the
        // way Figma's own inner shadow does — would otherwise render underneath it instead.
        // This ::after overlay (1px larger than the button on every side, via `inset: -1`)
        // paints as its own layer on top of the border: purely decorative (pointerEvents:
        // none, no layout/padding impact — Button is already position: relative by
        // default), and still reads theme.palette.primary.dark live.
        '&:hover::after': {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          boxShadow: `inset 0 -1px 0 ${theme.palette.primary.dark}`,
          pointerEvents: 'none'
        },
        '&:active': {
          backgroundColor: theme.palette.primary.dark,
          borderColor: theme.palette.primary.main,
          boxShadow: '0 2px 2px rgba(0, 0, 0, 0.25)'
        },
        '&:disabled': {
          border: 'none',
          color: 'rgb(221 221 221 / 50%)',
          boxShadow: 'none'
        }
      }),
      containedSizeSmall: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.small - 1}px ${theme.buttonCornerRadius.small + 7}px`
      }),
      containedSizeMedium: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.medium - 1}px ${theme.buttonCornerRadius.medium + 7}px`
      }),
      containedSizeLarge: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.large - 1}px ${theme.buttonCornerRadius.large + 7}px`
      }),
      outlinedPrimary: ({ theme }) => ({
        color: theme.palette.primary.main,
        borderColor: alpha(theme.palette.primary.main, 0.3),
        '&:hover': {
          color: theme.palette.primary.light,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          borderColor: alpha(theme.palette.primary.main, 0.3)
        },
        // Same reasoning as containedPrimary's &:hover::after above — the hover edge
        // highlight needs to paint on top of the border, which a same-box inset box-shadow
        // can't do.
        '&:hover::after': {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          boxShadow: `inset 0 -1px 0 ${alpha(theme.palette.primary.dark, 0.6)}`,
          pointerEvents: 'none'
        },
        '&:active': {
          color: theme.palette.primary.light,
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)'
        },
        '&:disabled': {
          color: 'rgba(255, 255, 255, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.3)'
        }
      }),
      outlinedSizeSmall: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.small - 1}px ${theme.buttonCornerRadius.small + 7}px`
      }),
      outlinedSizeMedium: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.medium - 1}px ${theme.buttonCornerRadius.medium + 7}px`
      }),
      outlinedSizeLarge: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.large - 1}px ${theme.buttonCornerRadius.large + 7}px`
      }),
      textPrimary: ({ theme }) => ({
        color: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.light,
          backgroundColor: alpha(theme.palette.primary.main, 0.1)
        },
        '&:active': {
          color: theme.palette.primary.light,
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)'
        }
      }),
      textSizeSmall: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.small}px ${theme.buttonCornerRadius.small + 8}px`
      }),
      textSizeMedium: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.medium}px ${theme.buttonCornerRadius.medium + 8}px`
      }),
      textSizeLarge: ({ theme }) => ({
        padding: `${theme.buttonCornerRadius.large}px ${theme.buttonCornerRadius.large + 8}px`
      }),
      textSecondary: {
        color: 'rgb(220, 0, 78)'
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: 500
      }
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        minWidth: 40
      }
    },
    MuiTableCell: {
      root: {
        padding: 12
      },
      paddingCheckbox: {
        width: ''
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    },
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none'
      }
    },
    MUIDataTableToolbar: {
      root: {
        height: 64,
        boxShadow: 'none',
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(224, 224, 224, 1)'
      }
    },
    MUIDataTableToolbarSelect: {
      root: {
        height: 64,
        boxShadow: 'none',
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(224, 224, 224, 1)'
      },
      iconButton: {
        height: 40
      }
    },
    MuiInput: {
      root: {
        '&$disabled': {
          color: '#000'
        }
      }
    },
    MuiFormControlLabel: {
      label: {
        '&$disabled': {
          color: '#838383'
        }
      }
    },
    MuiTablePagination: {
      selectRoot: {
        marginLeft: 8,
        marginRight: 8
      },
      select: {
        fontSize: 12
      },
      actions: {
        marginLeft: 0
      }
    },
    MuiPaper: {
      root: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
        // backgroundColor/color removed: Paper already defaults to
        // palette.background.paper / palette.text.primary — see palette.background below.
      }
    },
    MuiDialog: {
      paper: {
        backgroundColor: '#202020'
      },
      paperWidthSm: {
        padding: 0,
        '@media (max-width:1279.95px)': {
          padding: 5,
          margin: '40px auto!important',
          paddingTop: 35
        }
      },
      paperScrollBody: {
        '@media (max-width:959.95px)': {
          maxWidth: 'calc(100% - 32px)!important',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingTop: 40
        }
      }
    },
    MuiPopover: {
      paper: {
        backgroundColor: '#202020'
      }
    },
    MuiFormControl: {
      root: {
        display: 'flex',
        zIndex: 'unset'
      }
    },
    MuiInputBase: {
      input: {
        height: 'auto',
        color: '#fff',
        '&.Mui-disabled': {
          color: 'rgba(255, 255, 255, 0.38)',
          '-webkit-text-fill-color': 'rgba(255, 255, 255, 0.38)',
          cursor: 'not-allowed'
        }
      }
    },
    MuiPickersCalendarHeader: {
      iconButton: {
        backgroundColor: 'transparent'
      },
      dayLabel: {
        color: '#fff'
      }
    },
    MuiPickersYear: {
      root: {
        color: '#fff'
      },
      yearDisabled: {
        color: 'rgba(255, 255, 255, 0.87)'
      }
    },
    MuiPickersDay: {
      root: {
        backgroundColor: 'transparent',
        border: 'none',
        '&.Mui-selected': {
          backgroundColor: '#BB86FC'
        },
        '&:focus.Mui-selected': {
          backgroundColor: '#BB86FC'
        }
      }
    },
    PrivatePickersYear: {
      button: {
        '&:focus.Mui-selected': {
          backgroundColor: '#BB86FC'
        }
      }
    },
    MuiDayPicker: {
      weekDayLabel: {
        color: '#fff'
      }
    },
    MuiSnackbarContent: {
      root: {
        color: '#fff'
      }
    },
    MuiFormHelperText: {
      root: {
        color: '#fff',
        marginLeft: 0
      }
    },
    MuiAutocomplete: {
      inputRoot: ({ theme }) => ({
        borderRadius: '4px',
        // Same computation as MuiOutlinedInput.root below — this slot is a separate CSS
        // class applied to the same rendered surface (Autocomplete wraps a real
        // variant="outlined" TextField), so it needs the same value, but isn't literally
        // the same style rule. Kept in sync via one shared constant rather than one shared
        // literal.
        backgroundColor: lighten(theme.palette.background.paper, INPUT_SURFACE_LIGHTEN)
      }),
      paper: {
        margin: '10px -14px'
      },
      noOptions: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      loading: {
        color: 'rgba(255, 255, 255, 0.6)'
      }
    },
    MuiTypography: {
      colorTextSecondary: {
        color: '#fff'
      }
    },
    MuiTableSortLabel: {
      root: {
        '&:hover': {
          color: '#BB86FC'
        }
      }
    },
    MuiTextField: {
      root: {
        width: '100%',
        borderBottom: 'none',
        borderRadius: '4px'
      }
    },
    MuiOutlinedInput: {
      root: ({ theme }) => ({
        backgroundColor: lighten(theme.palette.background.paper, INPUT_SURFACE_LIGHTEN),
        borderBottom: 'none',
        borderRadius: '4px',
        '&.Mui-disabled': {
          color: 'rgba(255, 255, 255, 0.38)',
          cursor: 'not-allowed'
        }
      }),
      input: ({ theme }) => ({
        '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
          WebkitBoxShadow: `0 0 0 1000px ${lighten(theme.palette.background.paper, INPUT_SURFACE_LIGHTEN)} inset`,
          WebkitTextFillColor: '#fff',
          caretColor: '#fff'
        }
      })
    }
  },
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    type: 'dark',
    primary: {
      // light/dark were stale MUI-default blue values, leftover from before main was
      // changed to purple and never updated — unrelated to main, not a tonal ramp around
      // it. Fixed to the Figma design system's own primary/light & primary/dark (a proper
      // purple ramp around the same main), and contrastText likewise fixed from white to
      // the design system's near-black: white reads poorly against this light a purple.
      light: '#cca5fd',
      main: '#BB86FC',
      dark: '#a365f0',
      contrastText: 'rgba(0, 0, 0, 0.8)'
    },
    secondary: {
      light: '#ff4081',
      main: '#000000',
      dark: '#c51162',
      contrastText: '#fff'
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.38)',
      hint: 'rgba(255, 255, 255, 0.38)'
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
      paper: BACKGROUND_PAPER,
      default: BACKGROUND_PAPER
    },
    action: {
      active: '#fff',
      hover: 'rgba(0, 0, 0, 0.1)',
      hoverOpacity: 0.08,
      selected: 'rgba(0, 0, 0, 0.14)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)'
    }
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  shadows: [
    'none',
    '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
    '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)',
    '0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
  ],
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    // Deliberate design decision (not MUI's default of 16): the real DOM root font-size is
    // set to match via `html { font-size: 14px }` in public/css/style.css (a plain CSS file
    // can't read this value, so it's kept in sync there by hand — see the comment on that
    // rule). Without that CSS rule this would only feed MUI's internal px→rem math with no
    // visible effect — see CHANGES.md's "Worth addressing" history on this exact token.
    htmlFontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    display4: {
      color: '#fff',
      fontSize: '7rem',
      fontWeight: 300,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      letterSpacing: '-.04em',
      lineHeight: '1.14286em',
      marginLeft: '-.04em',
    },
    display3: {
      color: '#fff',
      fontSize: '3.5rem',
      fontWeight: 400,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      letterSpacing: '-.02em',
      lineHeight: '1.30357em',
      marginLeft: '-.02em',
    },
    display2: {
      color: '#fff',
      fontSize: '2.8125rem',
      fontWeight: 400,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.13333em',
      marginLeft: '-.02em',
    },
    display1: {
      color: '#fff',
      fontSize: '2.125rem',
      fontWeight: 400,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.20588em',
    },
    headline: {
      color: '#fff',
      fontSize: '1.5rem',
      fontWeight: 400,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.35417em',
    },
    title: {
      color: '#fff',
      fontSize: '1.3125rem',
      fontWeight: 500,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.16667em',
    },
    subheading: {
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 400,
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.5em',
    },
    body2: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em'
    },
    body1: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em'
    },
    caption: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em'
    },
    button: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      // fontSize here is what medium and large render at (see MuiButton.sizeSmall/
      // sizeLarge overrides below, which read this live). `small` intentionally has its own
      // distinct value via the nested token below, rather than sharing this one.
      fontSize: '1rem',
      small: {
        fontSize: '0.875rem'
      },
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase'
    },
    h1: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
      fontSize: '3rem',
      lineHeight: 1,
      letterSpacing: '-0.01562em'
    },
    h2: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
      fontSize: '2.375rem',
      lineHeight: 1,
      letterSpacing: '-0.00833em'
    },
    h3: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '2.125rem',
      lineHeight: 1.04,
      letterSpacing: '0em'
    },
    h4: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.17,
      letterSpacing: '0.00735em'
    },
    h5: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.33,
      letterSpacing: 0.5
    },
    h6: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.6,
      letterSpacing: '0.0075em'
    },
    subtitle1: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em'
    },
    subtitle2: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em'
    },
    body1Next: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em'
    },
    body2Next: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em'
    },
    buttonNext: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase'
    },
    captionNext: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em'
    },
    overline: {
      color: '#fff',
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase'
    },
    useNextVariants: true
  },
  shape: {
    borderRadius: 4
  },
  spacing: 8,
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  zIndex: {
    mobileStepper: 1000,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  },
  // Reverted to its original value — turns out this key isn't safely reusable for "flush
  // sidebar": it's also read by front-core's shared SchemaStepper.jsx and TreeListItem.jsx
  // (rendered inside admin's own schema-driven forms, 28 admin files use front-core
  // JsonSchema), which were never meant to flatten against the page either. The actual left
  // nav sidebar reads theme.palette.background.paper directly instead (see
  // layouts/LeftSidebar.jsx) — no custom key needed, since that's exactly the intent and
  // carries no other hidden consumers.
  leftSidebarBg: '#404040',
  buttonBg: '#BB86FC',
  buttonHoverBg: INPUT_SURFACE_BG,
  // Button / Primary's per-size corner radius from the Figma design system — Button's own
  // per-variant padding (MuiButton.containedSizeSmall &c. above) is *derived* from this same
  // map rather than reusing it directly (vertical padding is this value, minus 1px for
  // Contained/Outlined's border; horizontal adds 8px more, for the label's own breathing
  // room — see the comment above MuiButton.sizeSmall for why). Icon Button's own padding
  // scale is close but not identical (6/8/9, not 6/8/10 — Large is 1px tighter there),
  // hence the separate map.
  buttonCornerRadius: { small: 6, medium: 8, large: 10 },
  buttonIconPadding: { small: 6, medium: 8, large: 9 },
  textColorDark: '#232f3d',
  headerBg: '#eeeeee',
  checkboxBg: '#000000',
  borderColor: BORDER_COLOR,
  dataTableHoverColor: '#BB86FC',
  dataTableHoverBg: 'rgba(0, 0, 0, 0.16)',
  navLinkActive: 'rgba(255, 255, 255, .1)',
  categoryWrapperActive: 'rgba(255, 255, 255, .1)',
  iconButtonFill: 'rgba(255, 255, 255, 0.7)',
  searchInputBg: '#2a2a2a',
  chipColor: '#363636',
  listHover: 'rgba(255, 255, 255, 0.12)',
  listBackground: {
    background:
      'linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), #121212',
    boxShadow:
      '0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px'
  },
  logo: {
    width: '100%',
    minHeight: 78,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  /* Header */
  header: {
    padding: 0,
    textColor: 'rgba(255, 255, 255, 0.87)',
    background: '#212121',
    borderBottom: `1px solid ${BORDER_COLOR}`,
    leftTitle: {
      color: 'rgba(255, 255, 255, 0.87)'
    },
    leftSubTitle: {
      color: 'rgba(255, 255, 255, 0.6)'
    },
    leftLabel: {
      color: '#fff'
    },
    leftLabelStage: {
      background: '#1DAEFF'
    },
    leftLabelProd: {
      background: '#FF2A1D'
    },
    middle: {
      border: '1px solid rgba(255, 255, 255, 0.25)'
    },
    profile: {
      textColor: '#fff'
    }
  },
  /* Navigator */
  navigator: {
    width: 250,
    // Left deliberately unchanged at #404040 — this key is reused well beyond the actual left
    // nav sidebar: Workflow page/Versions/New version/Workflow settings/Task element dialogs,
    // the Right sidebar panel, and Version timeline cards (all under modules/workflow/pages/
    // Workflow/) all read this same token for their own background. Flattening it to match
    // palette.background.paper would make all of those blend invisibly into the page too —
    // not something asked for. The actual left nav sidebar now reads the dedicated
    // theme.leftSidebarBg (below) instead, in its own local layouts/LeftSidebar.jsx.
    sidebarBg: '#404040',
    fillIcon: 'rgba(255, 255, 255, 0.6)',
    // Was '#4E4E4F' — one hex digit off from the other three copies of this same line color,
    // a silent drift now resolved by sharing BORDER_COLOR instead of its own literal.
    borderBottom: `1px solid ${BORDER_COLOR}`,
    drawerPaper: {
      borderRight: `1px solid ${BORDER_COLOR}`
    },
    navItem: {
      linkActiveBg: 'rgba(187, 134, 252, 0.08)',
      linkActiveColor: '#BB86FC'
    },
    navItemContent: {
      linkActiveBg: 'rgba(187, 134, 252, 0.08)',
      color: 'rgba(255, 255, 255, 0.87)',
      badgeColor: {
        bg: '#a40000'
      }
    },
    navSubItem: {
      color: 'rgba(255, 255, 255, 0.6)',
      linkActiveBg: 'rgba(187, 134, 252, 0.08)',
      linkActiveColor: '#BB86FC'
    },
    childItem: {
      svg: {
        fill: '#eee',
        bg: 'rgba(255, 255, 255, .1)'
      }
    }
  },
  textCut(col) {
    return {
      display: '-webkit-box',
      '-webkit-line-clamp': `${col}`,
      '-webkit-box-orient': 'vertical',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    };
  },
  permanentWarning: {
    backgroundColor: '#F2B8B5',
    color: '#31111D',
    '& svg': {
      fill: '#31111D'
    }
  },
  confirmDialogAcceptButton: {
    padding: '6px 16px'
  }
};

// theme.overrides.json is written by the Style Guide's "Bake" action (dev-only) —
// treat it as the persisted result of designer-tuned colors/typography, not scratch state.
export default merge({}, baseTheme, overrides);
