// PoC (poc/git-version-control): stub git history for a workflow. There is no backend for
// commits yet, so every workflow shows this same list. `version` is set only on commits
// that were tagged as a process version.
const commits = [
  ['e005c6c9', 'Save workflowTemplates 161 via editor', 'Oliver Bennett', '2026-10-27T16:34:00', '1.0'],
  ['d8678b83', 'Save workflowTemplates 161 via editor', 'Oliver Bennett', '2026-10-21T12:21:40'],
  ['362aa7e4', 'Manual backup workflowTemplates 161', 'Sophie Turner', '2026-10-21T12:21:10'],
  ['1092a109', 'Manual backup workflowTemplates 161', 'Sophie Turner', '2026-10-21T12:12:00'],
  ['6e9ec4f4', 'Manual backup workflowTemplates 161', 'Oliver Bennett', '2026-10-21T12:08:00'],
  ['fbe0c7be', 'Save workflowTemplates 161 via editor', 'Daniel Hughes', '2026-10-21T12:07:00'],
  ['9484179f', 'Save workflowTemplates 161 via editor', 'Daniel Hughes', '2026-10-21T12:06:00'],
  ['ba67468a', 'Manual backup workflowTemplates 161', 'Oliver Bennett', '2026-10-21T11:57:00'],
  ['89cd3102', 'Save workflowTemplates 161 via MCP', 'MCP Editor', '2026-10-21T11:46:00'],
  ['74833895', 'Save workflowTemplates 161 via editor', 'Emily Carter', '2026-10-21T11:28:00'],
  ['5c1e0a77', 'Manual backup workflowTemplates 161', 'Emily Carter', '2026-10-20T18:02:00'],
  ['a3f9d210', 'Save workflowTemplates 161 via editor', 'Oliver Bennett', '2026-10-20T17:45:00'],
  ['0b7e4c19', 'Save workflowTemplates 161 via MCP', 'MCP Editor', '2026-10-20T15:31:00'],
  ['c4d82e6b', 'Save workflowTemplates 161 via editor', 'Sophie Turner', '2026-10-20T14:10:00'],
  ['f19a3b05', 'Initial commit workflowTemplates 161', 'Oliver Bennett', '2026-10-20T10:00:00']
].map(([sha, message, author, committedAt, version]) => ({
  id: sha,
  sha,
  message,
  author,
  committedAt,
  version: version || null
}));

export default commits;
