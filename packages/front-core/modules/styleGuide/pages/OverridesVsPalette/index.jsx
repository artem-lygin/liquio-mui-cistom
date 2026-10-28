import React from 'react';
import { Typography } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import { getResolvedMuiStyleOverride, readBackground, readPseudoSlot } from '../../shared/themeIntrospection';
import { navigateToSection } from '../../shared/navigation';

const OverridesVsPalettePageContent = () => {
  const { previewTheme } = useStyleGuideState();

  // admin-front and front-core (→ cabinet-front) each author containedPrimary
  // completely independently — different hex, and only admin adds the &:hover/
  // &:disabled sub-overrides at all (front-core's disabled styling instead comes
  // from a separate MuiButtonBase.root override — see Buttons above). Read live
  // rather than asserting one app's shape as if it were universal.
  const containedPrimary = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', 'containedPrimary') || {};
  const bg = readBackground(containedPrimary);
  const bgKey = containedPrimary.background !== undefined ? 'background' : 'backgroundColor';
  const paletteMain = previewTheme.palette.primary.main;
  const hoverBg = readBackground(readPseudoSlot(containedPrimary, '&:hover', ':hover'));
  const hasDisabled = !!readPseudoSlot(containedPrimary, '&:disabled', '&.Mui-disabled');
  const marginRight = containedPrimary.marginRight;

  return (
    <StyleGuideChrome activeId="overrides-vs-palette">
      <Section id="overrides-vs-palette" title="Overrides vs. palette">
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
          <span style={{ fontFamily: 'monospace' }}>theme.js</span> has an{' '}
          <span style={{ fontFamily: 'monospace' }}>overrides</span> block (the older MUI v4-style
          API — MUI v5&apos;s <span style={{ fontFamily: 'monospace' }}>createTheme()</span> still
          honors it for backward compatibility). It&apos;s a second, competing source of truth for
          how a component looks, alongside the palette.
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
          <strong>How a component normally gets its color:</strong> a component&apos;s own MUI
          source (e.g. <span style={{ fontFamily: 'monospace' }}>Button.js</span>) reads{' '}
          <span style={{ fontFamily: 'monospace' }}>theme.palette.primary.main</span>,{' '}
          <span style={{ fontFamily: 'monospace' }}>.dark</span>,{' '}
          <span style={{ fontFamily: 'monospace' }}>.contrastText</span>, etc. and computes CSS
          from them. Change the palette, and every component using that color updates
          automatically — this is what this guide badges &quot;Theme&quot; (green).
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
          <strong>What <span style={{ fontFamily: 'monospace' }}>overrides.MuiButton</span> does:</strong>{' '}
          it lets you write raw CSS keyed by MUI&apos;s own internal class names for that
          component, and those rules get merged into the generated stylesheet with enough
          specificity to win over whatever the palette-driven calculation would have produced —
          for that exact combination only. The keys map directly to real class names MUI
          attaches to the DOM:
        </Typography>
        <ul style={{ margin: '0 0 16px', paddingLeft: 20, maxWidth: 540 }}>
          <li>
            <Typography variant="body2" color="textSecondary">
              <span style={{ fontFamily: 'monospace' }}>containedPrimary</span> — only{' '}
              <span style={{ fontFamily: 'monospace' }}>variant=&quot;contained&quot; color=&quot;primary&quot;</span>{' '}
              (i.e. <span style={{ fontFamily: 'monospace' }}>.MuiButton-containedPrimary</span>)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="textSecondary">
              <span style={{ fontFamily: 'monospace' }}>outlinedPrimary</span> — only{' '}
              <span style={{ fontFamily: 'monospace' }}>variant=&quot;outlined&quot; color=&quot;primary&quot;</span>
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="textSecondary">
              <span style={{ fontFamily: 'monospace' }}>textPrimary</span> /{' '}
              <span style={{ fontFamily: 'monospace' }}>textSecondary</span> — the text variant,
              split by color
            </Typography>
          </li>
        </ul>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16, maxWidth: 540 }}>
          Nothing under <span style={{ fontFamily: 'monospace' }}>containedPrimary</span> touches{' '}
          <span style={{ fontFamily: 'monospace' }}>containedSecondary</span> at all — they&apos;re
          two independent objects, so a fact defined on one never silently reaches the other.{' '}
          {marginRight !== undefined ? (
            <>
              That&apos;s exactly why, in this app, the{' '}
              <a
                href="#buttons"
                onClick={(event) => {
                  event.preventDefault();
                  navigateToSection('buttons');
                }}
                style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Buttons
              </a>{' '}
              section&apos;s Spacing tab shows a{' '}
              <span style={{ fontFamily: 'monospace' }}>marginRight: {marginRight}</span> quirk
              that only exists for primary — someone added it under{' '}
              <span style={{ fontFamily: 'monospace' }}>containedPrimary</span> alone, so
              switching to secondary silently drops it.
            </>
          ) : (
            <>
              In this app, <span style={{ fontFamily: 'monospace' }}>containedPrimary</span>{' '}
              doesn&apos;t currently define that kind of asymmetric spacing quirk — but the same
              class of silent-drift bug is possible any time one color&apos;s block gets a
              one-off tweak the other&apos;s doesn&apos;t.
            </>
          )}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ maxWidth: 540 }}>
          Concretely, in this app <span style={{ fontFamily: 'monospace' }}>containedPrimary</span>{' '}
          hardcodes <span style={{ fontFamily: 'monospace' }}>{bgKey}: &apos;{bg}&apos;</span>{' '}
          (a literal, not a <span style={{ fontFamily: 'monospace' }}>palette.primary.main</span>{' '}
          reference —{' '}
          {bg === paletteMain
            ? 'currently a coincidental duplicate of it'
            : `which currently differs from palette.primary.main (${paletteMain})`}
          ),{' '}
          {hoverBg !== undefined ? (
            hoverBg === bg ? (
              <>
                forces the <span style={{ fontFamily: 'monospace' }}>&amp;:hover</span> background
                to stay that same color (overriding MUI&apos;s normal &quot;darken on hover via{' '}
                <span style={{ fontFamily: 'monospace' }}>palette.primary.dark</span>&quot;
                behavior),
              </>
            ) : (
              <>
                overrides <span style={{ fontFamily: 'monospace' }}>&amp;:hover</span> to{' '}
                {hoverBg},
              </>
            )
          ) : (
            <>
              leaves <span style={{ fontFamily: 'monospace' }}>&amp;:hover</span> unset here (so
              it falls through to MUI&apos;s normal &quot;darken via{' '}
              <span style={{ fontFamily: 'monospace' }}>palette.primary.dark</span>&quot;
              behavior),
            </>
          )}{' '}
          and{' '}
          {hasDisabled ? (
            <>
              defines its own <span style={{ fontFamily: 'monospace' }}>&amp;:disabled</span>{' '}
              styling instead of falling through to{' '}
              <span style={{ fontFamily: 'monospace' }}>palette.action.disabled</span>.
            </>
          ) : (
            <>
              leaves <span style={{ fontFamily: 'monospace' }}>&amp;:disabled</span> unset here —
              disabled styling instead comes from a separate{' '}
              <span style={{ fontFamily: 'monospace' }}>MuiButtonBase.root</span> override applied
              to every disabled button in this app, any color (see Buttons above).
            </>
          )}{' '}
          So think of palette as the default rulebook every component consults, and{' '}
          <span style={{ fontFamily: 'monospace' }}>overrides</span> as a per-component,
          per-class-name patch sheet that can silently replace pieces of that rulebook — and
          because it&apos;s keyed to literal values rather than palette references, it can drift
          out of sync with the palette without anyone noticing. That&apos;s exactly the class of
          thing the &quot;Overridden&quot; badges throughout this guide are meant to surface.
        </Typography>
      </Section>
    </StyleGuideChrome>
  );
};

const OverridesVsPalettePage = () => (
  <StyleGuideStateProvider>
    <OverridesVsPalettePageContent />
  </StyleGuideStateProvider>
);

export default OverridesVsPalettePage;
