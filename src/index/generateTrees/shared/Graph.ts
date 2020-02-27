export type Graph = Record<string, string[]>;
export type OldGraph = Record<
  string,
  { oldLocation: string, imports: { text: string, resolved: string }[] }
>;
