import React from 'react';

// "On this page" sub-nav active-highlighting, shared by every page that has one (Typography,
// Buttons, Inputs, Colors, Surfaces). `ids` is the full ordered list of this page's own anchor
// ids, including its own top-level id — whichever one is currently intersecting a thin band
// near the top of the viewport (rootMargin: '-10% 0px -80% 0px', the same idea as a reading-
// progress indicator) is returned as `activeId`, or `null` while none of them do.
//
// A short final section can never scroll into that band if the page doesn't have enough room
// below it — the page simply runs out of scroll before the section reaches the band. So once
// whichever element actually scrolled has reached its own bottom, the last id in `ids` wins
// regardless of the observer. The scrolling element here is StyleGuideChrome's content column
// (an overflow:auto div), not the window — a 'scroll' event on it doesn't bubble, but a
// capture-phase listener on the document still sees it on the way down to that element.
export const useSectionScrollspy = (ids) => {
  const [activeId, setActiveId] = React.useState(null);

  React.useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    elements.forEach((element) => observer.observe(element));

    const lastId = ids[ids.length - 1];
    const handleScroll = (event) => {
      const target = event.target === document ? document.documentElement : event.target;
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 2) {
        setActiveId(lastId);
      }
    };
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('scroll', handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')]);

  return activeId;
};
