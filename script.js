const form = document.querySelector("#proposalForm");
const output = document.querySelector("#proposalOutput");
const score = document.querySelector("#score");
const copyButton = document.querySelector("#copyButton");

function clean(value) {
  return String(value || "").trim();
}

function firstSentence(text) {
  const sentence = clean(text).split(/[.!?]/)[0];
  return sentence || "You need a clearer path from brief to deliverable";
}

function toneLead(tone) {
  const leads = {
    direct: "I can help with this.",
    consultative: "The key here is to make the page credible before asking visitors to convert.",
    friendly: "This sounds like a strong fit."
  };
  return leads[tone] || leads.direct;
}

function calculateScore(fields) {
  let value = 60;
  if (fields.jobBrief.length > 160) value += 8;
  if (fields.service.length > 12) value += 8;
  if (fields.proof.length > 18) value += 10;
  if (fields.cta.endsWith("?")) value += 8;
  if (fields.jobTitle.length > 10) value += 6;
  return Math.min(value, 98);
}

function buildProposal(fields) {
  const clientProblem = firstSentence(fields.jobBrief).toLowerCase();
  return [
    `Hi,`,
    ``,
    `${toneLead(fields.tone)} From your brief, the main job is not just creating a page. It is making sure buyers quickly understand the product, trust the offer, and know what to do next.`,
    ``,
    `For a ${fields.jobTitle.toLowerCase()}, I would start by mapping the page around the buyer's decision path: problem, value promise, proof, objections, and one clear conversion action.`,
    ``,
    `My relevant experience: ${fields.proof}. For this project, I would use that experience to build a page that is easy to scan, easy to edit, and ready for analytics from day one.`,
    ``,
    `A sensible first milestone would be:`,
    `1. Review your product notes and target audience.`,
    `2. Create the page structure and copy direction.`,
    `3. Build the responsive page with lead capture.`,
    `4. Add basic conversion tracking and handoff notes.`,
    ``,
    `${fields.cta}`,
    ``,
    `Best,`
  ].join("\n");
}

function readFields() {
  return {
    jobTitle: clean(form.jobTitle.value),
    jobBrief: clean(form.jobBrief.value),
    service: clean(form.service.value),
    proof: clean(form.proof.value),
    tone: clean(form.tone.value),
    cta: clean(form.cta.value)
  };
}

function render() {
  const fields = readFields();
  output.textContent = buildProposal(fields);
  score.textContent = calculateScore(fields);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(output.textContent);
  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1200);
});

render();
