export type Graph = Record<string, string[]>;
export type OldGraph = Record<
  string,
  {
    oldLocation: string;
    imports: Array<{ text: string; resolved: string }>;
    reversed: boolean;
  }
>;
