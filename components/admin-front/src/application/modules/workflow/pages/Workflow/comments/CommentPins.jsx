import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ButtonBase, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';

// The comment-count badge on a commented canvas element: just the number in a circle (it
// stretches into a pill from two digits), with "N comments" on hover. Rendered through a
// portal into the overlay container useCommentOverlays places on the element.

const BADGE_SIZE = 6; // spacing units → 24px

const useStyles = makeStyles((theme) => ({
  badge: {
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1,
    minWidth: theme.spacing(BADGE_SIZE),
    height: theme.spacing(BADGE_SIZE),
    padding: theme.spacing(0, 1.5),
    borderRadius: theme.spacing(BADGE_SIZE / 2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[2]
  },
  selected: {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`
  }
}));

const CommentPins = ({ t, pins, selectedElementId, onPinClick }) => {
  const classes = useStyles();

  return pins.map(({ elementId, count, container }) =>
    ReactDOM.createPortal(
      <Tooltip
        title={count === 1 ? t('OneComment') : t('CommentsCount', { count })}
        placement="top"
      >
        <ButtonBase
          className={classNames(classes.badge, {
            [classes.selected]: elementId === selectedElementId
          })}
          onClick={(event) => {
            event.stopPropagation();
            onPinClick(elementId);
          }}
        >
          {count}
        </ButtonBase>
      </Tooltip>,
      container,
      elementId
    )
  );
};

CommentPins.propTypes = {
  t: PropTypes.func.isRequired,
  pins: PropTypes.array.isRequired,
  selectedElementId: PropTypes.string,
  onPinClick: PropTypes.func.isRequired
};

CommentPins.defaultProps = {
  selectedElementId: null
};

export default CommentPins;
