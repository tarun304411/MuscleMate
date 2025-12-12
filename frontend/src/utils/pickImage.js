function variants(base) {
  // Prefer .jpeg first since your assets use it
  return [".jpeg", ".jpg", ".png", ".webp"].map(ext => `/assets/img/${base}${ext}`);
}

export function pickImageCandidates(name = "", categoryName = "", explicitUrl = "") {
  const candidates = [];
  if (explicitUrl) candidates.push(explicitUrl);
  const n = (name || "").toLowerCase();
  const c = (categoryName || "").toLowerCase();

  const rules = [
    { keys: ["whey", "protein", "iso", "gainer"], base: "whey" },
    { keys: ["creatine"], base: "creatine" },
    { keys: ["pre", "preworkout"], base: "preworkout" },
    { keys: ["bcaa", "amino"], base: "bcaa" },
    { keys: ["belt", "power"], base: "belt" },
    { keys: ["tee", "t-shirt", "apparel", "clothes"], base: "tee" },
    { keys: ["shaker"], base: "shaker" },
    { keys: ["glove"], base: "gloves" },
    { keys: ["strap"], base: "straps" },
    { keys: ["multi", "vitamin"], base: "multivitamin" },
  ];

  for (const r of rules) {
    if (r.keys.some(k => n.includes(k) || c.includes(k))) {
      candidates.push(...variants(r.base));
    }
  }
  // Always include supplements generic last
  candidates.push(...variants("supplements"));
  // De-duplicate
  return Array.from(new Set(candidates));
}

export function pickImageFor(name = "", categoryName = "", explicitUrl = "") {
  const list = pickImageCandidates(name, categoryName, explicitUrl);
  return list[0];
}


