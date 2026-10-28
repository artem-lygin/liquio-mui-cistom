import React from 'react';
import { Chip } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';
import { getChipTokenItems } from './tokenItems';

const ChipsPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();

  return (
    <StyleGuideChrome activeId="chips">
      <Section
        id="chips"
        title="Chips"
        properties={
          showProperties ? (
            <PropertiesCardGroup onNavigate={navigateToSection} items={getChipTokenItems(previewTheme)} />
          ) : null
        }
      >
        <MeasureOverlay enabled={measureEnabled}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Chip label="Default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Error" color="error" />
            <Chip label="Deletable" onDelete={() => {}} />
            <Chip label="Outlined" variant="outlined" />
          </div>
        </MeasureOverlay>
      </Section>
    </StyleGuideChrome>
  );
};

const ChipsPage = () => (
  <StyleGuideStateProvider>
    <ChipsPageContent />
  </StyleGuideStateProvider>
);

export default ChipsPage;
