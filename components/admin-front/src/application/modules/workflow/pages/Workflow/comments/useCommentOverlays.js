import React from 'react';
import { useTheme } from '@mui/material/styles';

// Comment pins on the BPMN canvas. They're diagram-js overlays: DOM drawn on top of the canvas
// and attached to an element (they follow it on move/zoom), but not part of the BPMN XML — so
// comments never touch the schema, Save, or the unsaved-changes state.

const OVERLAY_TYPE = 'workflow-comment';

// @mui/icons-material ChatBubbleOutline
const ICON_PATH =
  'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z';

const createPin = (theme, count, selected, onClick) => {
  const pin = document.createElement('button');
  pin.type = 'button';
  pin.title = String(count);
  Object.assign(pin.style, {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.25, 0.75),
    border: 'none',
    borderRadius: `${theme.shape.borderRadius}px`,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: selected
      ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`
      : theme.shadows[2]
  });
  pin.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${ICON_PATH}"/></svg><span>${count}</span>`;
  pin.addEventListener('click', (event) => {
    event.stopPropagation();
    onClick();
  });
  return pin;
};

const useCommentOverlays = ({ modeler, comments, selectedElementId, onPinClick }) => {
  const theme = useTheme();
  const onPinClickRef = React.useRef(onPinClick);
  onPinClickRef.current = onPinClick;

  const counts = React.useMemo(
    () =>
      comments.reduce((acc, { anchor }) => {
        if (anchor && anchor.elementId) acc[anchor.elementId] = (acc[anchor.elementId] || 0) + 1;
        return acc;
      }, {}),
    [comments]
  );

  React.useEffect(() => {
    if (!modeler) return undefined;

    const sync = () => {
      const overlays = modeler.get('overlays');
      const elementRegistry = modeler.get('elementRegistry');
      overlays.remove({ type: OVERLAY_TYPE });

      Object.entries(counts).forEach(([elementId, count]) => {
        const element = elementRegistry.get(elementId);
        if (!element) return; // element was deleted — the comment stays, unpinned
        overlays.add(element, OVERLAY_TYPE, {
          // Top-left: bpmn-js's context pad (the selected element's tool palette) owns the
          // top-right corner.
          position: { top: -12, left: -12 },
          html: createPin(theme, count, elementId === selectedElementId, () =>
            onPinClickRef.current(elementId)
          )
        });
      });
    };

    sync();
    // Re-import wipes overlays; undo/redo can bring a deleted element (and its pin) back.
    modeler.on('import.done', sync);
    modeler.on('commandStack.changed', sync);

    return () => {
      modeler.off('import.done', sync);
      modeler.off('commandStack.changed', sync);
    };
  }, [modeler, counts, selectedElementId, theme]);

  React.useEffect(
    () => () => {
      try {
        if (modeler) modeler.get('overlays').remove({ type: OVERLAY_TYPE });
      } catch (error) {
        // modeler already destroyed along with the page
      }
    },
    [modeler]
  );
};

export default useCommentOverlays;
