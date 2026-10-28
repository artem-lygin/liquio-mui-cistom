import React from 'react';

// Hover-to-measure: wraps a demo area and, on mouse move, finds whichever descendant
// element is directly under the cursor (via elementFromPoint, so it works for any nested
// child without each demo needing its own ref/instrumentation) and draws an outline + a
// live "W × H" badge over it. Pointer events pass straight through — the overlay box/badge
// are position:absolute + pointerEvents:'none', so demo controls stay fully clickable.
// A fixed highlight color (not theme-driven) — this is a dev-tool overlay, not a themed
// fact, so it should stand out the same way in both the light and dark app.
const MEASURE_COLOR = '#ffca28';

// Margin (outside the border box) gets a cyan tint; padding (inside it, between border and
// content) a yellow one, matching the element's own yellow outline/badge — padding is "part
// of the element's own box" the same way that outline is, margin is external to it.
const BOX_MODEL_COLORS = { margin: 'rgba(0, 188, 212, 0.3)', padding: 'rgba(255, 202, 40, 0.25)' };
const MARGIN_LABEL_COLOR = '#00bcd4';

const parseEdges = (style, prop) => ({
  top: parseFloat(style[`${prop}Top`]) || 0,
  right: parseFloat(style[`${prop}Right`]) || 0,
  bottom: parseFloat(style[`${prop}Bottom`]) || 0,
  left: parseFloat(style[`${prop}Left`]) || 0
});

// Below this thickness (px), a centered margin label wouldn't fit inside its own strip —
// those move just outside the strip instead, as a small solid pill (padding's labels always
// dock to the border line regardless of thickness, so they don't need this).
const MIN_LABEL_THICKNESS = 14;

// Margin strips sit outside the element's border box (expanding outward). A label centers
// inside its strip when there's room; otherwise it's pushed just outside as a small pill.
const renderMarginStrips = (box, edges) => {
  const sides = [
    { key: 'top', out: 'up', value: edges.top, style: { top: box.top - edges.top, left: box.left - edges.left, width: box.width + edges.left + edges.right, height: edges.top } },
    {
      key: 'bottom',
      out: 'down',
      value: edges.bottom,
      style: { top: box.top + box.height, left: box.left - edges.left, width: box.width + edges.left + edges.right, height: edges.bottom }
    },
    { key: 'left', out: 'left', value: edges.left, style: { top: box.top, left: box.left - edges.left, width: edges.left, height: box.height } },
    { key: 'right', out: 'right', value: edges.right, style: { top: box.top, left: box.left + box.width, width: edges.right, height: box.height } }
  ];

  return sides
    .filter((side) => side.value > 0)
    .flatMap((side) => {
      const strip = (
        <div
          key={`margin-${side.key}-strip`}
          style={{ position: 'absolute', background: BOX_MODEL_COLORS.margin, pointerEvents: 'none', zIndex: 1, boxSizing: 'border-box', ...side.style }}
        />
      );
      const label = Math.round(side.value);
      const thickness = side.out === 'up' || side.out === 'down' ? side.style.height : side.style.width;
      const fitsInline = thickness >= MIN_LABEL_THICKNESS;
      const outsidePos = {
        up: { top: side.style.top - 13, left: side.style.left, width: side.style.width, textAlign: 'center' },
        down: { top: side.style.top + side.style.height + 1, left: side.style.left, width: side.style.width, textAlign: 'center' },
        left: {
          top: side.style.top,
          left: side.style.left - 24,
          height: side.style.height,
          width: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        },
        right: { top: side.style.top, left: side.style.left + side.style.width + 2, height: side.style.height, display: 'flex', alignItems: 'center' }
      }[side.out];
      const inlineLabelStyle = {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontFamily: 'ui-monospace, Menlo, monospace',
        color: 'rgba(0, 0, 0, 0.75)',
        pointerEvents: 'none',
        zIndex: 2,
        ...side.style
      };
      const outsideLabelStyle = {
        position: 'absolute',
        fontSize: 9,
        fontFamily: 'ui-monospace, Menlo, monospace',
        color: '#000',
        background: MARGIN_LABEL_COLOR,
        borderRadius: 2,
        padding: '0 3px',
        lineHeight: '13px',
        pointerEvents: 'none',
        zIndex: 2,
        ...outsidePos
      };
      return [
        strip,
        <div key={`margin-${side.key}-label`} style={fitsInline ? inlineLabelStyle : outsideLabelStyle}>
          {label}
        </div>
      ];
    });
};

// Padding strips sit inside the border box (inset from the border edge toward content). Its
// label always docks right on the border line as a small yellow pill straddling that edge —
// unlike margin, this doesn't depend on the strip being thick enough, so a 1px padding is
// exactly as readable as a 16px one.
const renderPaddingStrips = (box, edges) => {
  const sides = [
    { key: 'top', value: edges.top, strip: { top: box.top, left: box.left, width: box.width, height: edges.top }, dock: { top: box.top, left: box.left + box.width / 2 } },
    {
      key: 'bottom',
      value: edges.bottom,
      strip: { top: box.top + box.height - edges.bottom, left: box.left, width: box.width, height: edges.bottom },
      dock: { top: box.top + box.height, left: box.left + box.width / 2 }
    },
    {
      key: 'left',
      value: edges.left,
      strip: { top: box.top + edges.top, left: box.left, width: edges.left, height: Math.max(box.height - edges.top - edges.bottom, 0) },
      dock: { top: box.top + box.height / 2, left: box.left }
    },
    {
      key: 'right',
      value: edges.right,
      strip: {
        top: box.top + edges.top,
        left: box.left + box.width - edges.right,
        width: edges.right,
        height: Math.max(box.height - edges.top - edges.bottom, 0)
      },
      dock: { top: box.top + box.height / 2, left: box.left + box.width }
    }
  ];

  return sides
    .filter((side) => side.value > 0)
    .flatMap((side) => [
      <div
        key={`padding-${side.key}-strip`}
        style={{ position: 'absolute', background: BOX_MODEL_COLORS.padding, pointerEvents: 'none', zIndex: 1, boxSizing: 'border-box', ...side.strip }}
      />,
      <div
        key={`padding-${side.key}-label`}
        style={{
          position: 'absolute',
          top: side.dock.top,
          left: side.dock.left,
          transform: 'translate(-50%, -50%)',
          background: MEASURE_COLOR,
          color: '#000',
          fontSize: 9,
          fontFamily: 'ui-monospace, Menlo, monospace',
          padding: '0 3px',
          borderRadius: 2,
          lineHeight: '13px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 3
        }}
      >
        {Math.round(side.value)}
      </div>
    ]);
};

const MeasureOverlay = ({ enabled, children }) => {
  const containerRef = React.useRef(null);
  const [box, setBox] = React.useState(null);

  React.useEffect(() => {
    if (!enabled) {
      setBox(null);
    }
  }, [enabled]);

  const handleMouseMove = (event) => {
    if (!enabled || !containerRef.current) {
      return;
    }
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (!target || target === containerRef.current || !containerRef.current.contains(target)) {
      setBox(null);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const style = window.getComputedStyle(target);
    setBox({
      top: rect.top - containerRect.top,
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height,
      margin: parseEdges(style, 'margin'),
      padding: parseEdges(style, 'padding')
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setBox(null)}
      // Padding gives outside-placed margin labels (see renderMarginStrips) and the W×H
      // badge room to sit clear of the container's own edges instead of clipping against
      // them.
      style={{ position: 'relative', padding: 24 }}
    >
      {children}
      {box ? (
        <>
          {renderMarginStrips(box, box.margin)}
          {renderPaddingStrips(box, box.padding)}
          <div
            style={{
              position: 'absolute',
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              border: `1px dashed ${MEASURE_COLOR}`,
              boxSizing: 'border-box',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
          <div
            style={{
              position: 'absolute',
              // Always slightly above the element, rather than flipping below when tight
              // on room — consistent placement beats occasionally-better-fitting placement.
              top: box.top - 20,
              left: box.left,
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: 11,
              lineHeight: '16px',
              whiteSpace: 'nowrap',
              padding: '1px 5px',
              borderRadius: 3,
              background: MEASURE_COLOR,
              color: '#000',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {`${Math.round(box.width)} × ${Math.round(box.height)}`}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default MeasureOverlay;
