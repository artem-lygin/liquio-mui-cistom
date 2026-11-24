import React from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-translate';
import { useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  documentationApi,
  parseDocumentationUrl,
  toAuthor
} from '../../Workflow/comments/documentation';

// Workflow-list 3-dot menu item (PoC): "Add documentation" opens a dialog for the URL alone
// (the title is the page's own, fetched when attaching). A workflow has at most one link;
// once it has one, the item reads "Documentation" and opens it. It's removed from the
// workflow's comments panel.

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    paddingTop: theme.spacing(2)
  }
}));

const WorkflowDocumentation = ({ workflow, menuOpen, closeMenu }) => {
  const t = useTranslate('WorkflowAdminPage');
  const classes = useStyles();
  const userInfo = useSelector(({ auth }) => auth && auth.info);

  const [doc, setDoc] = React.useState(undefined); // undefined: not loaded yet
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [urlTouched, setUrlTouched] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Rows keep their menus mounted, so look the link up only when this row's menu opens.
  React.useEffect(() => {
    if (!menuOpen) return undefined;
    let cancelled = false;
    documentationApi
      .get(workflow.id)
      .then((result) => !cancelled && setDoc(result))
      .catch(() => !cancelled && setDoc(null));
    return () => {
      cancelled = true;
    };
  }, [menuOpen, workflow.id]);

  const validUrl = parseDocumentationUrl(url);
  const urlError = urlTouched && !validUrl;

  const openDialog = () => {
    closeMenu();
    setUrl('');
    setUrlTouched(false);
    setError(null);
    setOpen(true);
  };

  const handleAttach = async () => {
    setUrlTouched(true);
    if (!validUrl || saving) return;
    setSaving(true);
    setError(null);
    try {
      const created = await documentationApi.attach(workflow.id, {
        url: validUrl,
        author: toAuthor(userInfo)
      });
      setDoc(created);
      setOpen(false);
    } catch (e) {
      setError(e);
    }
    setSaving(false);
  };

  if (doc) {
    return (
      <MenuItem
        onClick={() => {
          closeMenu();
          window.open(doc.url, '_blank', 'noopener,noreferrer');
        }}
      >
        <ListItemIcon>
          <OpenInNewIcon />
        </ListItemIcon>
        <ListItemText primary={t('Documentation')} />
      </MenuItem>
    );
  }

  return (
    <>
      <MenuItem onClick={openDialog} disabled={doc === undefined && menuOpen}>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary={t('AddDocumentation')} />
      </MenuItem>

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('AddDocumentation')}</DialogTitle>
        <DialogContent>
          <div className={classes.content}>
            <TextField
              autoFocus
              required
              fullWidth
              label={t('DocumentationUrl')}
              placeholder="https://"
              value={url}
              onChange={({ target: { value } }) => setUrl(value)}
              onBlur={() => setUrlTouched(true)}
              onKeyDown={(event) => event.key === 'Enter' && handleAttach()}
              error={urlError || !!error}
              helperText={
                urlError ? t('DocumentationUrlInvalid') : error ? error.message : ' '
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            {t('Cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleAttach} disabled={saving}>
            {saving ? <CircularProgress size={16} /> : t('AttachDocumentation')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

WorkflowDocumentation.propTypes = {
  workflow: PropTypes.object.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired
};

export default WorkflowDocumentation;
