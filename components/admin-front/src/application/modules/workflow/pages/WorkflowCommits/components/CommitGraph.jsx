// PoC (poc/git-version-control): one row's slice of the commit graph (see ../graph.js).
// Drawn over the whole table cell, padding included, so lines meet the rows above and below.
// Lines are an SVG stretched to the row's height (strokes stay 2px whatever the stretch);
// the dot is a separate element, so it stays round.
import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Lane spacing and the gap before the first lane / after the last one, in px.
const LANE = 16;
const EDGE = 8;
const DOT = 10;

export const graphWidth = (lanes) => EDGE * 2 + Math.max(lanes, 1) * LANE;

const laneX = (lane) => EDGE + LANE / 2 + lane * LANE;

// One color per lane, from the palette, repeating after four lanes.
const laneColors = (theme) => [
  theme.palette.primary.main,
  theme.palette.info.main,
  theme.palette.success.main,
  theme.palette.warning.main
];

const CommitGraph = ({ node, lanes }) => {
  const theme = useTheme();
  if (!node) return null;

  const colors = laneColors(theme);
  const color = (lane) => colors[lane % colors.length];
  const x = laneX(node.lane);
  const width = graphWidth(lanes);

  // viewBox height 100: 0 is the row's top edge, 50 the dot, 100 the bottom edge.
  const paths = [
    ...node.through.map((lane) => ({ lane, d: `M ${laneX(lane)} 0 V 100` })),
    node.top ? { lane: node.lane, d: `M ${x} 0 V 50` } : null,
    node.bottom ? { lane: node.lane, d: `M ${x} 50 V 100` } : null,
    // A child on another lane: from the top of its lane into the dot.
    ...node.joins.map((lane) => ({
      lane,
      d: `M ${laneX(lane)} 0 C ${laneX(lane)} 35, ${x} 15, ${x} 50`
    })),
    // A merge's extra parent: from the dot down to that parent's lane.
    ...node.forks.map((lane) => ({
      lane,
      d: `M ${x} 50 C ${x} 85, ${laneX(lane)} 65, ${laneX(lane)} 100`
    }))
  ].filter(Boolean);

  return (
    <Box position="absolute" top={0} bottom={0} left={0} width={width} aria-hidden={true}>
      <svg
        width={width}
        height="100%"
        viewBox={`0 0 ${width} 100`}
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {paths.map(({ lane, d }) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={color(lane)}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <Box
        position="absolute"
        top="50%"
        left={x}
        width={DOT}
        height={DOT}
        borderRadius="50%"
        bgcolor={color(node.lane)}
        sx={{ transform: 'translate(-50%, -50%)' }}
      />
    </Box>
  );
};

export default CommitGraph;
