#!/usr/bin/env python3
"""
GitHub API Client for Issue and PR Management

This script provides a reusable interface for interacting with GitHub's REST API
to create and update issues and pull requests.

Requirements:
    pip install requests --break-system-packages

Environment Variables:
    GITHUB_TOKEN: Personal Access Token with repo scope
    GITHUB_REPO: Repository in format "owner/repo" (optional, can be auto-detected)
"""

import os
import sys
import json
import subprocess
from typing import Optional, Dict, Any, List
import requests


class GitHubAPI:
    """GitHub API client for issue and PR operations"""
    
    def __init__(self, token: Optional[str] = None, repo: Optional[str] = None):
        """
        Initialize GitHub API client
        
        Args:
            token: GitHub Personal Access Token (defaults to GITHUB_TOKEN env var)
            repo: Repository in "owner/repo" format (defaults to GITHUB_REPO env var or auto-detect)
        """
        self.token = token or os.getenv('GITHUB_TOKEN')
        if not self.token:
            raise ValueError("GitHub token required. Set GITHUB_TOKEN environment variable or pass token parameter.")
        
        self.repo = repo or os.getenv('GITHUB_REPO') or self._detect_repo()
        if not self.repo:
            raise ValueError("Repository required. Set GITHUB_REPO environment variable, pass repo parameter, or run from git repository.")
        
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    
    def _detect_repo(self) -> Optional[str]:
        """Auto-detect repository from git remote"""
        try:
            result = subprocess.run(
                ['git', 'remote', 'get-url', 'origin'],
                capture_output=True,
                text=True,
                check=True
            )
            remote_url = result.stdout.strip()
            
            # Parse GitHub URL (handles both HTTPS and SSH)
            if 'github.com' in remote_url:
                # Extract owner/repo from URL
                if remote_url.startswith('git@github.com:'):
                    repo_path = remote_url.replace('git@github.com:', '').replace('.git', '')
                elif 'github.com/' in remote_url:
                    repo_path = remote_url.split('github.com/')[-1].replace('.git', '')
                else:
                    return None
                return repo_path
        except (subprocess.CalledProcessError, FileNotFoundError):
            return None
        return None
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request to GitHub API"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=self.headers)
            elif method == "POST":
                response = requests.post(url, headers=self.headers, json=data)
            elif method == "PATCH":
                response = requests.patch(url, headers=self.headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"GitHub API Error: {e}", file=sys.stderr)
            if hasattr(e.response, 'text'):
                print(f"Response: {e.response.text}", file=sys.stderr)
            raise
    
    def get_issue(self, issue_number: int) -> Optional[Dict[str, Any]]:
        """
        Get issue by number
        
        Args:
            issue_number: Issue number
            
        Returns:
            Issue data or None if not found
        """
        try:
            return self._make_request("GET", f"/repos/{self.repo}/issues/{issue_number}")
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    def search_issues(self, query: str, state: str = "all") -> List[Dict[str, Any]]:
        """
        Search issues by query string
        
        Args:
            query: Search query (will be combined with repo filter)
            state: Issue state filter (open, closed, all)
            
        Returns:
            List of matching issues
        """
        search_query = f"{query} repo:{self.repo} is:issue state:{state}"
        endpoint = f"/search/issues?q={requests.utils.quote(search_query)}"
        result = self._make_request("GET", endpoint)
        return result.get('items', [])
    
    def create_issue(self, title: str, body: str, labels: Optional[List[str]] = None, 
                     assignees: Optional[List[str]] = None, milestone: Optional[int] = None) -> Dict[str, Any]:
        """
        Create a new issue
        
        Args:
            title: Issue title
            body: Issue description (supports Markdown)
            labels: List of label names
            assignees: List of GitHub usernames
            milestone: Milestone number
            
        Returns:
            Created issue data
        """
        data = {
            "title": title,
            "body": body
        }
        
        if labels:
            data["labels"] = labels
        if assignees:
            data["assignees"] = assignees
        if milestone:
            data["milestone"] = milestone
        
        return self._make_request("POST", f"/repos/{self.repo}/issues", data)
    
    def update_issue(self, issue_number: int, title: Optional[str] = None, body: Optional[str] = None,
                     state: Optional[str] = None, labels: Optional[List[str]] = None,
                     assignees: Optional[List[str]] = None, milestone: Optional[int] = None) -> Dict[str, Any]:
        """
        Update an existing issue
        
        Args:
            issue_number: Issue number
            title: Updated title
            body: Updated description
            state: Issue state (open or closed)
            labels: List of label names
            assignees: List of GitHub usernames
            milestone: Milestone number
            
        Returns:
            Updated issue data
        """
        data = {}
        
        if title is not None:
            data["title"] = title
        if body is not None:
            data["body"] = body
        if state is not None:
            data["state"] = state
        if labels is not None:
            data["labels"] = labels
        if assignees is not None:
            data["assignees"] = assignees
        if milestone is not None:
            data["milestone"] = milestone
        
        return self._make_request("PATCH", f"/repos/{self.repo}/issues/{issue_number}", data)
    
    def create_pull_request(self, title: str, body: str, head: str, base: str = "main",
                           draft: bool = False, maintainer_can_modify: bool = True) -> Dict[str, Any]:
        """
        Create a new pull request
        
        Args:
            title: PR title
            body: PR description (supports Markdown)
            head: Branch containing changes (can be "username:branch" for forks)
            base: Target branch (defaults to "main")
            draft: Create as draft PR
            maintainer_can_modify: Allow maintainers to edit
            
        Returns:
            Created PR data
        """
        data = {
            "title": title,
            "body": body,
            "head": head,
            "base": base,
            "draft": draft,
            "maintainer_can_modify": maintainer_can_modify
        }
        
        return self._make_request("POST", f"/repos/{self.repo}/pulls", data)
    
    def update_pull_request(self, pr_number: int, title: Optional[str] = None, body: Optional[str] = None,
                           state: Optional[str] = None, base: Optional[str] = None) -> Dict[str, Any]:
        """
        Update an existing pull request
        
        Args:
            pr_number: PR number
            title: Updated title
            body: Updated description
            state: PR state (open or closed)
            base: Updated target branch
            
        Returns:
            Updated PR data
        """
        data = {}
        
        if title is not None:
            data["title"] = title
        if body is not None:
            data["body"] = body
        if state is not None:
            data["state"] = state
        if base is not None:
            data["base"] = base
        
        return self._make_request("PATCH", f"/repos/{self.repo}/pulls/{pr_number}", data)
    
    def get_current_branch(self) -> str:
        """Get the current git branch name"""
        try:
            result = subprocess.run(
                ['git', 'branch', '--show-current'],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError:
            raise ValueError("Unable to determine current git branch. Are you in a git repository?")
    
    def get_commits_on_branch(self, branch: str, base: str = "main") -> List[Dict[str, str]]:
        """
        Get commits that are on branch but not on base
        
        Args:
            branch: Feature branch
            base: Base branch to compare against
            
        Returns:
            List of commits with 'sha', 'message', 'author' keys
        """
        try:
            result = subprocess.run(
                ['git', 'log', f'{base}..{branch}', '--pretty=format:%H|%s|%an'],
                capture_output=True,
                text=True,
                check=True
            )
            
            commits = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    sha, message, author = line.split('|', 2)
                    commits.append({
                        'sha': sha,
                        'message': message,
                        'author': author
                    })
            return commits
        except subprocess.CalledProcessError:
            return []


def main():
    """CLI interface for testing"""
    import argparse
    
    parser = argparse.ArgumentParser(description='GitHub API Client')
    parser.add_argument('--repo', help='Repository (owner/repo)')
    parser.add_argument('--token', help='GitHub token')
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Get issue
    get_parser = subparsers.add_parser('get-issue', help='Get issue by number')
    get_parser.add_argument('number', type=int, help='Issue number')
    
    # Create issue
    create_parser = subparsers.add_parser('create-issue', help='Create new issue')
    create_parser.add_argument('title', help='Issue title')
    create_parser.add_argument('body', help='Issue body')
    create_parser.add_argument('--labels', nargs='+', help='Labels')
    
    # Create PR
    pr_parser = subparsers.add_parser('create-pr', help='Create pull request')
    pr_parser.add_argument('title', help='PR title')
    pr_parser.add_argument('body', help='PR body')
    pr_parser.add_argument('--head', help='Head branch (defaults to current branch)')
    pr_parser.add_argument('--base', default='main', help='Base branch')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    try:
        api = GitHubAPI(token=args.token, repo=args.repo)
        
        if args.command == 'get-issue':
            issue = api.get_issue(args.number)
            print(json.dumps(issue, indent=2))
        
        elif args.command == 'create-issue':
            issue = api.create_issue(args.title, args.body, labels=args.labels)
            print(f"Created issue #{issue['number']}: {issue['html_url']}")
        
        elif args.command == 'create-pr':
            head = args.head or api.get_current_branch()
            pr = api.create_pull_request(args.title, args.body, head, args.base)
            print(f"Created PR #{pr['number']}: {pr['html_url']}")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
