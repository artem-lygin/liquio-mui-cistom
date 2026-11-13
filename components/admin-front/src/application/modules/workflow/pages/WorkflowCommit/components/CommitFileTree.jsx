// PoC (poc/git-version-control): the commit's project tree. It shows the whole project,
// not just the changed files, so files with the same name in different folders stay
// distinguishable. Changed files get a status letter; folders that contain changes get a dot.
import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const STATUSES = {
  added: { letter: 'A', label: 'Added', color: 'success.main' },
  modified: { letter: 'M', label: 'Modified', color: 'warning.main' },
  deleted: { letter: 'D', label: 'Deleted', color: 'error.main' }
};

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

// Flat file list -> nested folders. Folders know whether anything inside them changed.
export const buildTree = (files) => {
  const root = { path: '', name: '', children: [] };

  files.forEach((file) => {
    const parts = file.path.split('/');
    let folder = root;
    parts.slice(0, -1).forEach((name, index) => {
      const path = parts.slice(0, index + 1).join('/');
      let child = folder.children.find((node) => node.path === path);
      if (!child) {
        child = { path, name, children: [] };
        folder.children.push(child);
      }
      folder = child;
    });
    folder.children.push({ path: file.path, name: parts[parts.length - 1], file });
  });

  const finish = (node) => {
    if (!node.children) return Boolean(node.file.status);
    node.children.sort(byName);
    node.hasChanges = node.children.map(finish).some(Boolean);
    return node.hasChanges;
  };
  finish(root);

  return root;
};

// Files in the order the tree shows them (for picking the first changed file).
export const flattenTree = (node) =>
  node.children ? node.children.flatMap(flattenTree) : [node.file];

const changedFolders = (node) =>
  node.children
    ? [...(node.hasChanges && node.path ? [node.path] : []), ...node.children.flatMap(changedFolders)]
    : [];

const Label = ({ node }) => {
  const isFolder = Boolean(node.children);
  const status = !isFolder && STATUSES[node.file.status];
  const Icon = isFolder ? FolderIcon : InsertDriveFileIcon;

  return (
    <Box display="flex" alignItems="center" gap={2} py={1}>
      <Icon fontSize="small" color="action" />
      <Typography
        variant="body2"
        noWrap={true}
        flex={1}
        color={status ? status.color : 'text.primary'}
        sx={node.file?.status === 'deleted' ? { textDecoration: 'line-through' } : undefined}
      >
        {node.name}
      </Typography>
      {status ? (
        <Tooltip title={status.label}>
          <Typography variant="caption" fontWeight="bold" color={status.color} pr={2}>
            {status.letter}
          </Typography>
        </Tooltip>
      ) : null}
      {isFolder && node.hasChanges ? (
        <Tooltip title="Contains changes">
          <Box width={6} height={6} borderRadius="50%" bgcolor="text.secondary" mr={3} />
        </Tooltip>
      ) : null}
    </Box>
  );
};

const renderNode = (node) => (
  <TreeItem key={node.path} nodeId={node.path} label={<Label node={node} />}>
    {node.children ? node.children.map(renderNode) : null}
  </TreeItem>
);

const CommitFileTree = ({ tree, selectedPath, onSelect }) => {
  const [expanded, setExpanded] = React.useState(() => changedFolders(tree));
  const filePaths = React.useMemo(
    () => new Set(flattenTree(tree).map((file) => file.path)),
    [tree]
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
      selected={selectedPath}
      // Folders only expand/collapse; selecting is for files.
      onNodeSelect={(event, nodeId) => filePaths.has(nodeId) && onSelect(nodeId)}
    >
      {tree.children.map(renderNode)}
    </TreeView>
  );
};

export default CommitFileTree;
