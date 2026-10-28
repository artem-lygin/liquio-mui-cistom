import { TextField } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// "Reddit style" input, adapted from MUI's own docs reference (mui.com/material-ui/
// react-text-field → "Customized inputs" → RedditTextField). A ONE-OFF styled(TextField)
// wrapper — deliberately NOT a global MuiFilledInput theme override. A global override was
// tried first and reverted: it affects every variant="filled" input app-wide, and admin-front
// already has one in production (the Header's search field, its own custom background/
// radius/underline handling) — the override silently added an unwanted border and a second,
// redundant focus ring on top of it. Scoping via a nested selector on this wrapper's own
// generated class instead means it only ever applies where this component is explicitly used
// (currently just the Text field demo below).
//
// Colors reuse existing cross-app theme keys, not new literals or this file's own magic
// numbers — theme.buttonHoverBg (the same key this app already uses for button/sidebar hover
// fills) and theme.borderColor (the same line color the sidebar/header separators use).
// Admin-focused exploration, not yet checked under cabinet-front specifically: cabinet's own
// buttonHoverBg is a bright yellow (#ffe565, a genuinely different design concept there, not
// just a different shade of the same idea admin uses it for), so this demo likely looks
// broken rather than merely "differently themed" when the Style Guide runs under cabinet. No
// light/dark split (the reference's theme.applyStyles) — no app this guide runs under has a
// light mode to switch between.
//
// No label color override (there was one — red while empty, normal once shrunk/filled — since
// removed at the product designer's direction: clearing a field's content shouldn't read as
// an error). Label now just uses "filled"'s own native behavior untouched, same as MUI's
// reference.
const RedditTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 4,
    border: '1px solid',
    backgroundColor: theme.buttonHoverBg,
    borderColor: theme.borderColor,
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main
    },
    // Declared after &.Mui-focused so it wins on equal specificity when both apply — an
    // invalid field should read as red even while focused, not fall back to the primary ring.
    '&.Mui-error': {
      borderColor: theme.palette.error.main
    }
  }
}));

export default RedditTextField;
