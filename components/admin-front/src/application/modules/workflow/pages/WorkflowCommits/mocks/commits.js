// PoC (poc/git-version-control): stub git history for a workflow. There is no backend for
// commits yet, so every workflow shows this same list.
// - `message`: the commit message. Entered in a single-line text input (or generated
//   automatically), so it's one line: a phrase or a couple of sentences. No length limit, and
//   a line break is possible but rare.
// - `tags`: the commit's git tags: a process version (e.g. '1.2') and/or 'current' (the
//   commit the workflow runs now: the latest commit, versioned or not). A commit with a
//   version tag is a release.
// - `releaseComment`: a release's own notes, separate from the commit message, also any length.
// - `parents`: SHAs of the commit's parents (git's parent links). Main-line commits get the
//   next main-line commit as their parent automatically; branch commits list theirs. A
//   commit with several children is where a branch starts; the list draws them as a graph.
// - `versionCreatedBy` / `versionCreatedAt`: who made the commit a version, and when. A version
//   is created later than its commit, often by someone else (e.g. the person approving it).

const RELEASE_1_3_COMMENT = `Release 1.3 is the version approved by the registry team on 27 October.

Highlights for operators:
1. Signing now happens before submission. If you see "Signature required" on an application that was submitted earlier, it was created before this release and can be processed as usual.
2. Unpaid applications expire automatically after 96 hours (two reminders 48 hours apart). The "Expired" status is final; the applicant has to start a new application.
3. "Check documents" is assigned to the whole document officers unit. Pick an application from the shared queue instead of waiting for a personal assignment.
4. The decision form is split into three steps. Drafts are saved after each step.

Known issues:
- The reminder e-mail still uses the old template header. A fix is planned for 1.3.1.
- On very slow connections the second step of the decision form can take a few seconds to load the notification preview.

Rollback: release 1.2 stays available. Restoring it does not affect applications already in progress, but new applications will again use the old signing order.`;

// The main line, newest first. The four commits above 1.3 aren't versioned yet: any of them
// can become the next version (1.4). The newest one is current.
const mainLine = [
  {
    sha: '7b2f4d1a',
    message:
      'Save workflowTemplates 161 via editor. The reminder e-mail now uses the new template header.',
    author: 'Daniel Hughes',
    committedAt: '2026-11-10T15:12:00',
    tags: ['current']
  },
  {
    sha: 'c91e3f08',
    message: 'Save workflowTemplates 161 via MCP',
    author: 'MCP Editor',
    committedAt: '2026-11-06T11:40:00'
  },
  {
    sha: '3fa6b2c5',
    message: 'Manual backup workflowTemplates 161',
    author: 'Sophie Turner',
    committedAt: '2026-11-03T09:25:00'
  },
  {
    sha: '58d0e7b2',
    message: 'Save workflowTemplates 161 via editor. Faster loading of the notification preview.',
    author: 'Emily Carter',
    committedAt: '2026-10-30T17:05:00'
  },
  {
    sha: 'e005c6c9',
    message: 'Save workflowTemplates 161 via editor. Signing moved before submission to the registry.',
    author: 'Oliver Bennett',
    committedAt: '2026-10-27T16:34:00',
    tags: ['1.3'],
    versionCreatedBy: 'Anna Kovalenko',
    versionCreatedAt: '2026-10-28T10:15:00',
    releaseComment: RELEASE_1_3_COMMENT
  },
  {
    sha: 'd8678b83',
    message: 'Save workflowTemplates 161 via editor',
    author: 'Oliver Bennett',
    committedAt: '2026-10-21T12:21:40'
  },
  {
    sha: '362aa7e4',
    message:
      'Manual backup workflowTemplates 161. Backup before splitting the "Prepare decision" form into steps.',
    author: 'Sophie Turner',
    committedAt: '2026-10-21T12:21:10',
    tags: ['1.2'],
    versionCreatedBy: 'Oliver Bennett',
    versionCreatedAt: '2026-10-21T14:02:00',
    releaseComment:
      'Release 1.2: the version used in production from 21 October until release 1.3. Kept as the rollback point for the signing changes.'
  },
  {
    sha: '1092a109',
    message: 'Manual backup workflowTemplates 161',
    author: 'Sophie Turner',
    committedAt: '2026-10-21T12:12:00'
  },
  {
    sha: '6e9ec4f4',
    message: 'Manual backup workflowTemplates 161',
    author: 'Oliver Bennett',
    committedAt: '2026-10-21T12:08:00'
  },
  {
    sha: 'fbe0c7be',
    message:
      'Save workflowTemplates 161 via editor. Fixed the condition on the "Is payment required" gateway: free applications were routed to the payment task.',
    author: 'Daniel Hughes',
    committedAt: '2026-10-21T12:07:00'
  },
  {
    sha: '9484179f',
    message: 'Save workflowTemplates 161 via editor',
    author: 'Daniel Hughes',
    committedAt: '2026-10-21T12:06:00'
  },
  {
    sha: 'ba67468a',
    message: 'Manual backup workflowTemplates 161',
    author: 'Oliver Bennett',
    committedAt: '2026-10-21T11:57:00',
    tags: ['1.1'],
    versionCreatedBy: 'Anna Kovalenko',
    versionCreatedAt: '2026-10-21T12:00:00'
  },
  {
    sha: '89cd3102',
    message:
      'Save workflowTemplates 161 via MCP. Generated by the MCP editor from the prompt: "add a 48 hour reminder to the payment task".',
    author: 'MCP Editor',
    committedAt: '2026-10-21T11:46:00'
  },
  {
    sha: '74833895',
    message: 'Save workflowTemplates 161 via editor',
    author: 'Emily Carter',
    committedAt: '2026-10-21T11:28:00'
  },
  {
    sha: '5c1e0a77',
    message: 'Manual backup workflowTemplates 161',
    author: 'Emily Carter',
    committedAt: '2026-10-20T18:02:00'
  },
  {
    sha: 'a3f9d210',
    message: 'Save workflowTemplates 161 via editor',
    author: 'Oliver Bennett',
    committedAt: '2026-10-20T17:45:00',
    tags: ['1.0'],
    versionCreatedBy: 'Anna Kovalenko',
    versionCreatedAt: '2026-10-20T18:30:00',
    releaseComment: 'First release of the process. Approved for the pilot in two regional offices.'
  },
  {
    sha: '0b7e4c19',
    message: 'Save workflowTemplates 161 via MCP',
    author: 'MCP Editor',
    committedAt: '2026-10-20T15:31:00'
  },
  {
    sha: 'c4d82e6b',
    message: 'Save workflowTemplates 161 via editor',
    author: 'Sophie Turner',
    committedAt: '2026-10-20T14:10:00'
  },
  {
    sha: 'f19a3b05',
    message: 'Initial commit workflowTemplates 161',
    author: 'Oliver Bennett',
    committedAt: '2026-10-20T10:00:00'
  }
];

// Side branches, up to two levels deep: a hotfix branch off release 1.2, an experiment
// branched off that hotfix, and a draft branched off the main line after 1.3. None of them
// is merged back.
const branches = [
  {
    sha: '0f3b8e64',
    message: 'Save workflowTemplates 161 via editor. Draft: the decision form as a single page.',
    author: 'Emily Carter',
    committedAt: '2026-11-04T13:15:00',
    parents: ['58d0e7b2']
  },
  {
    sha: 'b81f6a3d',
    message: 'Save workflowTemplates 161 via editor. Hotfix on 1.2: corrected the reminder text.',
    author: 'Sophie Turner',
    committedAt: '2026-10-24T15:40:00',
    parents: ['4c7d19e2']
  },
  {
    sha: 'e2a95c07',
    message:
      'Save workflowTemplates 161 via MCP. Experiment on the hotfix: reminder after 24 hours instead of 48.',
    author: 'MCP Editor',
    committedAt: '2026-10-23T16:20:00',
    parents: ['4c7d19e2']
  },
  {
    sha: '4c7d19e2',
    message:
      'Save workflowTemplates 161 via editor. Hotfix on 1.2: the payment reminder was sent twice.',
    author: 'Sophie Turner',
    committedAt: '2026-10-23T10:05:00',
    parents: ['362aa7e4']
  }
];

// One history, newest first (children always come before their parents).
const commits = [
  ...mainLine.map((commit, index) => ({
    parents: mainLine[index + 1] ? [mainLine[index + 1].sha] : [],
    ...commit
  })),
  ...branches
]
  .sort((a, b) => b.committedAt.localeCompare(a.committedAt))
  .map((commit) => ({
    id: commit.sha,
    tags: [],
    releaseComment: null,
    versionCreatedBy: null,
    versionCreatedAt: null,
    ...commit
  }));

// SHAs of the main line (the branch versions are created on).
export const mainLineShas = new Set(mainLine.map((commit) => commit.sha));

export default commits;
