const styles = (theme) => ({
  clearIndicator: {
    color: 'rgb(153, 153, 153)',
  },
  option: {
    fontSize: 16,
    lineHeight: '24px',
    padding: 8,
    '&:hover': {
      backgroundColor: 'rgb(245, 245, 245)',
      color: '#000',
    },
    [theme.breakpoints.down('md')]: {
      lineHeight: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      lineHeight: '17px',
    },
  },
  inputLabel: {
    fontSize: 16,
  },
});

export default styles;
