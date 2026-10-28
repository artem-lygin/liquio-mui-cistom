import React from 'react';
import { Typography, Divider } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import ColorTokenTable from '../../components/ColorTokenTable';
import ComponentColorTable from './ComponentColorTable';
import { resolvePath } from '../../shared/utils';
import { PALETTE_GROUPS, GREY_KEYS } from './constants';
import { getCustomColorRows } from './tokenItems';

const ColorsPageContent = () => {
  const { previewTheme, editMode, updateDraft } = useStyleGuideState();

  return (
    <StyleGuideChrome activeId="colors">
      <Section id="colors" title="Colors">
        <Typography variant="subtitle1" gutterBottom={true}>
          Palette
        </Typography>
        <Typography variant="caption" color="textSecondary" component="div" style={{ marginBottom: 8 }}>
          The raw color/tint layer — theme.palette. Every UI component is meant to resolve
          its color through one of these tokens, live, rather than a hardcoded literal —
          see each component's own Color card (in its Buttons/Inputs/Tabs section below)
          for where that's actually true today.
        </Typography>
        <ColorTokenTable
          rows={PALETTE_GROUPS.flatMap(([colorName, ...shades]) =>
            shades.map((shade) => ({
              token: `palette.${colorName}.${shade}`,
              color: resolvePath(previewTheme.palette, [colorName, shade]),
              editMode,
              editable: true,
              onChange: (value) => updateDraft(['palette', colorName, shade], value)
            }))
          )}
        />

        <Divider style={{ margin: '16px 0' }} />

        <Typography variant="subtitle2" gutterBottom={true}>
          Grey scale
        </Typography>
        <ColorTokenTable
          rows={GREY_KEYS.map((key) => ({
            token: `palette.grey.${key}`,
            color: previewTheme.palette.grey?.[key],
            editMode,
            editable: true,
            onChange: (value) => updateDraft(['palette', 'grey', String(key)], value)
          }))}
        />

        <Divider style={{ margin: '32px 0 16px' }} />

        <Typography variant="subtitle1" gutterBottom={true}>
          Custom tokens
        </Typography>
        <Typography variant="caption" color="textSecondary" component="div" style={{ marginBottom: 8 }}>
          Bespoke top-level theme tokens outside theme.palette entirely (leftSidebarBg,
          buttonBg, ...) — kept here rather than in a component's properties since none of
          these belong to any one interactive component. This list is a union across every
          app this guide can run under, filtered to whichever keys actually resolve to a
          string in the theme currently active. Several others use rgba()/gradient values
          not shown here.
        </Typography>
        <ComponentColorTable rows={getCustomColorRows(previewTheme)} />
      </Section>
    </StyleGuideChrome>
  );
};

const ColorsPage = () => (
  <StyleGuideStateProvider>
    <ColorsPageContent />
  </StyleGuideStateProvider>
);

export default ColorsPage;
