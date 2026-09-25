interface MatchResult {
  matched: boolean;
  params: Params;
}

interface Params {
  [key: string]: string;
}

export { MatchResult, Params };
