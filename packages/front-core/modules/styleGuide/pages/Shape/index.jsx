import React from 'react';
import { Typography, TextField } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';

const ShapePageContent = () => {
  const { previewTheme, editMode, updateDraft } = useStyleGuideState();

  return (
    <StyleGuideChrome activeId="shape">
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

const ShapePage = () => (
  <StyleGuideStateProvider>
    <ShapePageContent />
  </StyleGuideStateProvider>
);

export default ShapePage;
