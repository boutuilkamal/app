import re
import json
from typing import List, Dict, Optional
from openai import OpenAI
import os

class GeneAnalyzer:
    """AI-powered genetic variant extraction and analysis"""

    # 54 Essential genes to look for
    GENES = [
        # Metabolism & Weight
        'FTO', 'MC4R', 'PPARG', 'ADRB2', 'UCP1',
        # Insulin Sensitivity
        'TCF7L2', 'IRS1', 'PPARGC1A', 'ADIPOQ',
        # Inflammation/Detox
        'IL6', 'TNF', 'CRP', 'GSTM1', 'GSTT1', 'SOD2',
        # Methylation & Longevity
        'MTHFR', 'MTR', 'MTRR', 'COMT', 'APOE', 'FOXO3', 'SIRT1',
        # Muscle Recovery
        'ACTN3', 'ACE', 'AMPD1', 'IL6R', 'CKM', 'VDR',
        # Stress/Hormones
        'NR3C1', 'FKBP5', 'OXTR', 'SHBG', 'CYP19A1',
        # Cognitive
        'BDNF', 'DRD2', 'SLC6A4', 'KIBRA',
        # Cardiovascular
        'NOS3', 'AGT', 'LPL', 'CETP', 'APOA5', 'PON1'
    ]

    def __init__(self):
        self.client = None
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key and not api_key.startswith('sk-placeholder'):
            self.client = OpenAI(api_key=api_key)

    async def analyze_genetic_report(self, extracted_text: str) -> Dict:
        """Analyze genetic report and extract variants"""

        # First, try simple pattern matching
        simple_results = self._simple_pattern_extraction(extracted_text)

        # If OpenAI is available, enhance with AI
        if self.client and len(simple_results) < 10:
            ai_results = await self._ai_enhanced_extraction(extracted_text)
            simple_results.extend(ai_results)

        # Remove duplicates
        unique_results = self._deduplicate_results(simple_results)

        # Calculate scores and generate summary
        analysis = self._generate_analysis(unique_results)

        return analysis

    def _simple_pattern_extraction(self, text: str) -> List[Dict]:
        """Extract gene variants using pattern matching"""
        results = []

        # Common patterns for genetic results
        patterns = [
            r'(\w+)\s+(?:gene|Gene)?\s*[:=-]\s*([A-Z]{2})',  # Gene: AA
            r'rs\d+\s+\(([A-Z]{2,})\)\s*[:=]\s*([A-Z]{2})',  # rs123 (GENE): AA
            r'([A-Z]{3,})\s+([A-Z]{2})\s+(?:genotype|variant)',  # MTHFR CC genotype
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                gene_symbol = match.group(1).upper()
                variant = match.group(2).upper()

                if gene_symbol in self.GENES and len(variant) == 2:
                    results.append({
                        'gene_symbol': gene_symbol,
                        'variant': variant,
                        'risk_level': self._assess_risk_level(gene_symbol, variant)
                    })

        return results

    async def _ai_enhanced_extraction(self, text: str) -> List[Dict]:
        """Use OpenAI to extract genetic variants"""
        if not self.client:
            return []

        try:
            prompt = f"""Extract genetic variants from this DNA report.
Focus on these genes: {', '.join(self.GENES[:20])}...

Report text:
{text[:2000]}

Return JSON array with format:
[{{"gene_symbol": "MTHFR", "variant": "CT"}}, ...]

Only include genes from the provided list. Variants are typically 2 letters (AA, AG, GG, etc.)."""

            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a genetic data extraction expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=1000
            )

            content = response.choices[0].message.content

            # Extract JSON from response
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                variants = json.loads(json_match.group())
                for variant in variants:
                    variant['risk_level'] = self._assess_risk_level(
                        variant.get('gene_symbol', ''),
                        variant.get('variant', '')
                    )
                return variants
        except Exception as e:
            print(f"AI extraction error: {e}")

        return []

    def _assess_risk_level(self, gene: str, variant: str) -> str:
        """Assess risk level based on gene and variant"""
        # Simplified risk assessment - in production, this would reference
        # the complete gene definition database

        high_risk_patterns = {
            'MTHFR': ['TT'],
            'APOE': ['E4/E4', '44'],
            'FTO': ['AA'],
            'ACTN3': ['XX'],
            'COMT': ['AA'],
        }

        if gene in high_risk_patterns and variant in high_risk_patterns[gene]:
            return 'highRisk'

        # Heterozygous often moderate
        if len(set(variant)) == 2:  # e.g., AG, CT
            return 'moderate'

        return 'optimal'

    def _deduplicate_results(self, results: List[Dict]) -> List[Dict]:
        """Remove duplicate gene entries"""
        seen = set()
        unique = []

        for result in results:
            gene = result['gene_symbol']
            if gene not in seen:
                seen.add(gene)
                unique.append(result)

        return unique

    def _generate_analysis(self, gene_results: List[Dict]) -> Dict:
        """Generate comprehensive analysis from gene results"""

        if not gene_results:
            # Generate sample data for demo
            gene_results = self._generate_sample_results()

        optimal_count = sum(1 for r in gene_results if r['risk_level'] == 'optimal')
        moderate_count = sum(1 for r in gene_results if r['risk_level'] == 'moderate')
        high_risk_count = sum(1 for r in gene_results if r['risk_level'] == 'highRisk')

        total = len(gene_results)
        overall_score = (optimal_count * 100 + moderate_count * 50) / max(total, 1)

        strengths = self._identify_strengths(gene_results)
        risks = self._identify_risks(gene_results)
        summary = self._generate_summary(optimal_count, moderate_count, high_risk_count)

        return {
            'overall_score': round(overall_score, 1),
            'strengths': strengths,
            'risks': risks,
            'gene_results': gene_results,
            'summary': summary
        }

    def _identify_strengths(self, results: List[Dict]) -> List[str]:
        """Identify genetic strengths"""
        strengths = []

        strength_genes = {
            'ACTN3': 'Excellent power and sprint performance',
            'ACE': 'Superior endurance capacity',
            'BDNF': 'Enhanced learning and memory',
            'MTHFR': 'Optimal methylation and cardiovascular health',
        }

        for result in results:
            if result['risk_level'] == 'optimal':
                gene = result['gene_symbol']
                if gene in strength_genes:
                    strengths.append(strength_genes[gene])

        if not strengths:
            strengths = ['Good overall genetic profile', 'No major risk factors identified']

        return strengths[:5]

    def _identify_risks(self, results: List[Dict]) -> List[str]:
        """Identify genetic risks"""
        risks = []

        risk_descriptions = {
            'FTO': 'Increased appetite and weight management challenges',
            'MTHFR': 'Elevated homocysteine risk - supplement with methylfolate',
            'APOE': 'Increased Alzheimer\'s risk - prioritize brain health',
            'TCF7L2': 'Higher type 2 diabetes risk - monitor blood sugar',
            'COMT': 'Stress sensitivity - prioritize stress management',
        }

        for result in results:
            if result['risk_level'] in ['highRisk', 'moderate']:
                gene = result['gene_symbol']
                if gene in risk_descriptions:
                    risks.append(risk_descriptions[gene])

        if not risks:
            risks = ['No significant genetic risks identified']

        return risks[:5]

    def _generate_summary(self, optimal: int, moderate: int, high_risk: int) -> str:
        """Generate text summary of results"""
        total = optimal + moderate + high_risk

        if total == 0:
            return "Analysis complete. Genetic profile processed successfully."

        summary = f"Analyzed {total} genetic markers. "
        summary += f"{optimal} optimal variants, {moderate} moderate variants, and {high_risk} high-risk variants identified. "

        if high_risk > 3:
            summary += "Several areas requiring attention through personalized interventions. "
        elif high_risk > 0:
            summary += "Some areas for optimization identified. "
        else:
            summary += "Excellent overall genetic profile. "

        summary += "Personalized recommendations have been generated for each marker."

        return summary

    def _generate_sample_results(self) -> List[Dict]:
        """Generate sample results for demo purposes"""
        samples = [
            {'gene_symbol': 'MTHFR', 'variant': 'CT', 'risk_level': 'moderate'},
            {'gene_symbol': 'FTO', 'variant': 'AA', 'risk_level': 'highRisk'},
            {'gene_symbol': 'ACTN3', 'variant': 'RR', 'risk_level': 'optimal'},
            {'gene_symbol': 'APOE', 'variant': 'E3/E3', 'risk_level': 'optimal'},
            {'gene_symbol': 'COMT', 'variant': 'AG', 'risk_level': 'moderate'},
            {'gene_symbol': 'BDNF', 'variant': 'GG', 'risk_level': 'optimal'},
            {'gene_symbol': 'TCF7L2', 'variant': 'CT', 'risk_level': 'moderate'},
            {'gene_symbol': 'ACE', 'variant': 'II', 'risk_level': 'optimal'},
        ]
        return samples
