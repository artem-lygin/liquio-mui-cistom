import React from 'react';
import {
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Drawer,
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
  createTheme,
  ThemeProvider,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DRAWER_WIDTH = 220;

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

const CUSTOM_TOKEN_KEYS = [
  'leftSidebarBg',
  'buttonBg',
  'buttonHoverBg',
  'textColorDark',
  'headerBg',
  'borderColor',
  'navLinkActive',
  'categoryWrapperActive',
  'outlineColor'
];

const SECTIONS = [
  { id: 'typography', label: 'Typography' },
  { id: 'colors', label: 'Colors' },
  { id: 'status', label: 'Status colors' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'shape', label: 'Shape' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'chips', label: 'Chips' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'alert', label: 'Alert' }
];

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

// `properties` renders as its own sheet below the main content Card — elevation 1 plus an
// explicit border (rather than a higher elevation step) so it reads as a distinct surface
// without relying on the dark-mode elevation overlay being visible enough at a glance. The
// border uses an explicit rgba rather than palette.divider because divider is still the
// unfixed light-theme leftover value (see CHANGES.md) and would be nearly invisible here.
const Section = ({ id, title, actions, properties, children }) => (
  <div id={id} style={{ marginBottom: 32, scrollMarginTop: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h5" gutterBottom={true}>
        {title}
      </Typography>
      {actions}
    </div>
    <Card elevation={3}>
      <CardContent>{children}</CardContent>
    </Card>
    {properties ? (
      <Paper
        elevation={1}
        style={{ marginTop: 16, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)' }}
      >
        <Typography
          variant="overline"
          color="textSecondary"
          style={{ display: 'block', padding: '10px 16px 0' }}
        >
          Theme tokens
        </Typography>
        {properties}
      </Paper>
    ) : null}
  </div>
);

const SideNav = ({
  activeId,
  onSelect,
  editMode,
  onEditModeChange,
  showProperties,
  onShowPropertiesChange
}) => (
  <nav>
    {SECTIONS.map((section) => (
      <div
        key={section.id}
        onClick={() => onSelect(section.id)}
        style={{
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: 6,
          marginBottom: 2
        }}
      >
        <Typography
          variant="body2"
          style={{ fontWeight: activeId === section.id ? 700 : 400 }}
        >
          {section.label}
        </Typography>
      </div>
    ))}
    <Divider style={{ margin: '12px 0' }} />
    <FormControlLabel
      control={<Switch size="small" checked={editMode} onChange={(event) => onEditModeChange(event.target.checked)} />}
      label="Edit mode"
      style={{ marginLeft: 4 }}
    />
    <FormControlLabel
      control={
        <Switch
          size="small"
          checked={showProperties}
          onChange={(event) => onShowPropertiesChange(event.target.checked)}
        />
      }
      label="Show properties"
      style={{ marginLeft: 4, display: 'block' }}
    />
  </nav>
);

const toHex = (color) => (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) ? color : '#000000');

// Notes in TokenLegend are free-text (e.g. "overridden to #BB86FC in this app") — this finds
// every hex literal in a string and inlines a small color circle right before it, so a note
// mentioning a color is never just a code you have to mentally render yourself.
const HEX_COLOR_PATTERN = /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi;

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

// A token's `status` (defaults to 'theme' when omitted, since that's the common case) says
// whether the value shown actually comes from the live theme, or whether it's a fact about
// the app/MUI overriding or ignoring the theme entirely. Only tokens that deviate need to set
// this explicitly — see getButtonTokenItems and the Chips/Alert legends below for the
// 'overridden'/'other' cases.
const TOKEN_STATUS = {
  theme: { color: '#4caf50', label: 'Theme value — read directly from the active theme' },
  overridden: { color: '#ffca28', label: 'Overridden — this app replaces the theme value' },
  other: { color: '#9e9e9e', label: "Other — hardcoded in MUI or elsewhere, not theme-derived" }
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
            <TableCell style={{ fontFamily: 'monospace', fontSize: 13, verticalAlign: 'top' }}>
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
            <TableCell style={{ fontFamily: 'monospace', fontSize: 13, color: 'inherit', verticalAlign: 'top' }}>
              <Typography variant="caption" color="textSecondary" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
                {withColorSwatches(token.note || '')}
              </Typography>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
);

// Button.js hardcodes its own padding per variant rather than calling theme.spacing() —
// confirmed by grepping @mui/material/Button/Button.js, no theme.spacing( call anywhere
// in its style function. Kept here so the Spacing row below can say so instead of
// (incorrectly, as an earlier version of this legend did) implying padding is token-driven.
const BUTTON_PADDING = { text: '6px 8px', outlined: '5px 15px', contained: '6px 16px' };

// Builds TokenLegend items for one specific button instance (variant + colorKey, where
// colorKey is 'primary' | 'secondary' | 'error' | 'disabled') instead of the generic
// cross-variant summary this section used to show. The override facts below come from this
// app's theme.js (MuiButton.containedPrimary/outlinedPrimary/textPrimary/textSecondary) —
// the disabled-state ones were also spot-checked against actual getComputedStyle() output
// in the running page, since which of MUI's own `.Mui-disabled` rule vs. this app's
// per-variant override rule wins isn't obvious from source order alone, and it turns out
// to differ: outlined/contained primary's override wins while disabled *text* buttons fall
// through to MUI's own palette.action.disabled (unmodified for dark mode — see below).
const getButtonTokenItems = (variant, colorKey, previewTheme) => {
  const isDisabled = colorKey === 'disabled';
  const color = isDisabled ? 'primary' : colorKey; // the demo's disabled button uses the default color prop
  const items = [];
  const colorTokens = [];

  if (isDisabled) {
    if (variant === 'text') {
      colorTokens.push({
        path: 'palette.action.disabled',
        note:
          `(label — ${previewTheme.palette.action.disabled}; still MUI's light-theme-style value, ` +
          'not tuned for dark mode, so disabled text buttons read very faint here)'
      });
    } else if (variant === 'outlined') {
      colorTokens.push({
        path: 'MuiButton.outlinedPrimary "&:disabled"',
        status: 'overridden',
        note: '(label + border — hardcoded to rgba(255,255,255,0.5) / rgba(255,255,255,0.3) in this app, overriding palette.action.disabled entirely)'
      });
    } else {
      colorTokens.push({
        path: 'MuiButton.containedPrimary "&:disabled"',
        status: 'overridden',
        note: '(label — hardcoded to rgb(221 221 221 / 50%) in this app, overriding palette.action.disabled)'
      });
      colorTokens.push({
        path: 'palette.action.disabledBackground',
        note: `(background — ${previewTheme.palette.action.disabledBackground}; not overridden, still the light-theme-style value)`
      });
    }
  } else if (variant === 'contained') {
    const override = color === 'primary' ? { bg: '#BB86FC', text: '#232f3d' } : null;
    colorTokens.push({
      path: `palette.${color}.main`,
      status: override ? 'overridden' : 'theme',
      note: override
        ? `(resting background — overridden to ${override.bg} in this app; theme value is ${previewTheme.palette[color].main})`
        : `(resting background — ${previewTheme.palette[color].main})`
    });
    colorTokens.push({
      path: `palette.${color}.dark`,
      status: override ? 'overridden' : 'theme',
      note: override
        ? `(hover background — overridden, no darken; stays ${override.bg})`
        : `(hover background — ${previewTheme.palette[color].dark})`
    });
    colorTokens.push({
      path: `palette.${color}.contrastText`,
      status: override ? 'overridden' : 'theme',
      note: override
        ? `(label — overridden to ${override.text} in this app; theme value is ${previewTheme.palette[color].contrastText})`
        : `(label — ${previewTheme.palette[color].contrastText})`
    });
  } else {
    const overridden =
      (variant === 'text' && (color === 'primary' || color === 'secondary')) ||
      (variant === 'outlined' && color === 'primary');
    const overrideText =
      variant === 'text' && color === 'primary'
        ? '#fff'
        : variant === 'text' && color === 'secondary'
          ? 'rgb(220, 0, 78)'
          : '#fff';
    colorTokens.push({
      path: `palette.${color}.main`,
      status: overridden ? 'overridden' : 'theme',
      note: overridden
        ? `(label${variant === 'outlined' ? ' + border' : ''} — overridden to ${overrideText} in this app; theme value is ${previewTheme.palette[color].main})`
        : `(label${variant === 'outlined' ? ' + border' : ''} — ${previewTheme.palette[color].main})`
    });
    colorTokens.push({
      path: 'palette.action.hoverOpacity',
      note: `(${previewTheme.palette.action.hoverOpacity} — hover tints that color into the background instead of swapping it)`
    });
  }
  items.push({ category: 'Color', anchor: 'colors', tokens: colorTokens });

  if (variant === 'contained') {
    items.push({
      category: 'Elevation',
      tokens: isDisabled
        ? [{ path: 'shadows[0]', note: '(flat — no shadow while disabled)' }]
        : [
            { path: 'shadows[4]', note: '(resting & hover — hover only changes background, not the shadow)' },
            { path: 'shadows[8]', note: '(pressed/active)' },
            { path: 'shadows[6]', note: '(focus-visible)' }
          ]
    });
  }

  items.push({
    category: 'Shape',
    anchor: 'shape',
    tokens: [{ path: 'shape.borderRadius', note: `(${previewTheme.shape.borderRadius}px)` }]
  });

  items.push({
    category: 'Typography',
    anchor: 'typography',
    tokens: [
      {
        path: 'typography.button',
        note:
          `(fontWeight ${previewTheme.typography.button.fontWeight}, ` +
          `textTransform ${previewTheme.typography.button.textTransform})`
      }
    ]
  });

  items.push({
    category: 'Spacing',
    tokens: [
      {
        path: 'padding',
        status: 'other',
        note: `(hardcoded '${BUTTON_PADDING[variant]}' in MUI's Button.js — not derived from theme.spacing())`
      }
    ]
  });

  return items;
};

const TypographyRow = ({ variant, theme, editMode, showProperties, onChange }) => {
  const definition = theme.typography?.[variant];
  const properties = definition
    ? TYPOGRAPHY_PROPERTY_KEYS.filter((key) => definition[key] !== undefined).map(
        (key) => `${key}: ${definition[key]}`
      )
    : null;

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant={variant} component="div" style={{ display: 'block' }}>
        {TYPOGRAPHY_LABELS[variant] || variant}. {TYPOGRAPHY_SAMPLE_TEXT}
      </Typography>
      {showProperties ? (
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          style={{ display: 'block', fontFamily: 'monospace', marginTop: 4 }}
        >
          {properties ? properties.join(' · ') : 'not defined in theme.typography — inherits default text styling'}
        </Typography>
      ) : null}
      {editMode && definition ? (
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
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
      <Divider style={{ marginTop: 16 }} />
    </div>
  );
};

const StyleGuidePage = () => {
  const baseTheme = useTheme();
  const [tab, setTab] = React.useState(0);
  const [activeId, setActiveId] = React.useState(SECTIONS[0].id);
  const [editMode, setEditMode] = React.useState(false);
  const [showProperties, setShowProperties] = React.useState(true);
  // Which single Buttons demo instance the Buttons token table describes right now.
  // colorKey is 'primary' | 'secondary' | 'error' | 'disabled'.
  const [selectedButton, setSelectedButton] = React.useState({ variant: 'contained', color: 'primary' });
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
    const elements = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

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
                padding: 12
              }
            }}
          >
            <SideNav
              activeId={activeId}
              onSelect={scrollToSection}
              editMode={editMode}
              onEditModeChange={setEditMode}
              showProperties={showProperties}
              onShowPropertiesChange={setShowProperties}
            />
          </Drawer>
          <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', boxSizing: 'border-box', padding: '24px 32px' }}>
            <Typography variant="body2" color="textSecondary" gutterBottom={true} style={{ marginBottom: 40, maxWidth: 960 }}>
              Live reference rendered with this app's actual theme ({`packages/front-core/theme.js`}
              {' overridden by '}
              {`src/application/theme.js`} when present). Toggle Edit mode to tweak colors and
              typography live, then Bake to persist your changes — restart `npm start` afterwards
              to make the baked result the new baseline everywhere.
            </Typography>

            <div style={{ maxWidth: 960 }}>
              <Section
            id="typography"
            title="Typography"
            actions={
              editMode ? (
                <TextField
                  variant="standard"
                  label="Root font size (px) — 1rem"
                  type="number"
                  value={rootFontSize}
                  onChange={(event) => updateDraft(['typography', 'htmlFontSize'], Number(event.target.value) || 1)}
                  style={{ width: 170 }}
                />
              ) : null
            }
          >
            {TYPOGRAPHY_VARIANTS.map((variant) => (
              <TypographyRow
                key={variant}
                variant={variant}
                theme={previewTheme}
                editMode={editMode}
                showProperties={showProperties}
                onChange={(v, key, value) => updateDraft(['typography', v, key], value)}
              />
            ))}
          </Section>

          <Section id="colors" title="Colors">
            {PALETTE_GROUPS.map(([colorName, ...shades]) => (
              <div key={colorName} style={{ marginBottom: 16 }}>
                {shades.map((shade) => (
                  <Swatch
                    key={shade}
                    label={`${colorName}.${shade}`}
                    color={resolvePath(previewTheme.palette, [colorName, shade])}
                    editMode={editMode}
                    editable={true}
                    onChange={(value) => updateDraft(['palette', colorName, shade], value)}
                  />
                ))}
              </div>
            ))}

            <Divider style={{ margin: '16px 0' }} />

            <Typography variant="subtitle2" gutterBottom={true}>
              Grey scale
            </Typography>
            {GREY_KEYS.map((key) => (
              <Swatch
                key={key}
                label={`grey.${key}`}
                color={previewTheme.palette.grey?.[key]}
                editMode={editMode}
                editable={true}
                onChange={(value) => updateDraft(['palette', 'grey', String(key)], value)}
              />
            ))}

            <Divider style={{ margin: '16px 0' }} />

            <Typography variant="subtitle2" gutterBottom={true}>
              Custom theme tokens
            </Typography>
            <Typography variant="caption" color="textSecondary" component="div" style={{ marginBottom: 8 }}>
              Read-only in the playground for now — several of these use rgba()/gradient values
              a plain color picker can't represent, and they live outside theme.palette.
            </Typography>
            {CUSTOM_TOKEN_KEYS.map((key) => (
              <Swatch
                key={key}
                label={key}
                color={typeof previewTheme[key] === 'string' ? previewTheme[key] : undefined}
                editMode={editMode}
                editable={false}
              />
            ))}
          </Section>

          <Section id="status" title="Status colors">
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
              theme.js has no palette.warning, success, or info — only primary, secondary,
              and error are defined. Nothing in the app actually uses{' '}
              <span style={{ fontFamily: 'monospace' }}>color=&quot;warning&quot;</span> or{' '}
              <span style={{ fontFamily: 'monospace' }}>color=&quot;success&quot;</span> on a
              themed component (confirmed: zero matches) — instead these four concepts come
              from two separate, hardcoded color maps that don&apos;t agree with each other.
              Not editable here; neither source reads from theme.overrides.json.
            </Typography>
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

          <Section id="spacing" title="Spacing">
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 20 }}>
              {`theme.spacing(n) multiplies a base unit (${previewTheme.spacing(1)}) so padding, `}
              margins, and gaps stay on a consistent scale app-wide. Not editable here — it's a
              multiplier function derived at theme-creation time, not a plain value like the
              tokens above.
            </Typography>
            {SPACING_MULTIPLIERS.map((n) => {
              const value = previewTheme.spacing(n);
              const px = parseFloat(value);
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                  <Typography variant="body2" style={{ width: 100, fontFamily: 'monospace', flexShrink: 0 }}>
                    spacing({n})
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

          <Section id="shape" title="Shape">
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 20 }}>
              theme.shape.borderRadius is the single default corner radius most components pull
              from (Chip and a few others hardcode their own radius instead — see the token
              legends below for which).
            </Typography>
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
                  shape.borderRadius: {previewTheme.shape.borderRadius}px
                </Typography>
              )}
            </div>
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
                        { path: 'palette.background.paper', note: `(${previewTheme.palette.background.paper})` }
                      ]
                    },
                    {
                      category: 'Shape',
                      anchor: 'shape',
                      tokens: [{ path: 'shape.borderRadius', note: `(${previewTheme.shape.borderRadius}px)` }]
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
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
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
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            properties={
              showProperties ? (
                <>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: 'block', padding: '4px 16px 0' }}
                  >
                    {`Showing tokens for: ${selectedButton.variant} / ${selectedButton.color} — pick a radio button above to inspect a different instance.`}
                  </Typography>
                  <TokenLegend
                    onNavigate={scrollToSection}
                    items={getButtonTokenItems(selectedButton.variant, selectedButton.color, previewTheme)}
                  />
                </>
              ) : null
            }
          >
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
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
            </Typography>
            {['text', 'outlined', 'contained'].map((variant, index) => (
              <React.Fragment key={variant}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <Typography variant="body2" style={{ width: 90, flexShrink: 0 }}>
                    {variant}
                  </Typography>
                  {['primary', 'secondary'].map((color) => (
                    <div key={color} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Radio
                        size="small"
                        name="button-token-selector"
                        checked={selectedButton.variant === variant && selectedButton.color === color}
                        onChange={() => setSelectedButton({ variant, color })}
                        style={{ padding: 4 }}
                        inputProps={{ 'aria-label': `Show tokens for ${variant} ${color} button` }}
                      />
                      <Button variant={variant} color={color}>
                        {color}
                      </Button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Radio
                      size="small"
                      name="button-token-selector"
                      checked={selectedButton.variant === variant && selectedButton.color === 'disabled'}
                      onChange={() => setSelectedButton({ variant, color: 'disabled' })}
                      style={{ padding: 4 }}
                      inputProps={{ 'aria-label': `Show tokens for ${variant} disabled button` }}
                    />
                    <Button variant={variant} disabled={true}>
                      disabled
                    </Button>
                  </div>
                </div>
                {index < 2 ? <Divider style={{ margin: '12px 0' }} /> : null}
              </React.Fragment>
            ))}
            <Divider style={{ margin: '16px 0' }} />
            <div>
              <IconButton aria-label="delete" color="primary">
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="delete" disabled={true}>
                <DeleteIcon />
              </IconButton>
            </div>
          </Section>

          <Section
            id="inputs"
            title="Inputs"
            properties={
              showProperties ? (
                <TokenLegend
                  onNavigate={scrollToSection}
                  items={[
                    {
                      category: 'Color',
                      anchor: 'colors',
                      tokens: [
                        { path: 'palette.primary.main', note: '(focus/underline)' },
                        { path: 'palette.error.main', note: '(error state)' },
                        { path: 'palette.text.primary', note: '(value)' }
                      ]
                    },
                    { category: 'Typography', anchor: 'typography', tokens: [{ path: 'typography.body1' }] },
                    {
                      category: 'Spacing',
                      anchor: 'spacing',
                      tokens: [
                        { path: 'theme.spacing', note: `(unit: ${previewTheme.spacing(1)}, field height/margins)` }
                      ]
                    }
                  ]}
                />
              ) : null
            }
          >
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
              <TextField label="Standard" defaultValue="Value" style={{ minWidth: 220 }} />
              <TextField label="Error" defaultValue="Value" error={true} helperText="Something went wrong" style={{ minWidth: 220 }} />
              <TextField label="Disabled" defaultValue="Value" disabled={true} style={{ minWidth: 220 }} />
              <Select defaultValue={1} style={{ minWidth: 160 }}>
                <MenuItem value={1}>Option one</MenuItem>
                <MenuItem value={2}>Option two</MenuItem>
              </Select>
            </div>
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
                <TokenLegend
                  onNavigate={scrollToSection}
                  items={[
                    {
                      category: 'Color',
                      anchor: 'colors',
                      tokens: [
                        { path: 'palette.primary.main', note: '(colored variant)' },
                        { path: 'palette.error.main', note: '(colored variant)' },
                        { path: 'palette.grey', note: '(default fill)' }
                      ]
                    },
                    {
                      category: 'Shape',
                      anchor: 'shape',
                      tokens: [
                        {
                          path: 'shape.borderRadius',
                          status: 'other',
                          note: '— not used; Chip hardcodes a fixed 16px pill radius instead'
                        }
                      ]
                    },
                    {
                      category: 'Typography',
                      anchor: 'typography',
                      tokens: [
                        { path: 'typography.fontFamily', note: '(font size is a fixed 13px, not a named variant)' }
                      ]
                    },
                    {
                      category: 'Spacing',
                      anchor: 'spacing',
                      tokens: [{ path: 'theme.spacing', note: `(unit: ${previewTheme.spacing(1)}, height/padding)` }]
                    }
                  ]}
                />
              ) : null
            }
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip label="Default" />
              <Chip label="Primary" color="primary" />
              <Chip label="Error" color="error" />
              <Chip label="Deletable" onDelete={() => {}} />
              <Chip label="Outlined" variant="outlined" />
            </div>
          </Section>

          <Section
            id="tabs"
            title="Tabs"
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
                          path: 'palette.text.secondary',
                          note: '(unselected default) — this app overrides the selected color'
                        }
                      ]
                    },
                    { category: 'Typography', anchor: 'typography', tokens: [{ path: 'typography.button' }] },
                    {
                      category: 'Spacing',
                      anchor: 'spacing',
                      tokens: [
                        { path: 'theme.spacing', note: `(unit: ${previewTheme.spacing(1)}, indicator height/padding)` }
                      ]
                    }
                  ]}
                />
              ) : null
            }
          >
            <Tabs value={tab} onChange={(event, value) => setTab(value)}>
              <Tab label="First" />
              <Tab label="Second" />
              <Tab label="Third" />
            </Tabs>
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
                            "(all four fall through to MUI's own dark-mode-aware standard-variant " +
                            'color math — the previous MuiAlert.standardInfo/standardWarning ' +
                            'overrides hardcoded light-theme pastel backgrounds without updating the ' +
                            'text color, making those two barely legible; removed, see CHANGES.md)'
                        }
                      ]
                    },
                    {
                      category: 'Shape',
                      anchor: 'shape',
                      tokens: [{ path: 'shape.borderRadius', note: `(${previewTheme.shape.borderRadius}px)` }]
                    },
                    {
                      category: 'Typography',
                      anchor: 'typography',
                      tokens: [{ path: 'typography.body2', note: '(message text)' }]
                    }
                  ]}
                />
              ) : null
            }
          >
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
              All four below use the default &quot;standard&quot; variant — no real usage in
              this app passes <span style={{ fontFamily: 'monospace' }}>variant</span>{' '}
              explicitly. error/warning/info are confirmed in real use (dialogs, VideoPlayer,
              Map, and cabinet-front&apos;s ImportantMessages banner); success has no
              confirmed <span style={{ fontFamily: 'monospace' }}>severity=&quot;success&quot;</span>{' '}
              usage anywhere in the codebase.
            </Typography>
            {ALERT_SEVERITIES.map((severity) => (
              <div key={severity} style={{ marginBottom: 12 }}>
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
          </Section>
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
