// PoC (poc/git-version-control): one row's slice of the commit graph (see ../graph.js).
// Drawn over the whole table cell, padding included, so lines meet the rows above and below.
// Lines are an SVG stretched to the row's height (strokes stay 2px whatever the stretch);
// the dot is a separate element, so it stays round.
//
// Every lane is the same dim gray (grey 800, kept quiet so the table reads first). While a
// row is hovered, its commit's ancestry (the lines and dots it comes from, down to the first
// commit) turns almost white; `highlighted` is that set of SHAs (empty when nothing is
// hovered).
import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Lane spacing and the gap before the first lane / after the last one, in px.
const LANE = 16;
const EDGE = 8;
const DOT = 10;

export const graphWidth = (lanes) => EDGE * 2 + Math.max(lanes, 1) * LANE;

const laneX = (lane) => EDGE + LANE / 2 + lane * LANE;

const CommitGraph = ({ sha, node, lanes, highlighted }) => {
  const theme = useTheme();
  if (!node) return null;

  const restColor = theme.palette.grey[800];
  const highlightColor = theme.palette.text.primary;
  const isOn = (from) => highlighted.has(from);
  const x = laneX(node.lane);
  const width = graphWidth(lanes);

  // viewBox height 100: 0 is the row's top edge, 50 the dot, 100 the bottom edge. Each line
  // carries the commit it leads down from, which decides whether it's highlighted.
  const paths = [
    ...node.through.map(({ lane, from }) => ({ from, d: `M ${laneX(lane)} 0 V 100` })),
    node.top ? { from: node.top, d: `M ${x} 0 V 50` } : null,
    node.bottom ? { from: sha, d: `M ${x} 50 V 100` } : null,
    // A child on another lane: from the top of its lane into the dot.
    ...node.joins.map(({ lane, from }) => ({
      from,
      d: `M ${laneX(lane)} 0 C ${laneX(lane)} 35, ${x} 15, ${x} 50`
    })),
    // A merge's extra parent: from the dot down to that parent's lane.
    ...node.forks.map((lane) => ({
      from: sha,
      d: `M ${x} 50 C ${x} 85, ${laneX(lane)} 65, ${laneX(lane)} 100`
    }))
  ]
    .filter(Boolean)
    // Highlighted lines last, so they're drawn over gray ones where lines meet.
    .sort((a, b) => Number(isOn(a.from)) - Number(isOn(b.from)));

  return (
    // data-commit-sha: lets the page tell which row the pointer is over.
    <Box
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      width={width}
      aria-hidden={true}
      data-commit-sha={sha}
    >
      <svg
        width={width}
        height="100%"
        viewBox={`0 0 ${width} 100`}
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {paths.map(({ from, d }) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={isOn(from) ? highlightColor : restColor}
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
        bgcolor={isOn(sha) ? highlightColor : restColor}
        sx={{ transform: 'translate(-50%, -50%)' }}
      />
    </Box>
  );
};

export default CommitGraph;
