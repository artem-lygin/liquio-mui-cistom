export const TYPOGRAPHY_VARIANTS = [
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

export const TYPOGRAPHY_LABELS = {
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
export const TYPOGRAPHY_VARIANT_INFO = {
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

export const TYPOGRAPHY_SAMPLE_TEXT =
  'The quick brown fox jumps over the lazy dog, showing how this style reads across a ' +
  'longer run of text — line height, letter spacing, and weight all matter once a sentence ' +
  'wraps onto a second line.';

export const TYPOGRAPHY_PROPERTY_KEYS = [
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
export const EDITABLE_TYPOGRAPHY_KEYS = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
export const TEXT_TRANSFORM_OPTIONS = ['none', 'uppercase', 'lowercase', 'capitalize'];
