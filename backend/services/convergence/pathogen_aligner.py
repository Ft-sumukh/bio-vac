from typing import List, Dict, Any, Tuple
from monitoring.logging import logger

class PathogenAligner:
    """
    Cross-pathogen dynamic local alignment and homology mapping.
    Scans different viral structural proteins (e.g. Spike vs HA vs F-protein)
    to find structural regions with high functional and biochemical similarity.
    """

    def compute_local_alignment(self, seq1: str, seq2: str) -> Tuple[float, str, str]:
        """
        Executes a simplified local alignment score (Smith-Waterman heuristic).
        In production, executes specialized HMM profiles (Pfam / HMMER).
        """
        len1, len2 = len(seq1), len(seq2)
        if len1 == 0 or len2 == 0:
            return 0.0, "", ""

        # Score parameters
        match_score = 3
        mismatch_penalty = -1
        gap_penalty = -2

        # Initialize scoring matrix
        score_matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
        max_score = 0
        max_i, max_j = 0, 0

        # Fill matrix
        for i in range(1, len1 + 1):
            for j in range(1, len2 + 1):
                char1, char2 = seq1[i-1], seq2[j-1]
                match = score_matrix[i-1][j-1] + (match_score if char1 == char2 else mismatch_penalty)
                delete = score_matrix[i-1][j] + gap_penalty
                insert = score_matrix[i][j-1] + gap_penalty
                
                score_matrix[i][j] = max(0, match, delete, insert)
                if score_matrix[i][j] > max_score:
                    max_score = score_matrix[i][j]
                    max_i, max_j = i, j

        # Traceback to extract aligned segments
        align1, align2 = [], []
        i, j = max_i, max_j
        
        while i > 0 and j > 0 and score_matrix[i][j] > 0:
            current_score = score_matrix[i][j]
            score_diag = score_matrix[i-1][j-1]
            score_up = score_matrix[i-1][j]
            score_left = score_matrix[i][j-1]
            
            char1, char2 = seq1[i-1], seq2[j-1]
            
            if current_score == score_diag + (match_score if char1 == char2 else mismatch_penalty):
                align1.append(char1)
                align2.append(char2)
                i -= 1
                j -= 1
            elif current_score == score_up + gap_penalty:
                align1.append(char1)
                align2.append("-")
                i -= 1
            else:
                align1.append("-")
                align2.append(char2)
                j -= 1

        align1.reverse()
        align2.reverse()
        
        aligned_seq1 = "".join(align1)
        aligned_seq2 = "".join(align2)
        
        # Calculate percentage identity over aligned region
        aligned_len = len(aligned_seq1)
        if aligned_len == 0:
            return 0.0, "", ""
            
        matches = sum(1 for a, b in zip(aligned_seq1, aligned_seq2) if a == b)
        identity = matches / aligned_len
        
        return round(identity, 4), aligned_seq1, aligned_seq2

    def align_pathogen_domains(
        self, 
        pathogen_data: Dict[str, str], 
        min_homology: float = 0.35
    ) -> List[Dict[str, Any]]:
        """
        Aligns domain sequences pairwise across multiple pathogens to isolate hotspots.
        """
        pathogens = list(pathogen_data.keys())
        n = len(pathogens)
        homologous_regions = []
        
        for i in range(n):
            for j in range(i + 1, n):
                p1, p2 = pathogens[i], pathogens[j]
                seq1, seq2 = pathogen_data[p1], pathogen_data[p2]
                
                identity, aligned1, aligned2 = self.compute_local_alignment(seq1, seq2)
                
                if identity >= min_homology:
                    homologous_regions.append({
                        "pair": f"{p1} <-> {p2}",
                        "pathogens": [p1, p2],
                        "identity": identity,
                        "aligned_region_1": aligned1,
                        "aligned_region_2": aligned2,
                        "alignment_length": len(aligned1),
                        "functional_domain": "Receptor-Binding homologies"
                    })
                    
        return homologous_regions

# Instantiate pathogen aligner
pathogen_aligner = PathogenAligner()
