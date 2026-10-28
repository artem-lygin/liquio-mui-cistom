import React from 'react';
import { Tabs, Tab } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';
import { getTabsTokenItems } from './tokenItems';

const TabsPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();
  const [tab, setTab] = React.useState(0);

  return (
    <StyleGuideChrome activeId="tabs">
      <Section
        id="tabs"
        title="Tabs"
        properties={
          showProperties ? (
            <PropertiesCardGroup onNavigate={navigateToSection} items={getTabsTokenItems(previewTheme)} />
          ) : null
        }
      >
        <MeasureOverlay enabled={measureEnabled}>
          <Tabs value={tab} onChange={(event, value) => setTab(value)}>
            <Tab label="First" />
            <Tab label="Second" />
            <Tab label="Third" />
          </Tabs>
        </MeasureOverlay>
      </Section>
    </StyleGuideChrome>
  );
};

const TabsPage = () => (
  <StyleGuideStateProvider>
    <TabsPageContent />
  </StyleGuideStateProvider>
);

export default TabsPage;
