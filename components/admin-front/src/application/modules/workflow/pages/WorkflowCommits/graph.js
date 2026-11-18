// PoC (poc/git-version-control): lays out the commit graph (like `git log --graph`) for the
// rows the table shows, newest first. Each lane is a vertical line; a commit sits on one lane
// as a dot. Where a commit has several children (a branch starts there), the children's
// lanes curve into it; a merge (several parents) curves out of it into its parents' lanes.
//
// The graph is laid out over the rows actually shown (after "Releases only" and search), so
// it never points at a hidden commit: a hidden parent is skipped to its nearest shown
// ancestor. Lanes keep their position while active, so every row is self-contained and
// pagination can cut the list anywhere.
//
// Every line segment remembers the child commit it leads down from (`from`), so hovering a
// commit can highlight exactly the lines of its ancestry: a segment is on that path when its
// `from` commit is the hovered commit or one of its ancestors.

// Parents of `commit` among the shown rows: each hidden parent is replaced by its own
// parents, recursively, until a shown commit is reached.
const shownParents = (commit, bySha, shown) => {
  const result = [];
  const seen = new Set();
  const queue = [...(commit.parents || [])];
  while (queue.length) {
    const sha = queue.shift();
    if (seen.has(sha)) continue;
    seen.add(sha);
    if (shown.has(sha)) {
      result.push(sha);
    } else {
      queue.unshift(...(bySha.get(sha)?.parents || []));
    }
  }
  return result;
};

const freeLane = (lanes) => {
  const index = lanes.indexOf(null);
  if (index !== -1) return index;
  lanes.push(null);
  return lanes.length - 1;
};

// rows: the shown commits, newest first. allCommits: the whole history (to skip hidden ones).
// Returns { lanes, nodes }: the number of lanes to make room for, and per SHA:
// - lane:    the commit's lane
// - parents: its shown parents
// - top:     the child whose line comes down its lane into the dot (null: a branch tip)
// - bottom:  its lane continues downwards (it has a shown parent)
// - through: other lines passing this row top to bottom, as { lane, from }
// - joins:   other children's lines ending here (curve from the top into the dot), { lane, from }
// - forks:   lanes of extra parents of a merge (curve from the dot to the bottom)
const layoutGraph = (rows, allCommits) => {
  const bySha = new Map(allCommits.map((commit) => [commit.sha, commit]));
  const shown = new Set(rows.map((commit) => commit.sha));
  // Per lane: the SHA it's waiting for next (going down the list) and the child it comes
  // from, or null for a free lane.
  const lanes = [];
  const nodes = new Map();
  let width = 0;

  rows.forEach((commit) => {
    const before = lanes.slice();
    const parents = shownParents(commit, bySha, shown);

    let lane = lanes.findIndex((item) => item?.sha === commit.sha);
    const top = lane !== -1 ? lanes[lane].from : null;
    if (lane === -1) lane = freeLane(lanes);

    const joins = [];
    lanes.forEach((item, index) => {
      if (item?.sha === commit.sha && index !== lane) {
        joins.push({ lane: index, from: item.from });
        lanes[index] = null;
      }
    });

    lanes[lane] = parents[0] ? { sha: parents[0], from: commit.sha } : null;

    const forks = parents.slice(1).map((sha) => {
      const existing = lanes.findIndex((item) => item?.sha === sha);
      if (existing !== -1) return existing;
      const index = freeLane(lanes);
      lanes[index] = { sha, from: commit.sha };
      return index;
    });

    const through = before
      .map((item, index) => (item && item.sha !== commit.sha ? { lane: index, from: item.from } : null))
      .filter(Boolean);

    width = Math.max(width, lanes.length, lane + 1);
    while (lanes.length && lanes[lanes.length - 1] === null) lanes.pop();

    nodes.set(commit.sha, {
      lane,
      parents,
      top,
      bottom: parents.length > 0,
      through,
      joins,
      forks
    });
  });

  return { lanes: width, nodes };
};

// The commit and all its shown ancestors: the lines to highlight while it's hovered.
export const ancestry = (graph, sha) => {
  const result = new Set();
  const queue = sha ? [sha] : [];
  while (queue.length) {
    const current = queue.shift();
    if (result.has(current)) continue;
    result.add(current);
    queue.push(...(graph.nodes.get(current)?.parents || []));
  }
  return result;
};

export default layoutGraph;
