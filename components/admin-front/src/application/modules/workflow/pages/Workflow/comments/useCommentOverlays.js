import React from 'react';

// Comment badges on the BPMN canvas. They're diagram-js overlays: DOM drawn on top of the
// canvas and attached to an element (they follow it on move/zoom), but not part of the BPMN
// XML — so comments never touch the schema, Save, or the unsaved-changes state.
//
// This hook only places an empty container per commented element; the badge itself is React
// (CommentPins portals into each container), so it gets the theme and a MUI Tooltip.

const OVERLAY_TYPE = 'workflow-comment';

const useCommentOverlays = ({ modeler, comments }) => {
  const [pins, setPins] = React.useState([]);
  // One container per element, reused across re-syncs so badges (and open tooltips) don't
  // remount on every diagram change.
  const containers = React.useRef(new Map());

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

    const getContainer = (elementId) => {
      if (!containers.current.has(elementId)) {
        containers.current.set(elementId, document.createElement('div'));
      }
      return containers.current.get(elementId);
    };

    const sync = () => {
      const overlays = modeler.get('overlays');
      const elementRegistry = modeler.get('elementRegistry');
      overlays.remove({ type: OVERLAY_TYPE });

      const next = [];
      Object.entries(counts).forEach(([elementId, count]) => {
        const element = elementRegistry.get(elementId);
        if (!element) return; // element was deleted — the comment stays, unpinned
        const container = getContainer(elementId);
        overlays.add(element, OVERLAY_TYPE, {
          // Top-left: bpmn-js's context pad (the selected element's tool palette) owns the
          // top-right corner.
          position: { top: -12, left: -12 },
          html: container
        });
        next.push({ elementId, count, container });
      });
      setPins(next);
    };

    sync();
    // Re-import wipes overlays; undo/redo can bring a deleted element (and its pin) back.
    modeler.on('import.done', sync);
    modeler.on('commandStack.changed', sync);

    return () => {
      modeler.off('import.done', sync);
      modeler.off('commandStack.changed', sync);
    };
  }, [modeler, counts]);

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

  return pins;
};

export default useCommentOverlays;
