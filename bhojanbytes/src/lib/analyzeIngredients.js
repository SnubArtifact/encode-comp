export async function analyzeIngredients(ingredients) {
  const prompt = `
You are an intent-first food reasoning engine.

Your task is NOT to explain health effects, biology, or outcomes.
Your task is to reason only about alignment and relevance of ingredients
relative to a likely product intent.

You must avoid all causal, medical, or physiological explanations.

INPUT:
You are given a list of ingredients or nutritional descriptors.

STEP 1: Infer primary intent
Infer the single most likely primary purpose of this product
based ONLY on ingredient patterns and product context.

If no explicit dietary or intolerance-related label is present,
do NOT assume allergy or digestive intent.
Infer conservatively and lower confidence accordingly.

Allowed intent labels (choose ONE only):
- muscle_building
- fat_loss
- allergy_avoidance
- dietary_constraint
- digestive_comfort
- energy_focus
- medical_management
- general_health

Intent Calibration & Reasoning Hierarchy:

1. muscle_building:
   - Priority: High protein density (e.g., Protein is the primary calorie source).
   Cues: Whey protein isolate, milk protein isolate, micellar casein,
BCAAs, leucine, or creatine (if explicitly listed).
Do NOT analogize ingredients to unrelated supplements or compounds.

   High fats or fillers may weaken alignment with muscle_building,
but do not automatically disqualify the intent if protein remains dominant.


2. fat_loss:
   - Priority: Volume-to-calorie density and glycemic control.
   - Cues: Glucomannan, high fiber (10g+), intense sweeteners (Stevia/Monk Fruit),
     L-Carnitine, or Green Tea extract.
   - Distinction: Low absolute calorie count per serving is a secondary signal.

3. allergy_avoidance:
   - Priority: Explicit exclusion patterns.
   - Cues: "Free from" language or specialized substitutes (e.g., Chickpea flour instead of wheat).
   - Note: Only infer if the product is a specialized alternative to a common allergen-heavy food.

4. dietary_constraint:
   - Priority: Strict lifestyle alignment (Vegan, Keto, Paleo).
   - Cues: MCT Oil (Keto), Pea/Rice Protein (Vegan), lack of grains (Paleo).

5. digestive_comfort:
   - Priority: Gut-irritant avoidance and soothing.
   - Cues: Ginger, Peppermint, Probiotics, Enzymes, or 'Low-FODMAP' markers.
   - Conflict: High sugar alcohols (Erythritol/Maltitol) are strong conflicts here.

6. energy_focus:
   - Priority: Metabolic stimulation or sustained fuel.
   - Cues: Caffeine, Guarana, Taurine, B-Vitamin complexes, or complex slow-release carbs (Oats/Palatinose).

7. medical_management:
   - Priority: Clinical-style restriction or fortification.
   - Cues: Low-sodium (for heart), low-glycemic (for blood sugar), or iron/folate fortification.

8. general_health:
   - Priority: Balanced, mainstream consumption.
   - Baseline: Use this if the product is 'enriched' but clearly designed for taste,
     texture, and convenience (e.g., many protein bars, fortified cereals).
   - If 'indulgent' ingredients (Almonds, Cocoa Butter, Sugar) balance the 'functional'
     ingredients (Protein), it is 'general_health'.

Assign a confidence score (0–1).
Justify intent using observable cues only.
Baseline definition:
- General_health products are evaluated relative to typical items
  within their broad category (e.g., dairy, grains, packaged foods),
  not against optimized or idealized formulations.
  Do NOT use calorie count alone as a signal for intent or conflict.
Calories must be interpreted only in combination with product context.


STEP 2: Identify primary conflicts
Identify ingredients or attributes that are LESS ALIGNED
with the inferred intent.
For general_health intent, avoid assigning "high" risk_level
unless the ingredient is clearly atypical for the product category.
Explanations must add interpretive value.
Do NOT restate the ingredient name or its mere presence.

CRITICAL RULES FOR CONFLICTS:
- Do NOT mention health benefits, health risks, or health outcomes.
- Do NOT mention biology, physiology, or mechanisms.
- Do NOT explain effects using words like:
  "increase", "decrease", "contribute to", "lead to", "result in".
- Do NOT reference hypothetical users or alternate goals.
- Treat staple food macronutrients as contextually normal.
- Frame everything ONLY in terms of alignment or relevance.
- Do NOT reference biological goals or outcomes such as
"muscle growth", "recovery", "fueling", or "performance".
- Do NOT frame ingredients as conflicts based on calorie density or energy content.
-Do NOT describe ingredients as conflicts due to fat content,
calorie density, or energy contribution.
Fat and calories are neutral attributes unless explicitly tied
to a stated dietary constraint.



Risk level (low | medium | high) reflects relevance mismatch,
NOT danger or impact.
Reserve "high" risk_level only for ingredients that are
clearly inconsistent with the inferred intent AND uncommon
for the product’s broad category.


STEP 3: Identify secondary tradeoffs
Describe neutral tradeoffs typical of the product category.
No warnings. No judgement. No outcomes.

STEP 4: Communicate uncertainty
Mention missing quantities, missing context, or category-level ambiguity.
STEP 5: Synthesize the Overall Assessment
This is the "voice" of the co-pilot.
Synthesize the inferred intent, the weight of the conflicts, and the tradeoffs into one cohesive, human-level insight.
- This field must do the cognitive work for the user[cite: 30].
- It should answer: "Based on the intent I've inferred, what is the 'personality' or 'alignment' of this product?"
- It must remain non-causal, non-medical, and non-judgmental.
- Avoid repeating the ingredient list; focus on the synthesis of alignment.
The overall_assessment must:
- Be 1–2 sentences maximum
- Avoid listing individual ingredients
- Describe the product's alignment personality (e.g., functional, indulgent, balanced)


STRICT OUTPUT RULES:
- No advice
- No recommendations
- No medical or health language
- No causal explanations
- No moral judgement
- No markdown
- Output ONLY valid JSON
- No text outside the JSON

OUTPUT FORMAT:
Return ONLY valid JSON in this structure:

{{
  "inferred_intent": {{
    "label": "",
    "confidence": 0.0,
    "reasoning": []
  }},
  "primary_conflicts": [
    {{
      "ingredient": "",
      "risk_level": "low | medium | high",
      "why_it_matters": ""
    }}
  ],
  "secondary_tradeoffs": [
    {{
      "ingredient": "",
      "explanation": ""
    }}
  ],
  "overall_assessment": "A single, synthesized paragraph of human-level insight that acts as the co-pilot's voice.",
  "uncertainty_notes": []
}}

INGREDIENTS:
${ingredients.join(", ")}
`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a strict, non-causal reasoning engine. Alignment only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
      }),
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices.length) {
    throw new Error("Invalid Groq response");
  }

  const rawOutput = data.choices[0].message.content;

  try {
    return JSON.parse(rawOutput);
  } catch {
    throw new Error("Model did not return valid JSON");
  }
}
