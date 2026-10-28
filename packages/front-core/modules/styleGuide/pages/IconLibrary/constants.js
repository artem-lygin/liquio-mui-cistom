// Material Symbols, added as a second icon source alongside @mui/icons-material (classic
// Material Icons, SVG) — see CHANGES.md and this page's own description. Each renders a
// plain <svg>, so it drops straight into MUI's SvgIcon via the `component` prop rather than
// needing its own theming layer. Style/weight/fill are chosen at import time, not via a
// runtime prop — settled on Rounded/w400/Filled. The thirty below are this app's thirty
// most-used @mui/icons-material icons (see ICON_LIBRARY_SAMPLES for real usage counts).
import {
  CloseFill as SymbolClose,
  AddFill as SymbolAdd,
  VisibilityFill as SymbolVisibility,
  PersonFill as SymbolPerson,
  DeleteFill as SymbolDelete,
  EditFill as SymbolEdit,
  SaveFill as SymbolSave,
  SettingsFill as SymbolSettings,
  MenuFill as SymbolMenu,
  SearchFill as SymbolSearch,
  CheckFill as SymbolCheck,
  WarningFill as SymbolWarning,
  ArrowDropDownFill as SymbolArrowDropDown,
  StorageFill as SymbolStorage,
  FullscreenFill as SymbolFullscreen,
  VisibilityOffFill as SymbolVisibilityOff,
  CheckBoxFill as SymbolCheckBox,
  KeyboardArrowDownFill as SymbolKeyboardArrowDown,
  FolderOpenFill as SymbolFolderOpen,
  ErrorFill as SymbolError,
  TextFormatFill as SymbolTextFormat,
  TableChartFill as SymbolTableChart,
  StarFill as SymbolStar,
  MoreHorizFill as SymbolMoreHoriz,
  ListAltFill as SymbolListAlt,
  ArrowForwardFill as SymbolArrowForward,
  ArrowDropUpFill as SymbolArrowDropUp,
  WebFill as SymbolWeb,
  ViewColumnFill as SymbolViewColumn,
  RefreshFill as SymbolRefresh
} from '@material-symbols-svg/react/rounded/w400';

// This app's thirty most-used @mui/icons-material icons, shown here as Material Symbols —
// usage counts confirmed by grepping every `from '@mui/icons-material/X'` import across
// admin-front, cabinet-front, and front-core (excluding this guide's own file); kept here
// as real data even though the count itself isn't rendered. Where MUI splits an icon into
// Filled/Outlined variants (e.g. Delete vs. DeleteOutline), counts are combined under the
// base name since Material Symbols doesn't split that way — its filled/outlined distinction
// is the separate Fill-vs-not axis covered elsewhere in this section, not a different icon.
export const ICON_LIBRARY_SAMPLES = [
  { key: 'close', label: 'Close', Icon: SymbolClose, usage: 27 },
  { key: 'add', label: 'Add', Icon: SymbolAdd, usage: 27 },
  { key: 'visibility', label: 'Visibility', Icon: SymbolVisibility, usage: 17 },
  { key: 'delete', label: 'Delete', Icon: SymbolDelete, usage: 24 },
  { key: 'person', label: 'Person', Icon: SymbolPerson, usage: 16 },
  { key: 'edit', label: 'Edit', Icon: SymbolEdit, usage: 17 },
  { key: 'save', label: 'Save', Icon: SymbolSave, usage: 9 },
  { key: 'settings', label: 'Settings', Icon: SymbolSettings, usage: 9 },
  { key: 'menu', label: 'Menu', Icon: SymbolMenu, usage: 9 },
  { key: 'search', label: 'Search', Icon: SymbolSearch, usage: 6 },
  { key: 'check', label: 'Check', Icon: SymbolCheck, usage: 6 },
  { key: 'warning', label: 'Warning', Icon: SymbolWarning, usage: 6 },
  { key: 'arrow-drop-down', label: 'Arrow drop down', Icon: SymbolArrowDropDown, usage: 11 },
  { key: 'storage', label: 'Storage', Icon: SymbolStorage, usage: 10 },
  { key: 'fullscreen', label: 'Fullscreen', Icon: SymbolFullscreen, usage: 9 },
  { key: 'visibility-off', label: 'Visibility off', Icon: SymbolVisibilityOff, usage: 8 },
  { key: 'check-box', label: 'Check box', Icon: SymbolCheckBox, usage: 8 },
  { key: 'keyboard-arrow-down', label: 'Keyboard arrow down', Icon: SymbolKeyboardArrowDown, usage: 7 },
  { key: 'folder-open', label: 'Folder open', Icon: SymbolFolderOpen, usage: 7 },
  { key: 'error', label: 'Error', Icon: SymbolError, usage: 7 },
  { key: 'text-format', label: 'Text format', Icon: SymbolTextFormat, usage: 6 },
  { key: 'table-chart', label: 'Table chart', Icon: SymbolTableChart, usage: 6 },
  { key: 'star', label: 'Star', Icon: SymbolStar, usage: 6 },
  { key: 'more-horiz', label: 'More horiz', Icon: SymbolMoreHoriz, usage: 6 },
  { key: 'list-alt', label: 'List alt', Icon: SymbolListAlt, usage: 6 },
  { key: 'arrow-forward', label: 'Arrow forward', Icon: SymbolArrowForward, usage: 6 },
  { key: 'arrow-drop-up', label: 'Arrow drop up', Icon: SymbolArrowDropUp, usage: 6 },
  { key: 'web', label: 'Web', Icon: SymbolWeb, usage: 5 },
  { key: 'view-column', label: 'View column', Icon: SymbolViewColumn, usage: 5 },
  { key: 'refresh', label: 'Refresh', Icon: SymbolRefresh, usage: 5 }
];

export const ICON_LIBRARY_COLORS = [
  { key: 'inherit', label: 'Inherit' },
  { key: 'primary', label: 'Primary' },
  { key: 'error', label: 'Error' }
];
