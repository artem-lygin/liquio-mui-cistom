import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import {
  Button,
  ButtonBase,
  Chip,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AddIcon from '@mui/icons-material/Add';

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
  item: {
    padding: theme.spacing(2),
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
  // Last row: author (truncated) · time, delete pinned to the card's bottom-right corner.
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
  deleteButton: {
    flexShrink: 0,
    marginLeft: 'auto'
  },
  date: {
    color: theme.palette.text.secondary
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
  onSelectElement
}) => {
  const classes = useStyles();
  const [text, setText] = React.useState('');
  const [attach, setAttach] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const firstHighlightedRef = React.useRef(null);

  const selectedId = selection?.id || null;

  // A new selection re-attaches by default — the usual intent of selecting then commenting.
  React.useEffect(() => setAttach(true), [selectedId]);

  React.useEffect(() => {
    if (firstHighlightedRef.current) {
      firstHighlightedRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedId]);

  const elementExists = (elementId) =>
    !!(modeler && modeler.get('elementRegistry').get(elementId));

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
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

  const sorted = [...comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  let highlightedRefAssigned = false;

  return (
    <div>
      <div className={classes.composer}>
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

        {selection ? (
          <div>
            {attach ? (
              <Chip
                className={classes.anchorChip}
                size="small"
                color="primary"
                icon={<PlaceOutlinedIcon />}
                label={elementLabel(selection)}
                onDelete={() => setAttach(false)}
              />
            ) : (
              <Chip
                className={classes.anchorChip}
                size="small"
                variant="outlined"
                icon={<AddIcon />}
                label={t('CommentAttachTo', { name: elementLabel(selection) })}
                onClick={() => setAttach(true)}
              />
            )}
          </div>
        ) : null}

        <div className={classes.composerActions}>
          <Typography variant="caption" className={classes.date}>
            {selection && attach ? t('CommentOnElement') : t('CommentOnWorkflow')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
          >
            {t('AddComment')}
          </Button>
        </div>

        {error ? (
          <Typography variant="caption" className={classes.error}>
            {error.message}
          </Typography>
        ) : null}
      </div>

      {loading ? null : sorted.length === 0 ? (
        <Typography variant="body2" className={classes.empty}>
          {t('NoComments')}
        </Typography>
      ) : (
        <div className={classes.list}>
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
                        <span>{anchor.elementName || anchor.elementId}</span>
                      </ButtonBase>
                    ) : (
                      <span className={classNames(classes.place, classes.placeRemoved)}>
                        <PlaceOutlinedIcon />
                        <span>{anchor.elementName || anchor.elementId}</span>
                      </span>
                    )}
                  </Tooltip>
                ) : (
                  <span className={classes.place}>
                    <AccountTreeOutlinedIcon />
                    <span>{t('WholeWorkflow')}</span>
                  </span>
                )}

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
                  <Tooltip title={t('DeleteComment')}>
                    <IconButton
                      className={classes.deleteButton}
                      size="small"
                      onClick={() => onRemove(id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
  onSelectElement: PropTypes.func.isRequired
};

CommentsPanel.defaultProps = {
  loading: false,
  error: null,
  selection: null,
  modeler: null,
  currentUser: null
};

export default CommentsPanel;
