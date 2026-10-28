import React from 'react';
import { Typography, Paper, Card, CardContent, Divider, TextField } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import SubNav from '../../components/SubNav';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';
import { useSectionScrollspy } from '../../shared/useSectionScrollspy';

const SURFACES_SUB_SECTIONS = [
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'shape', label: 'Shape' }
];

const SCROLLSPY_IDS = SURFACES_SUB_SECTIONS.map((section) => section.id);

const SPACING_MULTIPLIERS = [0, 1, 2, 3, 4, 5, 6, 8, 10];

// Spacing and Shape used to be their own pages, so any cross-page reference to them (a
// properties-table anchor, an inline description link) still works via the redirect routes
// in index.jsx — but a reference to one of *this* page's own three sections should just
// scroll, not round-trip through a route push + redirect back to the same page.
const LOCAL_SECTION_IDS = new Set(SURFACES_SUB_SECTIONS.map((section) => section.id));
const navigate = (id) => {
  if (LOCAL_SECTION_IDS.has(id)) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    navigateToSection(id);
  }
};

const SurfacesPageContent = () => {
  const { previewTheme, editMode, showProperties, measureEnabled, updateDraft } = useStyleGuideState();
  const activeSubId = useSectionScrollspy(SCROLLSPY_IDS);

  return (
    <StyleGuideChrome
      activeId="surfaces"
      subNav={
        <SubNav
          heading="Surfaces"
          items={SURFACES_SUB_SECTIONS}
          activeSubId={activeSubId}
          onSelect={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      }
    >
      <Section
        id="surfaces"
        title="Surfaces"
        properties={
          showProperties ? (
            <PropertiesCardGroup
              onNavigate={navigate}
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
                navigateToSection('buttons');
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
    </StyleGuideChrome>
  );
};

const SurfacesPage = () => (
  <StyleGuideStateProvider>
    <SurfacesPageContent />
  </StyleGuideStateProvider>
);

export default SurfacesPage;
