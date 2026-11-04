import React from 'react';
import { Divider, Button, IconButton, SvgIcon, Tabs, Tab, FormControlLabel, Switch, Tooltip } from '@mui/material';
import {
  DeleteFill as SymbolDelete,
  RefreshFill as SymbolRefresh,
  FullscreenFill as SymbolFullscreen,
  MoreHorizFill as SymbolMoreHoriz,
  ArrowForwardFill as SymbolArrowForward,
  AccountCircleFill as SymbolAccountCircle
} from '@material-symbols-svg/react/rounded/w400';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import PageHeading from '../../components/PageHeading';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';
import { BUTTON_SIZES } from '../../shared/constants';
import { BUTTON_STATES, ICON_BUTTON_USAGE_NOTES } from './constants';
import { getButtonTokenItems, getIconButtonTokenItems } from './tokenItems';

// Icon buttons the admin panel really uses (the list-page toolbar's Reload and Toggle
// fullscreen, row Delete), drawn with the Material Symbols set instead of the
// @mui/icons-material icons they use today, plus the "more" button that opens a context menu.
const ICON_BUTTON_EXAMPLES = [
  { key: 'reload', icon: SymbolRefresh, label: 'Reload' },
  { key: 'fullscreen', icon: SymbolFullscreen, label: 'Toggle fullscreen' },
  { key: 'delete', icon: SymbolDelete, label: 'Delete' },
  { key: 'more', icon: SymbolMoreHoriz, label: 'More actions' }
];

const TAB_STYLE = { minHeight: 32, minWidth: 'auto', padding: '4px 12px 8px' };

// Buttons and Icon Buttons share one card and one set of tabs: color, size and state drive
// both. The icon button sits at the right end of the row, and clicking any button (the icon
// one included) picks which one the tokens table below describes.
const ButtonsPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();
  const [buttonVariant, setButtonVariant] = React.useState('contained');
  const [buttonColor, setButtonColor] = React.useState('primary');
  const [buttonSize, setButtonSize] = React.useState('medium');
  const [buttonShowIcon, setButtonShowIcon] = React.useState(true);
  const [buttonShowEndIcon, setButtonShowEndIcon] = React.useState(true);
  const [buttonState, setButtonState] = React.useState('resting');
  const isIconButton = buttonVariant === 'icon';

  return (
    <StyleGuideChrome activeId="buttons">
      <PageHeading title="Buttons" />
      <Section
        id="buttons"
        title="Button & Icon Button"
        controls={
          <>
            <Tabs value={buttonColor} onChange={(event, value) => setButtonColor(value)} style={{ minHeight: 32 }}>
              <Tab value="primary" label="Primary" style={TAB_STYLE} />
              <Tab value="secondary" label="Secondary" style={TAB_STYLE} />
            </Tabs>
            <Divider orientation="vertical" flexItem={true} style={{ marginBottom: 8 }} />
            <Tabs value={buttonSize} onChange={(event, value) => setButtonSize(value)} style={{ minHeight: 32 }}>
              {BUTTON_SIZES.map((size) => (
                <Tab key={size.key} value={size.key} label={size.label} style={TAB_STYLE} />
              ))}
            </Tabs>
            <FormControlLabel
              style={{ marginLeft: 'auto', marginBottom: 8 }}
              control={<Switch size="small" checked={buttonShowIcon} onChange={(event) => setButtonShowIcon(event.target.checked)} />}
              label="startIcon"
            />
            <FormControlLabel
              style={{ marginBottom: 8 }}
              control={<Switch size="small" checked={buttonShowEndIcon} onChange={(event) => setButtonShowEndIcon(event.target.checked)} />}
              label="endIcon"
            />
          </>
        }
        propertiesHeading={`Theme tokens for ${isIconButton ? `${buttonSize} icon` : buttonVariant} button`}
        propertiesControls={
          <Tabs value={buttonState} onChange={(event, value) => setButtonState(value)} variant="scrollable" style={{ minHeight: 36 }}>
            {BUTTON_STATES.map((state) => (
              <Tab
                key={state.key}
                value={state.key}
                label={state.label}
                style={{ minHeight: 36, minWidth: 'auto', padding: '6px 16px 10px' }}
              />
            ))}
          </Tabs>
        }
        properties={
          showProperties ? (
            <PropertiesCardGroup
              onNavigate={navigateToSection}
              items={
                isIconButton
                  ? getIconButtonTokenItems(buttonSize, buttonState, previewTheme)
                  : getButtonTokenItems(buttonVariant, buttonColor, buttonSize, buttonState, previewTheme, buttonShowIcon, buttonShowEndIcon)
              }
            />
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
            . Icon button, {buttonSize}: {ICON_BUTTON_USAGE_NOTES[buttonSize]}
          </>
        }
      >
        <MeasureOverlay enabled={measureEnabled}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            {['contained', 'outlined', 'text'].map((variant) => (
              <Button
                key={variant}
                variant={variant}
                color={buttonColor}
                size={buttonSize}
                disabled={buttonState === 'disabled'}
                onClick={() => setButtonVariant(variant)}
                startIcon={buttonShowIcon ? <SvgIcon component={SymbolAccountCircle} inheritViewBox={true} /> : undefined}
                endIcon={buttonShowEndIcon ? <SvgIcon component={SymbolArrowForward} inheritViewBox={true} /> : undefined}
              >
                {variant[0].toUpperCase() + variant.slice(1)}
              </Button>
            ))}
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              {ICON_BUTTON_EXAMPLES.map((example) => (
                <Tooltip key={example.key} title={example.label}>
                  {/* A disabled button fires no mouse events, so the tooltip listens on this span. */}
                  <span>
                    <IconButton
                      aria-label={example.label}
                      color={buttonColor}
                      size={buttonSize}
                      disabled={buttonState === 'disabled'}
                      onClick={() => setButtonVariant('icon')}
                    >
                      {/* SvgIcon defaults to a fixed 24px regardless of the parent's size — inherit ties it to the button's own fontSize instead. */}
                      <SvgIcon component={example.icon} inheritViewBox={true} fontSize="inherit" />
                    </IconButton>
                  </span>
                </Tooltip>
              ))}
            </div>
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
