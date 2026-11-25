import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import {
  Button,
  ButtonBase,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { parseDocumentationUrl } from './documentation';

const useStyles = makeStyles((theme) => ({
  composer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  composerActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    '& > :first-child': {
      flex: 1,
      minWidth: 0
    },
    '& > button': {
      flexShrink: 0
    }
  },
  // The composer's attach chip: body2-size text, a step under MUI Chip's own 13px.
  anchorChip: {
    maxWidth: '100%',
    '& .MuiChip-label': {
      fontSize: theme.typography.body2.fontSize
    }
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
  },
  // A Paper at COMMENT_ELEVATION: surface, shadow, radius and hairline border all come from
  // the theme (MuiPaper override + dark-mode elevation overlay).
  // Tight top (the first row is small caption text), roomier sides and bottom. Positioned so
  // the 3-dot menu can sit in the corner outside this padding (cardMenuButton).
  item: {
    position: 'relative',
    padding: theme.spacing(1.5, 3, 3),
    transition: theme.transitions.create(['background-color', 'border-color'])
  },
  itemHighlighted: {
    // Matches the theme's own `&.MuiPaper-rounded` border rule, which otherwise wins.
    '&.MuiPaper-rounded': {
      borderColor: theme.palette.primary.main
    },
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
  },
  text: {
    color: theme.palette.text.primary,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginTop: theme.spacing(1.5)
  },
  // Card metadata (place, author, time) is caption-size: one step under the comment text.
  // Place: a 20px icon (the theme's button-icon size) + label, no pill.
  place: {
    ...theme.typography.caption,
    // Block-level flex (sized to content) so a plain span and a ButtonBase sit on the same
    // line box — inline-flex let the span inherit the card's taller line height.
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    gap: theme.spacing(1),
    maxWidth: '100%',
    color: theme.palette.text.secondary,
    '& .MuiSvgIcon-root': {
      fontSize: theme.buttonIconSize.medium,
      flexShrink: 0
    },
    '& > span': {
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  },
  placeLink: {
    borderRadius: theme.shape.borderRadius,
    '&:hover, &.Mui-focusVisible': {
      color: theme.palette.text.primary
    }
  },
  placeActive: {
    color: theme.palette.primary.main,
    '&:hover, &.Mui-focusVisible': {
      color: theme.palette.primary.main
    }
  },
  placeRemoved: {
    color: theme.palette.text.disabled,
    '& > span': {
      textDecoration: 'line-through'
    }
  },
  // Last row: author (truncated) · time.
  itemFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1.5)
  },
  author: {
    ...theme.typography.caption,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.primary,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  time: {
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  // First row of every card: place (or the documentation label) + the 3-dot menu, top-right.
  // The menu is taken out of the row (see cardMenuButton), so the row only reserves room
  // for it on the right: the menu's reach into the card, less the card's own side padding.
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    minHeight: theme.buttonIconSize.medium,
    // 28px: the 32px menu at 4px in, minus the card's 12px side padding, plus a 4px gap.
    paddingRight: theme.spacing(7)
  },
  // Ignores the card padding: pinned 1 spacing step (4px) from the card's top and right edges.
  cardMenuButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1)
  },
  docTitle: {
    ...theme.typography.body2,
    display: 'block',
    marginTop: theme.spacing(1.5),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.primary.main,
    textDecoration: 'none',
    wordBreak: 'break-word',
    '&:hover, &:focus-visible': {
      textDecoration: 'underline'
    }
  },
  docUrl: {
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  docCheckbox: {
    marginLeft: 0,
    marginRight: 0,
    '& .MuiFormControlLabel-label': {
      ...theme.typography.body2
    }
  },
  empty: {
    color: theme.palette.text.secondary
  },
  error: {
    color: theme.palette.error.main
  }
}));

const COMMENT_ELEVATION = 4;

const shortType = (type = '') => type.replace(/^bpmn:/, '');

export const elementLabel = (element) => {
  if (!element) return '';
  const { businessObject = {} } = element;
  return businessObject.name || businessObject.id || element.id;
};

const toAnchor = (element) => ({
  elementId: element.id,
  elementType: element.type,
  elementName: element.businessObject?.name || null
});

// The card's top-right 3-dot menu — one action (remove), shared by comments and the doc card.
const CardMenu = ({ classes, label, actionLabel, onAction }) => {
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  return (
    <>
      <IconButton
        className={classes.cardMenuButton}
        size="small"
        aria-label={label}
        onClick={({ currentTarget }) => setMenuAnchor(currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onAction();
          }}
        >
          {actionLabel}
        </MenuItem>
      </Menu>
    </>
  );
};

CardMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  actionLabel: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired
};

const DocumentationCard = ({ t, doc, classes, onRemove }) => (
  <Paper elevation={COMMENT_ELEVATION} className={classes.item}>
    <div className={classes.cardHeader}>
      <span className={classes.place}>
        <LinkIcon />
        <span>{t('Documentation')}</span>
      </span>
      <CardMenu
        classes={classes}
        label={t('DocumentationActions')}
        actionLabel={t('RemoveDocumentation')}
        onAction={onRemove}
      />
    </div>

    <a className={classes.docTitle} href={doc.url} target="_blank" rel="noopener noreferrer">
      {doc.title}
    </a>
    <div className={classes.docUrl} title={doc.url}>
      {doc.url}
    </div>

    <div className={classes.itemFooter}>
      <span className={classes.author} title={doc.author?.name || ''}>
        {doc.author?.name || t('UnknownAuthor')}
      </span>
      <span className={classes.time}>{moment(doc.createdAt).format('DD.MM.YYYY HH:mm')}</span>
    </div>
  </Paper>
);

DocumentationCard.propTypes = {
  t: PropTypes.func.isRequired,
  doc: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

const CommentsPanel = ({
  t,
  comments,
  loading,
  error,
  selection,
  modeler,
  currentUser,
  onAdd,
  onRemove,
  onSelectElement,
  documentation,
  documentationError,
  onAttachDocumentation,
  onRemoveDocumentation
}) => {
  const classes = useStyles();
  const [text, setText] = React.useState('');
  const [asDocumentation, setAsDocumentation] = React.useState(false);
  const [attach, setAttach] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const firstHighlightedRef = React.useRef(null);
  const [, refreshFromDiagram] = React.useReducer((x) => x + 1, 0);

  // Element names are read live from the diagram (below), so re-render when it changes: a
  // rename, delete or undo on the canvas, or a re-import.
  React.useEffect(() => {
    if (!modeler) return undefined;
    modeler.on('elements.changed', refreshFromDiagram);
    modeler.on('import.done', refreshFromDiagram);
    return () => {
      modeler.off('elements.changed', refreshFromDiagram);
      modeler.off('import.done', refreshFromDiagram);
    };
  }, [modeler]);

  const selectedId = selection?.id || null;

  // A new selection re-attaches by default — the usual intent of selecting then commenting.
  React.useEffect(() => setAttach(true), [selectedId]);

  React.useEffect(() => {
    if (firstHighlightedRef.current) {
      firstHighlightedRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedId]);

  const getElement = (elementId) => (modeler ? modeler.get('elementRegistry').get(elementId) : null);

  const elementExists = (elementId) => !!getElement(elementId);

  // The element's current name, so a renamed element reads the same on every comment. The
  // name stored with the comment is only a fallback for an element deleted from the schema.
  const anchorLabel = (anchor) => {
    const element = getElement(anchor.elementId);
    return element ? elementLabel(element) : anchor.elementName || anchor.elementId;
  };

  // A comment that is just one link can become the workflow's documentation link instead —
  // only while the workflow has none (one per workflow; remove the old one first).
  const documentationUrl = documentation ? null : parseDocumentationUrl(text);
  const submitAsDocumentation = !!documentationUrl && asDocumentation;

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);

    if (submitAsDocumentation) {
      const attached = await onAttachDocumentation({ url: documentationUrl, author: currentUser });
      setSubmitting(false);
      if (attached) {
        setText('');
        setAsDocumentation(false);
      }
      return;
    }

    const created = await onAdd({
      text,
      author: currentUser,
      anchor: selection && attach ? toAnchor(selection) : null
    });
    setSubmitting(false);
    if (created) setText('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSubmit();
    }
  };

  // Newest first. With an element selected, that element's comments come first (newest
  // first among them), then everything else (newest first).
  const isOnSelected = ({ anchor }) => !!(selectedId && anchor && anchor.elementId === selectedId);
  const sorted = [...comments].sort(
    (a, b) =>
      Number(isOnSelected(b)) - Number(isOnSelected(a)) || b.createdAt.localeCompare(a.createdAt)
  );
  let highlightedRefAssigned = false;

  return (
    <div>
      <div className={classes.composer}>
        <Typography variant="subtitle2" component="h3">
          {t('NewCommentTitle')}
        </Typography>

        <TextField
          multiline
          minRows={3}
          maxRows={10}
          fullWidth
          variant="outlined"
          placeholder={t('CommentPlaceholder')}
          value={text}
          onChange={({ target: { value } }) => setText(value)}
          onKeyDown={handleKeyDown}
        />

        {/* Under the input: where the comment goes (a pill) — or, when the input is a bare
            link, the Documentation checkbox in its place — and the submit button. */}
        <div className={classes.composerActions}>
          <div>
            {documentationUrl ? (
              <FormControlLabel
                className={classes.docCheckbox}
                control={
                  <Checkbox
                    size="small"
                    checked={asDocumentation}
                    onChange={({ target: { checked } }) => setAsDocumentation(checked)}
                  />
                }
                label={t('Documentation')}
              />
            ) : selection && attach ? (
              <Chip
                className={classes.anchorChip}
                size="small"
                color="primary"
                icon={<PlaceOutlinedIcon />}
                label={elementLabel(selection)}
                onDelete={() => setAttach(false)}
              />
            ) : (
              <Tooltip
                title={selection ? t('CommentAttachTo', { name: elementLabel(selection) }) : ''}
              >
                <Chip
                  className={classes.anchorChip}
                  size="small"
                  variant="outlined"
                  icon={<AccountTreeOutlinedIcon />}
                  label={t('WholeWorkflow')}
                  onClick={selection ? () => setAttach(true) : undefined}
                />
              </Tooltip>
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
          >
            {submitAsDocumentation ? t('AttachDocumentation') : t('AddComment')}
          </Button>
        </div>

        {error || documentationError ? (
          <Typography variant="caption" className={classes.error}>
            {(error || documentationError).message}
          </Typography>
        ) : null}
      </div>

      {loading ? null : (
        <div className={classes.list}>
          {documentation ? (
            <DocumentationCard
              t={t}
              doc={documentation}
              classes={classes}
              onRemove={onRemoveDocumentation}
            />
          ) : null}

          {sorted.length === 0 ? (
            <Typography variant="body2" className={classes.empty}>
              {t('NoComments')}
            </Typography>
          ) : null}

          {sorted.map((comment) => {
            const { id, text: body, author, createdAt, anchor } = comment;
            const highlighted = !!(anchor && selectedId && anchor.elementId === selectedId);
            const exists = anchor ? elementExists(anchor.elementId) : false;
            const assignRef = highlighted && !highlightedRefAssigned;
            if (assignRef) highlightedRefAssigned = true;

            return (
              <Paper
                key={id}
                elevation={COMMENT_ELEVATION}
                ref={assignRef ? firstHighlightedRef : undefined}
                className={classNames(classes.item, {
                  [classes.itemHighlighted]: highlighted
                })}
              >
                <div className={classes.cardHeader}>
                  {anchor ? (
                    <Tooltip title={exists ? shortType(anchor.elementType) : t('ElementRemoved')}>
                      {exists ? (
                        <ButtonBase
                          className={classNames(classes.place, classes.placeLink, {
                            [classes.placeActive]: highlighted
                          })}
                          onClick={() => onSelectElement(anchor.elementId)}
                        >
                          <PlaceOutlinedIcon />
                          <span>{anchorLabel(anchor)}</span>
                        </ButtonBase>
                      ) : (
                        <span className={classNames(classes.place, classes.placeRemoved)}>
                          <PlaceOutlinedIcon />
                          <span>{anchorLabel(anchor)}</span>
                        </span>
                      )}
                    </Tooltip>
                  ) : (
                    <span className={classes.place}>
                      <AccountTreeOutlinedIcon />
                      <span>{t('WholeWorkflow')}</span>
                    </span>
                  )}
                  <CardMenu
                    classes={classes}
                    label={t('CommentActions')}
                    actionLabel={t('DeleteComment')}
                    onAction={() => onRemove(id)}
                  />
                </div>

                <Typography variant="body2" className={classes.text}>
                  {body}
                </Typography>

                <div className={classes.itemFooter}>
                  <span className={classes.author} title={author?.name || ''}>
                    {author?.name || t('UnknownAuthor')}
                  </span>
                  <span className={classes.time}>
                    {moment(createdAt).format('DD.MM.YYYY HH:mm')}
                  </span>
                </div>
              </Paper>
            );
          })}
        </div>
      )}
    </div>
  );
};

CommentsPanel.propTypes = {
  t: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  selection: PropTypes.object,
  modeler: PropTypes.object,
  currentUser: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelectElement: PropTypes.func.isRequired,
  documentation: PropTypes.object,
  documentationError: PropTypes.object,
  onAttachDocumentation: PropTypes.func.isRequired,
  onRemoveDocumentation: PropTypes.func.isRequired
};

CommentsPanel.defaultProps = {
  loading: false,
  error: null,
  selection: null,
  modeler: null,
  currentUser: null,
  documentation: null,
  documentationError: null
};

export default CommentsPanel;
