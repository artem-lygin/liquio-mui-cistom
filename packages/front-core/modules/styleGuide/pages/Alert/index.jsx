import React from 'react';
import { Typography, Divider, Alert, AlertTitle } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { navigateToSection } from '../../shared/navigation';

const ALERT_SEVERITIES = ['error', 'warning', 'info', 'success'];

const ALERT_SAMPLE_TEXT = {
  error: 'Error. Something went wrong and the action could not complete.',
  warning: 'Warning. Double-check this before continuing.',
  info: 'Info. Background context that isn’t urgent.',
  success: 'Success. The action completed as expected.'
};

// Confirmed by grepping every <Alert severity=...> in admin-front, cabinet-front, and
// front-core — not assumed. success has zero hits anywhere in the codebase.
const ALERT_USAGE_NOTES = {
  error: 'confirmed — CabinetMenuDialog, CabinetMenuTranslationsDialog, VideoPlayer, Map (4 usages)',
  warning: 'confirmed — cabinet-front’s ImportantMessages banner',
  info: 'confirmed — same ImportantMessages banner (severity toggles info/warning)',
  success: 'not found — no confirmed severity="success" usage anywhere in the codebase'
};

const AlertPageContent = () => {
  const { previewTheme, showProperties, measureEnabled } = useStyleGuideState();

  return (
    <StyleGuideChrome activeId="alert">
      <Section
        id="alert"
        title="Alert"
        properties={
          showProperties ? (
            <PropertiesCardGroup
              onNavigate={navigateToSection}
              items={[
                {
                  category: 'Color',
                  anchor: 'colors',
                  tokens: [
                    {
                      path: 'palette.error/warning/info/success (unthemed)',
                      status: 'other',
                      note:
                        "all four fall through to MUI's own dark-mode-aware standard-variant " +
                        'color math — the previous MuiAlert.standardInfo/standardWarning ' +
                        'overrides hardcoded light-theme pastel backgrounds without updating the ' +
                        'text color, making those two barely legible; removed, see CHANGES.md'
                    }
                  ]
                },
                {
                  category: 'Shape',
                  anchor: 'shape',
                  tokens: [{ path: 'theme.shape.borderRadius', note: `${previewTheme.shape.borderRadius}px` }]
                },
                {
                  category: 'Typography',
                  anchor: 'typography',
                  tokens: [{ path: 'theme.typography.body2', note: 'message text' }]
                }
              ]}
            />
          ) : null
        }
        description={
          <>
            All four below use the default &quot;standard&quot; variant — no real usage in
            this app passes <span style={{ fontFamily: 'monospace' }}>variant</span>{' '}
            explicitly. error/warning/info are confirmed in real use (dialogs, VideoPlayer,
            Map, and cabinet-front&apos;s ImportantMessages banner); success has no
            confirmed <span style={{ fontFamily: 'monospace' }}>severity=&quot;success&quot;</span>{' '}
            usage anywhere in the codebase.
          </>
        }
      >
        <MeasureOverlay enabled={measureEnabled}>
          {ALERT_SEVERITIES.map((severity) => (
            <div key={severity} style={{ marginBottom: 24 }}>
              <Alert severity={severity}>{ALERT_SAMPLE_TEXT[severity]}</Alert>
              <Typography
                variant="caption"
                color="textSecondary"
                style={{ display: 'block', marginTop: 4, marginLeft: 4 }}
              >
                {ALERT_USAGE_NOTES[severity]}
              </Typography>
            </div>
          ))}
          <Divider style={{ margin: '16px 0' }} />
          <Alert severity="warning">
            <AlertTitle>Title</AlertTitle>
            With an AlertTitle — used in FormControlMessage.jsx when a message carries one.
          </Alert>
        </MeasureOverlay>
      </Section>
    </StyleGuideChrome>
  );
};

const AlertPage = () => (
  <StyleGuideStateProvider>
    <AlertPageContent />
  </StyleGuideStateProvider>
);

export default AlertPage;
