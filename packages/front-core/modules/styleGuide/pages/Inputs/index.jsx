import React from 'react';
import {
  Typography,
  Divider,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
import TopLabelGallery from './TopLabelGallery';
import { INPUT_STATES } from './constants';
import { BUTTON_SIZES } from '../../shared/constants';
import {
  getTopLabelInputTokenItems,
  getAutocompleteTokenItems,
  getComboBoxTokenItems,
  getCheckboxTokenItems,
  getRadioTokenItems,
  getSwitchTokenItems
} from './tokenItems';

// Inputs splits into one anchor-able Section per data-entry component — same pattern as
// Typography's per-variant split — each with its own independent properties panel instead
// of one shared panel describing all six at once.
const INPUTS_SUB_SECTIONS = [
  { id: 'inputs-text-field', label: 'Text field' },
  { id: 'inputs-autocomplete', label: 'Autocomplete' },
  { id: 'inputs-combo-box', label: 'Combo box' },
  { id: 'inputs-checkboxes', label: 'Checkboxes' },
  { id: 'inputs-radio-buttons', label: 'Radio buttons' },
  { id: 'inputs-switches', label: 'Switches' }
];

const SCROLLSPY_IDS = ['inputs', ...INPUTS_SUB_SECTIONS.map((section) => section.id)];

const InputsPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();
  const [topLabelState, setTopLabelState] = React.useState('resting');
  const [topLabelSize, setTopLabelSize] = React.useState('medium');
  const [topLabelShowHelperText, setTopLabelShowHelperText] = React.useState(true);
  const activeSubId = useSectionScrollspy(SCROLLSPY_IDS);

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
        description="Built from Button / Primary's tokens: same per-size height and corner radius as a button, elevation-0 fill, primary.main on focus. The label sits above the field and never moves. Below: every kind of text input the admin panel uses, rebuilt on this field."
        properties={
          showProperties ? (
            <>
              <Tabs
                value={topLabelState}
                onChange={(event, value) => setTopLabelState(value)}
                variant="scrollable"
                style={{ minHeight: 36, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}
              >
                {INPUT_STATES.map((state) => (
                  <Tab key={state.key} value={state.key} label={state.label} style={{ minHeight: 36, padding: '6px 16px' }} />
                ))}
              </Tabs>
              <PropertiesCardGroup
                onNavigate={navigateToSection}
                items={getTopLabelInputTokenItems(topLabelState, topLabelSize, previewTheme)}
              />
            </>
          ) : null
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
          <Tabs value={topLabelSize} onChange={(event, value) => setTopLabelSize(value)} style={{ minHeight: 32 }}>
            {BUTTON_SIZES.map((size) => (
              <Tab key={size.key} value={size.key} label={size.label} style={{ minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' }} />
            ))}
          </Tabs>
          <FormControlLabel
            style={{ marginLeft: 'auto', marginBottom: 8 }}
            control={
              <Switch
                size="small"
                checked={topLabelShowHelperText}
                onChange={(event) => setTopLabelShowHelperText(event.target.checked)}
              />
            }
            label="Helper text"
          />
        </div>

        {/* The size tabs above switch the size of every field below; the state tabs in the
            properties panel switch their state. */}
        <MeasureOverlay enabled={measureEnabled}>
          <TopLabelGallery size={topLabelSize} state={topLabelState} showHelperText={topLabelShowHelperText} />
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-autocomplete"
        title="Autocomplete"
        titleVariant="h3"
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getAutocompleteTokenItems(previewTheme)} /> : null}
      >
        <MeasureOverlay enabled={measureEnabled}>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <Autocomplete
              options={['Option one', 'Option two', 'Option three']}
              style={{ minWidth: 240 }}
              renderInput={(params) => <TextField {...params} label="Autocomplete" />}
            />
            <Autocomplete
              disabled={true}
              options={['Option one', 'Option two', 'Option three']}
              style={{ minWidth: 240 }}
              renderInput={(params) => <TextField {...params} label="Disabled" />}
            />
          </div>
        </MeasureOverlay>
      </Section>

      <Section
        id="inputs-combo-box"
        title="Combo box"
        titleVariant="h3"
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getComboBoxTokenItems(previewTheme)} /> : null}
      >
        <MeasureOverlay enabled={measureEnabled}>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <Select defaultValue={1} style={{ minWidth: 160 }}>
              <MenuItem value={1}>Option one</MenuItem>
              <MenuItem value={2}>Option two</MenuItem>
            </Select>
            <FormControl style={{ minWidth: 160 }}>
              <InputLabel id="style-guide-input-combo-label">Combo box</InputLabel>
              <Select labelId="style-guide-input-combo-label" label="Combo box" defaultValue={1}>
                <MenuItem value={1}>Option one</MenuItem>
                <MenuItem value={2}>Option two</MenuItem>
              </Select>
            </FormControl>
          </div>
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
