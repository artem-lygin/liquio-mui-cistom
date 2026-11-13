// PoC (poc/git-version-control): commit metadata card. One row per field; tags and the
// release comment only appear when the commit has them.
import React from 'react';
import { Box, Chip, Link, Paper, Stack, Typography } from '@mui/material';

import TimeLabel from 'components/Label/Time';

import ShaCopy from '../../WorkflowCommits/components/ShaCopy';

const Row = ({ label, children }) => (
  <>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Box minWidth={0}>{children}</Box>
  </>
);

// Long-form text (message, release comment): keeps line breaks, capped line length.
const LongText = ({ children }) => (
  <Typography variant="body2" component="div" whiteSpace="pre-wrap" maxWidth="100ch">
    {children}
  </Typography>
);

// Release comment can be long: show the first `lines` lines, then "Show more" to expand.
// The toggle only appears when the text actually overflows the clamp.
const ClampedText = ({ children, lines = 3 }) => {
  const ref = React.useRef(null);
  const [expanded, setExpanded] = React.useState(false);
  const [overflows, setOverflows] = React.useState(false);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node || expanded) return undefined;
    const measure = () => setOverflows(node.scrollHeight > node.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children, expanded, lines]);

  return (
    <Box maxWidth="100ch">
      <Typography
        ref={ref}
        variant="body2"
        component="div"
        whiteSpace="pre-wrap"
        sx={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lines,
                overflow: 'hidden'
              }
        }
      >
        {children}
      </Typography>
      {overflows || expanded ? (
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => setExpanded((value) => !value)}
          sx={{ mt: 1 }}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Link>
      ) : null}
    </Box>
  );
};

const CommitMetadata = ({ commit }) => {
  const tags = commit.tags || [];
  const version = tags.find((tag) => tag !== 'current');

  return (
    <Paper elevation={2}>
      <Box
        display="grid"
        gridTemplateColumns="160px minmax(0, 1fr)"
        alignItems="baseline"
        columnGap={4}
        rowGap={4}
        p={4}
      >
        <Row label="Author">
          <Typography variant="body2">{commit.author}</Typography>
        </Row>
        <Row label="Committed">
          <Typography variant="body2" component="div">
            <TimeLabel date={commit.committedAt} />
          </Typography>
        </Row>
        <Row label="SHA">
          <Typography variant="body2" component="div">
            <ShaCopy sha={commit.sha} />
          </Typography>
        </Row>
        <Row label="Message">
          <LongText>{commit.message}</LongText>
        </Row>
        {tags.length ? (
          <Row label="Tags">
            <Stack direction="row" spacing={1}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  color={tag === 'current' ? 'primary' : 'default'}
                />
              ))}
            </Stack>
          </Row>
        ) : null}
        {version && commit.releaseComment ? (
          <Row label="Release comment">
            <ClampedText>{commit.releaseComment}</ClampedText>
          </Row>
        ) : null}
      </Box>
    </Paper>
  );
};

export default CommitMetadata;
