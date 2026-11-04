import React from 'react';
import {
  Typography,
  Divider,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Tabs,
  Tab
} from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import SubNav from '../../components/SubNav';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';
import { useSectionScrollspy } from '../../shared/useSectionScrollspy';
import { TextFieldCases, SelectCases, AutocompleteCases, MultipleSelectCases } from './TextFieldGallery';
import { INPUT_STATES } from './constants';
import { BUTTON_SIZES } from '../../shared/constants';
import {
  getTextFieldTokenItems,
  getAutocompleteTokenItems,
  getSelectTokenItems,
  getCheckboxTokenItems,
  getRadioTokenItems,
  getSwitchTokenItems
} from './tokenItems';

// Inputs splits into one anchor-able Section per data-entry component — same pattern as
// Typography's per-variant split — each with its own independent properties panel instead
// of one shared panel describing all of them at once. The field sections follow MUI's own
// docs: Text Field, Select, Autocomplete (whose basic demo MUI calls "Combo box"), and
// Multiple select (Select's "Chip" demo and Autocomplete's "Multiple values" side by side).
const INPUTS_SUB_SECTIONS = [
  { id: 'inputs-text-field', label: 'Text field' },
  { id: 'inputs-select', label: 'Select' },
  { id: 'inputs-autocomplete', label: 'Autocomplete' },
  { id: 'inputs-multiple-select', label: 'Multiple select' },
  { id: 'inputs-checkboxes', label: 'Checkboxes' },
  { id: 'inputs-radio-buttons', label: 'Radio buttons' },
  { id: 'inputs-switches', label: 'Switches' }
];

const SCROLLSPY_IDS = ['inputs', ...INPUTS_SUB_SECTIONS.map((section) => section.id)];

const TAB_STYLE = { minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' };

// Size, state and helper text for every field section. Repeated at the top of each section
// so it's always in reach, but all copies drive the same page state: switching one switches
// every field on the page. Rendered as the Section's `controls`, so it sits in the card's
// top bar above a full-width divider.
const FieldControls = ({ size, onSizeChange, state, onStateChange, showHelperText, onShowHelperTextChange }) => (
  <>
    <Tabs value={size} onChange={(event, value) => onSizeChange(value)} style={{ minHeight: 32 }}>
      {BUTTON_SIZES.map((item) => (
        <Tab key={item.key} value={item.key} label={item.label} style={TAB_STYLE} />
      ))}
    </Tabs>
    <Divider orientation="vertical" flexItem={true} style={{ marginBottom: 8 }} />
    <Tabs value={state} onChange={(event, value) => onStateChange(value)} variant="scrollable" style={{ minHeight: 32 }}>
      {INPUT_STATES.map((item) => (
        <Tab key={item.key} value={item.key} label={item.label} style={TAB_STYLE} />
      ))}
    </Tabs>
    <FormControlLabel
      style={{ marginLeft: 'auto', marginBottom: 8 }}
      control={<Switch size="small" checked={showHelperText} onChange={(event) => onShowHelperTextChange(event.target.checked)} />}
      label="Helper text"
    />
  </>
);

const InputsPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();
  const [fieldState, setFieldState] = React.useState('resting');
  const [fieldSize, setFieldSize] = React.useState('medium');
  const [showHelperText, setShowHelperText] = React.useState(true);
  const activeSubId = useSectionScrollspy(SCROLLSPY_IDS);

  const galleryProps = { size: fieldSize, state: fieldState, showHelperText };
  const fieldControls = (
    <FieldControls
      size={fieldSize}
      onSizeChange={setFieldSize}
      state={fieldState}
      onStateChange={setFieldState}
      showHelperText={showHelperText}
      onShowHelperTextChange={setShowHelperText}
    />
  );

  return (
    <StyleGuideChrome
      activeId="inputs"
      subNav={
        <SubNav
          heading="Inputs"
          items={INPUTS_SUB_SECTIONS}
          activeSubId={activeSubId}
          onSelect={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      }
    >
      <div id="inputs" style={{ marginBottom: 8, scrollMarginTop: 24 }}>
        <Typography variant="h2" gutterBottom={true}>
          Inputs
        </Typography>
        <Divider style={{ marginBottom: 16 }} />
      </div>

      <Section
        id="inputs-text-field"
        title="Text field"
        titleVariant="h3"
        controls={fieldControls}
        description="Admin's theme renders every outlined and standard input this way (TextField, Select, Autocomplete, date pickers, schema forms). Built from Button / Primary's tokens: same per-size height and corner radius as a button, elevation-0 fill, primary.main on focus. The label sits above the field and never moves. Below: the free-text inputs the admin panel uses, as plain MUI components."
        properties={
          showProperties ? (
            <PropertiesCardGroup
              onNavigate={navigateToSection}
              items={getTextFieldTokenItems(fieldState, fieldSize, previewTheme)}
            />
          ) : null
        }
      >
        <MeasureOverlay enabled={measureEnabled}>
          <TextFieldCases {...galleryProps} />
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-select"
        title="Select"
        titleVariant="h3"
        controls={fieldControls}
        description="Pick one value from a short, known list. The field is closed: it opens a menu, and you can't type into it. For long or searchable lists, use Autocomplete."
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getSelectTokenItems(previewTheme)} /> : null}
      >
        <MeasureOverlay enabled={measureEnabled}>
          <SelectCases {...galleryProps} />
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-autocomplete"
        title="Autocomplete"
        titleVariant="h3"
        controls={fieldControls}
        description="A text input with a list: typing filters the options, and you pick one. MUI calls this basic form a combo box. Use it for long or searchable lists such as users or units."
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getAutocompleteTokenItems(previewTheme)} /> : null}
      >
        <MeasureOverlay enabled={measureEnabled}>
          <AutocompleteCases {...galleryProps} />
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-multiple-select"
        title="Multiple select"
        titleVariant="h3"
        controls={fieldControls}
        description="Several values, shown as chips inside the field. Select multiple for a short list you open and pick from; Autocomplete multiple when the list is long and needs typing to filter."
      >
        <MeasureOverlay enabled={measureEnabled}>
          <MultipleSelectCases {...galleryProps} />
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-checkboxes"
        title="Checkboxes"
        titleVariant="h3"
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getCheckboxTokenItems(previewTheme)} /> : null}
      >
        <MeasureOverlay enabled={measureEnabled}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControlLabel control={<Checkbox defaultChecked={true} />} label="Checkbox" />
            <FormControlLabel control={<Checkbox disabled={true} />} label="Disabled" />
          </div>
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-radio-buttons"
        title="Radio buttons"
        titleVariant="h3"
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getRadioTokenItems(previewTheme)} /> : null}
      >
        <MeasureOverlay enabled={measureEnabled}>
          <RadioGroup row={true} defaultValue="a" style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
            <FormControlLabel value="a" control={<Radio />} label="Radio A" />
            <FormControlLabel value="b" control={<Radio />} label="Radio B" />
            <FormControlLabel value="c" control={<Radio disabled={true} />} label="Disabled" />
          </RadioGroup>
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-switches"
        title="Switches"
        titleVariant="h3"
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getSwitchTokenItems(previewTheme)} /> : null}
      >
        <MeasureOverlay enabled={measureEnabled}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControlLabel control={<Switch defaultChecked={true} />} label="Switch" />
            <FormControlLabel control={<Switch disabled={true} />} label="Disabled" />
          </div>
        </MeasureOverlay>
      </Section>
    </StyleGuideChrome>
  );
};

const InputsPage = () => (
  <StyleGuideStateProvider>
    <InputsPageContent />
  </StyleGuideStateProvider>
);

export default InputsPage;
