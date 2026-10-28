import React from 'react';

// "On this page" sub-nav active-highlighting, shared by every page that has one (Typography,
// Buttons, Inputs, Colors, Surfaces). `ids` is the full ordered list of this page's own anchor
// ids, including its own top-level id — whichever one is currently intersecting a thin band
// near the top of the viewport (rootMargin: '-10% 0px -80% 0px', the same idea as a reading-
// progress indicator) is returned as `activeId`, or `null` while none of them do.
//
// A short final section can never scroll into that band if the page doesn't have enough room
// below it — the page simply runs out of scroll before the section reaches the band. So once
// the actual scroll container (StyleGuideChrome's content column, an overflow:auto div — found
// by walking up from the first observed element, not assumed to be the window) has reached its
// own scroll-bottom, the last id in `ids` wins regardless of the observer.
//
// Both the scroll listener and the IntersectionObserver callback independently re-check
// "are we at the bottom right now" before deciding what to report, rather than one unconditionally
// overwriting the other — an instant jump to the bottom (e.g. clicking the last sub-nav item)
// fires both the scroll listener and, asynchronously, the observer for whichever section briefly
// passed through the band on the way down; if the observer's callback happened to run after the
// scroll listener's, it would silently overwrite the correct last-item result with that stale
// section. Re-checking the bottom condition at call time, in both places, is what keeps "at the
// bottom" authoritative regardless of which callback happens to fire last.
const findScrollContainer = (element) => {
  let node = element?.parentElement;
  while (node) {
    const style = getComputedStyle(node);
    if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentElement;
  }
  return document.documentElement;
};

export const useSectionScrollspy = (ids) => {
  const [activeId, setActiveId] = React.useState(null);

  React.useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) {
      return undefined;
    }

    const lastId = ids[ids.length - 1];
    const scrollContainer = findScrollContainer(elements[0]);
    const isAtBottom = () =>
      scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAtBottom()) {
          setActiveId(lastId);
          return;
        }
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    elements.forEach((element) => observer.observe(element));

    const handleScroll = () => {
      if (isAtBottom()) {
        setActiveId(lastId);
      }
    };
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')]);

  return activeId;
};
