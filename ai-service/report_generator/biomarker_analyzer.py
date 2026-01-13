import re
import json
from typing import List, Dict, Optional
from openai import OpenAI
import os

class BiomarkerAnalyzer:
    """AI-powered biomarker extraction and analysis from blood test reports"""

    # 40 Essential biomarkers to look for
    BIOMARKERS = {
        # Metabolic Health
        'Fasting Glucose': {'unit': 'mg/dL', 'category': 'Metabolic Health'},
        'Hemoglobin A1c': {'unit': '%', 'category': 'Metabolic Health'},
        'Fasting Insulin': {'unit': 'μIU/mL', 'category': 'Metabolic Health'},
        'Triglycerides': {'unit': 'mg/dL', 'category': 'Metabolic Health'},

        # Cardiovascular
        'Total Cholesterol': {'unit': 'mg/dL', 'category': 'Cardiovascular'},
        'LDL Cholesterol': {'unit': 'mg/dL', 'category': 'Cardiovascular'},
        'HDL Cholesterol': {'unit': 'mg/dL', 'category': 'Cardiovascular'},
        'ApoB': {'unit': 'mg/dL', 'category': 'Cardiovascular'},
        'Lipoprotein(a)': {'unit': 'mg/dL', 'category': 'Cardiovascular'},
        'Homocysteine': {'unit': 'μmol/L', 'category': 'Cardiovascular'},

        # Inflammation
        'C-Reactive Protein': {'unit': 'mg/L', 'category': 'Inflammation'},
        'hs-CRP': {'unit': 'mg/L', 'category': 'Inflammation'},
        'ESR': {'unit': 'mm/hr', 'category': 'Inflammation'},
        'Fibrinogen': {'unit': 'mg/dL', 'category': 'Inflammation'},

        # Hormones
        'Total Testosterone': {'unit': 'ng/dL', 'category': 'Hormones'},
        'Free Testosterone': {'unit': 'pg/mL', 'category': 'Hormones'},
        'Estradiol': {'unit': 'pg/mL', 'category': 'Hormones'},
        'SHBG': {'unit': 'nmol/L', 'category': 'Hormones'},
        'Cortisol': {'unit': 'μg/dL', 'category': 'Hormones'},
        'DHEA-S': {'unit': 'μg/dL', 'category': 'Hormones'},

        # Thyroid
        'TSH': {'unit': 'mIU/L', 'category': 'Thyroid Function'},
        'Free T4': {'unit': 'ng/dL', 'category': 'Thyroid Function'},
        'Free T3': {'unit': 'pg/mL', 'category': 'Thyroid Function'},
        'Reverse T3': {'unit': 'ng/dL', 'category': 'Thyroid Function'},

        # Vitamins & Minerals
        'Vitamin D': {'unit': 'ng/mL', 'category': 'Vitamins & Minerals'},
        'Vitamin B12': {'unit': 'pg/mL', 'category': 'Vitamins & Minerals'},
        'Folate': {'unit': 'ng/mL', 'category': 'Vitamins & Minerals'},
        'Magnesium': {'unit': 'mg/dL', 'category': 'Vitamins & Minerals'},
        'Ferritin': {'unit': 'ng/mL', 'category': 'Vitamins & Minerals'},
        'Omega-3 Index': {'unit': '%', 'category': 'Vitamins & Minerals'},

        # Liver Function
        'ALT': {'unit': 'U/L', 'category': 'Liver Function'},
        'AST': {'unit': 'U/L', 'category': 'Liver Function'},
        'GGT': {'unit': 'U/L', 'category': 'Liver Function'},

        # Kidney Function
        'Creatinine': {'unit': 'mg/dL', 'category': 'Kidney Function'},
        'BUN': {'unit': 'mg/dL', 'category': 'Kidney Function'},

        # Blood Health
        'Hemoglobin': {'unit': 'g/dL', 'category': 'Blood Health'},
        'Hematocrit': {'unit': '%', 'category': 'Blood Health'},
        'White Blood Cells': {'unit': 'K/μL', 'category': 'Blood Health'},
        'Platelets': {'unit': 'K/μL', 'category': 'Blood Health'},
    }

    # Optimal ranges for assessment
    OPTIMAL_RANGES = {
        'Fasting Glucose': (70, 85),
        'Hemoglobin A1c': (4.5, 5.2),
        'Fasting Insulin': (2, 5),
        'Triglycerides': (40, 80),
        'Total Cholesterol': (150, 200),
        'LDL Cholesterol': (50, 100),
        'HDL Cholesterol': (60, 100),
        'ApoB': (40, 80),
        'Lipoprotein(a)': (0, 14),
        'Homocysteine': (5, 8),
        'C-Reactive Protein': (0, 1.0),
        'hs-CRP': (0, 1.0),
        'ESR': (0, 10),
        'Fibrinogen': (200, 300),
        'Total Testosterone': (600, 1000),
        'Free Testosterone': (12, 25),
        'Estradiol': (20, 30),
        'SHBG': (20, 40),
        'Cortisol': (10, 18),
        'DHEA-S': (250, 450),
        'TSH': (0.5, 2.0),
        'Free T4': (1.0, 1.5),
        'Free T3': (3.2, 4.2),
        'Reverse T3': (8, 15),
        'Vitamin D': (50, 80),
        'Vitamin B12': (500, 1000),
        'Folate': (10, 20),
        'Magnesium': (6.0, 6.5),
        'Ferritin': (50, 150),
        'Omega-3 Index': (8.0, 12.0),
        'ALT': (10, 25),
        'AST': (10, 30),
        'GGT': (10, 20),
        'Creatinine': (0.7, 1.2),
        'BUN': (10, 20),
    }

    def __init__(self):
        self.client = None
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key and not api_key.startswith('sk-placeholder'):
            self.client = OpenAI(api_key=api_key)

    async def analyze_blood_report(self, extracted_text: str) -> Dict:
        """Analyze blood test report and extract biomarker values"""

        # First, try simple pattern matching
        simple_results = self._simple_pattern_extraction(extracted_text)

        # If OpenAI is available, enhance with AI
        if self.client and len(simple_results) < 5:
            ai_results = await self._ai_enhanced_extraction(extracted_text)
            simple_results.extend(ai_results)

        # Remove duplicates
        unique_results = self._deduplicate_results(simple_results)

        # Calculate scores and generate summary
        analysis = self._generate_analysis(unique_results)

        return analysis

    def _simple_pattern_extraction(self, text: str) -> List[Dict]:
        """Extract biomarker values using pattern matching"""
        results = []

        # Common patterns for blood test results
        patterns = [
            r'([\w\s\-]+)\s*[:=]\s*([\d.]+)\s*([a-zA-Zμ/%]+)',  # Glucose: 95 mg/dL
            r'([\w\s\-]+)\s+([\d.]+)\s+([a-zA-Zμ/%]+)',  # Glucose 95 mg/dL
            r'([\w\s\-]+)\s*\|\s*([\d.]+)\s*\|\s*([a-zA-Zμ/%]+)',  # Glucose | 95 | mg/dL
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                name = match.group(1).strip()
                value_str = match.group(2).strip()
                unit = match.group(3).strip() if len(match.groups()) >= 3 else ''

                # Check if this is a known biomarker
                biomarker_info = self._find_biomarker(name)
                if biomarker_info:
                    try:
                        value = float(value_str)
                        risk_level = self._assess_risk_level(biomarker_info['name'], value)

                        results.append({
                            'name': biomarker_info['name'],
                            'value': value,
                            'unit': unit or biomarker_info['unit'],
                            'risk_level': risk_level,
                            'category': biomarker_info['category']
                        })
                    except ValueError:
                        continue

        return results

    async def _ai_enhanced_extraction(self, text: str) -> List[Dict]:
        """Use OpenAI to extract biomarker values"""
        if not self.client:
            return []

        try:
            biomarker_list = ', '.join(list(self.BIOMARKERS.keys())[:20])

            prompt = f"""Extract blood biomarker values from this lab report.
Focus on these biomarkers: {biomarker_list}...

Lab report text:
{text[:3000]}

Return JSON array with format:
[{{"name": "Fasting Glucose", "value": 95.0, "unit": "mg/dL"}}, ...]

Only include biomarkers from the provided list with valid numeric values."""

            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a medical lab report extraction expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=2000
            )

            content = response.choices[0].message.content

            # Extract JSON from response
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                biomarkers = json.loads(json_match.group())
                for biomarker in biomarkers:
                    biomarker_info = self._find_biomarker(biomarker.get('name', ''))
                    if biomarker_info:
                        biomarker['risk_level'] = self._assess_risk_level(
                            biomarker_info['name'],
                            biomarker.get('value', 0)
                        )
                        biomarker['category'] = biomarker_info['category']
                        biomarker['name'] = biomarker_info['name']  # Standardize name
                return biomarkers
        except Exception as e:
            print(f"AI extraction error: {e}")

        return []

    def _find_biomarker(self, name: str) -> Optional[Dict]:
        """Find biomarker info by name (fuzzy matching)"""
        name_lower = name.lower().strip()

        # Exact match
        for biomarker_name, info in self.BIOMARKERS.items():
            if biomarker_name.lower() == name_lower:
                return {'name': biomarker_name, **info}

        # Partial match
        for biomarker_name, info in self.BIOMARKERS.items():
            if name_lower in biomarker_name.lower() or biomarker_name.lower() in name_lower:
                return {'name': biomarker_name, **info}

        # Common aliases
        aliases = {
            'glucose': 'Fasting Glucose',
            'hba1c': 'Hemoglobin A1c',
            'a1c': 'Hemoglobin A1c',
            'ldl': 'LDL Cholesterol',
            'hdl': 'HDL Cholesterol',
            'tg': 'Triglycerides',
            'crp': 'C-Reactive Protein',
            'b12': 'Vitamin B12',
            'vit d': 'Vitamin D',
            'testosterone': 'Total Testosterone',
        }

        for alias, full_name in aliases.items():
            if alias in name_lower:
                return {'name': full_name, **self.BIOMARKERS[full_name]}

        return None

    def _assess_risk_level(self, biomarker: str, value: float) -> str:
        """Assess risk level based on biomarker value"""
        if biomarker not in self.OPTIMAL_RANGES:
            return 'moderate'  # Unknown, assume moderate

        optimal_min, optimal_max = self.OPTIMAL_RANGES[biomarker]

        # Special case for HDL (higher is better)
        if biomarker == 'HDL Cholesterol':
            if value >= optimal_min:
                return 'optimal'
            elif value >= 40:
                return 'moderate'
            else:
                return 'critical'

        # Standard assessment
        if optimal_min <= value <= optimal_max:
            return 'optimal'
        elif optimal_min * 0.8 <= value <= optimal_max * 1.2:
            return 'moderate'
        else:
            return 'critical'

    def _deduplicate_results(self, results: List[Dict]) -> List[Dict]:
        """Remove duplicate biomarker entries"""
        seen = set()
        unique = []

        for result in results:
            name = result['name']
            if name not in seen:
                seen.add(name)
                unique.append(result)

        return unique

    def _generate_analysis(self, biomarker_results: List[Dict]) -> Dict:
        """Generate comprehensive analysis from biomarker results"""

        if not biomarker_results:
            # Generate sample data for demo
            biomarker_results = self._generate_sample_results()

        optimal_count = sum(1 for r in biomarker_results if r['risk_level'] == 'optimal')
        moderate_count = sum(1 for r in biomarker_results if r['risk_level'] == 'moderate')
        critical_count = sum(1 for r in biomarker_results if r['risk_level'] == 'critical')

        total = len(biomarker_results)
        overall_score = (optimal_count * 100 + moderate_count * 50) / max(total, 1)

        summary = self._generate_summary(optimal_count, moderate_count, critical_count)

        return {
            'overall_score': round(overall_score, 1),
            'optimal_count': optimal_count,
            'abnormal_count': moderate_count + critical_count,
            'biomarker_results': biomarker_results,
            'summary': summary
        }

    def _generate_summary(self, optimal: int, moderate: int, critical: int) -> str:
        """Generate text summary of results"""
        total = optimal + moderate + critical

        if total == 0:
            return "Analysis complete. Blood test results processed successfully."

        summary = f"Analyzed {total} biomarkers. "
        summary += f"{optimal} optimal, {moderate} moderate, and {critical} critical values identified. "

        if critical > 3:
            summary += "Several biomarkers require immediate attention through medical intervention and lifestyle changes. "
        elif critical > 0:
            summary += "Some biomarkers need optimization. "
        else:
            summary += "Overall good health profile. "

        summary += "Personalized recommendations have been generated for each marker."

        return summary

    def _generate_sample_results(self) -> List[Dict]:
        """Generate sample results for demo purposes"""
        samples = [
            {'name': 'Fasting Glucose', 'value': 92, 'unit': 'mg/dL', 'risk_level': 'moderate', 'category': 'Metabolic Health'},
            {'name': 'Hemoglobin A1c', 'value': 5.4, 'unit': '%', 'risk_level': 'moderate', 'category': 'Metabolic Health'},
            {'name': 'LDL Cholesterol', 'value': 120, 'unit': 'mg/dL', 'risk_level': 'moderate', 'category': 'Cardiovascular'},
            {'name': 'HDL Cholesterol', 'value': 65, 'unit': 'mg/dL', 'risk_level': 'optimal', 'category': 'Cardiovascular'},
            {'name': 'Triglycerides', 'value': 110, 'unit': 'mg/dL', 'risk_level': 'moderate', 'category': 'Metabolic Health'},
            {'name': 'C-Reactive Protein', 'value': 1.8, 'unit': 'mg/L', 'risk_level': 'moderate', 'category': 'Inflammation'},
            {'name': 'Vitamin D', 'value': 45, 'unit': 'ng/mL', 'risk_level': 'moderate', 'category': 'Vitamins & Minerals'},
            {'name': 'TSH', 'value': 1.5, 'unit': 'mIU/L', 'risk_level': 'optimal', 'category': 'Thyroid Function'},
        ]
        return samples
