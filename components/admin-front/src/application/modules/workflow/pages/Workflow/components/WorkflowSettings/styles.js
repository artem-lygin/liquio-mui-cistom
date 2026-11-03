const styles = (theme) => ({
  exportButton: {
    color: theme?.navigator?.navItem?.linkActiveColor,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(7),
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
  actionWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    width: 'calc(100% + 17px)',
    position: 'relative',
    left: -8,
    '&:hover': {
      backgroundColor: theme.buttonHoverBg,
    },
  },
  actionLabel: {
    fontWeight: 500,
    lineHeight: '19px',
    color: '#FFFFFF',
    fontSize: 16,
    textTransform: 'initial',
    textAlign: 'left',
  },
  addTableWrapper: {
    marginBottom: theme.spacing(5),
    width: 'calc(100% + 12px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fill: theme.textColorDark,
    marginRight: theme.spacing(1),
  },
  dialogTitle: {
    paddingBottom: 0,
    paddingTop: theme.spacing(8),
    '& h2': {
      fontWeight: 400,
      fontSize: 32,
      lineHeight: '38px',
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  dialogPaper: {
    background: theme?.navigator?.sidebarBg,
    width: 780,
    maxWidth: 780,
    [theme.breakpoints.down('lg')]: {
      maxWidth: '100%',
    },
  },
  dialogActionsRoot: {
    padding: theme.spacing(0, 6),
    paddingBottom: theme.spacing(6),
  },
  biggerLabel: {
    fontSize: 16,
    lineHeight: '19px',
  },
  actionWrapperMargin: {
    marginBottom: theme.spacing(5),
  },
  closeDialog: {
    color: theme?.navigator?.navItem?.linkActiveColor,
    '&:hover': {
      backgroundColor: theme.buttonHoverBg,
    },
  },
  noMargin: {
    marginBottom: 0,
  },
  exportBlockWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editorLabel: {
    marginBottom: theme.spacing(3),
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  firstStatus: {
    marginTop: theme.spacing(8),
  },
  statusWrapper: {
    marginBottom: theme.spacing(8),
    '& > div': {
      width: '100%',
      maxWidth: '100%',
    },
    '& .MuiFormControl-fullWidth': {
      maxWidth: '100%',
    },
  },
  deleteButtonContainer: {
    float: 'right',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  switchWrapper: {
    marginBottom: theme.spacing(4),
  },
});

export default styles;
