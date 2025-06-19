import SkillResultsDraggable from "@/components/skill-results-draggable";

export default async function LearnSkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  const decodedSkill = decodeURIComponent(skill);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold text-center capitalize mb-6">
        Top instructors for {decodedSkill}
      </h1>
      <SkillResultsDraggable skill={decodedSkill} />
    </div>
  );
}