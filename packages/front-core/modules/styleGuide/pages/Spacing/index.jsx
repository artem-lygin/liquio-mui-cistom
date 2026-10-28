import React from 'react';
import { Typography } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import { navigateToSection } from '../../shared/navigation';

const SPACING_MULTIPLIERS = [0, 1, 2, 3, 4, 5, 6, 8, 10];

const SpacingPageContent = () => {
  const { previewTheme } = useStyleGuideState();

  return (
    <StyleGuideChrome activeId="spacing">
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
    </StyleGuideChrome>
  );
};

const SpacingPage = () => (
  <StyleGuideStateProvider>
    <SpacingPageContent />
  </StyleGuideStateProvider>
);

export default SpacingPage;
