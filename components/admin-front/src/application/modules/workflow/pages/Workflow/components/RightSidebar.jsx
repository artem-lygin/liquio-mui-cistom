import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Badge,
  Button,
  CircularProgress,
  Divider,
  Typography,
  IconButton,
  Paper,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import TuneIcon from '@mui/icons-material/Tune';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
  RightPanelOpen as SymbolRightPanelOpen,
  RightPanelClose as SymbolRightPanelClose,
} from '@material-symbols-svg/react/rounded/w400';
import { validateData } from 'components/JsonSchema';
import Scrollbar from 'components/Scrollbar';
import Copy from 'assets/img/copy.svg';
import WorkflowSettings from './WorkflowSettings';
import CreateParallelGatewayEnding from './CreateParallelGatewayEnding';
import ElementDetails from './Details';
import formElements from './Details/elements';
import awaitDelay from 'helpers/awaitDelay';
import schema from './WorkflowSettings/schema';
import unitSchema from './WorkflowSettings/unitSchema';
import CommentsPanel from '../comments/CommentsPanel';
import useWorkflowComments from '../comments/useWorkflowComments';
import useCommentOverlays from '../comments/useCommentOverlays';
import CommentPins from '../comments/CommentPins';

const MODE_PROPERTIES = 'properties';
const MODE_COMMENTS = 'comments';

const PANEL_WIDTH = 300;
const PANEL_ELEVATION = 1;

const useStyles = makeStyles((theme) => ({
  // Only as wide as the header controls, so whatever the toolbar puts before it (the "last
  // changes" text) sits right next to Save; the panel body below keeps its own fixed width.
  root: {
    height: '100%',
    // Keeps the collapse button off the window edge (the panel body is absolutely positioned
    // against this box's padding edge, so it stays flush right).
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  // Spacing between Save, the mode tabs and the collapse button is the theme's button gap:
  // Save (first) and the collapse Icon Button space themselves via theme.buttonGap; the
  // ToggleButtonGroup isn't a Button, so it takes the same gap explicitly.
  headerControls: {
    display: 'flex',
    alignItems: 'center',
  },
  modeSwitch: {
    marginLeft: theme.spacing(theme.buttonGap.medium),
    // Same 20px as Button / Icon Button icons.
    '& .MuiSvgIcon-root': {
      fontSize: theme.buttonIconSize.medium,
    },
  },
  body: {
    position: 'absolute',
    right: 0,
    top: 52,
    width: PANEL_WIDTH,
    height: 'calc(100vh - 125px)',
    transition: theme.transitions.create(['transform', 'visibility']),
    transform: 'translateX(0)',
    opacity: 1,
    zIndex: 10,
  },
  // The panel surface: a square Paper at elevation 1 (was the flat navigator.sidebarBg
  // #404040, off the elevation scale), so cards inside at higher elevations read as raised.
  // A child of body rather than body itself, so Paper's own transition can't override the
  // collapse animation above.
  surface: {
    height: '100%',
    paddingTop: theme.spacing(5),
  },
  // Collapses off the right edge; the page layout clips the overflow.
  bodyClosed: {
    transform: 'translateX(100%)',
    visibility: 'hidden',
  },
  bodyToggled: {
    transition: '.2s ease-in-out',
    opacity: 0,
  },
  divider: {
    background: theme.borderColor,
    marginBottom: theme.spacing(4),
  },
  sidebarHeadline: {
    color: '#fff',
    display: 'flex',
    marginBottom: theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > span': {
      fontWeight: 500,
      paddingRight: theme.spacing(4),
      textTransform: 'capitalize',
    },
  },
  copyButton: {
    display: 'flex',
    alignItems: 'center'
  },
  copyIcon: {
    marginLeft: theme.spacing(1),
  },
  copyElementButton: {
    color: theme?.navigator?.navItem?.linkActiveColor,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(7),
    marginLeft: 0, // stacked under the element details, not in a button row
    '& img': {
      marginRight: theme.spacing(3),
    },
    '&:hover': {
      backgroundColor: theme.buttonHoverBg,
    },
  },
  fillSvg: {
    fill: theme.textColorDark,
    color: theme.textColorDark,
    marginRight: theme.spacing(3),
  },
  pdr: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(5),
  },
}));

const getElementId = ({ businessObject: { id } }) =>
  parseInt(
    id.split('-').find((item) => Number(item)),
    10,
  );
const getElementType = ({ businessObject: { id } }) => id.split('-').shift();

// What a new comment would attach to: a real diagram element, never the root process (what an
// empty-canvas click selects); a label stands in for the element it labels.
const getCommentTarget = (selection) => {
  if (!selection) return null;
  const target = selection.type === 'label' ? selection.labelTarget : selection;
  return target && target.parent ? target : null;
};

const getCurrentUser = (info) => {
  if (!info) return null;
  const name =
    info.name ||
    [info.last_name, info.first_name].filter(Boolean).join(' ') ||
    info.email ||
    null;
  return { id: info.userId || info.id || null, name };
};

const RightSidebar = ({
  t,
  handleSaveWorkflow,
  busy,
  saved,
  error,
  selection,
  workflow,
  workflowId,
  events,
  taskTemplates,
  workflowStatuses,
  numberTemplates,
  onChangeSettings,
  modeler,
  handleChangeElement,
  handleSave,
  savingElement,
  setBusy,
  blockHotkeysEvent,
  isPristine,
  onSelectElement,
}) => {
  const [open, setOpen] = React.useState(true);
  const [mode, setMode] = React.useState(MODE_PROPERTIES);
  const userInfo = useSelector(({ auth }) => auth && auth.info);
  const currentUser = React.useMemo(() => getCurrentUser(userInfo), [userInfo]);
  const { comments, loading: commentsLoading, error: commentsError, addComment, removeComment } =
    useWorkflowComments(workflowId);
  const commentTarget = getCommentTarget(selection);
  const [mounted, setMounter] = React.useState(true);
  const [errors, setErrors] = React.useState([]);

  const classes = useStyles();

  const chosenElement = selection && formElements[selection.type];

  React.useEffect(() => {
    const listenChange = async () => {
      setMounter(false);
      await awaitDelay(300);
      setMounter(true);
    };

    listenChange();
  }, [selection]);

  const workflowSchema = schema({
    t,
    taskTemplates,
    events,
    workflowStatuses,
    numberTemplates,
  });

  const unitSettingsSchema = unitSchema({ t });

  const handleSaveAction = async () => {
    if (savingElement || busy) return;

    const errors = validateData(workflow, workflowSchema);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    setErrors([]);

    await handleSave();

    handleSaveWorkflow();
  };

  const handleOpen = () => setOpen(!open);

  const handleModeChange = (event, value) => {
    if (value) setMode(value);
    setOpen(true);
  };

  const showElementComments = React.useCallback(
    (elementId) => {
      setMode(MODE_COMMENTS);
      setOpen(true);
      onSelectElement(elementId);
    },
    [onSelectElement],
  );

  const commentPins = useCommentOverlays({ modeler, comments });

  const activeType = chosenElement
    ? `${getElementType(selection)} Id`
    : 'Workflow Id';

  const activeId = chosenElement ? getElementId(selection) : workflowId;

  return (
    <div className={classes.root}>
      <CommentPins
        t={t}
        pins={commentPins}
        selectedElementId={commentTarget ? commentTarget.id : null}
        onPinClick={showElementComments}
      />
      <div className={classes.header}>
        <div className={classes.headerControls}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAction}
            disabled={isPristine}
          >
            {busy || savingElement ? (
              <CircularProgress size={16} className={classes.fillSvg} />
            ) : null}

            {saved && error
              ? t('SavedWithError')
              : busy
                ? t('Saving')
                : t('Save')}
          </Button>

          <ToggleButtonGroup
            className={classes.modeSwitch}
            size="small"
            exclusive
            value={open ? mode : null}
            onChange={handleModeChange}
          >
            <ToggleButton value={MODE_PROPERTIES} aria-label={t('Properties')}>
              <Tooltip title={t('Properties')}>
                <TuneIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={MODE_COMMENTS} aria-label={t('Comments')}>
              <Tooltip title={t('Comments')}>
                <Badge badgeContent={comments.length} color="primary" max={99}>
                  <ChatBubbleOutlineIcon />
                </Badge>
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title={open ? t('CollapsePanel') : t('ExpandPanel')}>
            <IconButton
              onClick={handleOpen}
              aria-label={open ? t('CollapsePanel') : t('ExpandPanel')}
            >
              <SvgIcon
                component={open ? SymbolRightPanelClose : SymbolRightPanelOpen}
                inheritViewBox={true}
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div
        className={classNames({
          [classes.body]: true,
          [classes.bodyClosed]: !open,
        })}
      >
        <Paper square elevation={PANEL_ELEVATION} className={classes.surface}>
          <Scrollbar options={{ suppressScrollX: true }}>
            <div
              className={classNames({
                [classes.pdr]: true,
                [classes.bodyToggled]: !mounted && mode === MODE_PROPERTIES,
              })}
            >
              <Divider className={classes.divider} />

              {mode === MODE_COMMENTS ? (
                <CommentsPanel
                  t={t}
                  comments={comments}
                  loading={commentsLoading}
                  error={commentsError}
                  selection={commentTarget}
                  modeler={modeler}
                  currentUser={currentUser}
                  onAdd={addComment}
                  onRemove={removeComment}
                  onSelectElement={onSelectElement}
                />
              ) : (
                <>
                <Typography className={classes.sidebarHeadline}>
                  <span>{activeType}</span>
                  <div
                    className={classes.copyButton}
                    onClick={() => navigator.clipboard.writeText(activeId)}
                  >
                    {activeId}
                    <Tooltip title={t('Copy')}>
                      <IconButton className={classes.copyIcon} size="large">
                        <img src={Copy} alt={'copy'} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Typography>
  
                <CreateParallelGatewayEnding
                  t={t}
                  modeler={modeler}
                  selection={selection}
                  classes={classes}
                />
  
                <Divider className={classes.divider} />
  
                {chosenElement ? (
                  <ElementDetails
                    t={t}
                    numberTemplates={numberTemplates}
                    selectionId={selection?.businessObject?.id}
                    selection={selection}
                    workflow={workflow}
                    modeler={modeler}
                    onChange={handleChangeElement}
                    handleSave={handleSave}
                    busy={busy}
                    savingElement={savingElement}
                    setBusy={setBusy}
                    blockHotkeysEvent={blockHotkeysEvent}
                    classes={classes}
                  />
                ) : (
                  <WorkflowSettings
                    t={t}
                    busy={busy}
                    errors={errors}
                    setErrors={setErrors}
                    workflow={workflow}
                    handleChangeWorkflow={onChangeSettings}
                    events={events}
                    taskTemplates={taskTemplates}
                    workflowStatuses={workflowStatuses}
                    numberTemplates={numberTemplates}
                    onChange={onChangeSettings}
                    workflowSchema={workflowSchema}
                    unitSettingsSchema={unitSettingsSchema}
                    modeler={modeler}
                    handleSave={handleSaveAction}
                    isPristine={isPristine}
                  />
                )}
                </>
              )}
            </div>
          </Scrollbar>
        </Paper>
      </div>
    </div>
  );
};

RightSidebar.propTypes = {
  t: PropTypes.func.isRequired,
  handleSaveWorkflow: PropTypes.func.isRequired,
  busy: PropTypes.bool.isRequired,
  saved: PropTypes.bool,
  error: PropTypes.object,
  selection: PropTypes.object,
  workflow: PropTypes.object.isRequired,
  workflowId: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  taskTemplates: PropTypes.array.isRequired,
  workflowStatuses: PropTypes.array.isRequired,
  numberTemplates: PropTypes.array.isRequired,
  onChangeSettings: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  isPristine: PropTypes.bool,
  onSelectElement: PropTypes.func,
};

RightSidebar.defaultProps = {
  saved: false,
  error: null,
  selection: null,
  isPristine: false,
  onSelectElement: () => null,
};

export default RightSidebar;
