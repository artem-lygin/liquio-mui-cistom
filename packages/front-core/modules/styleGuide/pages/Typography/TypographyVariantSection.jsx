import React from 'react';
import { Typography, TextField, MenuItem } from '@mui/material';
import Section from '../../components/Section';
import MeasureOverlay from '../../components/MeasureOverlay';
import { PropertiesCardGroup } from '../../components/PropertiesPanel';
import { TYPOGRAPHY_LABELS, TYPOGRAPHY_SAMPLE_TEXT, EDITABLE_TYPOGRAPHY_KEYS, TEXT_TRANSFORM_OPTIONS } from './constants';
import { getTypographyTokenItems, describeTypographyVariant } from './tokenItems';

const TypographyVariantSection = ({ variant, previewTheme, rootFontSize, editMode, showProperties, measureEnabled, onChange, onNavigate }) => {
  const definition = previewTheme.typography?.[variant];
  const description = describeTypographyVariant(variant);

  return (
    <Section
      id={`typography-${variant}`}
      title={TYPOGRAPHY_LABELS[variant] || variant}
      titleVariant="h3"
      properties={showProperties ? <PropertiesCardGroup onNavigate={onNavigate} items={getTypographyTokenItems(variant, previewTheme, rootFontSize)} /> : null}
      description={description}
    >
      <MeasureOverlay enabled={measureEnabled}>
        <Typography variant={variant} component="div" style={{ display: 'block' }}>
          {TYPOGRAPHY_SAMPLE_TEXT}
        </Typography>
      </MeasureOverlay>
      {editMode && definition ? (
        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
          {EDITABLE_TYPOGRAPHY_KEYS.map((key) => (
            <TextField
              key={key}
              variant="standard"
              label={key}
              defaultValue={definition[key]}
              onBlur={(event) => onChange(variant, key, event.target.value)}
              style={{ width: 120 }}
            />
          ))}
          <TextField
            select={true}
            variant="standard"
            label="textTransform"
            value={definition.textTransform || 'none'}
            onChange={(event) => onChange(variant, 'textTransform', event.target.value)}
            style={{ width: 140 }}
          >
            {TEXT_TRANSFORM_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
      ) : null}
    </Section>
  );
};

export default TypographyVariantSection;
