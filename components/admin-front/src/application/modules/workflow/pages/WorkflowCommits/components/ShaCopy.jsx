// PoC (poc/git-version-control).
import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// navigator.clipboard only exists in secure contexts; the dev hosts are plain http, so
// fall back to a hidden textarea + execCommand there.
const copyText = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
};

// SHA with a copy button that appears on hover (or when the button is focused). Used in the
// commits table and on the commit page. `iconStart` puts the button before the SHA (commit
// page); then the button is first in the row, so the theme's buttonGap no longer spaces it
// and the same token is applied as the gap instead.
const ShaCopy = ({ sha, iconStart = false }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (event) => {
    event.stopPropagation(); // don't trigger the row click
    copyText(sha).then(() => setCopied(true));
  };

  const button = (
    <Tooltip title={copied ? 'Copied' : 'Copy SHA'}>
      <IconButton className="copy-sha" size="small" onClick={handleCopy}>
        <ContentCopyIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={iconStart ? (theme) => theme.spacing(theme.buttonGap.small) : 1}
      sx={{
        '& .copy-sha': { visibility: 'hidden' },
        '&:hover .copy-sha, & .copy-sha:focus-visible': { visibility: 'visible' }
      }}
      onMouseLeave={() => setCopied(false)}
    >
      {iconStart ? button : null}
      <Typography variant="inherit" fontFamily="monospace">
        {sha}
      </Typography>
      {iconStart ? null : button}
    </Box>
  );
};

export default ShaCopy;
