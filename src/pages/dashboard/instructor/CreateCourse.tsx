import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiChevronDown, FiChevronUp, FiPlus, FiTrash2, FiUploadCloud, FiVideo } from "react-icons/fi";
import { Button } from "../../../components/ui/button";
import { apiRequest, uploadRequest } from "../../../lib/api";
import { courseCategories } from "../../../lib/courseCategories";
import type { InstructorCourse } from "./shared";

interface LessonDraft {
  id: string;
  title: string;
  videoUrl: string;
  savedVideoUrl: string;
  freePreview: boolean;
  serverId?: string;
  resources: { title: string; url: string }[];
}

interface SectionDraft {
  id: string;
  title: string;
  serverId?: string;
  lessons: LessonDraft[];
}

const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-2 px-3.5 text-sm text-fog outline-none transition placeholder:text-mist/70 focus:border-cyan/60 focus:ring-2 focus:ring-cyan/15 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "block text-xs font-medium uppercase tracking-wide text-mist";
const newLesson = (): LessonDraft => ({ id: crypto.randomUUID(), title: "", videoUrl: "", savedVideoUrl: "", freePreview: false, resources: [] });
const newSection = (order: number): SectionDraft => ({ id: crypto.randomUUID(), title: `Section ${order + 1}`, lessons: [newLesson()] });

function savedDriveShareUrl(lesson: { videoDriveFileId?: string; videoUrl?: string }) {
  return lesson.videoDriveFileId
    ? `https://drive.google.com/file/d/${encodeURIComponent(lesson.videoDriveFileId)}/view`
    : lesson.videoUrl || "";
}

function toCourseId(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export default function CreateCourse() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    courseId: "",
    name: "",
    description: "",
    category: String(courseCategories[0]),
    subcategory: "",
    level: "Beginner",
    price: "",
    duration: "",
    objectives: "",
    prerequisites: "",
  });
  const [cover, setCover] = useState<File | null>(null);
  const [sections, setSections] = useState<SectionDraft[]>([newSection(0)]);
  const [createdCourse, setCreatedCourse] = useState<InstructorCourse | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const editingId = searchParams.get("edit");
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editingId));
  const [structuredEdit, setStructuredEdit] = useState(false);
  const [legacyVideoCourse, setLegacyVideoCourse] = useState(false);

  const generatedId = useMemo(() => toCourseId(form.name), [form.name]);
  const pendingAssets = Boolean(cover || sections.some((section) => section.lessons.some((lesson) => lesson.videoUrl.trim() !== lesson.savedVideoUrl)));

  useEffect(() => {
    if (!editingId) return;
    let active = true;
    apiRequest<{ courses: InstructorCourse[] }>("/courses/instructor/mine")
      .then(({ courses }) => {
        const course = courses.find((item) => item._id === editingId);
        if (!active) return;
        if (!course) {
          setError("The course could not be found in your instructor workspace.");
          return;
        }
        setForm({
          courseId: course.courseId,
          name: course.name,
          description: course.description,
          category: course.category,
          subcategory: course.subcategory || "",
          level: course.level || "Beginner",
          price: String(course.price),
          duration: course.duration || "",
          objectives: (course.learningObjectives || []).join("\n"),
          prerequisites: (course.prerequisites || []).join("\n"),
        });
        if (course.sections?.length) {
          setStructuredEdit(true);
          setSections(course.sections.map((section) => ({
            id: crypto.randomUUID(),
            title: section.title,
            serverId: section._id,
            lessons: section.lessons.map((lesson) => ({
              id: crypto.randomUUID(),
              serverId: lesson._id,
              title: lesson.title,
              videoUrl: savedDriveShareUrl(lesson),
              savedVideoUrl: savedDriveShareUrl(lesson),
              freePreview: Boolean(lesson.freePreview),
              resources: lesson.resources || [],
            })),
          })) as SectionDraft[]);
        } else if (course.videoLessons?.length || course.videoUrl) {
          setLegacyVideoCourse(true);
        }
        setCreatedCourse(course);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load this draft.");
      })
      .finally(() => {
        if (active) setLoadingEdit(false);
      });
    return () => { active = false; };
  }, [editingId]);

  function updateForm(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value, ...(name === "name" && !current.courseId ? { courseId: toCourseId(value) } : {}) }));
  }

  function updateLesson(sectionId: string, lessonId: string, changes: Partial<LessonDraft>) {
    setSections((current) => current.map((section) => section.id !== sectionId
      ? section
      : { ...section, lessons: section.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, ...changes } : lesson) }));
  }

  function moveItem<T>(items: T[], index: number, amount: number): T[] {
    const destination = index + amount;
    if (destination < 0 || destination >= items.length) return items;
    const reordered = [...items];
    const currentItem = reordered[index];
    const destinationItem = reordered[destination];
    if (currentItem === undefined || destinationItem === undefined) return items;
    reordered[index] = destinationItem;
    reordered[destination] = currentItem;
    return reordered;
  }

  function attachServerIds(draftSections: SectionDraft[], course: InstructorCourse): SectionDraft[] {
    return draftSections.map((section, sectionIndex) => {
      const savedSection = course.sections?.[sectionIndex];
      const namedLessons = section.lessons.filter((lesson) => lesson.title.trim());
      return {
        ...section,
        serverId: savedSection?._id || section.serverId,
        lessons: section.lessons.map((lesson) => {
          const position = namedLessons.findIndex((item) => item.id === lesson.id);
          return {
            ...lesson,
            serverId: position >= 0 ? savedSection?.lessons[position]?._id || lesson.serverId : lesson.serverId,
          };
        }),
      };
    });
  }

  async function uploadPendingAssets(course: InstructorCourse, draftSections: SectionDraft[]) {
    setBusy(true);
    setError("");
    const failures: string[] = [];
    if (cover) {
      setProgress(`Uploading thumbnail: ${cover.name}`);
      setUploadPercent(0);
      try {
        const data = new FormData();
        data.append("image", cover);
        await uploadRequest(`/courses/${encodeURIComponent(course._id)}/image`, data, setUploadPercent);
        setCover(null);
      } catch (uploadError: unknown) {
        failures.push(`Thumbnail: ${uploadError instanceof Error ? uploadError.message : "upload failed"}`);
      }
    }
    const pending = draftSections.flatMap((section) => section.lessons.map((lesson) => ({ sectionId: section.id, lesson }))
      .filter(({ lesson }) => lesson.videoUrl.trim() !== lesson.savedVideoUrl));
    for (const [index, item] of pending.entries()) {
      const { lesson, sectionId } = item;
      setProgress(`Saving video link ${index + 1} of ${pending.length}: ${lesson.title}`);
      setUploadPercent(0);
      try {
        if (!lesson.serverId) throw new Error("Save the lesson title before adding its video link.");
        await apiRequest(`/courses/${encodeURIComponent(course._id)}/lessons/video-link`, {
          method: "PATCH",
          body: JSON.stringify({ lessonId: lesson.serverId, videoUrl: lesson.videoUrl.trim() }),
        });
        updateLesson(sectionId, lesson.id, { savedVideoUrl: lesson.videoUrl.trim() });
        setUploadPercent(100);
      } catch (linkError: unknown) {
        failures.push(`${lesson.title}: ${linkError instanceof Error ? linkError.message : "link could not be saved"}`);
      }
    }
    setBusy(false);
    setProgress("");
    if (failures.length) {
      setError(`Your draft was saved, but some uploads need attention: ${failures.join(" · ")}`);
    } else {
      setNotice("Draft saved. Google Drive video links are ready for review.");
    }
  }

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createdCourse && editingId) {
      setBusy(true);
      setError("");
      try {
        const sectionsPayload = structuredEdit ? sections.map((section, sectionIndex) => ({
          ...(section.serverId ? { _id: section.serverId } : {}),
          title: section.title.trim(),
          order: sectionIndex,
          lessons: section.lessons.filter((lesson) => lesson.title.trim()).map((lesson, lessonIndex) => ({
            ...(lesson.serverId ? { _id: lesson.serverId } : {}),
            title: lesson.title.trim(),
            order: lessonIndex,
            freePreview: lesson.freePreview,
            resources: lesson.resources.filter((resource) => resource.title.trim() && resource.url.trim()),
          })),
        })) : undefined;
        const { course } = await apiRequest<{ course: InstructorCourse }>(`/courses/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            subcategory: form.subcategory.trim(),
            level: form.level,
            learningObjectives: form.objectives.split("\n").map((item) => item.trim()).filter(Boolean),
            prerequisites: form.prerequisites.split("\n").map((item) => item.trim()).filter(Boolean),
            price: Number(form.price),
            duration: form.duration.trim(),
            ...(sectionsPayload ? { sections: sectionsPayload } : {}),
          }),
        });
        const savedSections = sectionsPayload ? attachServerIds(sections, course) : sections;
        if (sectionsPayload) setSections(savedSections);
        setCreatedCourse(course);
        setNotice("Course changes saved. Saving video links…");
        await uploadPendingAssets(course, savedSections);
      } catch (requestError: unknown) {
        setError(requestError instanceof Error ? requestError.message : "Unable to update the course.");
        setBusy(false);
      }
      return;
    }
    if (createdCourse) {
      await uploadPendingAssets(createdCourse, sections);
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const curriculum = sections.map((section, sectionIndex) => ({
        title: section.title,
        order: sectionIndex,
        lessons: section.lessons.filter((lesson) => lesson.title.trim()).map((lesson, lessonIndex) => ({
          title: lesson.title.trim(),
          order: lessonIndex,
          freePreview: lesson.freePreview,
          resources: lesson.resources.filter((resource) => resource.title.trim() && resource.url.trim()),
        })),
      }));
      const result = await apiRequest<{ course: InstructorCourse }>("/courses", {
        method: "POST",
        body: JSON.stringify({
          courseId: form.courseId || generatedId,
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          subcategory: form.subcategory.trim(),
          level: form.level,
          learningObjectives: form.objectives.split("\n").map((item) => item.trim()).filter(Boolean),
          prerequisites: form.prerequisites.split("\n").map((item) => item.trim()).filter(Boolean),
          price: Number(form.price),
          lessons: curriculum.reduce((total, section) => total + section.lessons.length, 0),
          duration: form.duration.trim(),
          sections: curriculum,
        }),
      });
      const preparedSections = attachServerIds(sections, result.course);
      setSections(preparedSections);
      setCreatedCourse(result.course);
      setNotice("Your draft has been created. Saving video links…");
      await uploadPendingAssets(result.course, preparedSections);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save the course draft.");
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/instructor/courses" className="inline-flex items-center gap-2 text-sm text-mist transition hover:text-cyan"><FiArrowLeft size={15} /> Back to My courses</Link>
      <header className="relative isolate overflow-hidden rounded-3xl border border-cyan/20 bg-surface p-6 shadow-xl shadow-black/5 sm:p-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-gradient-to-l from-cyan/10 via-violet/5 to-transparent" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Instructor workspace / Course builder</p>
        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><h1 className="font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">{editingId ? "Edit your package" : "Create a new package"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">Shape a learning experience with clear outcomes and an ordered curriculum. Paste a Google Drive video sharing link for each lesson.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs text-mist"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan/10 font-semibold text-cyan">1</span> Details <span className="h-px w-5 bg-line" /><span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-semibold">2</span> Curriculum</div>
        </div>
      </header>
      {loadingEdit && <p role="status" className="rounded-xl border border-line bg-surface p-4 text-sm text-mist">Loading the selected course…</p>}
      {error && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm leading-relaxed text-coral">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-cyan/25 bg-cyan/10 p-4 text-sm leading-relaxed text-cyan">{notice}</p>}
      {createdCourse && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3"><span className="inline-flex items-center gap-2 text-sm text-fog"><FiCheck className="text-cyan" /> Draft saved: <strong>{createdCourse.name}</strong></span><Link to={`/instructor/courses/${encodeURIComponent(createdCourse._id)}/preview`} className="text-sm font-semibold text-cyan hover:underline">Preview draft</Link></div>}

      <form onSubmit={(event) => void saveDraft(event)} className="space-y-8 rounded-3xl border border-line bg-surface p-4 shadow-xl shadow-black/5 sm:p-7 lg:p-8">
        <section>
          <div className="mb-5 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 font-display font-semibold text-cyan">01</span><div><h2 className="font-display text-lg font-semibold text-fog">Package information</h2><p className="mt-1 text-sm text-mist">Introduce your course and help learners know what they’ll gain.</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>Course title<input name="name" required minLength={2} maxLength={120} disabled={Boolean(createdCourse) && !editingId} value={form.name} onChange={updateForm} placeholder="Modern JavaScript from the ground up" className={inputClass} /></label>
            <label className={labelClass}>Course ID<input name="courseId" required pattern="[A-Za-z0-9_-]+" maxLength={80} disabled={Boolean(createdCourse)} value={form.courseId} onChange={updateForm} placeholder={generatedId || "modern-javascript"} className={inputClass} /></label>
            <label className={labelClass}>Category<select name="category" disabled={Boolean(createdCourse) && !editingId} value={form.category} onChange={updateForm} className={`${inputClass} theme-select`}>{!courseCategories.includes(form.category as typeof courseCategories[number]) && <option>{form.category}</option>}{courseCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className={labelClass}>Subcategory<input name="subcategory" maxLength={80} disabled={Boolean(createdCourse) && !editingId} value={form.subcategory} onChange={updateForm} placeholder="Frontend frameworks" className={inputClass} /></label>
            <label className={labelClass}>Difficulty<select name="level" disabled={Boolean(createdCourse) && !editingId} value={form.level} onChange={updateForm} className={`${inputClass} theme-select`}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
            <label className={labelClass}>Price (USD)<input name="price" required type="number" min="0.01" step="0.01" disabled={Boolean(createdCourse) && !editingId} value={form.price} onChange={updateForm} placeholder="49.00" className={inputClass} /></label>
            <label className={labelClass}>Course duration<input name="duration" maxLength={80} disabled={Boolean(createdCourse) && !editingId} value={form.duration} onChange={updateForm} placeholder="6 weeks · 12 hours" className={inputClass} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Description<textarea name="description" required minLength={10} maxLength={5000} rows={4} disabled={Boolean(createdCourse) && !editingId} value={form.description} onChange={updateForm} placeholder="Describe what learners will build and who the package is for." className={`${inputClass} h-auto min-h-28 resize-y py-3 leading-relaxed`} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Learning objectives <span className="normal-case tracking-normal">(one per line)</span><textarea name="objectives" rows={3} disabled={Boolean(createdCourse) && !editingId} value={form.objectives} onChange={updateForm} placeholder={"Build and deploy a full-stack application\nApply modern JavaScript patterns"} className={`${inputClass} h-auto resize-y py-3`} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Prerequisites <span className="normal-case tracking-normal">(one per line)</span><textarea name="prerequisites" rows={2} disabled={Boolean(createdCourse) && !editingId} value={form.prerequisites} onChange={updateForm} placeholder="Basic programming concepts" className={`${inputClass} h-auto resize-y py-3`} /></label>
          </div>
        </section>

        {legacyVideoCourse ? (
          <section className="rounded-xl border border-amber/25 bg-amber/5 p-4 text-sm leading-relaxed text-mist">
            <h2 className="font-display font-semibold text-fog">Legacy curriculum retained</h2>
            <p className="mt-1">This package uses the original flat lesson format. Its existing video order and learner progress are preserved while you edit package information. New packages support full section editing.</p>
          </section>
        ) : <section className="border-t border-line pt-7">
          <div className="mb-4 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 font-display font-semibold text-violet">02</span><div><h2 className="font-display text-lg font-semibold text-fog">Course thumbnail</h2><p className="mt-1 text-sm text-mist">Choose a cover image up to 5 MB to make your package stand out.</p></div></div>
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface-2/50 px-4 py-5 text-center transition hover:border-cyan/50 hover:bg-cyan/5">
            <FiUploadCloud size={21} className="text-cyan" /><span className="text-sm font-medium text-fog">{cover?.name || "Choose a cover image"}</span><span className="text-xs text-mist">PNG, JPG, WebP</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" disabled={Boolean(createdCourse) && !editingId} className="sr-only" onChange={(event) => setCover(event.target.files?.[0] || null)} />
          </label>
        </section>}

        <section className="border-t border-line pt-7">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 font-display font-semibold text-violet">03</span><div><h2 className="font-display text-lg font-semibold text-fog">Build your curriculum</h2><p className="mt-1 text-sm text-mist">Arrange sections and lessons, add resources, and choose optional free previews.</p></div></div><Button type="button" size="sm" variant="outline" disabled={Boolean(createdCourse) && !editingId} onClick={() => { setStructuredEdit(true); setSections((current) => [...current, newSection(current.length)]); }}><FiPlus /> Add section</Button></div>
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => <div key={section.id} className="rounded-xl border border-line bg-surface-2/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <input value={section.title} disabled={Boolean(createdCourse) && !editingId} onChange={(event) => setSections((current) => current.map((item) => item.id === section.id ? { ...item, title: event.target.value } : item))} aria-label={`Section ${sectionIndex + 1} title`} maxLength={120} className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-fog outline-none focus:border-cyan/50" />
                <button type="button" disabled={Boolean(createdCourse) && !editingId || sectionIndex === 0} onClick={() => setSections((current) => moveItem(current, sectionIndex, -1))} aria-label="Move section up" className="rounded p-2 text-mist hover:text-cyan disabled:opacity-40"><FiChevronUp /></button>
                <button type="button" disabled={Boolean(createdCourse) && !editingId || sectionIndex === sections.length - 1} onClick={() => setSections((current) => moveItem(current, sectionIndex, 1))} aria-label="Move section down" className="rounded p-2 text-mist hover:text-cyan disabled:opacity-40"><FiChevronDown /></button>
                {sections.length > 1 && <button type="button" disabled={Boolean(createdCourse) && !editingId} onClick={() => setSections((current) => current.filter((item) => item.id !== section.id))} aria-label="Remove section" className="rounded p-2 text-mist hover:text-coral disabled:opacity-40"><FiTrash2 /></button>}
              </div>
              <div className="space-y-3">
                {section.lessons.map((lesson, lessonIndex) => <div key={lesson.id} className="rounded-lg border border-line/70 bg-surface p-3">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <input value={lesson.title} disabled={Boolean(createdCourse) && !editingId} onChange={(event) => updateLesson(section.id, lesson.id, { title: event.target.value })} maxLength={120} placeholder={`Lesson ${lessonIndex + 1} title`} aria-label={`Section ${sectionIndex + 1} lesson ${lessonIndex + 1} title`} className="h-10 min-w-0 rounded-lg border border-line bg-surface-2 px-3 text-sm text-fog outline-none focus:border-cyan/50" />
                  <label className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 text-sm text-mist focus-within:border-cyan/50">
                    <FiVideo className="shrink-0 text-cyan" />
                    <input
                      type="url"
                      value={lesson.videoUrl}
                      disabled={busy || loadingEdit}
                      maxLength={2000}
                      placeholder="Paste Google Drive video link"
                      aria-label={`Section ${sectionIndex + 1} lesson ${lessonIndex + 1} Google Drive video link`}
                      onChange={(event) => {
                        setError("");
                        updateLesson(section.id, lesson.id, { videoUrl: event.target.value });
                      }}
                      className="h-full min-w-0 flex-1 bg-transparent text-xs text-fog outline-none placeholder:text-mist/70"
                    />
                    {lesson.savedVideoUrl && lesson.videoUrl.trim() === lesson.savedVideoUrl && <FiCheck className="shrink-0 text-cyan" aria-label="Video link saved" />}
                  </label>
                  <div className="flex items-center justify-end gap-1">
                    <label className="flex items-center gap-1 whitespace-nowrap text-[11px] text-mist"><input type="checkbox" checked={lesson.freePreview} disabled={Boolean(createdCourse) && !editingId} onChange={(event) => updateLesson(section.id, lesson.id, { freePreview: event.target.checked })} /> Free preview</label>
                    <button type="button" disabled={Boolean(createdCourse) && !editingId || lessonIndex === 0} onClick={() => setSections((current) => current.map((item) => item.id === section.id ? { ...item, lessons: moveItem(item.lessons, lessonIndex, -1) } : item))} aria-label="Move lesson up" className="rounded p-1.5 text-mist hover:text-cyan disabled:opacity-40"><FiChevronUp /></button>
                    <button type="button" disabled={Boolean(createdCourse) && !editingId || lessonIndex === section.lessons.length - 1} onClick={() => setSections((current) => current.map((item) => item.id === section.id ? { ...item, lessons: moveItem(item.lessons, lessonIndex, 1) } : item))} aria-label="Move lesson down" className="rounded p-1.5 text-mist hover:text-cyan disabled:opacity-40"><FiChevronDown /></button>
                    {section.lessons.length > 1 && <button type="button" disabled={Boolean(createdCourse) && !editingId} onClick={() => setSections((current) => current.map((item) => item.id === section.id ? { ...item, lessons: item.lessons.filter((entry) => entry.id !== lesson.id) } : item))} aria-label="Remove lesson" className="rounded p-1.5 text-mist hover:text-coral disabled:opacity-40"><FiTrash2 /></button>}
                  </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {lesson.resources.map((resource, resourceIndex) => <div key={`${lesson.id}-resource-${resourceIndex}`} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                      <input value={resource.title} disabled={Boolean(createdCourse) && !editingId} maxLength={120} placeholder="Resource title" onChange={(event) => updateLesson(section.id, lesson.id, { resources: lesson.resources.map((item, index) => index === resourceIndex ? { ...item, title: event.target.value } : item) })} className="h-9 rounded-lg border border-line bg-surface-2 px-3 text-xs text-fog outline-none focus:border-cyan/50" />
                      <input type="url" value={resource.url} disabled={Boolean(createdCourse) && !editingId} maxLength={1000} placeholder="https://example.com/handout" onChange={(event) => updateLesson(section.id, lesson.id, { resources: lesson.resources.map((item, index) => index === resourceIndex ? { ...item, url: event.target.value } : item) })} className="h-9 rounded-lg border border-line bg-surface-2 px-3 text-xs text-fog outline-none focus:border-cyan/50" />
                      <button type="button" disabled={Boolean(createdCourse) && !editingId} onClick={() => updateLesson(section.id, lesson.id, { resources: lesson.resources.filter((_item, index) => index !== resourceIndex) })} aria-label="Remove resource" className="rounded p-2 text-mist hover:text-coral disabled:opacity-40"><FiTrash2 /></button>
                    </div>)}
                    <button type="button" disabled={Boolean(createdCourse) && !editingId} onClick={() => updateLesson(section.id, lesson.id, { resources: [...lesson.resources, { title: "", url: "" }] })} className="text-xs font-semibold text-cyan hover:underline">Add lesson resource</button>
                  </div>
                </div>)}
              </div>
              <Button type="button" size="sm" variant="subtle" disabled={Boolean(createdCourse) && !editingId} onClick={() => { if (editingId) setStructuredEdit(true); setSections((current) => current.map((item) => item.id === section.id ? { ...item, lessons: [...item.lessons, newLesson()] } : item)); }} className="mt-3"><FiPlus /> Add lesson</Button>
            </div>)}
          </div>
          <p className="mt-3 text-xs text-mist">Paste the Google Drive sharing link for a video you have already uploaded. In Google Drive, set General access to “Anyone with the link” so the player can load. Each lesson can include a free-preview marker.</p>
        </section>

        {busy && <div role="status" className="rounded-xl border border-cyan/20 bg-cyan/5 p-4"><div className="flex justify-between gap-3 text-sm text-fog"><span>{progress || "Saving draft…"}</span><span>{uploadPercent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-cyan transition-[width]" style={{ width: `${uploadPercent}%` }} /></div></div>}
        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-mist">Your package remains a private draft until you publish it from My courses.</p>
          <Button type="submit" disabled={busy || loadingEdit} className="w-full sm:w-auto">{busy ? "Saving…" : editingId ? pendingAssets ? "Save changes and links" : "Save changes" : createdCourse ? pendingAssets ? "Retry saving links" : "Save draft" : "Save as draft"}</Button>
        </div>
      </form>
    </div>
  );
}
