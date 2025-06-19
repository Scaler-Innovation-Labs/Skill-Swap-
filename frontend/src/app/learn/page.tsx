"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchPopularSkills, PopularSkill } from "@/lib/api";

interface Skill {
  name: string;
  category?: string;
  popularity?: number;
}

export default function LearnPage() {
  const router = useRouter();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load skills from backend (popular skills) – fallback to local list
  useEffect(() => {
    fetchPopularSkills(100)
      .then((data) => setSkills(data))
      .catch(() => {
        // Fallback list if backend fails
        setSkills(
          [
            "Excel",
            "Python",
            "Public Speaking",
            "Photoshop",
            "Spanish",
            "React",
            "Guitar",
            "Cooking",
            "Photography",
            "Communication",
            "Design",
            "Leadership",
            "JavaScript",
            "Data Analysis",
            "Marketing"
          ].map((n) => ({ name: n, category: "General" }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    skills.forEach((s) => cats.add(s.category || "General"));
    return Array.from(cats);
  }, [skills]);

  const filteredSkills = skills
    .filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      (!category || s.category === category)
    )
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  return (
    <div className="container py-10 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Browse Skills</h1>
        <p className="text-muted-foreground">
          Discover skills to learn or find people to teach
        </p>
      </div>

      <div className="flex gap-2 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search skills..."
          className="flex-1 border rounded-md px-4 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => setQuery("")}
          className="border px-4 py-2 rounded-md"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setCategory(null)}
          className={`px-3 py-1 rounded-full border ${!category ? "bg-primary text-primary-foreground" : ""}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full border ${category === cat ? "bg-primary text-primary-foreground" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading skills…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <button
              key={skill.name}
              onClick={() => router.push(`/learn/${encodeURIComponent(skill.name.toLowerCase())}`)}
              className="rounded-lg border bg-card p-4 hover:bg-primary/10 transition-colors text-left"
            >
              <div className="font-medium">{skill.name}</div>
              {skill.popularity !== undefined && (
                <div className="text-xs text-muted-foreground mt-1">Popularity rank: #{skill.popularity}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 