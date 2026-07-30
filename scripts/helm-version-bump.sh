#!/bin/bash

# Helm chart version bump script
# Refreshes every component's package-lock.json (no version bumps), syncs their
# current package.json versions into helm-chart/templates/shared/_service-helpers.tpl,
# and bumps the chart version in helm-chart/Chart.yaml.
# Usage: ./scripts/helm-version-bump.sh [-v major|minor|patch] [-f]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPONENTS_DIR="$PROJECT_ROOT/components"
SERVICE_HELPERS_TPL="$PROJECT_ROOT/helm-chart/templates/shared/_service-helpers.tpl"
CHART_YAML="$PROJECT_ROOT/helm-chart/Chart.yaml"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_usage() {
  cat <<EOF
Usage: $0 [-v|--version major|minor|patch] [-f|--force]

Refreshes every component's package-lock.json under components/* (dependency
resolution only - component versions themselves are never changed here), syncs
their current package.json versions into
helm-chart/templates/shared/_service-helpers.tpl, and bumps the chart version
in helm-chart/Chart.yaml (appVersion is left untouched).

If no package-lock.json ends up changed and the service helper template is
already in sync, the chart version is left untouched and the script exits
without doing anything - pass --force to bump the chart version regardless.

Options:
  -v, --version LEVEL     Chart version bump level: major, minor, or patch (default: patch)
  -f, --force             Bump the chart version even if nothing else changed
  -h, --help              Show this help message

Examples:
  $0                      # Refresh lockfiles/tpl, bump the chart by patch if anything changed
  $0 --version minor      # Same, but bump the chart by a minor version
  $0 --force              # Always bump the chart version, even with no other changes
EOF
}

# Bump a semver "X.Y.Z" string by the given level.
bump_semver() {
  local version="$1"
  local level="$2"
  local major minor patch

  IFS='.' read -r major minor patch <<< "$version"

  case "$level" in
    major)
      echo "$((major + 1)).0.0"
      ;;
    minor)
      echo "$major.$((minor + 1)).0"
      ;;
    patch)
      echo "$major.$minor.$((patch + 1))"
      ;;
  esac
}

main() {
  local bump_level="patch"
  local force=false

  while [[ $# -gt 0 ]]; do
    case $1 in
      -v|--version)
        bump_level="$2"
        shift 2
        ;;
      -f|--force)
        force=true
        shift
        ;;
      -h|--help)
        show_usage
        exit 0
        ;;
      *)
        echo -e "${RED}Unknown option: $1${NC}" >&2
        show_usage
        exit 1
        ;;
    esac
  done

  case "$bump_level" in
    major|minor|patch) ;;
    *)
      echo -e "${RED}Invalid --version value: $bump_level (expected major, minor, or patch)${NC}" >&2
      exit 1
      ;;
  esac

  if ! command -v jq &> /dev/null; then
    echo -e "${RED}jq is required but not installed${NC}" >&2
    exit 1
  fi

  if ! command -v sha256sum &> /dev/null; then
    echo -e "${RED}sha256sum is required but not installed${NC}" >&2
    exit 1
  fi

  echo -e "${BLUE}Refreshing component lockfiles...${NC}"

  local tpl_hash_before
  tpl_hash_before="$(sha256sum "$SERVICE_HELPERS_TPL" | awk '{print $1}')"

  local any_lock_changed=false

  for component_dir in "$COMPONENTS_DIR"/*/; do
    local component
    component="$(basename "$component_dir")"

    if [[ ! -f "$component_dir/package.json" ]]; then
      continue
    fi

    local version
    version="$(jq -r '.version' "$component_dir/package.json")"

    local lock_file="$component_dir/package-lock.json"
    local lock_hash_before=""
    [[ -f "$lock_file" ]] && lock_hash_before="$(sha256sum "$lock_file" | awk '{print $1}')"

    # --ignore-scripts: this is a lockfile refresh, not a real install - some
    # components (e.g. pdf-generator) have postinstall steps (playwright) that
    # don't apply and aren't available in every environment this runs in.
    local npm_output
    if ! npm_output="$(cd "$component_dir" && npm install --package-lock-only --ignore-scripts 2>&1)"; then
      echo -e "${RED}npm install failed for $component${NC}" >&2
      echo "$npm_output" >&2
      exit 1
    fi

    local lock_hash_after=""
    [[ -f "$lock_file" ]] && lock_hash_after="$(sha256sum "$lock_file" | awk '{print $1}')"

    if [[ "$lock_hash_before" != "$lock_hash_after" ]]; then
      any_lock_changed=true
      echo -e "  ${GREEN}$component${NC} ($version): package-lock.json updated"
    else
      echo -e "  $component ($version): up to date"
    fi

    # Sync the component's current (unbumped) version into the per-service
    # version table, e.g.:
    #   "task" "0.1.9"
    sed -i -E "s/(\"$component\"[[:space:]]+\")[0-9]+\.[0-9]+\.[0-9]+(\")/\1$version\2/" "$SERVICE_HELPERS_TPL"
  done

  local tpl_hash_after
  tpl_hash_after="$(sha256sum "$SERVICE_HELPERS_TPL" | awk '{print $1}')"

  local tpl_changed=false
  if [[ "$tpl_hash_before" != "$tpl_hash_after" ]]; then
    tpl_changed=true
    echo -e "${GREEN}Service version table updated.${NC}"
  fi

  if [[ "$any_lock_changed" == false && "$tpl_changed" == false && "$force" == false ]]; then
    echo -e "${YELLOW}No changes detected - chart version left untouched. Pass --force to bump it anyway.${NC}"
    exit 0
  fi

  echo -e "${BLUE}Bumping helm chart version ($bump_level)...${NC}"

  local chart_old_version chart_new_version
  chart_old_version="$(grep -E '^version:' "$CHART_YAML" | awk '{print $2}')"
  chart_new_version="$(bump_semver "$chart_old_version" "$bump_level")"

  sed -i -E "s/^version:.*/version: $chart_new_version/" "$CHART_YAML"

  echo -e "  ${GREEN}helm-chart${NC}: $chart_old_version -> $chart_new_version"
  echo -e "${GREEN}✓ Done${NC}"

  echo
  echo -e "${BLUE}Suggested commit:${NC}"
  echo "git add -A && git commit -m \"chore(helm): update Helm chart version to $chart_new_version\""
}

main "$@"
