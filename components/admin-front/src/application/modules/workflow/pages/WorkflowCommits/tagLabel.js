// PoC (poc/git-version-control): display label of a commit's git tag. The tag itself stays
// lowercase ('current'); on screen it starts with a capital ("Current"). Versions ('1.3')
// show as they are.
const tagLabel = (tag) => tag.charAt(0).toUpperCase() + tag.slice(1);

export default tagLabel;
