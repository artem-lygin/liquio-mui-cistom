import React from 'react';
import {
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Chip,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Snackbar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  SvgIcon,
  createTheme,
  ThemeProvider,
  useTheme
} from '@mui/material';
// Material Symbols, added as a second icon source alongside @mui/icons-material (classic
// Material Icons, SVG) — see CHANGES.md and the "Icon library" section below. Each renders a
// plain <svg>, so it drops straight into MUI's SvgIcon via the `component` prop rather than
// needing its own theming layer. Style/weight/fill are chosen at import time, not via a
// runtime prop — settled on Rounded/w400/Filled. The twelve below are this app's twelve
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
const ICON_LIBRARY_SAMPLES = [
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

const ICON_LIBRARY_COLORS = [
  { key: 'inherit', label: 'Inherit' },
  { key: 'primary', label: 'Primary' },
  { key: 'error', label: 'Error' }
];

const DRAWER_WIDTH = 220;
const RIGHT_DRAWER_WIDTH = 180;

const TYPOGRAPHY_VARIANTS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'button',
  'caption',
  'overline',
  // Custom variants some app themes define on top of the MUI defaults.
  // If the active theme doesn't define one, it just renders unstyled below (and isn't editable,
  // since there's no existing definition shape to edit).
  'title',
  'subheading',
  'subheading2',
  'label',
  'label1',
  'label2',
  'breadcrumbs'
];

const TYPOGRAPHY_LABELS = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  subtitle1: 'Subtitle 1',
  subtitle2: 'Subtitle 2',
  body1: 'Body 1',
  body2: 'Body 2',
  button: 'Button',
  caption: 'Caption',
  overline: 'Overline',
  title: 'Title',
  subheading: 'Subheading',
  subheading2: 'Subheading 2',
  label: 'Label',
  label1: 'Label 1',
  label2: 'Label 2',
  breadcrumbs: 'Breadcrumbs'
};

// Which variants are part of MUI's own built-in Typography variant set vs. ones this app
// bolts on top via theme.typography (see TYPOGRAPHY_VARIANTS above), and where each is
// actually used — confirmed by grepping `variant="<name>"` across admin-front/src,
// cabinet-front/src, and packages/front-core (excluding this style guide module itself).
// File lists are capped for readability; counts are exact.
const TYPOGRAPHY_VARIANT_INFO = {
  h1: { native: true, count: 4, files: ['BlockScreenReforged', 'EmptyPage', 'layouts/LeftSidebar'] },
  h2: { native: true, count: 5, files: ['EditScreenLayout', 'EmailInput', 'SuccessMessageLayout', 'TaskPreview', 'TwoFactorCode'] },
  h3: { native: true, count: 1, files: ['ErrorsBlock'] },
  h4: {
    native: true,
    count: 6,
    files: ['Auth/ServiceMessage', 'AddUnitUser', 'Header', 'RegistryModal', 'PrivateRoute/NoPermission', 'WorkflowVersionsDialog']
  },
  h5: {
    native: true,
    count: 11,
    files: ['Attach/AttachList', 'CabinetFile', 'GreetingsPage', 'Header', 'CustomInterface/TaskDetails', 'DirectPreview']
  },
  h6: {
    native: true,
    count: 11,
    files: ['CardEditDialog', 'EmailInput', 'SchemaItem', 'debugTools/CheckValidFunction', 'PDF', 'ReportList']
  },
  subtitle1: {
    native: true,
    count: 6,
    files: ['Auth/ServiceMessage', 'CodeEditDialog/FunctionEditor', 'DataTable/SpreadsheetErrors', 'FullScreenDialog', 'SelectFilesDialogContent']
  },
  subtitle2: { native: true, count: 2, files: ['CabinetMenuAccessDialog', 'CustomizateColumns'] },
  body1: {
    native: true,
    count: 44,
    files: ['EmailInput', 'GreetingsPage', 'HandleTask', 'HeaderInfo', 'RegistryKeys', 'SignerList'],
    note: 'the single most-used variant in the app by a wide margin'
  },
  body2: {
    native: true,
    count: 23,
    files: ['CabinetMenuAccessDialog', 'CabinetMenuTranslationsDialog', 'EmailInput', 'FileListPreview', 'HeaderInfo', 'renderFilters']
  },
  button: {
    native: true,
    count: 0,
    note: "no component applies this manually — it's what MUI's own Button uses internally for its label, not something anyone reaches for on a plain Typography"
  },
  caption: {
    native: true,
    count: 6,
    files: ['CabinetMenuAccessDialog', 'IconSelect', 'UploadProgressDialog', 'JsonSchema/SchemaStepper', 'Popup', 'dataTableSettings']
  },
  overline: { native: true, count: 0, note: 'the only place it actually appears is this style guide’s own "Theme tokens" labels' },
  title: { native: false, count: 0 },
  subheading: { native: false, count: 0 },
  subheading2: { native: false, count: 3, files: ['renderFilters', 'TableToolbar', 'TableToolbar/SelectStatus'] },
  label: { native: false, count: 3, files: ['HeaderInfo', 'JsonSchema/SchemaStepper', 'TaskAssign'] },
  label1: { native: false, count: 1, files: ['JsonSchema/SchemaStepper'] },
  label2: { native: false, count: 0 },
  breadcrumbs: { native: false, count: 4, files: ['BreadCrumbs', 'JsonSchema/SchemaStepper'] }
};

// Sub-items within the Typography category — each variant is its own anchor-able Section
// (see TypographyVariantSection), so this drives both the right-side "on this page" sub-nav
// and the scrollspy logic that keeps the left nav's "Typography" entry highlighted while any
// of them is in view.
const TYPOGRAPHY_SUB_SECTIONS = TYPOGRAPHY_VARIANTS.map((variant) => ({
  id: `typography-${variant}`,
  label: TYPOGRAPHY_LABELS[variant] || variant,
  parentId: 'typography'
}));

// Shared by both the Buttons and Icon Buttons size tabs — MUI's IconButton supports the
// exact same three sizes as Button.
const BUTTON_SIZES = [
  { key: 'small', label: 'Small' },
  { key: 'medium', label: 'Medium' },
  { key: 'large', label: 'Large' }
];

// Icon Buttons lives inside the Buttons category (one card, switched by its own size/state
// tabs — see the Buttons Section's JSX) rather than as its own top-level SECTIONS entry, so
// this is its one sub-nav entry under "buttons".
const BUTTONS_SUB_SECTIONS = [{ id: 'buttons-icon-buttons', label: 'Icon Buttons', parentId: 'buttons' }];

// Keyed by top-level SECTIONS id — which categories currently have their own sub-nav.
// Empty/absent for every category that isn't split into its own anchor-able sub-items.
const SUB_SECTIONS_BY_PARENT = {
  typography: TYPOGRAPHY_SUB_SECTIONS,
  buttons: BUTTONS_SUB_SECTIONS
};

const TYPOGRAPHY_SAMPLE_TEXT =
  'The quick brown fox jumps over the lazy dog, showing how this style reads across a ' +
  'longer run of text — line height, letter spacing, and weight all matter once a sentence ' +
  'wraps onto a second line.';

const TYPOGRAPHY_PROPERTY_KEYS = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'color'
];
// letterSpacing ("tracking") and textTransform ("capitalization") are plain CSS properties —
// MUI passes theme.typography.<variant> straight through, so both are editable the same way
// as fontSize/fontWeight/lineHeight.
const EDITABLE_TYPOGRAPHY_KEYS = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
const TEXT_TRANSFORM_OPTIONS = ['none', 'uppercase', 'lowercase', 'capitalize'];

const PALETTE_GROUPS = [
  ['primary', 'light', 'main', 'dark'],
  ['secondary', 'light', 'main', 'dark'],
  ['error', 'light', 'main', 'dark']
];

const GREY_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// The union of top-level custom color keys seen across every theme.js this guide can run
// under (front-core's own base — what cabinet-front uses as-is — and admin-front's fully
// independent theme.js, confirmed via each app's webpack `resolve.modules` order: admin's
// own App.jsx imports plain 'theme', never front-core's). The two files don't share one
// base — admin doesn't import/extend front-core/theme.js at all — so their custom-key sets
// only partially overlap. Rendered below filtered to whichever keys actually resolve to a
// string in the theme currently active, so each app's guide only ever shows its own real
// tokens instead of a shared list padded with "(not set)" rows for the other app's keys.
const CUSTOM_TOKEN_KEYS = [
  // Shared by both front-core (→ cabinet) and admin-front
  'leftSidebarBg',
  'buttonBg',
  'buttonHoverBg',
  'textColorDark',
  'headerBg',
  'borderColor',
  'navLinkActive',
  'categoryWrapperActive',
  // front-core only (→ cabinet-front)
  'outlineColor',
  'dataTableHighlights',
  'categoryHeaderPrimary',
  // admin-front only
  'checkboxBg',
  'chipColor',
  'dataTableHoverColor',
  'dataTableHoverBg',
  'iconButtonFill',
  'searchInputBg',
  'listHover',
  // admin-front only, and nested — listBackground is an object, not a plain color string;
  // its `background` is the one sub-value worth showing, and it's a gradient, not a flat
  // color (see ColorTokenTable's gradient-stop preview).
  { key: 'listBackground', path: 'background' }
];

const SECTIONS = [
  { id: 'typography', label: 'Typography' },
  { id: 'colors', label: 'Colors' },
  { id: 'status', label: 'Status colors' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'shape', label: 'Shape' },
  { id: 'icon-library', label: 'Icon library' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'chips', label: 'Chips' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'alert', label: 'Alert' }
];

// Conceptual write-ups that don't belong to one specific component — how a piece of the
// theme system works in general. Rendered after a divider at the bottom of the side nav,
// and as their own plain sections at the bottom of the page (see StyleGuidePage's JSX).
const EXPLAINER_SECTIONS = [{ id: 'explainer-overrides-vs-palette', label: 'Overrides vs. palette' }];

const SPACING_MULTIPLIERS = [0, 1, 2, 3, 4, 5, 6, 8, 10];

// theme.js defines no palette.warning/success/info — these four concepts are drawn
// instead from two separate, hardcoded, disagreeing places in the codebase. `snackbar`
// describes packages/front-core/components/Snackbars/Snackbar.jsx (the real toast system,
// wired in via addMessage) and `formControl` describes
// packages/front-core/components/JsonSchema/components/FormControlMessage.jsx (inline
// form-field messages). `resolve`, when present, reads a value that genuinely comes from
// the live theme (error/info reuse theme.palette.error.dark/primary.dark); everything else
// is a literal hex/MUI-swatch constant copied into that file, confirmed by reading both
// files directly — not derived from the theme at all.
const STATUS_COLOR_ROWS = [
  {
    key: 'success',
    label: 'Success',
    snackbar: { note: 'green[600]', resolve: () => '#43a047' },
    formControl: { note: "MUI's default success.main", color: '#4caf50' }
  },
  {
    key: 'warning',
    label: 'Warning',
    snackbar: { note: 'amber[700]', resolve: () => '#ffa000' },
    formControl: { note: "MUI's default warning.main", color: '#ff9800' }
  },
  {
    key: 'error',
    label: 'Error',
    snackbar: { note: 'theme.palette.error.dark — themed', resolve: (theme) => theme.palette.error.dark },
    formControl: { note: 'hardcoded literal — matches palette.error.main by coincidence', color: '#f44336' }
  },
  {
    key: 'info',
    label: 'Info',
    snackbar: {
      note: 'theme.palette.primary.dark — repurposed, not a real "info" color',
      resolve: (theme) => theme.palette.primary.dark
    },
    formControl: { note: "hardcoded literal, MUI's default info.main", color: '#2196f3' }
  }
];

const ALERT_SEVERITIES = ['error', 'warning', 'info', 'success'];

const ALERT_SAMPLE_TEXT = {
  error: 'Error. Something went wrong and the action could not complete.',
  warning: 'Warning. Double-check this before continuing.',
  info: 'Info. Background context that isn’t urgent.',
  success: 'Success. The action completed as expected.'
};

// Confirmed by grepping every <Alert severity=...> in admin-front, cabinet-front, and
// front-core — not assumed. success has zero hits anywhere in the codebase.
const ALERT_USAGE_NOTES = {
  error: 'confirmed — CabinetMenuDialog, CabinetMenuTranslationsDialog, VideoPlayer, Map (4 usages)',
  warning: 'confirmed — cabinet-front’s ImportantMessages banner',
  info: 'confirmed — same ImportantMessages banner (severity toggles info/warning)',
  success: 'not found — no confirmed severity="success" usage anywhere in the codebase'
};

// Pure immutable nested-object setter. Deliberately not lodash's `set` with a dotted string:
// lodash treats numeric-looking segments (e.g. grey scale keys like "50") as array indices,
// which would turn theme.palette.grey into a sparse array instead of an object.
const setPath = (obj, pathSegments, value) => {
  if (pathSegments.length === 0) {
    return value;
  }
  const [head, ...rest] = pathSegments;
  const current = obj && typeof obj === 'object' ? obj : {};
  return { ...current, [head]: setPath(current[head], rest, value) };
};

const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

const resolvePath = (obj, pathSegments) => pathSegments.reduce((acc, key) => (acc ? acc[key] : undefined), obj);

// Hover-to-measure: wraps a demo area and, on mouse move, finds whichever descendant
// element is directly under the cursor (via elementFromPoint, so it works for any nested
// child without each demo needing its own ref/instrumentation) and draws an outline + a
// live "W × H" badge over it. Pointer events pass straight through — the overlay box/badge
// are position:absolute + pointerEvents:'none', so demo controls stay fully clickable.
// A fixed highlight color (not theme-driven) — this is a dev-tool overlay, not a themed
// fact, so it should stand out the same way in both the light and dark app.
const MEASURE_COLOR = '#ffca28';

// Margin (outside the border box) gets a cyan tint; padding (inside it, between border and
// content) a yellow one, matching the element's own yellow outline/badge — padding is "part
// of the element's own box" the same way that outline is, margin is external to it.
const BOX_MODEL_COLORS = { margin: 'rgba(0, 188, 212, 0.3)', padding: 'rgba(255, 202, 40, 0.25)' };
const MARGIN_LABEL_COLOR = '#00bcd4';

const parseEdges = (style, prop) => ({
  top: parseFloat(style[`${prop}Top`]) || 0,
  right: parseFloat(style[`${prop}Right`]) || 0,
  bottom: parseFloat(style[`${prop}Bottom`]) || 0,
  left: parseFloat(style[`${prop}Left`]) || 0
});

// Below this thickness (px), a centered margin label wouldn't fit inside its own strip —
// those move just outside the strip instead, as a small solid pill (padding's labels always
// dock to the border line regardless of thickness, so they don't need this).
const MIN_LABEL_THICKNESS = 14;

// Margin strips sit outside the element's border box (expanding outward). A label centers
// inside its strip when there's room; otherwise it's pushed just outside as a small pill.
const renderMarginStrips = (box, edges) => {
  const sides = [
    { key: 'top', out: 'up', value: edges.top, style: { top: box.top - edges.top, left: box.left - edges.left, width: box.width + edges.left + edges.right, height: edges.top } },
    {
      key: 'bottom',
      out: 'down',
      value: edges.bottom,
      style: { top: box.top + box.height, left: box.left - edges.left, width: box.width + edges.left + edges.right, height: edges.bottom }
    },
    { key: 'left', out: 'left', value: edges.left, style: { top: box.top, left: box.left - edges.left, width: edges.left, height: box.height } },
    { key: 'right', out: 'right', value: edges.right, style: { top: box.top, left: box.left + box.width, width: edges.right, height: box.height } }
  ];

  return sides
    .filter((side) => side.value > 0)
    .flatMap((side) => {
      const strip = (
        <div
          key={`margin-${side.key}-strip`}
          style={{ position: 'absolute', background: BOX_MODEL_COLORS.margin, pointerEvents: 'none', zIndex: 1, boxSizing: 'border-box', ...side.style }}
        />
      );
      const label = Math.round(side.value);
      const thickness = side.out === 'up' || side.out === 'down' ? side.style.height : side.style.width;
      const fitsInline = thickness >= MIN_LABEL_THICKNESS;
      const outsidePos = {
        up: { top: side.style.top - 13, left: side.style.left, width: side.style.width, textAlign: 'center' },
        down: { top: side.style.top + side.style.height + 1, left: side.style.left, width: side.style.width, textAlign: 'center' },
        left: {
          top: side.style.top,
          left: side.style.left - 24,
          height: side.style.height,
          width: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        },
        right: { top: side.style.top, left: side.style.left + side.style.width + 2, height: side.style.height, display: 'flex', alignItems: 'center' }
      }[side.out];
      const inlineLabelStyle = {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontFamily: 'ui-monospace, Menlo, monospace',
        color: 'rgba(0, 0, 0, 0.75)',
        pointerEvents: 'none',
        zIndex: 2,
        ...side.style
      };
      const outsideLabelStyle = {
        position: 'absolute',
        fontSize: 9,
        fontFamily: 'ui-monospace, Menlo, monospace',
        color: '#000',
        background: MARGIN_LABEL_COLOR,
        borderRadius: 2,
        padding: '0 3px',
        lineHeight: '13px',
        pointerEvents: 'none',
        zIndex: 2,
        ...outsidePos
      };
      return [
        strip,
        <div key={`margin-${side.key}-label`} style={fitsInline ? inlineLabelStyle : outsideLabelStyle}>
          {label}
        </div>
      ];
    });
};

// Padding strips sit inside the border box (inset from the border edge toward content). Its
// label always docks right on the border line as a small yellow pill straddling that edge —
// unlike margin, this doesn't depend on the strip being thick enough, so a 1px padding is
// exactly as readable as a 16px one.
const renderPaddingStrips = (box, edges) => {
  const sides = [
    { key: 'top', value: edges.top, strip: { top: box.top, left: box.left, width: box.width, height: edges.top }, dock: { top: box.top, left: box.left + box.width / 2 } },
    {
      key: 'bottom',
      value: edges.bottom,
      strip: { top: box.top + box.height - edges.bottom, left: box.left, width: box.width, height: edges.bottom },
      dock: { top: box.top + box.height, left: box.left + box.width / 2 }
    },
    {
      key: 'left',
      value: edges.left,
      strip: { top: box.top + edges.top, left: box.left, width: edges.left, height: Math.max(box.height - edges.top - edges.bottom, 0) },
      dock: { top: box.top + box.height / 2, left: box.left }
    },
    {
      key: 'right',
      value: edges.right,
      strip: {
        top: box.top + edges.top,
        left: box.left + box.width - edges.right,
        width: edges.right,
        height: Math.max(box.height - edges.top - edges.bottom, 0)
      },
      dock: { top: box.top + box.height / 2, left: box.left + box.width }
    }
  ];

  return sides
    .filter((side) => side.value > 0)
    .flatMap((side) => [
      <div
        key={`padding-${side.key}-strip`}
        style={{ position: 'absolute', background: BOX_MODEL_COLORS.padding, pointerEvents: 'none', zIndex: 1, boxSizing: 'border-box', ...side.strip }}
      />,
      <div
        key={`padding-${side.key}-label`}
        style={{
          position: 'absolute',
          top: side.dock.top,
          left: side.dock.left,
          transform: 'translate(-50%, -50%)',
          background: MEASURE_COLOR,
          color: '#000',
          fontSize: 9,
          fontFamily: 'ui-monospace, Menlo, monospace',
          padding: '0 3px',
          borderRadius: 2,
          lineHeight: '13px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 3
        }}
      >
        {Math.round(side.value)}
      </div>
    ]);
};

const MeasureOverlay = ({ enabled, children }) => {
  const containerRef = React.useRef(null);
  const [box, setBox] = React.useState(null);

  React.useEffect(() => {
    if (!enabled) {
      setBox(null);
    }
  }, [enabled]);

  const handleMouseMove = (event) => {
    if (!enabled || !containerRef.current) {
      return;
    }
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (!target || target === containerRef.current || !containerRef.current.contains(target)) {
      setBox(null);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const style = window.getComputedStyle(target);
    setBox({
      top: rect.top - containerRect.top,
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height,
      margin: parseEdges(style, 'margin'),
      padding: parseEdges(style, 'padding')
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setBox(null)}
      // Padding gives outside-placed margin labels (see renderMarginStrips) and the W×H
      // badge room to sit clear of the container's own edges instead of clipping against
      // them.
      style={{ position: 'relative', padding: 24 }}
    >
      {children}
      {box ? (
        <>
          {renderMarginStrips(box, box.margin)}
          {renderPaddingStrips(box, box.padding)}
          <div
            style={{
              position: 'absolute',
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              border: `1px dashed ${MEASURE_COLOR}`,
              boxSizing: 'border-box',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
          <div
            style={{
              position: 'absolute',
              // Always slightly above the element, rather than flipping below when tight
              // on room — consistent placement beats occasionally-better-fitting placement.
              top: box.top - 20,
              left: box.left,
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: 11,
              lineHeight: '16px',
              whiteSpace: 'nowrap',
              padding: '1px 5px',
              borderRadius: 3,
              background: MEASURE_COLOR,
              color: '#000',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {`${Math.round(box.width)} × ${Math.round(box.height)}`}
          </div>
        </>
      ) : null}
    </div>
  );
};

// Clamps a description to 5 lines via -webkit-line-clamp (works on the rendered JSX as-is,
// regardless of the nested <span>s some descriptions use for inline monospace terms) and
// only shows a More/Less toggle when the content actually overflows that clamp — comparing
// scrollHeight (the un-clamped content height, which the clamp doesn't shrink) against
// clientHeight (the clamped, visible height) is the standard way to detect that without
// re-measuring text manually.
const ExpandableDescription = ({ children }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);
  const textRef = React.useRef(null);

  React.useEffect(() => {
    const el = textRef.current;
    if (el) setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  return (
    <div>
      <Typography
        ref={textRef}
        variant="body1"
        color="textSecondary"
        style={{
          maxWidth: 640,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 5,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden'
        }}
      >
        {children}
      </Typography>
      {overflowing ? (
        <Button
          size="small"
          onClick={() => setExpanded((value) => !value)}
          style={{ marginTop: 4, padding: 0, minWidth: 'auto', textTransform: 'none' }}
        >
          {expanded ? 'Less' : 'More'}
        </Button>
      ) : null}
    </div>
  );
};

// Layout is always: demo (`children`), a splitter, `description`, then — when `properties`
// is provided (i.e. "Show properties" is on) — a stronger splitter and the theme-tokens
// table. The tokens table sits flush inside the same outer card, just nested one elevation
// lower (2 vs 4) so it still reads as "reference" without a gap breaking up the surface.
const Section = ({ id, title, titleVariant = 'h2', actions, description, properties, propertiesHeading, children }) => (
  <div id={id} style={{ marginBottom: 32, scrollMarginTop: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant={titleVariant} gutterBottom={true}>
        {title}
      </Typography>
      {actions}
    </div>
    <Divider style={{ marginBottom: 16 }} />
    <Card elevation={4}>
      <CardContent>{children}</CardContent>
      {description ? (
        <>
          <Divider />
          <CardContent>
            <ExpandableDescription>{description}</ExpandableDescription>
          </CardContent>
        </>
      ) : null}
      {properties ? (
        <>
          <Divider style={{ borderBottomWidth: 2 }} />
          <Card elevation={2} square={true}>
            <Typography
              variant="overline"
              color="textSecondary"
              style={{ display: 'block', padding: '10px 16px 0' }}
            >
              {propertiesHeading || 'Theme tokens'}
            </Typography>
            {properties}
          </Card>
        </>
      ) : null}
    </Card>
  </div>
);

// A real ListItemButton (not a styled div) so hover/focus-visible/selected all come from
// the theme's own action.hover/action.selected states instead of being hand-rolled — the
// left accent border on ".Mui-selected" is the one bit of custom styling on top of that.
const SideNavLink = ({ section, activeId, onSelect }) => (
  <ListItemButton
    selected={activeId === section.id}
    onClick={() => onSelect(section.id)}
    sx={{
      borderRadius: 1,
      marginBottom: '2px',
      borderLeft: '3px solid transparent',
      '&.Mui-selected': {
        borderLeft: '3px solid #BB86FC',
        backgroundColor: 'rgba(187, 134, 252, 0.12)'
      },
      '&.Mui-selected:hover': {
        backgroundColor: 'rgba(187, 134, 252, 0.18)'
      }
    }}
  >
    <ListItemText
      primary={section.label}
      primaryTypographyProps={{ variant: 'body2', style: { fontWeight: activeId === section.id ? 700 : 400 } }}
    />
  </ListItemButton>
);

const SideNav = ({ activeId, onSelect }) => (
  <List component="nav" disablePadding={true} style={{ background: 'none' }}>
    {SECTIONS.map((section) => (
      <SideNavLink key={section.id} section={section} activeId={activeId} onSelect={onSelect} />
    ))}
    <Divider style={{ margin: '12px 0' }} />
    {EXPLAINER_SECTIONS.map((section) => (
      <SideNavLink key={section.id} section={section} activeId={activeId} onSelect={onSelect} />
    ))}
  </List>
);

// "On this page" sub-nav for whichever category currently has its own split-out sub-items
// (see SUB_SECTIONS_BY_PARENT) — e.g. every Typography variant. Renders nothing for a
// category with no sub-items instead of showing an empty panel.
const SubNav = ({ heading, items, activeSubId, onSelect }) => {
  if (!items || !items.length) {
    return null;
  }

  return (
    <nav>
      <Typography
        variant="overline"
        color="textSecondary"
        style={{ display: 'block', padding: '0 8px 4px' }}
      >
        {heading}
      </Typography>
      {items.map((section) => {
        const active = activeSubId === section.id;
        return (
          <div
            key={section.id}
            onClick={() => onSelect(section.id)}
            style={{
              cursor: 'pointer',
              // Constant padding regardless of `active` — varying box size with state (as an
              // earlier version of this did) shifts every item below it when the active item
              // changes while scrolling. Only color/border/weight vary here, never size.
              padding: '3px 8px 3px 12px',
              marginBottom: 2,
              borderLeft: active ? '2px solid #BB86FC' : '2px solid transparent'
            }}
          >
            <Typography
              variant="caption"
              style={{ display: 'block', color: active ? '#BB86FC' : 'inherit', fontWeight: active ? 700 : 400 }}
            >
              {section.label}
            </Typography>
          </div>
        );
      })}
    </nav>
  );
};

const toHex = (color) => (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) ? color : '#000000');

// Notes and values (TokenLegend, ColorTokenTable) are free-text that often contains a raw
// color literal (e.g. "overridden to #BB86FC in this app", or a whole gradient() value with
// several rgba() stops) — this finds every hex/rgb/rgba literal in a string and inlines a
// small color circle right before each one, so a color is never just a code you have to
// mentally render yourself.
const HEX_COLOR_PATTERN = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\([^)]*\)/gi;

const withColorSwatches = (text) => {
  if (typeof text !== 'string' || !text) {
    return text;
  }
  const parts = [];
  let lastIndex = 0;
  let match;
  HEX_COLOR_PATTERN.lastIndex = 0;
  while ((match = HEX_COLOR_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={`${match.index}-${match[0]}`} style={{ whiteSpace: 'nowrap' }}>
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: match[0],
            border: '1px solid rgba(255, 255, 255, 0.4)',
            marginRight: 4,
            verticalAlign: 'middle'
          }}
        />
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};

const Swatch = ({ label, color, editMode, editable, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
    {editMode && editable ? (
      <input
        type="color"
        value={toHex(color)}
        onChange={(event) => onChange(event.target.value)}
        style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', padding: 0, flexShrink: 0 }}
      />
    ) : (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.15)',
          background: color || 'transparent',
          flexShrink: 0
        }}
      />
    )}
    <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
      {label}: {color || '(not set)'}
    </Typography>
  </div>
);

// One row per color token: a preview swatch (or picker, in edit mode), the token's full
// path, and its raw value — used by the Colors section instead of a flat Swatch list so
// long custom-token lists (which vary per app, see CUSTOM_TOKEN_KEYS) scan as a table.
const COLOR_TABLE_CELL_STYLE = { padding: '4px 8px' };

const ColorTokenTable = ({ rows }) => (
  <Table size="small" style={{ tableLayout: 'fixed' }}>
    <TableHead>
      <TableRow>
        <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, width: 40, whiteSpace: 'nowrap' }}>Color</TableCell>
        <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, width: 260 }}>Token</TableCell>
        <TableCell style={COLOR_TABLE_CELL_STYLE}>Value</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.token}>
          <TableCell style={COLOR_TABLE_CELL_STYLE}>
            {row.editMode && row.editable ? (
              <input
                type="color"
                value={toHex(row.color)}
                onChange={(event) => row.onChange(event.target.value)}
                style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid rgba(0,0,0,0.15)', padding: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.15)',
                  background: row.color || 'transparent'
                }}
              />
            )}
          </TableCell>
          <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, fontFamily: 'monospace', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.token}
          </TableCell>
          <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, fontFamily: 'monospace', fontSize: 12 }}>
            {row.color ? withColorSwatches(row.color) : '(not set)'}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// A token's `status` (defaults to 'theme' when omitted, since that's the common case) says
// whether the value shown actually comes from the live theme, or whether it's a fact about
// the app/MUI overriding or ignoring the theme entirely. Only tokens that deviate need to set
// this explicitly — see getButtonTokenItems and the Chips/Alert legends below for the
// 'overridden'/'other' cases.
const TOKEN_STATUS = {
  theme: { color: '#4caf50', label: 'Theme value — read directly from the active theme' },
  overridden: { color: '#ffca28', label: 'Overridden — this app replaces the theme value' },
  other: { color: '#f44336', label: "Other — hardcoded in MUI or elsewhere, not theme-derived" }
};

const StatusBadge = ({ status }) => {
  const meta = TOKEN_STATUS[status] || TOKEN_STATUS.theme;
  return (
    <Tooltip title={meta.label} arrow={true} placement="top">
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: meta.color,
          border: '1px solid rgba(255, 255, 255, 0.4)',
          cursor: 'default'
        }}
      />
    </Tooltip>
  );
};

// Shown on a token row whose value isn't actually redefined for the currently-selected
// state tab (see BUTTON_STATES/INPUT_STATES) — it's just carried over from another state,
// most often Resting. Keeps that fact out of the note text, which only has to describe
// what the token IS in this state, not which other states share it.
const InheritsChip = ({ from }) => (
  <Tooltip title={`Inherits from ${from} — not redefined for this state`} arrow={true} placement="top">
    <Chip
      label={from}
      size="small"
      variant="outlined"
      style={{ height: 20, fontSize: 11, marginRight: 8, verticalAlign: 'middle' }}
    />
  </Tooltip>
);

// Names which theme categories (color/shape/typography/spacing/elevation) an element category
// draws from, and where in the theme — the same idea as the property list under each typography
// row, but pointing at the underlying token path instead of the CSS output of one instance.
// Each category lists one or more { path, note } tokens: `path` (the theme reference, e.g.
// "palette.primary.main") is the only part rendered as a link — `note` (a resolved value or
// caveat) stays plain text, in its own column so long notes don't run into the next token.
// `anchor`, when set on the category, links every path in it to the section that owns that
// token category. One row per token; the category cell spans every row it owns.
const TokenLegend = ({ items, onNavigate }) => (
  <Table size="small" style={{ marginTop: 8 }}>
    <TableHead>
      <TableRow>
        <TableCell style={{ width: 110 }}>Category</TableCell>
        <TableCell style={{ width: 260 }}>Token</TableCell>
        <TableCell style={{ width: 36 }}>Status</TableCell>
        <TableCell>Note</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items.flatMap((item) =>
        item.tokens.map((token, tokenIndex) => (
          <TableRow key={`${item.category}-${tokenIndex}`}>
            {tokenIndex === 0 ? (
              <TableCell rowSpan={item.tokens.length} style={{ verticalAlign: 'top', fontWeight: 700 }}>
                {item.category}
              </TableCell>
            ) : null}
            <TableCell style={{ fontFamily: 'monospace', fontSize: 12, verticalAlign: 'top' }}>
              {item.anchor ? (
                <a
                  href={`#${item.anchor}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.anchor);
                  }}
                  style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {token.path}
                </a>
              ) : (
                token.path
              )}
            </TableCell>
            <TableCell style={{ verticalAlign: 'top', textAlign: 'center' }}>
              <StatusBadge status={token.status} />
            </TableCell>
            <TableCell style={{ fontFamily: 'monospace', fontSize: 12, color: 'inherit', verticalAlign: 'top' }}>
              {token.inheritsFrom ? <InheritsChip from={token.inheritsFrom} /> : null}
              <Typography
                variant="caption"
                color="textSecondary"
                style={{ fontFamily: 'inherit', fontSize: 'inherit', display: token.inheritsFrom ? 'inline' : undefined }}
              >
                {withColorSwatches(token.note || '')}
              </Typography>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
);

// Button.js hardcodes its own padding per variant+size rather than calling
// theme.spacing()/deriving from theme.spacing — confirmed by grepping
// @mui/material/Button/Button.js directly: no theme.spacing( call anywhere in its style
// function. It used to also hardcode its own pxToRem() font-size per size (13px/15px for
// small/large, overriding typography.button.fontSize — medium was the only size left
// alone), but both app themes now pin MuiButton.sizeSmall/sizeLarge.fontSize to match
// typography.button.fontSize explicitly (see CHANGES.md, Typography), so font-size is no
// longer part of this per-size metrics table — see getButtonFontSizePx below, which reads
// the live theme instead of a hardcoded default.
const BUTTON_METRICS = {
  text: {
    small: { padding: '4px 5px' },
    medium: { padding: '6px 8px' },
    large: { padding: '8px 11px' }
  },
  outlined: {
    small: { padding: '3px 9px' },
    medium: { padding: '5px 15px' },
    large: { padding: '7px 21px' }
  },
  contained: {
    small: { padding: '4px 10px' },
    medium: { padding: '6px 16px' },
    large: { padding: '8px 22px' }
  }
};

// Icon size/spacing per size, read straight from MUI's Button.js: commonIconStyles()
// (fontSize 18/20/22 for small/medium/large), ButtonStartIcon's own styled() rule
// (marginRight: 8, marginLeft: -4, or -2 for small), and ButtonEndIcon's mirrored rule
// (marginLeft: 8, marginRight: -4, or -2 for small). All literal px, unrelated to the
// button's own fontSize or to theme.spacing().
const BUTTON_ICON_METRICS = {
  small: { fontSize: 18, marginLeft: -2, endMarginRight: -2 },
  medium: { fontSize: 20, marginLeft: -4, endMarginRight: -4 },
  large: { fontSize: 22, marginLeft: -4, endMarginRight: -4 }
};

// Reads the fontSize a given size actually renders with, live from the theme: an explicit
// MuiButton.size{Small,Large} override if the app defines one (both app themes now derive
// this from theme.typography.button.fontSize via a function-valued style override — see
// CHANGES.md), otherwise typography.button.fontSize itself (what medium always uses, having
// no size-specific override). getMuiStyleOverride can return either a plain object or that
// function, hence resolveMuiStyleOverride before reading .fontSize off it.
const getButtonSizeFontSize = (size, previewTheme) => {
  const override = resolveMuiStyleOverride(
    getMuiStyleOverride(previewTheme, 'MuiButton', `size${size[0].toUpperCase()}${size.slice(1)}`),
    previewTheme
  );
  return override?.fontSize !== undefined ? override.fontSize : previewTheme.typography.button.fontSize;
};

const getButtonFontSizePx = (size, previewTheme, rootFontSize) => {
  const fontSize = getButtonSizeFontSize(size, previewTheme);
  // MUI/JSS convention: a bare number is px. Otherwise it's a 'Nrem' or 'Npx' string.
  if (typeof fontSize === 'number') return fontSize;
  return fontSize.endsWith('px') ? parseFloat(fontSize) : parseFloat(fontSize) * rootFontSize;
};

// MUI doesn't publish a button height anywhere — this is vertical padding (×2) + the
// taller of the label's line-height or the icon's fontSize (an icon is often taller than
// the text line-height it sits next to — e.g. medium's 20px icon vs. a 16.8px text line —
// so it, not the label, ends up setting the button's height) + a 1px top/bottom border for
// outlined only (its padding is 1px shorter per side than contained/text specifically to
// cancel that border out). Verified against the real DOM (getBoundingClientRect) for every
// variant/size/icon combo.
const getButtonHeightPx = (variant, size, previewTheme, rootFontSize, showIcon) => {
  const metrics = BUTTON_METRICS[variant][size];
  const paddingVertical = parseFloat(metrics.padding);
  const fontSizePx = getButtonFontSizePx(size, previewTheme, rootFontSize);
  const lineHeightPx = fontSizePx * previewTheme.typography.button.lineHeight;
  const contentHeightPx = showIcon ? Math.max(lineHeightPx, BUTTON_ICON_METRICS[size].fontSize) : lineHeightPx;
  const borderPx = variant === 'outlined' ? 2 : 0;
  return paddingVertical * 2 + contentHeightPx + borderPx;
};

// Interaction states shown as tabs above each interactive component's token table, so a
// note only ever has to describe ONE state at a time (e.g. plain "(background)") instead of
// packing resting/hover/focus/pressed/disabled facts into one row's text.
const BUTTON_STATES = [
  { key: 'resting', label: 'Resting' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'pressed', label: 'Pressed' },
  { key: 'disabled', label: 'Disabled' }
];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// `theme.js` files in this codebase author their MuiButton customization via the legacy v4
// `overrides` key. Both admin-front's App.jsx and front-core's own App.jsx (used as-is by
// cabinet-front) feed that theme through `createTheme(adaptV4Theme(theme))` — and
// adaptV4Theme (@mui/material/styles/adaptV4Theme.js) rebuilds `theme.components` from
// scratch out of the legacy `overrides`/`props`/`styleOverrides` keys only, discarding
// whatever `components` block the theme.js file itself already defined. Concretely: this
// means front-core/theme.js's own `components.MuiButton.styleOverrides` (the small
// textTransform-only block near the top of the file) is dead code at runtime — only the far
// larger legacy `overrides.MuiButton` further down actually reaches the page. So
// `previewTheme.components.MuiButton.styleOverrides` is the one reliable place to read what
// each app's Button *actually* renders, for either app, instead of assuming one app's
// override shape (e.g. admin's per-color `containedPrimary`/`outlinedPrimary`/`textPrimary`/
// `textSecondary` slots) applies universally.
const getMuiStyleOverride = (previewTheme, component, slot) => previewTheme.components?.[component]?.styleOverrides?.[slot] || null;

// A styleOverrides slot can be a plain object or a function `({ theme, ownerState }) =>
// object` — MUI v5's documented shape for a style override that reads the live theme
// instead of duplicating a value as a literal (see MuiButton.sizeSmall/sizeLarge in both
// theme.js files, and CHANGES.md's Typography section). Resolve either shape to a plain
// object before reading properties off it.
const resolveMuiStyleOverride = (override, previewTheme) => (typeof override === 'function' ? override({ theme: previewTheme }) : override);

const readBackground = (styleObj) => (styleObj ? (styleObj.background !== undefined ? styleObj.background : styleObj.backgroundColor) : undefined);

const readPseudoSlot = (styleObj, ...keys) => {
  if (!styleObj) return null;
  for (const key of keys) {
    if (styleObj[key]) return styleObj[key];
  }
  return null;
};

// Phrases a color/background fact as either "this app's literal happens to equal the
// current theme value" (a silent-drift risk, not a real visual difference) or a genuine
// override — rather than assuming every override actually diverges from the palette.
const describeOverridden = (kind, overrideVal, themeVal, themePath) =>
  overrideVal === themeVal
    ? `${kind} — hardcodes ${overrideVal} here too, duplicating ${themePath}'s own current value; no visual difference today, but the two are independent literals that would silently diverge if either changed alone`
    : `${kind} — overridden to ${overrideVal} in this app; theme value is ${themeVal}`;

// Builds TokenLegend items for one specific button instance (variant + color) in one
// specific interaction state. Every color fact below is read live from
// `previewTheme.components.MuiButton`/`MuiButtonBase` (see getMuiStyleOverride above) rather
// than hardcoded to one app's override shape, since admin-front and front-core (→
// cabinet-front) each author completely independent MuiButton overrides:
//  - admin-front only overrides `containedPrimary`/`outlinedPrimary`/`textPrimary`/
//    `textSecondary` — secondary+contained/outlined falls through untouched to
//    palette.secondary.
//  - front-core only overrides `root` (a flat background+color applied to EVERY button,
//    any variant/color), plus `containedPrimary`/`outlinedPrimary` to escape it — so
//    palette.secondary is never read by Button at all in that theme, and even primary+text
//    falls through to root's flat styling. Disabled buttons additionally get a separate,
//    color-agnostic `MuiButtonBase.root "&.MuiButton-root.Mui-disabled"` override.
// All of this was verified against the real running app (getComputedStyle + matched CSS
// rules), not assumed from theme.js alone — see CHANGES.md.
const getButtonTokenItems = (variant, color, size, state, previewTheme, showStartIcon, showEndIcon) => {
  const items = [];
  const colorTokens = [];
  const elevationTokens = [];
  const slotKey = `${variant}${capitalize(color)}`;
  const overrideSlot = getMuiStyleOverride(previewTheme, 'MuiButton', slotKey);
  const rootSlot = getMuiStyleOverride(previewTheme, 'MuiButton', 'root');
  const overrideBg = readBackground(overrideSlot);
  const overrideColor = overrideSlot?.color;
  const rootBg = readBackground(rootSlot);
  const rootColor = rootSlot?.color;
  const paletteMain = previewTheme.palette[color].main;
  const paletteContrastText = previewTheme.palette[color].contrastText;
  const bgSuffix = variant === 'outlined' ? ' + border' : '';
  const isDark = previewTheme.palette.mode === 'dark';

  if (state === 'disabled') {
    const disabledOverride = readPseudoSlot(overrideSlot, '&:disabled', '&.Mui-disabled');
    const buttonBaseDisabled = readPseudoSlot(
      getMuiStyleOverride(previewTheme, 'MuiButtonBase', 'root'),
      '&.MuiButton-root.Mui-disabled',
      '&.Mui-disabled'
    );

    if (disabledOverride && (disabledOverride.color !== undefined || readBackground(disabledOverride) !== undefined)) {
      const disabledBg = readBackground(disabledOverride);
      if (disabledBg !== undefined) {
        colorTokens.push({ path: `MuiButton.${slotKey} "&:disabled"`, status: 'overridden', note: `background — hardcoded to ${disabledBg} in this app` });
      }
      if (disabledOverride.color !== undefined) {
        const borderNote = variant === 'outlined' && disabledOverride.borderColor ? ` / border ${disabledOverride.borderColor}` : '';
        colorTokens.push({
          path: `MuiButton.${slotKey} "&:disabled"`,
          status: 'overridden',
          note: `label${borderNote} — hardcoded to ${disabledOverride.color}${borderNote}, overriding palette.action.disabled`
        });
      }
      if (variant === 'contained' && disabledBg === undefined) {
        colorTokens.push({ path: 'palette.action.disabledBackground', note: `background — ${previewTheme.palette.action.disabledBackground}; not overridden for this color` });
        elevationTokens.push({ path: 'shadows[0]', note: 'flat — no shadow while disabled' });
      }
    } else if (buttonBaseDisabled) {
      const baseBg = readBackground(buttonBaseDisabled);
      if (baseBg !== undefined) {
        colorTokens.push({
          path: 'MuiButtonBase.root "&.MuiButton-root.Mui-disabled"',
          status: 'other',
          note: `background — hardcoded to ${baseBg} for every disabled button in this app, any variant/color — palette.action.disabledBackground is never applied here`
        });
      }
      if (buttonBaseDisabled.color !== undefined) {
        colorTokens.push({
          path: 'MuiButtonBase.root "&.MuiButton-root.Mui-disabled"',
          status: 'other',
          note: `label — hardcoded to ${buttonBaseDisabled.color} for every disabled button in this app, any variant/color — palette.action.disabled is never applied here`
        });
      }
      if (variant === 'contained') {
        elevationTokens.push({ path: 'shadows[0]', note: 'flat — no shadow while disabled' });
      }
    } else {
      colorTokens.push({
        path: 'palette.action.disabled',
        note: `label${bgSuffix} — ${previewTheme.palette.action.disabled}; MUI's own default, not overridden by this app${
          isDark ? ' — still a light-theme-style rgba value, not tuned for dark mode, so this reads faint here' : ''
        }`
      });
      if (variant === 'contained') {
        colorTokens.push({ path: 'palette.action.disabledBackground', note: `background — ${previewTheme.palette.action.disabledBackground}` });
        elevationTokens.push({ path: 'shadows[0]', note: 'flat — no shadow while disabled' });
      }
    }
  } else if (variant === 'contained') {
    if (state === 'resting') {
      if (overrideBg !== undefined) {
        colorTokens.push({ path: `MuiButton.${slotKey}`, status: 'overridden', note: describeOverridden('background', overrideBg, paletteMain, `palette.${color}.main`) });
      } else if (rootBg !== undefined) {
        colorTokens.push({
          path: 'MuiButton.root',
          status: 'other',
          note: `background — hardcoded to ${rootBg} for every button in this app (no MuiButton.${slotKey} override exists) — palette.${color}.main (${paletteMain}) is never applied here`
        });
      } else {
        colorTokens.push({ path: `palette.${color}.main`, note: `background — ${paletteMain}` });
      }
      if (overrideColor !== undefined) {
        colorTokens.push({ path: `MuiButton.${slotKey}`, status: 'overridden', note: describeOverridden('label', overrideColor, paletteContrastText, `palette.${color}.contrastText`) });
      } else if (rootColor !== undefined) {
        colorTokens.push({
          path: 'MuiButton.root',
          status: 'other',
          note: `label — hardcoded to ${rootColor} for every button in this app (no MuiButton.${slotKey} override exists) — palette.${color}.contrastText (${paletteContrastText}) is never applied here`
        });
      } else {
        colorTokens.push({ path: `palette.${color}.contrastText`, note: `label — ${paletteContrastText}` });
      }
      elevationTokens.push({ path: 'shadows[4]', note: 'resting' });
    } else if (state === 'hover') {
      const hoverBg = readBackground(readPseudoSlot(overrideSlot, '&:hover', ':hover'));
      if (hoverBg !== undefined) {
        const restingBg = overrideBg ?? rootBg ?? paletteMain;
        colorTokens.push({
          path: `MuiButton.${slotKey} "&:hover"`,
          status: 'overridden',
          note: hoverBg === restingBg ? `background — frozen to the same ${hoverBg}; no darken-on-hover in this app` : `background — overridden to ${hoverBg} on hover`
        });
      } else {
        const restingSource = overrideBg !== undefined ? `MuiButton.${slotKey}` : rootBg !== undefined ? 'MuiButton.root' : `palette.${color}.main`;
        colorTokens.push({
          path: `palette.${color}.dark`,
          note: `background — ${previewTheme.palette[color].dark}; MUI's own default darken-on-hover, not intercepted by this app's ${restingSource} resting style`
        });
      }
      colorTokens.push({ path: `palette.${color}.contrastText`, inheritsFrom: 'Resting', note: 'label' });
      elevationTokens.push({ path: 'shadows[4]', inheritsFrom: 'Resting', note: 'hover only swaps the background, not the shadow' });
    } else if (state === 'focus') {
      colorTokens.push({ path: `palette.${color}.main`, inheritsFrom: 'Resting', note: 'background' });
      colorTokens.push({ path: `palette.${color}.contrastText`, inheritsFrom: 'Resting', note: 'label' });
      elevationTokens.push({ path: 'shadows[6]', note: 'focus-visible ring' });
    } else if (state === 'pressed') {
      colorTokens.push({ path: `palette.${color}.main`, inheritsFrom: 'Resting', note: 'background' });
      colorTokens.push({ path: `palette.${color}.contrastText`, inheritsFrom: 'Resting', note: 'label' });
      elevationTokens.push({ path: 'shadows[8]', note: 'pressed/active' });
    }
  } else {
    // text or outlined — real MUI defaults to these being transparent; only worth a
    // background row when this app's theme actually paints one in over that.
    if (state === 'resting') {
      if (overrideBg !== undefined) {
        colorTokens.push({ path: `MuiButton.${slotKey}`, status: 'overridden', note: `background${bgSuffix} — hardcoded to ${overrideBg} in this app, replacing MUI's normal transparent ${variant} background` });
      } else if (rootBg !== undefined) {
        colorTokens.push({
          path: 'MuiButton.root',
          status: 'other',
          note: `background${bgSuffix} — hardcoded to ${rootBg} for every button in this app (no MuiButton.${slotKey} override exists), replacing MUI's normal transparent ${variant} background`
        });
      }
      if (overrideColor !== undefined) {
        colorTokens.push({ path: `MuiButton.${slotKey}`, status: 'overridden', note: describeOverridden(`label${bgSuffix}`, overrideColor, paletteMain, `palette.${color}.main`) });
      } else if (rootColor !== undefined) {
        colorTokens.push({
          path: 'MuiButton.root',
          status: 'other',
          note: `label${bgSuffix} — hardcoded to ${rootColor} for every button in this app (no MuiButton.${slotKey} override exists) — palette.${color}.main (${paletteMain}) is never applied here`
        });
      } else {
        colorTokens.push({ path: `palette.${color}.main`, note: `label${bgSuffix} — ${paletteMain}` });
      }
    } else if (state === 'hover') {
      colorTokens.push({
        path: overrideColor !== undefined ? `MuiButton.${slotKey}` : rootColor !== undefined ? 'MuiButton.root' : `palette.${color}.main`,
        status: overrideColor !== undefined ? 'overridden' : rootColor !== undefined ? 'other' : 'theme',
        inheritsFrom: 'Resting',
        note: `label${bgSuffix}`
      });
      colorTokens.push({
        path: 'palette.action.hoverOpacity',
        note: `${previewTheme.palette.action.hoverOpacity} — a background tint layered on top of whatever the resting background is; the label${bgSuffix} color itself doesn't change`
      });
    } else if (state === 'focus') {
      colorTokens.push({
        path: overrideColor !== undefined ? `MuiButton.${slotKey}` : rootColor !== undefined ? 'MuiButton.root' : `palette.${color}.main`,
        status: overrideColor !== undefined ? 'overridden' : rootColor !== undefined ? 'other' : 'theme',
        inheritsFrom: 'Resting',
        note: `label${bgSuffix}`
      });
      colorTokens.push({
        path: 'palette.action.focusOpacity',
        note: `${previewTheme.palette.action.focusOpacity} — MUI's default keyboard focus-visible ring, not overridden by this app`
      });
    } else if (state === 'pressed') {
      colorTokens.push({
        path: overrideColor !== undefined ? `MuiButton.${slotKey}` : rootColor !== undefined ? 'MuiButton.root' : `palette.${color}.main`,
        status: overrideColor !== undefined ? 'overridden' : rootColor !== undefined ? 'other' : 'theme',
        inheritsFrom: 'Resting',
        note: `label${bgSuffix}`
      });
      colorTokens.push({
        path: 'TouchRipple',
        status: 'other',
        note: 'a transient ripple animation on press, not a static color token'
      });
    }
  }

  if (colorTokens.length) {
    items.push({ category: 'Color', anchor: 'colors', tokens: colorTokens });
  }
  if (elevationTokens.length) {
    items.push({ category: 'Elevation', tokens: elevationTokens });
  }

  const notResting = state !== 'resting' ? 'Resting' : undefined;

  items.push({
    category: 'Shape',
    anchor: 'shape',
    tokens: [{ path: 'theme.shape.borderRadius', inheritsFrom: notResting, note: `${previewTheme.shape.borderRadius}px` }]
  });

  const metrics = BUTTON_METRICS[variant][size];
  const typographyTokens = [
    {
      path: 'theme.typography.button',
      inheritsFrom: notResting,
      note: `fontSize ${previewTheme.typography.button.fontSize}, fontWeight ${previewTheme.typography.button.fontWeight}, textTransform ${previewTheme.typography.button.textTransform} — same for every size`
    }
  ];
  const sizeSlot = `size${size[0].toUpperCase()}${size.slice(1)}`;
  const sizeOverride = resolveMuiStyleOverride(getMuiStyleOverride(previewTheme, 'MuiButton', sizeSlot), previewTheme);
  if (sizeOverride?.fontSize !== undefined) {
    // MUI's Button.js hardcodes a *different* pxToRem() fontSize per size by default
    // (13px/15px for small/large, overriding typography.button.fontSize — medium was
    // always the one size left alone). Both app themes now add this explicit
    // sizeSmall/sizeLarge override — a function reading the theme live, not a duplicated
    // literal — specifically to cancel that default back out, so font-size is one
    // consistent "Buttons" typography across every size instead of three different ones.
    // Once resolved (see resolveMuiStyleOverride), figure out which token it actually read:
    // theme.typography.button.small/.large if that app has since opted a size into its own
    // distinct value, otherwise the shared theme.typography.button.fontSize every size
    // defaults to today.
    const perSizeKey = size === 'small' || size === 'large' ? size : null;
    const perSizeFontSize = perSizeKey ? previewTheme.typography.button[perSizeKey]?.fontSize : undefined;
    const sourcePath = perSizeFontSize !== undefined ? `theme.typography.button.${perSizeKey}.fontSize` : 'theme.typography.button.fontSize';
    typographyTokens.push({
      path: `MuiButton.${sizeSlot}`,
      status: 'overridden',
      inheritsFrom: notResting,
      note: `fontSize — function-valued override, reads ${sourcePath} live (currently ${sizeOverride.fontSize}) instead of duplicating it as a literal, so this size stays in sync automatically if the token changes`
    });
  } else {
    typographyTokens.push({
      path: 'theme.typography.button.fontSize',
      inheritsFrom: notResting,
      note: `${previewTheme.typography.button.fontSize} — medium has no size-specific override`
    });
  }

  items.push({ category: 'Typography', anchor: 'typography', tokens: typographyTokens });

  const spacingTokens = [
    {
      path: 'padding',
      status: 'other',
      inheritsFrom: notResting,
      note: `hardcoded '${metrics.padding}' in MUI's Button.js for size="${size}" — not derived from theme.spacing()`
    }
  ];

  if (variant === 'contained') {
    // Read live rather than assumed: front-core's containedPrimary/containedSecondary have
    // no marginRight at all (this quirk is admin-front-only), so this row is correctly
    // omitted entirely when running under cabinet-front instead of asserting a fact that
    // isn't true there.
    const siblingColor = color === 'primary' ? 'secondary' : 'primary';
    const siblingSlot = getMuiStyleOverride(previewTheme, 'MuiButton', `contained${capitalize(siblingColor)}`);
    const marginRight = overrideSlot?.marginRight;
    const siblingMarginRight = siblingSlot?.marginRight;
    if (marginRight !== undefined) {
      spacingTokens.push({
        path: `MuiButton.${slotKey} marginRight`,
        status: 'overridden',
        inheritsFrom: notResting,
        note:
          siblingMarginRight === undefined
            ? `hardcoded to ${marginRight}px in this app — MuiButton.contained${capitalize(siblingColor)} has no equivalent, so switching color to ${siblingColor} removes this ${marginRight}px and visibly shifts the gap to the next button`
            : `hardcoded to ${marginRight}px in this app, same as contained${capitalize(siblingColor)}`
      });
    } else if (siblingMarginRight !== undefined) {
      spacingTokens.push({
        path: `MuiButton.contained${capitalize(siblingColor)} marginRight`,
        inheritsFrom: notResting,
        note: `${siblingMarginRight}px — this app only adds the extra marginRight to contained${capitalize(siblingColor)}, not this color`
      });
    }
  }

  items.push({ category: 'Spacing', tokens: spacingTokens });

  if (showStartIcon || showEndIcon) {
    const iconMetrics = BUTTON_ICON_METRICS[size];
    const iconTokens = [
      {
        path: `MuiButton size${size[0].toUpperCase()}${size.slice(1)} icon`,
        status: 'other',
        inheritsFrom: notResting,
        note: `fontSize — hardcoded ${iconMetrics.fontSize}px in MUI's Button.js for size="${size}", independent of the button's own fontSize; shared by startIcon and endIcon`
      }
    ];
    if (showStartIcon) {
      iconTokens.push({
        path: 'MuiButton startIcon',
        status: 'other',
        inheritsFrom: notResting,
        note: `spacing — hardcoded marginRight: 8px, marginLeft: ${iconMetrics.marginLeft}px in MUI's Button.js, not theme.spacing()`
      });
    }
    if (showEndIcon) {
      iconTokens.push({
        path: 'MuiButton endIcon',
        status: 'other',
        inheritsFrom: notResting,
        note: `spacing — hardcoded marginLeft: 8px, marginRight: ${iconMetrics.endMarginRight}px in MUI's Button.js — the mirror image of startIcon's margins, not theme.spacing()`
      });
    }
    iconTokens.push({
      path: 'color: inherit',
      inheritsFrom: notResting,
      note: "icon color follows the button's own label color — no separate token, same for start and end"
    });
    items.push({ category: 'Icon', tokens: iconTokens });
  }

  return items;
};

// Real per-size fontSize/padding, read straight from MUI's IconButton.js: the base `root`
// style sets fontSize: pxToRem(24), padding: 8 (what "medium" — the implicit default —
// actually uses, with no size-specific override of its own); `sizeSmall`/`sizeLarge` then
// override both. All three are literal px, unrelated to theme.spacing() or any typography
// variant.
const ICON_BUTTON_SIZE_METRICS = {
  small: { padding: 5, fontSize: 18 },
  medium: { padding: 8, fontSize: 24 },
  large: { padding: 12, fontSize: 28 }
};

// Confirmed by grepping every real <IconButton> across admin-front, cabinet-front, and
// front-core (excluding this guide's own demo): 281 instances total, 0 pass a color prop,
// 51 pass size="large", 2 pass size="small", 0 explicitly pass size="medium" (228 just omit
// size, which resolves to medium), 7 are disabled, 0 pass an edge prop.
const ICON_BUTTON_USAGE_NOTES = {
  small: 'Rare in practice — only 2 of 281 real instances explicitly pass size="small".',
  medium: 'The implicit default — 228 of 281 real instances omit size entirely, which resolves to medium (0 pass size="medium" explicitly).',
  large: '51 of 281 real instances explicitly pass size="large" — the only size this app deliberately opts into.'
};

// IconButton's own color prop is never used in this app's real code (verified above), so
// every real icon button actually renders through this chain: MUI's own
// palette.action.active default, this app's real hover/disabled overrides (if any), read
// live via getMuiStyleOverride rather than assumed — front-core and admin-front diverge here
// (front-core overrides IconButton hover via a shared MuiButtonBase rule; admin-front doesn't
// touch it at all), same reasoning as the Buttons section above.
const getIconButtonTokenItems = (size, state, previewTheme) => {
  const metrics = ICON_BUTTON_SIZE_METRICS[size];
  const iconButtonRoot = getMuiStyleOverride(previewTheme, 'MuiIconButton', 'root');
  const buttonBaseRoot = getMuiStyleOverride(previewTheme, 'MuiButtonBase', 'root');
  const hoverOverride = readPseudoSlot(buttonBaseRoot, '&.MuiIconButton-root:hover');
  const disabledOverride = readPseudoSlot(iconButtonRoot, '&.Mui-disabled');
  const hoverBg = readBackground(hoverOverride);
  const notResting = state !== 'resting' ? 'Resting' : undefined;

  const colorTokens = [];
  if (state === 'resting') {
    colorTokens.push({
      path: 'palette.action.active',
      note: `icon color — ${previewTheme.palette.action.active}; real usage never passes a color prop (confirmed: 0/281 real <IconButton> instances), so this is what every icon button in this app actually renders`
    });
  } else if (state === 'hover') {
    if (hoverBg !== undefined) {
      colorTokens.push({
        path: 'MuiButtonBase.root "&.MuiIconButton-root:hover"',
        status: 'overridden',
        note: `background — hardcoded to ${hoverBg} in this app, replacing MUI's default alpha(palette.action.active, action.hoverOpacity) tint`
      });
    } else {
      colorTokens.push({
        path: 'palette.action.hoverOpacity',
        note: `background — MUI's own default hover tint, alpha(palette.action.active, ${previewTheme.palette.action.hoverOpacity}); not overridden by this app`
      });
    }
    colorTokens.push({ path: 'palette.action.active', inheritsFrom: 'Resting', note: 'icon color — unaffected by hover, only the background tints in' });
  } else if (state === 'focus') {
    colorTokens.push({
      path: 'palette.action.focusOpacity',
      note: `${previewTheme.palette.action.focusOpacity} — MUI's default keyboard focus-visible ring, not overridden by this app`
    });
    colorTokens.push({ path: 'palette.action.active', inheritsFrom: 'Resting', note: 'icon color' });
  } else if (state === 'pressed') {
    colorTokens.push({ path: 'TouchRipple', status: 'other', note: 'a transient ripple animation on press, not a static color token' });
    colorTokens.push({ path: 'palette.action.active', inheritsFrom: 'Resting', note: 'icon color' });
  } else if (state === 'disabled') {
    if (disabledOverride && disabledOverride.opacity !== undefined) {
      colorTokens.push({
        path: 'MuiIconButton.root "&.Mui-disabled"',
        status: 'overridden',
        note: `opacity — hardcoded to ${disabledOverride.opacity} in this app, layered on top of MUI's own disabled color (palette.action.disabled) rather than replacing it`
      });
    } else {
      colorTokens.push({
        path: 'palette.action.disabled',
        note: `disabled icon color — ${previewTheme.palette.action.disabled}; MUI's own default, not overridden by this app`
      });
    }
  }

  const sizeSlot = size === 'medium' ? 'MuiIconButton.root' : `MuiIconButton size${size[0].toUpperCase()}${size.slice(1)}`;

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    {
      category: 'Icon size',
      tokens: [
        {
          path: sizeSlot,
          status: 'other',
          inheritsFrom: notResting,
          note:
            `fontSize — hardcoded to theme.typography.pxToRem(${metrics.fontSize}) in MUI's IconButton.js for size="${size}", ` +
            'but only reaches the icon glyph if it\'s given fontSize="inherit" — real usage never does (confirmed: 83 real ' +
            'size="large" instances, none pair it with a matching fontSize on their child icon), so in this app the icon ' +
            "itself stays a fixed 24px regardless of size — only the button's own padding/hit-area actually changes. The " +
            'demo below uses fontSize="inherit" so the size difference is visible; toggle "Measure" in the header to see ' +
            "the real padding change even where the demo matches production and the icon doesn't visibly grow."
        }
      ]
    },
    {
      category: 'Spacing',
      anchor: 'spacing',
      tokens: [
        {
          path: sizeSlot,
          status: 'other',
          inheritsFrom: notResting,
          note: `padding — hardcoded to ${metrics.padding}px in MUI's IconButton.js for size="${size}" — not derived from theme.spacing()`
        }
      ]
    }
  ];
};

// Real per-app MuiSvgIcon overrides, read live via getMuiStyleOverride — front-core (→
// cabinet) has none at all, so every color here is a plain palette read. admin-front
// hardcodes literal hex for `colorPrimary`/`colorError` (unrelated to
// palette.primary.main/palette.error.main), plus a `root`-level `fill`. That `fill` only
// reaches classic @mui/icons-material icons — their <path> has no fill of its own, so it
// inherits whatever the root <svg> sets. Material Symbols paths hardcode
// fill="currentColor" (confirmed in @material-symbols-svg/react's own source), which reads
// the CSS `color` property instead and so ignores this override entirely — Material Symbols
// icons here fall through to inherited text color regardless of `root.fill`.
const getIconLibraryTokenItems = (color, size, previewTheme) => {
  const svgIconRoot = getMuiStyleOverride(previewTheme, 'MuiSvgIcon', 'root');
  const colorSlot = color === 'primary' ? 'colorPrimary' : color === 'error' ? 'colorError' : null;
  const colorOverride = colorSlot ? getMuiStyleOverride(previewTheme, 'MuiSvgIcon', colorSlot) : null;

  const colorTokens = [];
  if (color === 'inherit') {
    const rootColor = svgIconRoot?.color;
    const rootFill = svgIconRoot?.fill;
    if (rootColor !== undefined) {
      colorTokens.push({ path: 'MuiSvgIcon.root', status: 'overridden', note: `color — hardcoded to ${rootColor} in this app` });
    } else if (rootFill !== undefined) {
      colorTokens.push({
        path: 'MuiSvgIcon.root',
        status: 'other',
        note: `fill — hardcoded to ${rootFill} in this app; only reaches classic @mui/icons-material icons (see this category's intro), not Material Symbols`
      });
      colorTokens.push({ path: 'palette.text.primary', note: `inherited text color — ${previewTheme.palette.text.primary}; what Material Symbols icons actually use here` });
    } else {
      colorTokens.push({ path: 'palette.text.primary', note: `inherited text color — ${previewTheme.palette.text.primary}; not overridden by this app` });
    }
  } else {
    const paletteMain = previewTheme.palette[color].main;
    const overrideColor = colorOverride?.color;
    if (overrideColor !== undefined) {
      colorTokens.push({
        path: `MuiSvgIcon.${colorSlot}`,
        status: 'overridden',
        note: describeOverridden('color', overrideColor, paletteMain, `palette.${color}.main`)
      });
    } else {
      colorTokens.push({ path: `palette.${color}.main`, note: `color — ${paletteMain}` });
    }
  }

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    {
      category: 'Icon size',
      anchor: 'typography',
      tokens: [
        {
          path: 'theme.typography.pxToRem',
          note: `${size} — MuiSvgIcon derives its fontSize from theme.typography.pxToRem(${{ small: 20, medium: 24, large: 35 }[size]}), unlike Button/IconButton's hardcoded icon sizes — this one genuinely scales with the app's typography settings`
        }
      ]
    },
    {
      category: 'Package',
      tokens: [
        {
          path: '@material-symbols-svg/react/rounded/w400',
          status: 'other',
          note: 'Rounded, weight 400, filled — settled config for this app, chosen at import time per icon (see CHANGES.md)'
        }
      ]
    }
  ];
};

const INPUT_STATES = [
  { key: 'resting', label: 'Resting' },
  { key: 'focus', label: 'Focus' },
  { key: 'error', label: 'Error' },
  { key: 'disabled', label: 'Disabled' }
];

// Builds TokenLegend items for a text field in one specific interaction state. TextField
// defaults to variant="outlined" in MUI v5 (confirmed in @mui/material/TextField/TextField.js),
// which matters here: front-core's MuiInputBase.input disabled override is scoped to
// "&.MuiInput-input.Mui-disabled" — the Standard/underline variant's class only — so on
// cabinet-front it silently never applies to this (outlined) demo field; confirmed live via
// getComputedStyle, the disabled value text there actually renders palette.text.disabled
// (MUI's own default), while the disabled label still gets front-core's own MuiFormLabel
// override (which isn't variant-scoped) — two different colors, not the same one. admin-front's
// override has no such variant qualifier, so both apply there and do share one literal. Read
// live via getMuiStyleOverride rather than assuming one app's shape (and un-scoped selector)
// holds for the other. No MuiOutlinedInput/MuiFormLabel "&.Mui-focused" or "&.Mui-error" rule
// exists in either app's theme.js, so focus/error colors are MUI's own unmodified defaults.
const readDisabledOverride = (styleObj) => {
  if (!styleObj) {
    return { applies: false };
  }
  if (styleObj['&.Mui-disabled']) {
    return { applies: true, value: styleObj['&.Mui-disabled'] };
  }
  const scopedKey = Object.keys(styleObj).find((key) => key !== '&.Mui-disabled' && /Mui-disabled/.test(key));
  return scopedKey ? { applies: false, scopedKey, value: styleObj[scopedKey] } : { applies: false };
};

const getInputTokenItems = (state, previewTheme) => {
  const colorTokens = [];

  if (state === 'resting') {
    const restingOverride = getMuiStyleOverride(previewTheme, 'MuiInputBase', 'input')?.color;
    if (restingOverride !== undefined) {
      colorTokens.push({
        path: 'MuiInputBase.input',
        status: 'overridden',
        note: describeOverridden('value', restingOverride, previewTheme.palette.text.primary, 'palette.text.primary')
      });
    } else {
      colorTokens.push({ path: 'palette.text.primary', note: `value — ${previewTheme.palette.text.primary}` });
    }
  } else if (state === 'focus') {
    colorTokens.push({ path: 'palette.primary.main', note: "label + underline/outline — MUI's default, not overridden by this app" });
  } else if (state === 'error') {
    colorTokens.push({ path: 'palette.error.main', note: "label + underline/outline + helper text — MUI's default, not overridden by this app" });
  } else if (state === 'disabled') {
    const inputDisabled = readDisabledOverride(getMuiStyleOverride(previewTheme, 'MuiInputBase', 'input'));
    const labelDisabled = readDisabledOverride(getMuiStyleOverride(previewTheme, 'MuiFormLabel', 'root'));

    if (inputDisabled.applies && inputDisabled.value?.color !== undefined) {
      colorTokens.push({
        path: 'MuiInputBase.input "&.Mui-disabled"',
        status: 'overridden',
        note: `value text — hardcoded to ${inputDisabled.value.color} in this app, not palette.text.disabled`
      });
    } else if (inputDisabled.scopedKey) {
      colorTokens.push({
        path: `MuiInputBase.input "${inputDisabled.scopedKey}"`,
        status: 'other',
        note: `value text — this override only targets the Standard/underline variant's class, not the Outlined variant shown here (TextField defaults to variant="outlined"), so it never actually applies to this field — falls through to palette.text.disabled (${previewTheme.palette.text.disabled}) instead`
      });
    } else {
      colorTokens.push({ path: 'palette.text.disabled', note: `value text — ${previewTheme.palette.text.disabled}; MUI's own default, not overridden by this app` });
    }

    if (labelDisabled.applies && labelDisabled.value?.color !== undefined) {
      const sameAsInput = inputDisabled.applies && inputDisabled.value?.color === labelDisabled.value.color;
      colorTokens.push({
        path: 'MuiFormLabel.root "&.Mui-disabled"',
        status: 'overridden',
        note: `label — hardcoded to ${labelDisabled.value.color} in this app${
          sameAsInput ? ', the same literal as the input override above (independent literals, not derived from one another)' : ', independently of the input value color above'
        }`
      });
    } else {
      colorTokens.push({ path: 'palette.text.disabled', note: `label — ${previewTheme.palette.text.disabled}; MUI's own default, not overridden by this app` });
    }
  }

  const notResting = state !== 'resting' ? 'Resting' : undefined;

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    {
      category: 'Typography',
      anchor: 'typography',
      tokens: [{ path: 'theme.typography.body1', inheritsFrom: notResting, note: '' }]
    },
    {
      category: 'Spacing',
      anchor: 'spacing',
      tokens: [
        {
          path: 'theme.spacing',
          inheritsFrom: notResting,
          note: `unit: ${previewTheme.spacing(1)}, field height/margins`
        }
      ]
    }
  ];
};

// Chip's color/typography facts differ structurally between the two apps: front-core (→
// cabinet-front) overrides MuiChip.root (height, fontSize, label color, textTransform) and
// filledError.color; admin-front defines no MuiChip override at all, so its Chip renders with
// MUI's own untouched 32px/13px defaults. Read live rather than asserting one app's facts (or
// MUI's own defaults) as if they held for both — confirmed live via the mounted theme object.
const getChipTokenItems = (previewTheme) => {
  const chipRoot = getMuiStyleOverride(previewTheme, 'MuiChip', 'root');
  const overrideColor = chipRoot?.color;
  const overrideFontSize = chipRoot?.fontSize;
  const overrideHeight = chipRoot?.height;

  const colorTokens = [
    { path: 'palette.primary.main', note: 'colored variant' },
    { path: 'palette.error.main', note: 'colored variant' },
    { path: 'palette.grey', note: 'default fill' }
  ];
  if (overrideColor !== undefined) {
    colorTokens.push({
      path: 'MuiChip.root',
      status: 'overridden',
      note: describeOverridden('default/grey label text', overrideColor, previewTheme.palette.text.primary, 'palette.text.primary')
    });
  } else {
    colorTokens.push({ path: 'palette.text.primary', note: `default/grey label text — ${previewTheme.palette.text.primary}` });
  }

  const typographyTokens = [
    overrideFontSize !== undefined
      ? {
          path: 'MuiChip.root',
          status: 'overridden',
          note: `font size — hardcoded to ${overrideFontSize}px in this app, overriding MUI's own default 13px Chip font size`
        }
      : { path: 'theme.typography.fontFamily', note: "font size is a fixed 13px (MUI's own Chip.js default), not a named variant" }
  ];

  const spacingTokens = [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}, height/padding` }];
  if (overrideHeight !== undefined) {
    spacingTokens.push({
      path: 'MuiChip.root',
      status: 'overridden',
      note: `height — hardcoded to ${overrideHeight}px in this app, overriding MUI's own default 32px Chip height`
    });
  }

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    {
      category: 'Shape',
      anchor: 'shape',
      tokens: [{ path: 'theme.shape.borderRadius', status: 'other', note: '— not used; Chip hardcodes a fixed 16px pill radius instead' }]
    },
    { category: 'Typography', anchor: 'typography', tokens: typographyTokens },
    { category: 'Spacing', anchor: 'spacing', tokens: spacingTokens }
  ];
};

// Tab's unselected/selected label color is authored completely differently between the two
// apps: admin-front overrides MuiTab.textColorInherit (an unconditional label color, swapped
// for a different literal on "&.Mui-selected"); front-core (→ cabinet-front) instead overrides
// MuiTab.root (an unconditional label color that "&.Mui-selected" never touches — only the
// background changes there). Read live rather than assuming one app's override slot/shape
// applies to the other.
const getTabsTokenItems = (previewTheme) => {
  const tabRoot = getMuiStyleOverride(previewTheme, 'MuiTab', 'root') || {};
  const tabTextColorInherit = getMuiStyleOverride(previewTheme, 'MuiTab', 'textColorInherit');
  const unselectedColor = tabTextColorInherit?.color ?? tabRoot.color;
  const unselectedPath = tabTextColorInherit?.color !== undefined ? 'MuiTab.textColorInherit' : 'MuiTab.root';
  const selectedFromTextColorInherit = tabTextColorInherit?.['&.Mui-selected'];
  const selectedFromRoot = tabRoot['&.Mui-selected'];
  const selectedSlot = selectedFromTextColorInherit || selectedFromRoot;
  const selectedSlotPath = selectedFromTextColorInherit ? 'MuiTab.textColorInherit "&.Mui-selected"' : 'MuiTab.root "&.Mui-selected"';
  const selectedColor = selectedSlot?.color;
  const selectedBg = readBackground(selectedSlot);

  const colorTokens = [];
  if (unselectedColor !== undefined) {
    colorTokens.push({
      path: unselectedPath,
      status: 'overridden',
      note: describeOverridden('label (unselected)', unselectedColor, previewTheme.palette.text.secondary, 'palette.text.secondary')
    });
  } else {
    colorTokens.push({ path: 'palette.text.secondary', note: `label (unselected) — ${previewTheme.palette.text.secondary}` });
  }
  if (selectedColor !== undefined) {
    colorTokens.push({ path: selectedSlotPath, status: 'overridden', note: `label (selected) — hardcoded to ${selectedColor} in this app` });
  } else if (selectedBg !== undefined) {
    colorTokens.push({
      path: selectedSlotPath,
      status: 'overridden',
      note: `background (selected) — hardcoded to ${selectedBg} in this app; label color is unchanged from unselected`
    });
  }

  const textTransformOverride = tabRoot.textTransform;
  const typographyTokens = [
    {
      path: 'theme.typography.button',
      note: `fontWeight ${previewTheme.typography.button.fontWeight}, fontSize ${previewTheme.typography.button.fontSize} — MuiTab reads these unless overridden below`
    }
  ];
  if (textTransformOverride !== undefined) {
    typographyTokens.push({
      path: 'MuiTab.root',
      status: 'overridden',
      note: `textTransform — hardcoded to "${textTransformOverride}" in this app, overriding typography.button.textTransform ("${previewTheme.typography.button.textTransform}")`
    });
  }

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    { category: 'Typography', anchor: 'typography', tokens: typographyTokens },
    { category: 'Spacing', anchor: 'spacing', tokens: [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}, indicator height/padding` }] }
  ];
};

// Every typography variant's own token table — one row per defined property, read straight
// from theme.typography.<variant>.<key>. Unlike the component sections, there's no known
// per-variant component-level override anywhere in this app's theme.js, so these are all
// plain "theme" reads rather than "overridden"/"other".
const getTypographyTokenItems = (variant, previewTheme) => {
  const definition = previewTheme.typography?.[variant];
  if (!definition) {
    return [
      {
        category: 'Typography',
        tokens: [
          {
            path: `theme.typography.${variant}`,
            status: 'other',
            note: 'not defined in theme.typography — inherits default text styling'
          }
        ]
      }
    ];
  }
  const tokens = TYPOGRAPHY_PROPERTY_KEYS.filter((key) => definition[key] !== undefined).map((key) => ({
    path: `theme.typography.${variant}.${key}`,
    note: String(definition[key])
  }));
  return [{ category: 'Typography', tokens }];
};

const describeTypographyVariant = (variant) => {
  const info = TYPOGRAPHY_VARIANT_INFO[variant];
  if (!info) {
    return null;
  }
  const originText = info.native
    ? "MUI's own built-in variant."
    : "A custom variant this app adds on top of MUI's built-in set — it isn't part of MUI's own variant list.";
  const usageText =
    info.count > 0
      ? `Used ${info.count} time${info.count === 1 ? '' : 's'} in the app — e.g. ${info.files.join(', ')}${
          info.files.length < info.count ? ', and more' : ''
        }.`
      : `Confirmed zero usage anywhere in admin-front, cabinet-front, or front-core${info.note ? ` — ${info.note}` : ' — currently unused in this app'}.`;
  return `${originText} ${usageText}`;
};

const TypographyVariantSection = ({ variant, previewTheme, editMode, showProperties, measureEnabled, onChange, onNavigate }) => {
  const definition = previewTheme.typography?.[variant];
  const description = describeTypographyVariant(variant);

  return (
    <Section
      id={`typography-${variant}`}
      title={TYPOGRAPHY_LABELS[variant] || variant}
      titleVariant="h3"
      properties={showProperties ? <TokenLegend onNavigate={onNavigate} items={getTypographyTokenItems(variant, previewTheme)} /> : null}
      description={description}
    >
      <MeasureOverlay enabled={measureEnabled}>
        <Typography variant={variant} component="div" style={{ display: 'block' }}>
          {TYPOGRAPHY_SAMPLE_TEXT}
        </Typography>
      </MeasureOverlay>
      {editMode && definition ? (
        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
          {EDITABLE_TYPOGRAPHY_KEYS.map((key) => (
            <TextField
              key={key}
              variant="standard"
              label={key}
              defaultValue={definition[key]}
              onBlur={(event) => onChange(variant, key, event.target.value)}
              style={{ width: 120 }}
            />
          ))}
          <TextField
            select={true}
            variant="standard"
            label="textTransform"
            value={definition.textTransform || 'none'}
            onChange={(event) => onChange(variant, 'textTransform', event.target.value)}
            style={{ width: 140 }}
          >
            {TEXT_TRANSFORM_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
      ) : null}
    </Section>
  );
};

const StyleGuidePage = () => {
  const baseTheme = useTheme();
  const [tab, setTab] = React.useState(0);
  const [activeId, setActiveId] = React.useState(SECTIONS[0].id);
  // Which sub-item (see SUB_SECTIONS_BY_PARENT) is in view right now, for the right-side
  // "on this page" nav — independent of activeId, which stays on the parent category.
  const [activeSubId, setActiveSubId] = React.useState(null);
  const allSubSections = React.useMemo(() => Object.values(SUB_SECTIONS_BY_PARENT).flat(), []);
  const [editMode, setEditMode] = React.useState(false);
  const [showProperties, setShowProperties] = React.useState(true);
  // Global "Measure" toggle in the header — drives every MeasureOverlay-wrapped demo at
  // once, rather than each demo needing its own on/off switch.
  const [measureEnabled, setMeasureEnabled] = React.useState(true);
  // Which single Buttons demo instance the Buttons token table describes right now.
  const [buttonVariant, setButtonVariant] = React.useState('contained');
  const [buttonColor, setButtonColor] = React.useState('primary');
  const [buttonSize, setButtonSize] = React.useState('medium');
  const [buttonShowIcon, setButtonShowIcon] = React.useState(true);
  const [buttonShowEndIcon, setButtonShowEndIcon] = React.useState(true);
  // Which interaction state's tokens the Buttons/Inputs token tables currently show.
  const [buttonState, setButtonState] = React.useState('resting');
  const [inputState, setInputState] = React.useState('resting');
  // Icon Buttons card, nested inside Buttons — same size/state tab pattern as Buttons above.
  const [iconButtonSize, setIconButtonSize] = React.useState('medium');
  const [iconButtonState, setIconButtonState] = React.useState('resting');
  // Icon library sample grid — size/color tabs apply to all twelve icons at once.
  const [iconLibrarySize, setIconLibrarySize] = React.useState('medium');
  const [iconLibraryColor, setIconLibraryColor] = React.useState('inherit');
  const [draft, setDraft] = React.useState({});
  const [baking, setBaking] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const previewTheme = React.useMemo(
    () => (isEmpty(draft) ? baseTheme : createTheme(baseTheme, draft)),
    [baseTheme, draft]
  );

  const rootFontSize = draft.typography?.htmlFontSize ?? previewTheme.typography.htmlFontSize;

  React.useEffect(() => {
    // 1rem is defined relative to the <html> element's font-size, not a MUI/palette value —
    // MUI's own `typography.htmlFontSize` only feeds its internal pxToRem() math, it never
    // touches the DOM. So making it live requires setting the root font-size ourselves.
    document.documentElement.style.fontSize = `${rootFontSize}px`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [rootFontSize]);

  React.useEffect(() => {
    const elements = [...SECTIONS, ...EXPLAINER_SECTIONS, ...allSubSections]
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const subEntry = allSubSections.find((section) => section.id === entry.target.id);
          if (subEntry) {
            setActiveSubId(subEntry.id);
            setActiveId(subEntry.parentId);
          } else {
            setActiveId(entry.target.id);
            setActiveSubId(null);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [allSubSections]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateDraft = (pathSegments, value) => {
    setDraft((prev) => setPath(prev, pathSegments, value));
  };

  const handleBake = async () => {
    setBaking(true);
    try {
      const response = await fetch('/__dev/bake-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const result = await response.json();
      setSnackbarMessage(
        result.ok
          ? 'Baked into theme.overrides.json — restart npm start to make it the new baseline.'
          : `Bake failed: ${result.error}`
      );
    } catch (error) {
      setSnackbarMessage(`Bake failed: ${error.message}`);
    } finally {
      setBaking(false);
    }
  };

  return (
    <ThemeProvider theme={previewTheme}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" style={{ flex: 1 }}>
              Style Guide
            </Typography>
            {editMode ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button variant="outlined" disabled={isEmpty(draft)} onClick={() => setDraft({})}>
                  Reset draft
                </Button>
                <Button variant="contained" color="primary" disabled={isEmpty(draft) || baking} onClick={handleBake}>
                  {baking ? 'Baking…' : 'Bake into theme.overrides.json'}
                </Button>
              </div>
            ) : null}
            <FormControlLabel
              control={<Switch size="small" checked={editMode} onChange={(event) => setEditMode(event.target.checked)} />}
              label="Edit mode"
              style={{ marginLeft: 16 }}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showProperties}
                  onChange={(event) => setShowProperties(event.target.checked)}
                />
              }
              label="Show properties"
              style={{ marginLeft: 8 }}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={measureEnabled}
                  onChange={(event) => setMeasureEnabled(event.target.checked)}
                />
              }
              label="Measure"
              style={{ marginLeft: 8 }}
            />
          </Toolbar>
        </AppBar>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Drawer
            variant="permanent"
            anchor="left"
            elevation={0}
            sx={{ flexShrink: 0 }}
            PaperProps={{
              style: {
                position: 'relative',
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                padding: 12,
                // MUI's default docked-drawer border-right is rgba(0,0,0,0.12) — a
                // light-theme-style divider color, unfixed for dark mode (same leftover
                // issue as palette.divider elsewhere in this file).
                borderRight: '1px solid rgba(255, 255, 255, 0.12)'
              }
            }}
          >
            <SideNav activeId={activeId} onSelect={scrollToSection} />
          </Drawer>
          <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', boxSizing: 'border-box', padding: '24px 32px' }}>
            <Typography variant="body2" color="textSecondary" gutterBottom={true} style={{ marginBottom: 40, maxWidth: 540 }}>
              Live reference rendered with this app's actual theme ({`packages/front-core/theme.js`}
              {' overridden by '}
              {`src/application/theme.js`} when present). Toggle Edit mode to tweak colors and
              typography live, then Bake to persist your changes — restart `npm start` afterwards
              to make the baked result the new baseline everywhere.
            </Typography>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ maxWidth: 960, minWidth: 0, flex: '1 1 auto' }}>
              <div id="typography" style={{ marginBottom: 8, scrollMarginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h2" gutterBottom={true}>
                    Typography
                  </Typography>
                  {editMode ? (
                    <TextField
                      variant="standard"
                      label="Root font size (px) — 1rem"
                      type="number"
                      value={rootFontSize}
                      onChange={(event) => updateDraft(['typography', 'htmlFontSize'], Number(event.target.value) || 1)}
                      style={{ width: 170 }}
                    />
                  ) : null}
                </div>
                <Divider style={{ marginBottom: 16 }} />
              </div>
              {TYPOGRAPHY_VARIANTS.map((variant) => (
                <TypographyVariantSection
                  key={variant}
                  variant={variant}
                  previewTheme={previewTheme}
                  editMode={editMode}
                  showProperties={showProperties}
                  measureEnabled={measureEnabled}
                  onChange={(v, key, value) => updateDraft(['typography', v, key], value)}
                  onNavigate={scrollToSection}
                />
              ))}

          <Section id="colors" title="Colors">
            <ColorTokenTable
              rows={PALETTE_GROUPS.flatMap(([colorName, ...shades]) =>
                shades.map((shade) => ({
                  token: `palette.${colorName}.${shade}`,
                  color: resolvePath(previewTheme.palette, [colorName, shade]),
                  editMode,
                  editable: true,
                  onChange: (value) => updateDraft(['palette', colorName, shade], value)
                }))
              )}
            />

            <Divider style={{ margin: '16px 0' }} />

            <Typography variant="subtitle2" gutterBottom={true}>
              Grey scale
            </Typography>
            <ColorTokenTable
              rows={GREY_KEYS.map((key) => ({
                token: `palette.grey.${key}`,
                color: previewTheme.palette.grey?.[key],
                editMode,
                editable: true,
                onChange: (value) => updateDraft(['palette', 'grey', String(key)], value)
              }))}
            />

            <Divider style={{ margin: '16px 0' }} />

            <Typography variant="subtitle2" gutterBottom={true}>
              Custom theme tokens
            </Typography>
            <Typography variant="caption" color="textSecondary" component="div" style={{ marginBottom: 8 }}>
              Read-only in the playground for now — several of these use rgba()/gradient values
              a plain color picker can't represent, and they live outside theme.palette. This
              list is a union across every app this guide can run under — admin-front's
              theme.js is fully independent of front-core's (cabinet-front's base), so their
              custom keys only partially overlap. Only the keys that actually resolve in the
              theme currently active are shown below.
            </Typography>
            <ColorTokenTable
              rows={CUSTOM_TOKEN_KEYS.map((entry) => {
                const nested = typeof entry === 'object';
                const key = nested ? entry.key : entry;
                const value = nested ? previewTheme[key]?.[entry.path] : previewTheme[key];
                return typeof value === 'string'
                  ? { token: `theme.${key}${nested ? `.${entry.path}` : ''}`, color: value, editMode: false, editable: false }
                  : null;
              }).filter(Boolean)}
            />
          </Section>

          <Section
            id="status"
            title="Status colors"
            description={
              <>
                theme.js has no palette.warning, success, or info — only primary, secondary,
                and error are defined. Nothing in the app actually uses{' '}
                <span style={{ fontFamily: 'monospace' }}>color=&quot;warning&quot;</span> or{' '}
                <span style={{ fontFamily: 'monospace' }}>color=&quot;success&quot;</span> on a
                themed component (confirmed: zero matches) — instead these four concepts come
                from two separate, hardcoded color maps that don&apos;t agree with each other.
                Not editable here; neither source reads from theme.overrides.json.
              </>
            }
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 90 }}>Concept</TableCell>
                  <TableCell>Snackbars/Snackbar.jsx (real toast system)</TableCell>
                  <TableCell>FormControlMessage.jsx (inline field messages)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {STATUS_COLOR_ROWS.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell style={{ fontWeight: 700, verticalAlign: 'top' }}>{row.label}</TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <Swatch
                        label={row.snackbar.note}
                        color={row.snackbar.resolve(previewTheme)}
                        editMode={false}
                        editable={false}
                      />
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <Swatch
                        label={row.formControl.note}
                        color={row.formControl.color}
                        editMode={false}
                        editable={false}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          <Section
            id="spacing"
            title="Spacing"
            description={
              <>
                {`theme.spacing(n) multiplies a base unit (${previewTheme.spacing(1)}) so padding, `}
                margins, and gaps stay on a consistent scale app-wide. Not editable here — it's a
                multiplier function derived at theme-creation time, not a plain value like the
                tokens above.
                <br />
                <br />
                This scale is only ever used in custom app/MUI-theme styles — it isn&apos;t a
                promise that built-in components use it internally. <span style={{ fontFamily: 'monospace' }}>
                  Button
                </span>{' '}
                is a good example of the gap: its per-size padding is hardcoded literal px in
                MUI&apos;s own <span style={{ fontFamily: 'monospace' }}>Button.js</span>, unrelated
                to this <span style={{ fontFamily: 'monospace' }}>theme.spacing()</span> scale — see{' '}
                <a
                  href="#buttons"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection('buttons');
                  }}
                  style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Buttons
                </a>
                .
              </>
            }
          >
            {SPACING_MULTIPLIERS.map((n) => {
              const value = previewTheme.spacing(n);
              const px = parseFloat(value);
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                  <Typography variant="body2" style={{ width: 100, fontFamily: 'monospace', flexShrink: 0 }}>
                    theme.spacing({n})
                  </Typography>
                  <div
                    style={{
                      height: 16,
                      width: Math.max(px, 2),
                      maxWidth: 320,
                      backgroundColor: previewTheme.palette.primary.main,
                      borderRadius: 2,
                      flexShrink: 0
                    }}
                  />
                  <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                    {value}
                  </Typography>
                </div>
              );
            })}
          </Section>

          <Section
            id="shape"
            title="Shape"
            description={
              <>
                theme.shape.borderRadius is the single default corner radius most components pull
                from (Chip and a few others hardcode their own radius instead — see the token
                legends below for which).
              </>
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  flexShrink: 0,
                  backgroundColor: previewTheme.palette.primary.main,
                  borderRadius: previewTheme.shape.borderRadius
                }}
              />
              {editMode ? (
                <TextField
                  variant="standard"
                  label="shape.borderRadius (px)"
                  type="number"
                  value={previewTheme.shape.borderRadius}
                  onChange={(event) => updateDraft(['shape', 'borderRadius'], Number(event.target.value) || 0)}
                  style={{ width: 180 }}
                />
              ) : (
                <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                  theme.shape.borderRadius: {previewTheme.shape.borderRadius}px
                </Typography>
              )}
            </div>
          </Section>

          <Section
            id="icon-library"
            title="Icon library"
            propertiesHeading={`Theme tokens for ${iconLibraryColor} color, ${iconLibrarySize} size`}
            properties={showProperties ? <TokenLegend onNavigate={scrollToSection} items={getIconLibraryTokenItems(iconLibraryColor, iconLibrarySize, previewTheme)} /> : null}
            description={
              <>
                <span style={{ fontFamily: 'monospace' }}>@material-symbols-svg/react</span> (Material Symbols)
                is available as a second icon source alongside{' '}
                <span style={{ fontFamily: 'monospace' }}>@mui/icons-material</span> (classic Material Icons) —
                not a migration, no existing icon usage was touched (see CHANGES.md). Each icon renders a
                plain <span style={{ fontFamily: 'monospace' }}>{'<svg>'}</span>, so it wraps in MUI&apos;s own{' '}
                <span style={{ fontFamily: 'monospace' }}>SvgIcon</span> via its{' '}
                <span style={{ fontFamily: 'monospace' }}>component</span> prop — same{' '}
                <span style={{ fontFamily: 'monospace' }}>color</span>/
                <span style={{ fontFamily: 'monospace' }}>fontSize</span> props this app already uses
                everywhere, no new theming layer. Style (Outlined/Rounded/Sharp), weight (100–700), and
                fill (outlined vs. filled shape) are each chosen at import time via a separate named
                export — not a runtime prop — so switching any of them means importing a different
                component, not toggling a prop; this app has settled on Rounded, weight 400, filled. One
                real gotcha: Material Symbols&apos; SVGs use a{' '}
                <span style={{ fontFamily: 'monospace' }}>viewBox=&quot;0 -960 960 960&quot;</span> coordinate
                space, not the classic 24×24 grid —{' '}
                <span style={{ fontFamily: 'monospace' }}>inheritViewBox</span> is required on{' '}
                <span style={{ fontFamily: 'monospace' }}>SvgIcon</span>, or the icon renders squished. The
                thirty below are this app&apos;s thirty most-used{' '}
                <span style={{ fontFamily: 'monospace' }}>@mui/icons-material</span> icons, shown here as
                their Material Symbols equivalents. Color resolution differs by app for Inherit — see the
                properties table below.
              </>
            }
          >
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                marginBottom: 20,
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Tabs value={iconLibraryColor} onChange={(event, value) => setIconLibraryColor(value)} style={{ minHeight: 32 }}>
                {ICON_LIBRARY_COLORS.map((color) => (
                  <Tab key={color.key} value={color.key} label={color.label} style={{ minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' }} />
                ))}
              </Tabs>
              <Divider
                orientation="vertical"
                flexItem={true}
                style={{ margin: '4px 0', borderColor: 'rgba(255, 255, 255, 0.12)' }}
              />
              <Tabs value={iconLibrarySize} onChange={(event, value) => setIconLibrarySize(value)} style={{ minHeight: 32 }}>
                {BUTTON_SIZES.map((size) => (
                  <Tab key={size.key} value={size.key} label={size.label} style={{ minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' }} />
                ))}
              </Tabs>
            </div>
            <MeasureOverlay enabled={measureEnabled}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)' }}>
                {ICON_LIBRARY_SAMPLES.map((sample, index) => {
                  const isLastColumn = (index + 1) % 10 === 0;
                  const isLastRow = index >= ICON_LIBRARY_SAMPLES.length - 10;
                  return (
                    <div
                      key={sample.key}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                        padding: '16px 8px',
                        borderRight: isLastColumn ? 'none' : `1px solid ${previewTheme.palette.divider}`,
                        borderBottom: isLastRow ? 'none' : `1px solid ${previewTheme.palette.divider}`
                      }}
                    >
                      <SvgIcon
                        component={sample.Icon}
                        inheritViewBox={true}
                        fontSize={iconLibrarySize}
                        color={iconLibraryColor === 'inherit' ? undefined : iconLibraryColor}
                      />
                      <Typography variant="caption" color="textSecondary" style={{ textAlign: 'center' }}>
                        {sample.label}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </MeasureOverlay>
          </Section>

          <Section
            id="surfaces"
            title="Surfaces"
            properties={
              showProperties ? (
                <TokenLegend
                  onNavigate={scrollToSection}
                  items={[
                    {
                      category: 'Color',
                      anchor: 'colors',
                      tokens: [
                        { path: 'palette.background.paper', note: `${previewTheme.palette.background.paper}` }
                      ]
                    },
                    {
                      category: 'Shape',
                      anchor: 'shape',
                      tokens: [{ path: 'theme.shape.borderRadius', note: `${previewTheme.shape.borderRadius}px` }]
                    },
                    {
                      category: 'Elevation',
                      tokens: [
                        { path: 'shadows[n]', note: '— plus a dark-mode-only overlay gradient on top of the flat color' }
                      ]
                    }
                  ]}
                />
              ) : null
            }
          >
            <MeasureOverlay enabled={measureEnabled}>
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 24 }}>
                {[0, 1, 2, 4, 8, 16, 24].map((elevation) => (
                  <Paper
                    key={elevation}
                    elevation={elevation}
                    style={{ width: 140, height: 90, padding: 12, boxSizing: 'border-box' }}
                  >
                    <Typography variant="caption">elevation={elevation}</Typography>
                  </Paper>
                ))}
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <Card style={{ maxWidth: 320 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom={true}>
                    Card
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cards use Paper under the hood with elevation=1 by default.
                  </Typography>
                </CardContent>
              </Card>
            </MeasureOverlay>
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            propertiesHeading={`Theme tokens for ${buttonVariant} button`}
            properties={
              showProperties ? (
                <>
                  <Tabs
                    value={buttonState}
                    onChange={(event, value) => setButtonState(value)}
                    variant="scrollable"
                    style={{ minHeight: 36, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}
                  >
                    {BUTTON_STATES.map((state) => (
                      <Tab
                        key={state.key}
                        value={state.key}
                        label={state.label}
                        style={{ minHeight: 36, minWidth: 'auto', padding: '6px 16px 10px' }}
                      />
                    ))}
                  </Tabs>
                  <TokenLegend
                    onNavigate={scrollToSection}
                    items={getButtonTokenItems(buttonVariant, buttonColor, buttonSize, buttonState, previewTheme, buttonShowIcon, buttonShowEndIcon)}
                  />
                </>
              ) : null
            }
            description={
              <>
                Only primary and secondary appear below —{' '}
                <span style={{ fontFamily: 'monospace' }}>color=&quot;error&quot;</span>/
                <span style={{ fontFamily: 'monospace' }}>&quot;success&quot;</span>/
                <span style={{ fontFamily: 'monospace' }}>&quot;warning&quot;</span>/
                <span style={{ fontFamily: 'monospace' }}>&quot;info&quot;</span> are valid MUI
                Button colors but unused on any real button in this app (confirmed: zero
                matches, across a multi-line-aware scan of every &lt;Button&gt;/&lt;IconButton&gt;
                in admin-front, cabinet-front, and front-core). When those concepts do appear,
                it&apos;s through separate hardcoded colors, not a Button prop — see{' '}
                <a
                  href="#status"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection('status');
                  }}
                  style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Status colors
                </a>
                .
              </>
            }
          >
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                marginBottom: 20,
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Tabs value={buttonColor} onChange={(event, value) => setButtonColor(value)} style={{ minHeight: 32 }}>
                <Tab value="primary" label="Primary" style={{ minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' }} />
                <Tab value="secondary" label="Secondary" style={{ minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' }} />
              </Tabs>
              <Divider
                orientation="vertical"
                flexItem={true}
                style={{ margin: '4px 0', borderColor: 'rgba(255, 255, 255, 0.12)' }}
              />
              <Tabs value={buttonSize} onChange={(event, value) => setButtonSize(value)} style={{ minHeight: 32 }}>
                {BUTTON_SIZES.map((size) => (
                  <Tab key={size.key} value={size.key} label={size.label} style={{ minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' }} />
                ))}
              </Tabs>
              <FormControlLabel
                style={{ marginLeft: 'auto', marginBottom: 8 }}
                control={
                  <Switch
                    size="small"
                    checked={buttonShowIcon}
                    onChange={(event) => setButtonShowIcon(event.target.checked)}
                  />
                }
                label="startIcon"
              />
              <FormControlLabel
                style={{ marginBottom: 8 }}
                control={
                  <Switch
                    size="small"
                    checked={buttonShowEndIcon}
                    onChange={(event) => setButtonShowEndIcon(event.target.checked)}
                  />
                }
                label="endIcon"
              />
            </div>

            <MeasureOverlay enabled={measureEnabled}>
              <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                {['contained', 'outlined', 'text'].map((variant) => (
                  <Button
                    key={variant}
                    variant={variant}
                    color={buttonColor}
                    size={buttonSize}
                    disabled={buttonState === 'disabled'}
                    onClick={() => setButtonVariant(variant)}
                    startIcon={buttonShowIcon ? <SvgIcon component={SymbolDelete} inheritViewBox={true} /> : undefined}
                    endIcon={buttonShowEndIcon ? <SvgIcon component={SymbolArrowForward} inheritViewBox={true} /> : undefined}
                  >
                    {variant[0].toUpperCase() + variant.slice(1)}
                  </Button>
                ))}
                <Typography
                  variant="caption"
                  color="textSecondary"
                  style={{ fontFamily: 'monospace', marginLeft: 'auto', whiteSpace: 'nowrap' }}
                >
                  {`height: ${getButtonHeightPx(buttonVariant, buttonSize, previewTheme, rootFontSize, buttonShowIcon || buttonShowEndIcon).toFixed(2)}px`}
                </Typography>
              </div>
            </MeasureOverlay>
          </Section>

          <Section
            id="buttons-icon-buttons"
            title="Icon Buttons"
            titleVariant="h3"
            propertiesHeading={`Theme tokens for ${iconButtonSize} icon button`}
            properties={
              showProperties ? (
                <>
                  <Tabs
                    value={iconButtonState}
                    onChange={(event, value) => setIconButtonState(value)}
                    variant="scrollable"
                    style={{ minHeight: 36, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}
                  >
                    {BUTTON_STATES.map((state) => (
                      <Tab
                        key={state.key}
                        value={state.key}
                        label={state.label}
                        style={{ minHeight: 36, minWidth: 'auto', padding: '6px 16px 10px' }}
                      />
                    ))}
                  </Tabs>
                  <TokenLegend onNavigate={scrollToSection} items={getIconButtonTokenItems(iconButtonSize, iconButtonState, previewTheme)} />
                </>
              ) : null
            }
            description={ICON_BUTTON_USAGE_NOTES[iconButtonSize]}
          >
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                marginBottom: 20,
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Tabs value={iconButtonSize} onChange={(event, value) => setIconButtonSize(value)} style={{ minHeight: 32 }}>
                {BUTTON_SIZES.map((size) => (
                  <Tab key={size.key} value={size.key} label={size.label} style={{ minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' }} />
                ))}
              </Tabs>
            </div>
            <MeasureOverlay enabled={measureEnabled}>
              <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                <IconButton aria-label="delete" size={iconButtonSize} disabled={iconButtonState === 'disabled'}>
                  {/* SvgIcon defaults to a fixed 24px regardless of the parent's size — inherit ties it to the button's own fontSize instead. */}
                  <SvgIcon component={SymbolDelete} inheritViewBox={true} fontSize="inherit" />
                </IconButton>
              </div>
            </MeasureOverlay>
          </Section>

          <Section
            id="inputs"
            title="Inputs"
            properties={
              showProperties ? (
                <>
                  <Tabs
                    value={inputState}
                    onChange={(event, value) => setInputState(value)}
                    variant="scrollable"
                    style={{ minHeight: 36, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}
                  >
                    {INPUT_STATES.map((state) => (
                      <Tab
                        key={state.key}
                        value={state.key}
                        label={state.label}
                        style={{ minHeight: 36, padding: '6px 16px' }}
                      />
                    ))}
                  </Tabs>
                  <TokenLegend onNavigate={scrollToSection} items={getInputTokenItems(inputState, previewTheme)} />
                </>
              ) : null
            }
          >
            <MeasureOverlay enabled={measureEnabled}>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 16 }}>
                <TextField label="Standard" defaultValue="Value" style={{ minWidth: 220 }} />
                <TextField label="Error" defaultValue="Value" error={true} helperText="Something went wrong" style={{ minWidth: 220 }} />
                <TextField label="Disabled" defaultValue="Value" disabled={true} style={{ minWidth: 220 }} />
                <Select defaultValue={1} style={{ minWidth: 160 }}>
                  <MenuItem value={1}>Option one</MenuItem>
                  <MenuItem value={2}>Option two</MenuItem>
                </Select>
              </div>
            </MeasureOverlay>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel control={<Checkbox defaultChecked={true} />} label="Checkbox" />
              <FormControlLabel control={<Checkbox disabled={true} />} label="Disabled" />
              <RadioGroup row={true} defaultValue="a" style={{ display: 'flex', flexDirection: 'row' }}>
                <FormControlLabel value="a" control={<Radio />} label="Radio A" />
                <FormControlLabel value="b" control={<Radio />} label="Radio B" />
              </RadioGroup>
              <FormControlLabel control={<Switch defaultChecked={true} />} label="Switch" />
            </div>
          </Section>

          <Section
            id="chips"
            title="Chips"
            properties={
              showProperties ? (
                <TokenLegend onNavigate={scrollToSection} items={getChipTokenItems(previewTheme)} />
              ) : null
            }
          >
            <MeasureOverlay enabled={measureEnabled}>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <Chip label="Default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Error" color="error" />
                <Chip label="Deletable" onDelete={() => {}} />
                <Chip label="Outlined" variant="outlined" />
              </div>
            </MeasureOverlay>
          </Section>

          <Section
            id="tabs"
            title="Tabs"
            properties={
              showProperties ? (
                <TokenLegend onNavigate={scrollToSection} items={getTabsTokenItems(previewTheme)} />
              ) : null
            }
          >
            <MeasureOverlay enabled={measureEnabled}>
              <Tabs value={tab} onChange={(event, value) => setTab(value)}>
                <Tab label="First" />
                <Tab label="Second" />
                <Tab label="Third" />
              </Tabs>
            </MeasureOverlay>
          </Section>

          <Section
            id="alert"
            title="Alert"
            properties={
              showProperties ? (
                <TokenLegend
                  onNavigate={scrollToSection}
                  items={[
                    {
                      category: 'Color',
                      anchor: 'colors',
                      tokens: [
                        {
                          path: 'palette.error/warning/info/success (unthemed)',
                          status: 'other',
                          note:
                            "all four fall through to MUI's own dark-mode-aware standard-variant " +
                            'color math — the previous MuiAlert.standardInfo/standardWarning ' +
                            'overrides hardcoded light-theme pastel backgrounds without updating the ' +
                            'text color, making those two barely legible; removed, see CHANGES.md'
                        }
                      ]
                    },
                    {
                      category: 'Shape',
                      anchor: 'shape',
                      tokens: [{ path: 'theme.shape.borderRadius', note: `${previewTheme.shape.borderRadius}px` }]
                    },
                    {
                      category: 'Typography',
                      anchor: 'typography',
                      tokens: [{ path: 'theme.typography.body2', note: 'message text' }]
                    }
                  ]}
                />
              ) : null
            }
            description={
              <>
                All four below use the default &quot;standard&quot; variant — no real usage in
                this app passes <span style={{ fontFamily: 'monospace' }}>variant</span>{' '}
                explicitly. error/warning/info are confirmed in real use (dialogs, VideoPlayer,
                Map, and cabinet-front&apos;s ImportantMessages banner); success has no
                confirmed <span style={{ fontFamily: 'monospace' }}>severity=&quot;success&quot;</span>{' '}
                usage anywhere in the codebase.
              </>
            }
          >
            <MeasureOverlay enabled={measureEnabled}>
              {ALERT_SEVERITIES.map((severity) => (
                <div key={severity} style={{ marginBottom: 24 }}>
                  <Alert severity={severity}>{ALERT_SAMPLE_TEXT[severity]}</Alert>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: 'block', marginTop: 4, marginLeft: 4 }}
                  >
                    {ALERT_USAGE_NOTES[severity]}
                  </Typography>
                </div>
              ))}
              <Divider style={{ margin: '16px 0' }} />
              <Alert severity="warning">
                <AlertTitle>Title</AlertTitle>
                With an AlertTitle — used in FormControlMessage.jsx when a message carries one.
              </Alert>
            </MeasureOverlay>
          </Section>

          <Section id="explainer-overrides-vs-palette" title="Overrides vs. palette">
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
              <span style={{ fontFamily: 'monospace' }}>theme.js</span> has an{' '}
              <span style={{ fontFamily: 'monospace' }}>overrides</span> block (the older MUI v4-style
              API — MUI v5&apos;s <span style={{ fontFamily: 'monospace' }}>createTheme()</span> still
              honors it for backward compatibility). It&apos;s a second, competing source of truth for
              how a component looks, alongside the palette.
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
              <strong>How a component normally gets its color:</strong> a component&apos;s own MUI
              source (e.g. <span style={{ fontFamily: 'monospace' }}>Button.js</span>) reads{' '}
              <span style={{ fontFamily: 'monospace' }}>theme.palette.primary.main</span>,{' '}
              <span style={{ fontFamily: 'monospace' }}>.dark</span>,{' '}
              <span style={{ fontFamily: 'monospace' }}>.contrastText</span>, etc. and computes CSS
              from them. Change the palette, and every component using that color updates
              automatically — this is what this guide badges &quot;Theme&quot; (green).
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
              <strong>What <span style={{ fontFamily: 'monospace' }}>overrides.MuiButton</span> does:</strong>{' '}
              it lets you write raw CSS keyed by MUI&apos;s own internal class names for that
              component, and those rules get merged into the generated stylesheet with enough
              specificity to win over whatever the palette-driven calculation would have produced —
              for that exact combination only. The keys map directly to real class names MUI
              attaches to the DOM:
            </Typography>
            <ul style={{ margin: '0 0 16px', paddingLeft: 20, maxWidth: 540 }}>
              <li>
                <Typography variant="body2" color="textSecondary">
                  <span style={{ fontFamily: 'monospace' }}>containedPrimary</span> — only{' '}
                  <span style={{ fontFamily: 'monospace' }}>variant=&quot;contained&quot; color=&quot;primary&quot;</span>{' '}
                  (i.e. <span style={{ fontFamily: 'monospace' }}>.MuiButton-containedPrimary</span>)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="textSecondary">
                  <span style={{ fontFamily: 'monospace' }}>outlinedPrimary</span> — only{' '}
                  <span style={{ fontFamily: 'monospace' }}>variant=&quot;outlined&quot; color=&quot;primary&quot;</span>
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="textSecondary">
                  <span style={{ fontFamily: 'monospace' }}>textPrimary</span> /{' '}
                  <span style={{ fontFamily: 'monospace' }}>textSecondary</span> — the text variant,
                  split by color
                </Typography>
              </li>
            </ul>
            {(() => {
              // admin-front and front-core (→ cabinet-front) each author containedPrimary
              // completely independently — different hex, and only admin adds the &:hover/
              // &:disabled sub-overrides at all (front-core's disabled styling instead comes
              // from a separate MuiButtonBase.root override — see Buttons above). Read live
              // rather than asserting one app's shape as if it were universal.
              const containedPrimary = getMuiStyleOverride(previewTheme, 'MuiButton', 'containedPrimary') || {};
              const bg = readBackground(containedPrimary);
              const bgKey = containedPrimary.background !== undefined ? 'background' : 'backgroundColor';
              const paletteMain = previewTheme.palette.primary.main;
              const hoverBg = readBackground(readPseudoSlot(containedPrimary, '&:hover', ':hover'));
              const hasDisabled = !!readPseudoSlot(containedPrimary, '&:disabled', '&.Mui-disabled');
              const marginRight = containedPrimary.marginRight;

              return (
                <>
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
                    Nothing under <span style={{ fontFamily: 'monospace' }}>containedPrimary</span> touches{' '}
                    <span style={{ fontFamily: 'monospace' }}>containedSecondary</span> at all — they&apos;re
                    two independent objects, so a fact defined on one never silently reaches the other.{' '}
                    {marginRight !== undefined ? (
                      <>
                        That&apos;s exactly why, in this app, the{' '}
                        <a
                          href="#buttons"
                          onClick={(event) => {
                            event.preventDefault();
                            scrollToSection('buttons');
                          }}
                          style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Buttons
                        </a>{' '}
                        section&apos;s Spacing tab shows a{' '}
                        <span style={{ fontFamily: 'monospace' }}>marginRight: {marginRight}</span> quirk
                        that only exists for primary — someone added it under{' '}
                        <span style={{ fontFamily: 'monospace' }}>containedPrimary</span> alone, so
                        switching to secondary silently drops it.
                      </>
                    ) : (
                      <>
                        In this app, <span style={{ fontFamily: 'monospace' }}>containedPrimary</span>{' '}
                        doesn&apos;t currently define that kind of asymmetric spacing quirk — but the same
                        class of silent-drift bug is possible any time one color&apos;s block gets a
                        one-off tweak the other&apos;s doesn&apos;t.
                      </>
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ maxWidth: 540 }}>
                    Concretely, in this app <span style={{ fontFamily: 'monospace' }}>containedPrimary</span>{' '}
                    hardcodes <span style={{ fontFamily: 'monospace' }}>{bgKey}: &apos;{bg}&apos;</span>{' '}
                    (a literal, not a <span style={{ fontFamily: 'monospace' }}>palette.primary.main</span>{' '}
                    reference —{' '}
                    {bg === paletteMain
                      ? 'currently a coincidental duplicate of it'
                      : `which currently differs from palette.primary.main (${paletteMain})`}
                    ),{' '}
                    {hoverBg !== undefined ? (
                      hoverBg === bg ? (
                        <>
                          forces the <span style={{ fontFamily: 'monospace' }}>&amp;:hover</span> background
                          to stay that same color (overriding MUI&apos;s normal &quot;darken on hover via{' '}
                          <span style={{ fontFamily: 'monospace' }}>palette.primary.dark</span>&quot;
                          behavior),
                        </>
                      ) : (
                        <>
                          overrides <span style={{ fontFamily: 'monospace' }}>&amp;:hover</span> to{' '}
                          {hoverBg},
                        </>
                      )
                    ) : (
                      <>
                        leaves <span style={{ fontFamily: 'monospace' }}>&amp;:hover</span> unset here (so
                        it falls through to MUI&apos;s normal &quot;darken via{' '}
                        <span style={{ fontFamily: 'monospace' }}>palette.primary.dark</span>&quot;
                        behavior),
                      </>
                    )}{' '}
                    and{' '}
                    {hasDisabled ? (
                      <>
                        defines its own <span style={{ fontFamily: 'monospace' }}>&amp;:disabled</span>{' '}
                        styling instead of falling through to{' '}
                        <span style={{ fontFamily: 'monospace' }}>palette.action.disabled</span>.
                      </>
                    ) : (
                      <>
                        leaves <span style={{ fontFamily: 'monospace' }}>&amp;:disabled</span> unset here —
                        disabled styling instead comes from a separate{' '}
                        <span style={{ fontFamily: 'monospace' }}>MuiButtonBase.root</span> override applied
                        to every disabled button in this app, any color (see Buttons above).
                      </>
                    )}{' '}
                    So think of palette as the default rulebook every component consults, and{' '}
                    <span style={{ fontFamily: 'monospace' }}>overrides</span> as a per-component,
                    per-class-name patch sheet that can silently replace pieces of that rulebook — and
                    because it&apos;s keyed to literal values rather than palette references, it can drift
                    out of sync with the palette without anyone noticing. That&apos;s exactly the class of
                    thing the &quot;Overridden&quot; badges throughout this guide are meant to surface.
                  </Typography>
                </>
              );
            })()}
          </Section>
            </div>
            {SUB_SECTIONS_BY_PARENT[activeId]?.length ? (
              <div
                style={{
                  width: RIGHT_DRAWER_WIDTH,
                  flexShrink: 0,
                  position: 'sticky',
                  top: 24,
                  boxSizing: 'border-box',
                  padding: '12px 12px 12px 0',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <SubNav
                  heading={SECTIONS.find((section) => section.id === activeId)?.label || 'On this page'}
                  items={SUB_SECTIONS_BY_PARENT[activeId]}
                  activeSubId={activeSubId}
                  onSelect={scrollToSection}
                />
              </div>
            ) : null}
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </ThemeProvider>
  );
};

export default StyleGuidePage;
