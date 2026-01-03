# BHOJANBYTES
BhojanBytes is an AI-native consumer health experience that helps users understand food ingredients at the moment decisions matter.
Instead of listing data, Encode acts as an intelligent co-pilot that reasons about ingredients, infers user intent, and communicates trade-offs and uncertainty clearly.
> AI is the interface, not a feature.

---

##  What BhojanBytes Does

-  Accepts ingredient input via **text or image (OCR)**
-  **Infers user intent** (e.g. muscle building, weight loss) without forms or filters
-  Explains **why ingredients matter**, not just what they are
-  Surfaces **intelligent alerts** instead of dumping ingredient lists
-  Communicates **trade-offs and uncertainty honestly**

BhojanBytes is designed to **reduce cognitive load**, not increase it.

---



##  Core Experience Flow

1. User inputs ingredients (text or photo)
2. OCR extracts ingredient text (if image)
3. LLM reasons over ingredients + context
4. Output is constrained to a **strict JSON schema**
5. UI renders deterministic, explainable insights



---


##  How to Run Locally

### Prerequisites

- Node.js **v18 or higher**
- npm or yarn
- An API key for the LLM provider you are using (e.g. Groq / OpenAI)

---

### 1️. Clone the Repository

```bash
git clone https://github.com/SnubArtifact/encode-comp.git
cd encode-comp
cd bhojanbytes

```

### 2. Install dependencies

```bash
npm install
```

### 3. Set .env
Create a .env file
```bash
VITE_GROQ_API_KEY = "YOUR API KEY"
```

### 4. Start the server
```bash
npm run dev
```

---



