// PoC (poc/git-version-control): commit viewer, comparing two states of the project:
// `base` (by default the previous commit) and `target` (the commit being viewed). Later the
// same viewer compares any two commits picked in the commits table, so it never assumes they
// share a file structure: `files` is the union of both trees, and each file carries its
// content on each side (`before` = base, `after` = target, null where it doesn't exist) and
// its git status (added / modified / deleted / unchanged).
//
// Layout: the file tree is a left panel of its own; the right panel is the editor with its own
// title bar (file path + git status, the compared commits, Show difference).
// The editor shows the file at `target`, or (Show difference) a git-style inline diff
// base -> target, with removed lines in red and added lines in green.
import React from 'react';
import { Box, Divider, FormControlLabel, Paper, Switch, Typography } from '@mui/material';

import Editor, { DiffEditor } from 'components/Editor';

import CommitFileTree, { STATUSES, buildTree, flattenTree } from './CommitFileTree';

const READ_ONLY = { readOnly: true };
// renderSideBySide: false -> one column, like `git diff`.
const DIFF_OPTIONS = { readOnly: true, renderSideBySide: false };

const EmptyState = ({ children }) => (
  <Box height="100%" display="flex" alignItems="center" justifyContent="center" p={6}>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      {children}
    </Typography>
  </Box>
);

const FilePreview = ({ file, showDiff }) => {
  if (!file) return <EmptyState>Select a file to see its content.</EmptyState>;

  if (showDiff) {
    // One DiffEditor that updates in place (no key per file), and it doesn't dispose its
    // models on unmount: remounting/disposing makes @monaco-editor/react throw "TextModel got
    // disposed before DiffEditorWidget model got reset".
    return (
      <DiffEditor
        language={file.language}
        original={file.before || ''}
        modified={file.after || ''}
        options={DIFF_OPTIONS}
        keepCurrentOriginalModel={true}
        keepCurrentModifiedModel={true}
      />
    );
  }

  if (file.status === 'deleted') {
    return (
      <EmptyState>
        This file was deleted in this commit.
        <br />
        Turn on Show difference to see what was removed.
      </EmptyState>
    );
  }

  return (
    <Editor key={file.path} language={file.language} value={file.after} options={READ_ONLY} />
  );
};

// Both panels' title bars share one height so their dividers line up.
const TITLE_BAR_HEIGHT = 56;

const TitleBar = ({ children }) => (
  <>
    <Box display="flex" alignItems="center" gap={4} px={4} minHeight={TITLE_BAR_HEIGHT}>
      {children}
    </Box>
    <Divider />
  </>
);

const Sha = ({ children }) => (
  <Typography component="span" variant="inherit" fontFamily="monospace">
    {children}
  </Typography>
);

const CommitViewer = ({ files, base, target, defaultShowDiff = false }) => {
  const tree = React.useMemo(() => buildTree(files), [files]);
  const [selectedPath, setSelectedPath] = React.useState(
    () => (flattenTree(tree).find((file) => file.status) || {}).path || ''
  );
  const [showDiff, setShowDiff] = React.useState(defaultShowDiff);

  const selectedFile = files.find((file) => file.path === selectedPath);
  const status = selectedFile && STATUSES[selectedFile.status];
  const changedCount = files.filter((file) => file.status).length;

  return (
    <Paper elevation={2} sx={{ display: 'flex', height: '70vh', minHeight: 480, overflow: 'hidden' }}>
      {/* Left panel: the project tree (union of base and target). */}
      <Box
        width={320}
        flexShrink={0}
        display="flex"
        flexDirection="column"
        borderRight={1}
        borderColor="divider"
      >
        <TitleBar>
          <Typography variant="subtitle2" flex={1}>
            Files
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {changedCount} changed
          </Typography>
        </TitleBar>
        <Box flex={1} minHeight={0} overflow="auto" py={2}>
          <CommitFileTree tree={tree} selectedPath={selectedPath} onSelect={setSelectedPath} />
        </Box>
      </Box>

      {/* Right panel: the selected file's title bar, then the editor. */}
      <Box flex={1} minWidth={0} display="flex" flexDirection="column">
        <TitleBar>
          <Box flex={1} minWidth={0}>
            <Typography variant="body2" fontFamily="monospace" noWrap={true}>
              {selectedPath || 'No file selected'}
              {status ? (
                <Typography component="span" variant="inherit" color={status.color}>
                  {` · ${status.label}`}
                </Typography>
              ) : null}
            </Typography>
            <Typography variant="caption" component="div" color="text.secondary" noWrap={true}>
              {showDiff && base ? (
                <>
                  <Sha>{base.sha}</Sha> → <Sha>{target.sha}</Sha>
                </>
              ) : (
                <>
                  at <Sha>{target.sha}</Sha>
                </>
              )}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showDiff}
                onChange={(event) => setShowDiff(event.target.checked)}
              />
            }
            label="Show difference"
          />
        </TitleBar>
        <Box flex={1} minHeight={0}>
          <FilePreview file={selectedFile} showDiff={showDiff} />
        </Box>
      </Box>
    </Paper>
  );
};

export default CommitViewer;
