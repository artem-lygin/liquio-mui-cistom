import React from 'react';
import { Typography, Button, Autocomplete, Select, MenuItem, InputAdornment, IconButton, SvgIcon } from '@mui/material';
import {
  SearchFill as SymbolSearch,
  VisibilityFill as SymbolVisibility,
  VisibilityOffFill as SymbolVisibilityOff,
  CalendarMonthFill as SymbolCalendarMonth
} from '@material-symbols-svg/react/rounded/w400';
import TopLabelTextField, { TopLabelField, TopLabelInput } from './TopLabelTextField';

// Every kind of text input the admin panel actually uses, rebuilt on the top-label field so
// they can be judged side by side at one size and one state. "Where" names a real place in
// admin that uses that kind of input today (found by searching the codebase), so each case
// maps back to a screen that would change if this design were adopted.

const USERS = ['Olena Kovalenko', 'Taras Shevchuk', 'Iryna Bondar', 'Andrii Melnyk'];
const UNITS = ['Administrators', 'Registry editors', 'Workflow designers', 'Support'];
const CUSTOMERS = ['Ministry of Justice', 'City Council', 'Regional Administration'];

const Case = ({ title, where, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
    <div>
      <Typography variant="subtitle2" component="div">
        {title}
      </Typography>
      <Typography variant="caption" color="textSecondary" component="div">
        {where}
      </Typography>
    </div>
    {children}
  </div>
);

const TopLabelGallery = ({ size, state, showHelperText }) => {
  const [name, setName] = React.useState('Citizen request');
  const [user, setUser] = React.useState(USERS[0]);
  const [customer, setCustomer] = React.useState(CUSTOMERS[0]);
  const [units, setUnits] = React.useState(UNITS.slice(0, 2));
  const [password, setPassword] = React.useState('correct-horse');
  const [showPassword, setShowPassword] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [description, setDescription] = React.useState('Handles incoming citizen requests\nand routes them to the right unit.');

  // The same state contract as the Text field demo above: focus is only forced when the
  // Focus tab is selected, so in Resting every field is genuinely interactive.
  const stateProps = {
    focused: state === 'focus' ? true : undefined,
    error: state === 'error',
    disabled: state === 'disabled'
  };
  const helper = (text) => (showHelperText ? (state === 'error' ? 'Something went wrong' : text) : undefined);
  const id = (key) => `style-guide-top-label-${key}`;
  const iconButton = (icon, ariaLabel, onClick) => (
    <InputAdornment position="end">
      <IconButton aria-label={ariaLabel} onClick={onClick} disabled={stateProps.disabled}>
        <SvgIcon component={icon} inheritViewBox={true} fontSize="inherit" />
      </IconButton>
    </InputAdornment>
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '32px 28px',
        alignItems: 'start'
      }}
    >
      <Case title="Text field" where="New workflow dialog → Workflow name (shown next to a button of the same size)">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <TopLabelTextField
            id={id('text')}
            size={size}
            label="Workflow name"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            helperText={helper('Up to 255 characters')}
            fullWidth={true}
            {...stateProps}
          />
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            {/* An invisible copy of the field's frame (label only) keeps the button level
                with the field itself, without hardcoding the label's height. */}
            <TopLabelField id={id('text-spacer')} label={' '} style={{ visibility: 'hidden' }} />
            <Button variant="contained" color="primary" size={size} disabled={stateProps.disabled}>
              Create
            </Button>
          </div>
        </div>
      </Case>

      <Case title="Autocomplete" where="File library → Access dialog → User">
        <Autocomplete
          options={USERS}
          value={user}
          onChange={(event, value) => setUser(value)}
          disabled={stateProps.disabled}
          renderInput={(params) => (
            <TopLabelField
              id={params.id}
              label="User"
              helperText={helper('Start typing a name')}
              error={stateProps.error}
              disabled={params.disabled}
              focused={stateProps.focused}
              fullWidth={true}
            >
              <TopLabelInput
                {...params.InputProps}
                inputSize={size}
                inputProps={params.inputProps}
                placeholder="Select a user"
                fullWidth={true}
              />
            </TopLabelField>
          )}
        />
      </Case>

      <Case title="Combo box" where="New workflow dialog → Customer">
        <TopLabelField
          id={id('select')}
          label="Customer"
          helperText={helper('Owner of the workflow')}
          fullWidth={true}
          {...stateProps}
        >
          <Select
            value={customer}
            onChange={(event) => setCustomer(event.target.value)}
            input={<TopLabelInput id={id('select')} inputSize={size} />}
          >
            {CUSTOMERS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </TopLabelField>
      </Case>

      <Case title="Multi-select with chips" where="Unit → Units (Autocomplete with multiple values)">
        <Autocomplete
          multiple={true}
          size="small"
          options={UNITS}
          value={units}
          onChange={(event, value) => setUnits(value)}
          disabled={stateProps.disabled}
          renderInput={(params) => (
            <TopLabelField
              id={params.id}
              label="Units"
              helperText={helper('One or more units')}
              error={stateProps.error}
              disabled={params.disabled}
              focused={stateProps.focused}
              fullWidth={true}
            >
              <TopLabelInput {...params.InputProps} inputSize={size} inputProps={params.inputProps} fullWidth={true} />
            </TopLabelField>
          )}
        />
      </Case>

      <Case title="Password" where="Users → Add user, Set password (show/hide toggle)">
        <TopLabelTextField
          id={id('password')}
          size={size}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          endAdornment={iconButton(
            showPassword ? SymbolVisibility : SymbolVisibilityOff,
            showPassword ? 'Hide password' : 'Show password',
            () => setShowPassword(!showPassword)
          )}
          helperText={helper('At least 8 characters')}
          fullWidth={true}
          {...stateProps}
        />
      </Case>

      <Case title="Search" where="List pages → table search (no label, icon at the start)">
        <TopLabelTextField
          id={id('search')}
          size={size}
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon component={SymbolSearch} inheritViewBox={true} />
            </InputAdornment>
          }
          inputProps={{ 'aria-label': 'Search' }}
          helperText={helper('Name or ID')}
          fullWidth={true}
          {...stateProps}
        />
      </Case>

      <Case title="Date filter" where="Metrics, Statistics → period filters (opens a calendar; trigger appearance only here)">
        <TopLabelTextField
          id={id('date')}
          size={size}
          label="From"
          value="01.11.2026"
          readOnly={true}
          endAdornment={iconButton(SymbolCalendarMonth, 'Open calendar')}
          helperText={helper('DD.MM.YYYY')}
          fullWidth={true}
          {...stateProps}
        />
      </Case>

      <Case title="Multi-line" where="Workflow settings, Task → Description">
        <TopLabelTextField
          id={id('multiline')}
          size={size}
          label="Description"
          multiline={true}
          minRows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          helperText={helper('Shown to operators')}
          fullWidth={true}
          {...stateProps}
        />
      </Case>
    </div>
  );
};

export default TopLabelGallery;
