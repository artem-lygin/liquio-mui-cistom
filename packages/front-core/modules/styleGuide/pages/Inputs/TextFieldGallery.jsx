import React from 'react';
import {
  Box,
  Button,
  Chip,
  Typography,
  TextField,
  Autocomplete,
  MenuItem,
  InputAdornment,
  IconButton,
  SvgIcon,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  SearchFill as SymbolSearch,
  VisibilityFill as SymbolVisibility,
  VisibilityOffFill as SymbolVisibilityOff,
  CalendarMonthFill as SymbolCalendarMonth,
  ContentCopyFill as SymbolContentCopy,
  CheckFill as SymbolCheck,
  CancelFill as SymbolCancel,
  MailFill as SymbolMail
} from '@material-symbols-svg/react/rounded/w400';

// Every kind of text input the admin panel uses, rendered with plain MUI components and no
// local styling: what you see is exactly what admin's theme draws (the Text field rules in
// components/admin-front/src/application/theme.js: MuiOutlinedInput, MuiInput,
// MuiInputLabel, MuiAutocomplete). Under cabinet-front this shows cabinet's own (unchanged)
// inputs instead.
//
// Split into one gallery per Inputs section, named after MUI's own docs pages and demos:
// Text Field, Select ("Basic select"), Autocomplete ("Combo box"), and Multiple select
// (Select's "Chip" demo next to Autocomplete's "Multiple values"). Each case's title is the
// MUI demo name where one exists; "where" names a real place in admin that uses it.
// Every gallery takes the same size / state / showHelperText, driven by the page's shared
// field controls.

const USERS = ['Olena Kovalenko', 'Taras Shevchuk', 'Iryna Bondar', 'Andrii Melnyk'];
const UNITS = ['Administrators', 'Registry editors', 'Workflow designers', 'Support'];
const CUSTOMERS = ['Ministry of Justice', 'City Council', 'Regional Administration'];
const PER_PAGE = [10, 50, 100];

// Each case is one row of a two-column list: the input on the left, its title and where it's
// used on the right. Case returns both cells as a fragment so every row shares the same column
// widths (set once on Grid).
const Case = ({ title, where, children }) => (
  <>
    <div style={{ minWidth: 0 }}>{children}</div>
    <div style={{ minWidth: 0 }}>
      <Typography variant="subtitle2" component="div">
        {title}
      </Typography>
      <Typography variant="caption" color="textSecondary" component="div">
        {where}
      </Typography>
    </div>
  </>
);

const Grid = ({ children }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 400px) minmax(0, 1fr)',
      gap: '32px 40px',
      alignItems: 'start'
    }}
  >
    {children}
  </div>
);

// Focus is only forced when the Focus tab is selected, so in Resting every field is
// genuinely interactive.
const useCaseProps = (state, showHelperText) => {
  const stateProps = {
    focused: state === 'focus' ? true : undefined,
    error: state === 'error',
    disabled: state === 'disabled'
  };
  const helper = (text) => (showHelperText ? (state === 'error' ? 'Something went wrong' : text) : undefined);
  return { stateProps, helper };
};

// Autocomplete takes disabled itself; error/focused go on the TextField it renders.
const autocompleteInput = (stateProps, props) => (params) => (
  <TextField {...params} {...props} error={stateProps.error} focused={stateProps.focused} />
);

// Copies to the clipboard and swaps the copy icon for a check for a moment, so the action
// confirms itself without a toast.
const useCopyAction = () => {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
  };
  return [copied, copy];
};

export const TextFieldCases = ({ size, state, showHelperText }) => {
  const { stateProps, helper } = useCaseProps(state, showHelperText);
  const [name, setName] = React.useState('Citizen request');
  const [password, setPassword] = React.useState('correct-horse');
  const [showPassword, setShowPassword] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [description, setDescription] = React.useState('Handles incoming citizen requests\nand routes them to the right unit.');
  const [website, setWebsite] = React.useState('liquio.gov.ua');
  const [deadline, setDeadline] = React.useState('14');
  const [email, setEmail] = React.useState('olena.kovalenko@liquio.gov.ua');
  const [filterName, setFilterName] = React.useState('Citizen request');
  const [token, setToken] = React.useState('lq_live_8f3a2c91d4e7b6a0');
  const [showToken, setShowToken] = React.useState(false);
  const [workflowIdCopied, copyWorkflowId] = useCopyAction();
  const [tokenCopied, copyToken] = useCopyAction();
  const workflowId = '6f1c2e04-91ab-4d3e-b8a7-2c5d0e9f4a17';

  // One or more action buttons at the end of the field, as in MUI's Input Adornments demo.
  const endActions = (...actions) => (
    <InputAdornment position="end">
      {actions.map(({ icon, label, onClick }) => (
        <IconButton key={label} aria-label={label} onClick={onClick} disabled={stateProps.disabled}>
          <SvgIcon component={icon} inheritViewBox={true} fontSize="inherit" />
        </IconButton>
      ))}
    </InputAdornment>
  );
  const iconButton = (icon, label, onClick) => endActions({ icon, label, onClick });
  const startIcon = (icon) => (
    <InputAdornment position="start">
      <SvgIcon component={icon} inheritViewBox={true} />
    </InputAdornment>
  );

  return (
    <Grid>
      <Case title="Basic" where="New workflow dialog → Workflow name (shown next to a button of the same size)">
        {/* No gap: the button's own per-size left margin (theme.buttonGap) spaces it from the field. */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <TextField
            size={size}
            label="Workflow name"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            helperText={helper('Up to 255 characters')}
            {...stateProps}
          />
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            {/* An invisible label above the button takes exactly the field label's height
                (its font size and bottom margin come from the theme's MuiInputLabel), so the
                button lines up with the input box itself, not with the label. It holds a
                non-breaking space: a plain space collapses to zero height. */}
            <FormControl size={size} style={{ visibility: 'hidden' }} aria-hidden={true}>
              <InputLabel>{'\u00a0'}</InputLabel>
            </FormControl>
            <Button variant="contained" color="primary" size={size} disabled={stateProps.disabled}>
              Create
            </Button>
          </div>
        </div>
      </Case>

      <Case title="Password" where="Users → Add user, Set password (show/hide toggle)">
        <TextField
          size={size}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          InputProps={{
            endAdornment: iconButton(
              showPassword ? SymbolVisibility : SymbolVisibilityOff,
              showPassword ? 'Hide password' : 'Show password',
              () => setShowPassword(!showPassword)
            )
          }}
          helperText={helper('At least 8 characters')}
          {...stateProps}
        />
      </Case>

      <Case title="Search" where="List pages → table search (no label, icon at the start)">
        <TextField
          size={size}
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{ startAdornment: startIcon(SymbolSearch) }}
          inputProps={{ 'aria-label': 'Search' }}
          helperText={helper('Name or ID')}
          {...stateProps}
        />
      </Case>

      <Case title="Input adornments (date filter)" where="Metrics, Statistics → period filters (opens a calendar; trigger appearance only here)">
        <TextField
          size={size}
          label="From"
          value="01.11.2026"
          InputProps={{ readOnly: true, endAdornment: iconButton(SymbolCalendarMonth, 'Open calendar') }}
          helperText={helper('DD.MM.YYYY')}
          {...stateProps}
        />
      </Case>

      <Case title="Text adornment · start" where="Prefix text, e.g. a fixed URL scheme (MUI Input Adornments demo)">
        <TextField
          size={size}
          label="Website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start">https://</InputAdornment> }}
          helperText={helper('Domain only')}
          {...stateProps}
        />
      </Case>

      <Case title="Text adornment · end" where="Unit after the value, e.g. a deadline in days">
        <TextField
          size={size}
          label="Deadline"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
          inputProps={{ inputMode: 'numeric' }}
          helperText={helper('Working days')}
          {...stateProps}
        />
      </Case>

      <Case title="Icon adornment · start" where="Icon before the value, naming what the field holds">
        <TextField
          size={size}
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          InputProps={{ startAdornment: startIcon(SymbolMail) }}
          helperText={helper('Used for notifications')}
          {...stateProps}
        />
      </Case>

      <Case title="Action · Clear" where="Clear button, shown only while the field has a value">
        <TextField
          size={size}
          label="Filter by name"
          value={filterName}
          onChange={(event) => setFilterName(event.target.value)}
          InputProps={{
            endAdornment: filterName ? endActions({ icon: SymbolCancel, label: 'Clear', onClick: () => setFilterName('') }) : null
          }}
          helperText={helper('Type to filter the list')}
          {...stateProps}
        />
      </Case>

      <Case title="Action · Copy" where="Read-only value with a copy button, e.g. a workflow ID">
        <TextField
          size={size}
          label="Workflow ID"
          value={workflowId}
          InputProps={{
            readOnly: true,
            endAdornment: endActions({
              icon: workflowIdCopied ? SymbolCheck : SymbolContentCopy,
              label: workflowIdCopied ? 'Copied' : 'Copy',
              onClick: () => copyWorkflowId(workflowId)
            })
          }}
          helperText={helper('Read-only')}
          {...stateProps}
        />
      </Case>

      <Case title="Actions · Show + Copy" where="Secret with two actions side by side, e.g. an API token">
        <TextField
          size={size}
          label="API token"
          type={showToken ? 'text' : 'password'}
          value={token}
          onChange={(event) => setToken(event.target.value)}
          InputProps={{
            endAdornment: endActions(
              {
                icon: showToken ? SymbolVisibility : SymbolVisibilityOff,
                label: showToken ? 'Hide token' : 'Show token',
                onClick: () => setShowToken(!showToken)
              },
              {
                icon: tokenCopied ? SymbolCheck : SymbolContentCopy,
                label: tokenCopied ? 'Copied' : 'Copy',
                onClick: () => copyToken(token)
              }
            )
          }}
          helperText={helper('Keep it secret')}
          {...stateProps}
        />
      </Case>

      <Case title="Multiline" where="Workflow settings, Task → Description">
        <TextField
          size={size}
          label="Description"
          multiline={true}
          minRows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          helperText={helper('Shown to operators')}
          {...stateProps}
        />
      </Case>
    </Grid>
  );
};

export const SelectCases = ({ size, state, showHelperText }) => {
  const { stateProps, helper } = useCaseProps(state, showHelperText);
  const [customer, setCustomer] = React.useState(CUSTOMERS[0]);
  const [perPage, setPerPage] = React.useState(PER_PAGE[0]);

  return (
    <Grid>
      <Case title="Basic select" where="New workflow dialog → Customer">
        <TextField
          select={true}
          size={size}
          label="Customer"
          value={customer}
          onChange={(event) => setCustomer(event.target.value)}
          helperText={helper('Owner of the workflow')}
          {...stateProps}
        >
          {CUSTOMERS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Case>

      <Case title="Without label" where="Table pagination → Per page (standard variant, no label)">
        <FormControl size={size} {...stateProps}>
          <Select
            variant="standard"
            value={perPage}
            onChange={(event) => setPerPage(event.target.value)}
            inputProps={{ 'aria-label': 'Per page' }}
          >
            {PER_PAGE.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Case>
    </Grid>
  );
};

export const AutocompleteCases = ({ size, state, showHelperText }) => {
  const { stateProps, helper } = useCaseProps(state, showHelperText);
  const [user, setUser] = React.useState(USERS[0]);

  return (
    <Grid>
      <Case title="Combo box" where="File library → Access dialog → User">
        <Autocomplete
          size={size}
          options={USERS}
          value={user}
          onChange={(event, value) => setUser(value)}
          disabled={stateProps.disabled}
          renderInput={autocompleteInput(stateProps, {
            label: 'User',
            placeholder: 'Select a user',
            helperText: helper('Start typing a name')
          })}
        />
      </Case>
    </Grid>
  );
};

export const MultipleSelectCases = ({ size, state, showHelperText }) => {
  const { stateProps, helper } = useCaseProps(state, showHelperText);
  const [selectUnits, setSelectUnits] = React.useState(UNITS.slice(0, 2));
  const [autocompleteUnits, setAutocompleteUnits] = React.useState(UNITS.slice(0, 2));

  return (
    <Grid>
      {/* MUI's Select "Chip" demo: a closed list you open and pick from, values as chips. */}
      <Case title="Select · Chip" where="Not used in admin yet (MUI Select, multiple)">
        <TextField
          select={true}
          size={size}
          label="Units"
          value={selectUnits}
          onChange={(event) => setSelectUnits(event.target.value)}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )
          }}
          helperText={helper('One or more units')}
          {...stateProps}
        >
          {UNITS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Case>

      {/* MUI's Autocomplete "Multiple values" demo: type to filter, values as chips. */}
      <Case title="Autocomplete · Multiple values" where="Unit → Units">
        <Autocomplete
          multiple={true}
          size={size}
          options={UNITS}
          value={autocompleteUnits}
          onChange={(event, value) => setAutocompleteUnits(value)}
          disabled={stateProps.disabled}
          renderInput={autocompleteInput(stateProps, {
            label: 'Units',
            helperText: helper('One or more units')
          })}
        />
      </Case>
    </Grid>
  );
};
