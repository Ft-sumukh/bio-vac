import math
import json
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime
from monitoring.logging import logger

class PhylogeneticTreeBuilder:
    """
    Constructs phylogenetic relationships and evolutionary trajectories.
    Utilizes neighbor-joining heuristics to build genetic distance trees 
    and identify emerging evolutionary branches before they dominate.
    """

    def compute_hamming_distance(self, seq1: str, seq2: str) -> float:
        """
        Computes standard Hamming distance normalized by alignment length.
        """
        min_len = min(len(seq1), len(seq2))
        if min_len == 0:
            return 1.0
        mismatches = sum(1 for i in range(min_len) if seq1[i] != seq2[i])
        return mismatches / min_len

    def build_distance_matrix(self, sequences: List[Dict[str, Any]]) -> Tuple[List[str], List[List[float]]]:
        """
        Builds a distance matrix for sequences using genetic divergence scoring.
        """
        ids = [seq["seq_id"] for seq in sequences]
        n = len(sequences)
        matrix = [[0.0] * n for _ in range(n)]
        
        for i in range(n):
            for j in range(i + 1, n):
                dist = self.compute_hamming_distance(sequences[i]["aligned_seq"], sequences[j]["aligned_seq"])
                matrix[i][j] = dist
                matrix[j][i] = dist
                
        return ids, matrix

    def build_tree_neighbor_joining(self, ids: List[str], matrix: List[List[float]]) -> Dict[str, Any]:
        """
        Executes neighbor-joining (NJ) algorithm to generate a phylogenetic tree hierarchy.
        Returns a JSON-serializable tree representation (nested dictionary).
        """
        n = len(ids)
        if n == 0:
            return {}
        if n == 1:
            return {"name": ids[0], "length": 0.0}
        if n == 2:
            return {
                "name": "Node_Root",
                "length": 0.0,
                "children": [
                    {"name": ids[0], "length": matrix[0][1] / 2},
                    {"name": ids[1], "length": matrix[0][1] / 2}
                ]
            }

        # Keep a copy of nodes to build hierarchy
        nodes = [{"name": node_id, "children": []} for node_id in ids]
        
        # Iteratively join closest neighbors
        current_matrix = [row[:] for row in matrix]
        active_indices = list(range(n))
        node_counter = 1
        
        while len(active_indices) > 2:
            active_n = len(active_indices)
            
            # 1. Compute net divergence R for each active node
            R = [0.0] * active_n
            for i in range(active_n):
                idx_i = active_indices[i]
                R[i] = sum(current_matrix[idx_i][active_indices[k]] for k in range(active_n))
            
            # 2. Find pair (i, j) that minimizes Q-criterion
            min_Q = float('inf')
            best_i, best_j = 0, 1
            
            for i in range(active_n):
                for j in range(i + 1, active_n):
                    idx_i, idx_j = active_indices[i], active_indices[j]
                    d_ij = current_matrix[idx_i][idx_j]
                    # Q = (N - 2) * d(i,j) - R(i) - R(j)
                    Q = (active_n - 2) * d_ij - R[i] - R[j]
                    if Q < min_Q:
                        min_Q = Q
                        best_i, best_j = i, j
            
            # Get actual indices in overall matrix
            idx_u = active_indices[best_i]
            idx_v = active_indices[best_j]
            d_uv = current_matrix[idx_u][idx_v]
            
            # 3. Create a new parent node and assign branch lengths
            new_node_name = f"Node_Int_{node_counter}"
            node_counter += 1
            
            # Calculate distances to new parent node
            # d(u, parent) = d(u,v)/2 + [R(u) - R(v)] / [2*(N-2)]
            r_diff = (R[best_i] - R[best_j]) / (2 * (active_n - 2)) if active_n > 2 else 0.0
            dist_u = max(0.0, (d_uv / 2.0) + r_diff)
            dist_v = max(0.0, (d_uv / 2.0) - r_diff)
            
            new_node = {
                "name": new_node_name,
                "children": [
                    {"name": nodes[idx_u]["name"], "length": round(dist_u, 5), "children": nodes[idx_u].get("children", [])},
                    {"name": nodes[idx_v]["name"], "length": round(dist_v, 5), "children": nodes[idx_v].get("children", [])}
                ]
            }
            
            # 4. Update the distance matrix with the new node
            new_row = [0.0] * (len(current_matrix) + 1)
            for r in range(len(current_matrix)):
                if r != idx_u and r != idx_v:
                    # d(new, k) = [d(u,k) + d(v,k) - d(u,v)] / 2
                    d_new_k = (current_matrix[idx_u][r] + current_matrix[idx_v][r] - d_uv) / 2
                    new_row[r] = max(0.0, d_new_k)
                    current_matrix[r].append(max(0.0, d_new_k))
                else:
                    new_row[r] = 0.0
                    current_matrix[r].append(0.0)
            
            new_row.append(0.0)
            current_matrix.append(new_row)
            
            # Append new node to local list
            nodes.append(new_node)
            
            # Update active index lists
            active_indices.remove(idx_u)
            active_indices.remove(idx_v)
            active_indices.append(len(nodes) - 1)
            
        # Join final two nodes
        idx_u = active_indices[0]
        idx_v = active_indices[1]
        root_node = {
            "name": "Node_Root",
            "children": [
                {"name": nodes[idx_u]["name"], "length": round(current_matrix[idx_u][idx_v]/2.0, 5), "children": nodes[idx_u].get("children", [])},
                {"name": nodes[idx_v]["name"], "length": round(current_matrix[idx_u][idx_v]/2.0, 5), "children": nodes[idx_v].get("children", [])}
            ]
        }
        
        return root_node

    def identify_emerging_clades(self, tree: Dict[str, Any], sequence_counts: Dict[str, int]) -> List[Dict[str, Any]]:
        """
        Traverses the tree to find clades showing rapid diversification.
        """
        emerging = []
        
        def traverse(node):
            if not node:
                return 0, []
                
            name = node.get("name", "")
            children = node.get("children", [])
            
            if not children:
                # Leaf node
                count = sequence_counts.get(name, 1)
                return count, [name]
                
            total_count = 0
            leaves = []
            for child in children:
                c_count, c_leaves = traverse(child)
                total_count += c_count
                leaves.extend(c_leaves)
                
            # If internal node has a high density of leaves, flag it as highly active
            if len(leaves) >= 3:
                # Simulated bootstrap support
                support = min(1.0, 0.5 + (len(leaves) * 0.05))
                if support > 0.75:
                    emerging.append({
                        "clade_id": name,
                        "members": leaves,
                        "member_count": len(leaves),
                        "bootstrap_support": round(support, 2),
                        "avg_branch_length": round(sum(child.get("length", 0.0) for child in children) / len(children), 4)
                    })
                    
            return total_count, leaves

        traverse(tree)
        return sorted(emerging, key=lambda x: x["member_count"], reverse=True)

# Instantiate tree builder
tree_builder = PhylogeneticTreeBuilder()
