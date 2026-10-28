import React from 'react';
import { Typography, Divider, Tabs, Tab, SvgIcon } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';
import { BUTTON_SIZES } from '../../shared/constants';
import { ICON_LIBRARY_SAMPLES, ICON_LIBRARY_COLORS } from './constants';
import { getIconLibraryTokenItems } from './tokenItems';

const IconLibraryPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();
  const [iconLibrarySize, setIconLibrarySize] = React.useState('medium');
  const [iconLibraryColor, setIconLibraryColor] = React.useState('inherit');

  return (
    <StyleGuideChrome activeId="icon-library">
      <Section
        id="icon-library"
        title="Icon library"
        propertiesHeading={`Theme tokens for ${iconLibraryColor} color, ${iconLibrarySize} size`}
        properties={showProperties ? <PropertiesCardGroup onNavigate={navigateToSection} items={getIconLibraryTokenItems(iconLibraryColor, iconLibrarySize, previewTheme)} /> : null}
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
    </StyleGuideChrome>
  );
};

const IconLibraryPage = () => (
  <StyleGuideStateProvider>
    <IconLibraryPageContent />
  </StyleGuideStateProvider>
);

export default IconLibraryPage;
