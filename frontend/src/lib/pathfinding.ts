import { WALKING_GRAPH } from "./campusData";

export interface RouteResult {
  path: string[];
  totalTime: number;
}

export function findRoute(
  start: string,
  end: string,
  safeMode = false,
  blockedBuildings: string[] = []
): RouteResult | null {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  Object.keys(WALKING_GRAPH).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  });
  distances[start] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    unvisited.forEach((node) => {
      if (current === null || distances[node] < distances[current]) {
        current = node;
      }
    });

    if (current === null) break;
    if (current === end) break;
    if (distances[current] === Infinity) break;

    unvisited.delete(current);

    const neighbours = WALKING_GRAPH[current] || {};
    Object.entries(neighbours).forEach(([neighbour, edge]) => {
      if (!unvisited.has(neighbour)) return;
      if (blockedBuildings.includes(neighbour)) return;
      if (safeMode && !edge.safe) return;

      const alt = distances[current!] + edge.time;
      if (alt < distances[neighbour]) {
        distances[neighbour] = alt;
        previous[neighbour] = current;
      }
    });
  }

  if (distances[end] === Infinity) return null;

  const path: string[] = [];
  let current: string | null = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return { path, totalTime: distances[end] };
}
