import React from 'react';
import { Typography, Divider, TextField } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import SubNav from '../../components/SubNav';
import TypographyVariantSection from './TypographyVariantSection';
import { navigateToSection } from '../../shared/navigation';
import { TYPOGRAPHY_VARIANTS, TYPOGRAPHY_LABELS } from './constants';

const TYPOGRAPHY_SUB_SECTIONS = TYPOGRAPHY_VARIANTS.map((variant) => ({
  id: `typography-${variant}`,
  label: TYPOGRAPHY_LABELS[variant] || variant
}));

const TypographyPageContent = () => {
  const { previewTheme, rootFontSize, editMode, showProperties, measureEnabled, updateDraft } = useStyleGuideState();
  const [activeSubId, setActiveSubId] = React.useState(null);

  // Small, page-local scrollspy — just this page's own per-variant sub-items, no cross-page
  // concern (unlike the old single-page guide, which tracked every page's anchors at once).
  React.useEffect(() => {
    const elements = ['typography', ...TYPOGRAPHY_SUB_SECTIONS.map((section) => section.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveSubId(entry.target.id === 'typography' ? null : entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <StyleGuideChrome
      activeId="typography"
      subNav={
        <SubNav
          heading="Typography"
          items={TYPOGRAPHY_SUB_SECTIONS}
          activeSubId={activeSubId}
          onSelect={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      }
    >
      <div id="typography" style={{ marginBottom: 8, scrollMarginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h2" gutterBottom={true}>
            Typography
          </Typography>
          {editMode ? (
            <TextField
              variant="standard"
              label="Root font size (px) — 1rem"
              type="number"
              value={rootFontSize}
              onChange={(event) => updateDraft(['typography', 'htmlFontSize'], Number(event.target.value) || 1)}
              style={{ width: 170 }}
            />
          ) : null}
        </div>
        <Divider style={{ marginBottom: 16 }} />
      </div>
      {TYPOGRAPHY_VARIANTS.map((variant) => (
        <TypographyVariantSection
          key={variant}
          variant={variant}
          previewTheme={previewTheme}
          rootFontSize={rootFontSize}
          editMode={editMode}
          showProperties={showProperties}
          measureEnabled={measureEnabled}
          onChange={(v, key, value) => updateDraft(['typography', v, key], value)}
          onNavigate={navigateToSection}
        />
      ))}
    </StyleGuideChrome>
  );
};

const TypographyPage = () => (
  <StyleGuideStateProvider>
    <TypographyPageContent />
  </StyleGuideStateProvider>
);

export default TypographyPage;
