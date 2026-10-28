import React from 'react';
import { Typography, Paper, Card, CardContent, Divider } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';

const SurfacesPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();

  return (
    <StyleGuideChrome activeId="surfaces">
      <Section
        id="surfaces"
        title="Surfaces"
        properties={
          showProperties ? (
            <PropertiesCardGroup
              onNavigate={navigateToSection}
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
    </StyleGuideChrome>
  );
};

const SurfacesPage = () => (
  <StyleGuideStateProvider>
    <SurfacesPageContent />
  </StyleGuideStateProvider>
);

export default SurfacesPage;
