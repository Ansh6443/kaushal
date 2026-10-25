"""Skill knowledge graph (NetworkX): edge A -> B means 'learn A before B'."""
from functools import lru_cache

import networkx as nx

from . import data


@lru_cache(maxsize=1)
def graph() -> nx.DiGraph:
    g = nx.DiGraph()
    for sid, s in data.skills().items():
        g.add_node(sid, name=s["name"], category=s["category"])
    for sid, s in data.skills().items():
        for pre in s["prerequisites"]:
            g.add_edge(pre, sid)
    if not nx.is_directed_acyclic_graph(g):
        raise ValueError("skills.json has a prerequisite cycle")
    return g


def prerequisites(skill_id: str) -> set:
    """All direct and indirect prerequisites."""
    return nx.ancestors(graph(), skill_id)


def learning_order(skill_ids, priority: dict | None = None) -> list:
    """Topological order of the given skills (prerequisites first), highest priority first among equals.
    Uses the transitive closure so A -> B -> C keeps A before C even when B is not selected."""
    priority = priority or {}
    sub = nx.transitive_closure_dag(graph()).subgraph(set(skill_ids))
    return list(nx.lexicographical_topological_sort(sub, key=lambda n: (-priority.get(n, 0.0), n)))


def with_weak_prerequisites(gap_ids, scores: dict, threshold: int = 40) -> set:
    """Gap skills plus any prerequisite the user is weak in (assessed score below threshold)."""
    needed = set(gap_ids)
    for sid in gap_ids:
        for pre in prerequisites(sid):
            if scores.get(pre, {}).get("score", 100) < threshold:
                needed.add(pre)
    return needed


def export(role_id: str | None = None) -> dict:
    g = graph()
    if role_id:
        role = data.get_role(role_id)
        keep = {rs["skill_id"] for rs in role["skills"]}
        for sid in list(keep):
            keep |= nx.ancestors(g, sid)
        g = g.subgraph(keep)
    return {"nodes": [{"id": n, **g.nodes[n]} for n in g.nodes],
            "edges": [{"from": a, "to": b} for a, b in g.edges]}
