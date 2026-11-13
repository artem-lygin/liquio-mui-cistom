// PoC (poc/git-version-control): commit viewer. Project tree on the left, the selected
// file on the right: its content at this commit, or (Show difference) a git-style inline
// diff against the previous commit, with removed lines in red and added lines in green.
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

const CommitViewer = ({ files }) => {
  const tree = React.useMemo(() => buildTree(files), [files]);
  const [selectedPath, setSelectedPath] = React.useState(
    () => (flattenTree(tree).find((file) => file.status) || {}).path || ''
  );
  const [showDiff, setShowDiff] = React.useState(false);

  const selectedFile = files.find((file) => file.path === selectedPath);
  const status = selectedFile && STATUSES[selectedFile.status];

  return (
    <Paper elevation={2}>
      <Box display="flex" alignItems="center" gap={4} px={4} py={2}>
        <Typography variant="body2" fontFamily="monospace" noWrap={true} flex={1}>
          {selectedPath}
          {status ? (
            <Typography component="span" variant="inherit" color={status.color}>
              {` · ${status.label}`}
            </Typography>
          ) : null}
        </Typography>
        <FormControlLabel
          control={
            <Switch checked={showDiff} onChange={(event) => setShowDiff(event.target.checked)} />
          }
          label="Show difference"
        />
      </Box>
      <Divider />
      <Box display="flex" height="70vh" minHeight={480}>
        <Box
          width={320}
          flexShrink={0}
          overflow="auto"
          py={2}
          borderRight={1}
          borderColor="divider"
        >
          <CommitFileTree tree={tree} selectedPath={selectedPath} onSelect={setSelectedPath} />
        </Box>
        <Box flex={1} minWidth={0}>
          <FilePreview file={selectedFile} showDiff={showDiff} />
        </Box>
      </Box>
    </Paper>
  );
};

export default CommitViewer;
