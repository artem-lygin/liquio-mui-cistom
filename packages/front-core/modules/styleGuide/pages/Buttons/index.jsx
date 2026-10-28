import React from 'react';
import { Typography, Divider, Button, IconButton, SvgIcon, Tabs, Tab, FormControlLabel, Switch } from '@mui/material';
import { DeleteFill as SymbolDelete, ArrowForwardFill as SymbolArrowForward } from '@material-symbols-svg/react/rounded/w400';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import SubNav from '../../components/SubNav';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';
import { BUTTON_SIZES } from '../../shared/constants';
import { BUTTON_STATES, ICON_BUTTON_USAGE_NOTES } from './constants';
import { getButtonHeightPx } from './metrics';
import { getButtonTokenItems, getIconButtonTokenItems } from './tokenItems';

// Icon Buttons lives inside the Buttons page (one card, switched by its own size/state
// tabs) rather than as its own top-level page — this is its one sub-nav entry.
const BUTTONS_SUB_SECTIONS = [{ id: 'buttons-icon-buttons', label: 'Icon Buttons' }];

const ButtonsPageContent = () => {
  const { previewTheme, rootFontSize, showProperties, measureEnabled } = useStyleGuideState();
  const [buttonVariant, setButtonVariant] = React.useState('contained');
  const [buttonColor, setButtonColor] = React.useState('primary');
  const [buttonSize, setButtonSize] = React.useState('medium');
  const [buttonShowIcon, setButtonShowIcon] = React.useState(true);
  const [buttonShowEndIcon, setButtonShowEndIcon] = React.useState(true);
  const [buttonState, setButtonState] = React.useState('resting');
  const [iconButtonSize, setIconButtonSize] = React.useState('medium');
  const [iconButtonState, setIconButtonState] = React.useState('resting');
  const [activeSubId, setActiveSubId] = React.useState(null);

  // Small, page-local scrollspy — just this page's own one sub-item, no cross-page concern.
  React.useEffect(() => {
    const elements = ['buttons', ...BUTTONS_SUB_SECTIONS.map((section) => section.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveSubId(entry.target.id === 'buttons' ? null : entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <StyleGuideChrome
      activeId="buttons"
      subNav={
        <SubNav
          heading="Buttons"
          items={BUTTONS_SUB_SECTIONS}
          activeSubId={activeSubId}
          onSelect={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      }
    >
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
              <PropertiesCardGroup
                onNavigate={navigateToSection}
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
                navigateToSection('status');
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
              <PropertiesCardGroup onNavigate={navigateToSection} items={getIconButtonTokenItems(iconButtonSize, iconButtonState, previewTheme)} />
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
    </StyleGuideChrome>
  );
};

const ButtonsPage = () => (
  <StyleGuideStateProvider>
    <ButtonsPageContent />
  </StyleGuideStateProvider>
);

export default ButtonsPage;
