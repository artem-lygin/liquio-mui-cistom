// PoC (poc/git-version-control): one-line preview of a commit message. Messages can be any
// length (subject line, blank line, body); the preview is just the subject, with "…" when
// the message has more lines. Pair with noWrap so an overflowing subject also ends in "…".
const getMessagePreview = (message = '') => {
  const [subject, ...rest] = message.split('\n');
  return rest.join('').trim() ? `${subject} …` : subject;
};

export default getMessagePreview;
