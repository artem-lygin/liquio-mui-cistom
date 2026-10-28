import React from 'react';
import { Typography, Button } from '@mui/material';

// Clamps a description to 5 lines via -webkit-line-clamp (works on the rendered JSX as-is,
// regardless of the nested <span>s some descriptions use for inline monospace terms) and
// only shows a More/Less toggle when the content actually overflows that clamp — comparing
// scrollHeight (the un-clamped content height, which the clamp doesn't shrink) against
// clientHeight (the clamped, visible height) is the standard way to detect that without
// re-measuring text manually.
const ExpandableDescription = ({ children }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);
  const textRef = React.useRef(null);

  React.useEffect(() => {
    const el = textRef.current;
    if (el) setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  return (
    <div>
      <Typography
        ref={textRef}
        variant="body1"
        color="textSecondary"
        style={{
          maxWidth: 640,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 5,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden'
        }}
      >
        {children}
      </Typography>
      {overflowing ? (
        <Button
          size="small"
          onClick={() => setExpanded((value) => !value)}
          style={{ marginTop: 4, padding: 0, minWidth: 'auto', textTransform: 'none' }}
        >
          {expanded ? 'Less' : 'More'}
        </Button>
      ) : null}
    </div>
  );
};

export default ExpandableDescription;
