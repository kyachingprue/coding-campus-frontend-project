import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiFilter,
  FiSearch,
  FiSliders,
  FiZap,
} from "react-icons/fi";
import { useAppSelector } from "../../app/hooks";
import CourseCard from "../../components/CourseCard";
import { apiRequest } from "../../lib/api";
import type { Course, CourseLevel } from "../../lib/types";
import { courseCategories } from "../../lib/courseCategories";

interface CatalogCourse {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  level?: CourseLevel;
  lessons: number;
  price: number;
  duration: string;
  imageUrl?: string;
  instructor?: { name: string } | string;
}

type SortOption = "recommended" | "price-low" | "price-high" | "name";

function displayCategory(course: CatalogCourse) {
  if (courseCategories.includes(course.category as typeof courseCategories[number])) return course.category;
  if (course.category === "Programming Language") return "Programming Languages";
  if (course.category === "Framework") return "Web Development";
  if (course.category === "Library") {
    if (["pandas", "dataframe", "numpy"].some((term) => `${course.courseId} ${course.name}`.toLowerCase().includes(term))) return "Data Science";
    if (["tensorflow", "pytorch", "machine learning"].some((term) => `${course.courseId} ${course.name}`.toLowerCase().includes(term))) return "AI Engineering";
    return "Web Development";
  }
  return course.category;
}

function mapCatalogCourse(item: CatalogCourse): Course {
  const instructor = typeof item.instructor === "string"
    ? item.instructor
    : item.instructor?.name || "CodeCampus instructor";
  return {
    id: item.courseId,
    name: item.name,
    logoImage: item.imageUrl || "",
    color: "#00d9c0",
    level: item.level || "Beginner",
    category: displayCategory(item),
    lessons: item.lessons,
    students: "New",
    price: item.price,
    duration: item.duration || "Self-paced",
    hours: 0,
    rating: 0,
    reviews: 0,
    projects: 0,
    assignments: 0,
    certificate: false,
    lifetimeAccess: true,
    format: "Video lessons",
    instructor,
    desc: item.description,
    shortDesc: item.description,
    skills: [],
    requirements: [],
    outcomes: [],
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Overview() {
  const user = useAppSelector((state) => state.auth.user);
  const enrolledIds = useAppSelector((state) => state.courses.enrolledIds);
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadCatalog() {
      setLoading(true);
      try {
        const { courses: catalog } = await apiRequest<{ courses: CatalogCourse[] }>("/courses", {
          signal: controller.signal,
        });
        setCourses(catalog.map(mapCatalogCourse));
        setError("");
      } catch (requestError: unknown) {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load the course catalog.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadCatalog();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [...courseCategories, ...new Set(courses.map((course) => course.category).filter((item) => !courseCategories.includes(item as typeof courseCategories[number])))].sort((a, b) => {
      const aIndex = courseCategories.indexOf(a as typeof courseCategories[number]);
      const bIndex = courseCategories.indexOf(b as typeof courseCategories[number]);
      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      return a.localeCompare(b);
    }),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = courses.filter((course) => {
      const matchesQuery = !normalizedQuery ||
        `${course.name} ${course.category} ${course.level} ${course.instructor} ${course.shortDesc}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesQuery &&
        (category === "all" || course.category === category) &&
        (level === "all" || course.level === level);
    });
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [courses, query, category, level, sort]);
  const categoryGroups = categories
    .filter((item) => category === "all" || category === item)
    .map((item) => ({ category: item, courses: filteredCourses.filter((course) => course.category === item) }));

  const stats = [
    { icon: FiBookOpen, label: "Enrolled courses", value: enrolledIds.length },
    { icon: FiZap, label: "Current streak", value: "4 days" },
    { icon: FiAward, label: "Plan", value: user?.plan || "Starter" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="flex flex-col gap-4 rounded-2xl border border-cyan/15 bg-gradient-to-br from-cyan/10 via-surface to-violet/10 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Your learning space</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "learner"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">
            Find your next course, explore new skills, and keep building your momentum.
          </p>
        </div>
        <Link
          to="/dashboard/learning"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-fog transition hover:border-cyan/40 hover:text-cyan"
        >
          My Learning <FiArrowRight size={15} />
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Learning summary">
        {stats.map(({ icon: Icon, label, value }) => (
          <article key={label} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-semibold text-fog">{value}</p>
              <p className="text-xs text-mist">{label}</p>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="catalog-title">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan">Explore the catalog</p>
            <h2 id="catalog-title" className="mt-1 font-display text-xl font-semibold text-fog sm:text-2xl">Find your next course</h2>
            <p className="mt-1 text-sm text-mist">Browse live packages published by our instructors.</p>
          </div>
          <span className="w-fit rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs text-mist">
            {loading ? "Loading…" : `${filteredCourses.length} ${filteredCourses.length === 1 ? "course" : "courses"}`}
          </span>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm shadow-black/[0.03] sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <label className="relative block min-w-0">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" size={17} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses, skills, categories, or instructors…"
                aria-label="Search published courses"
                className="h-12 w-full rounded-xl border border-line bg-surface-2 pl-10 pr-4 text-sm text-fog outline-none transition placeholder:text-mist/70 focus:border-cyan/60 focus:ring-2 focus:ring-cyan/15"
              />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
              <label className="relative flex h-12 min-w-0 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 text-mist sm:min-w-36">
                <FiFilter size={15} />
                <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category" className="theme-select w-full min-w-0 bg-transparent text-sm text-fog outline-none">
                  <option value="all">All categories</option>
                  {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="relative flex h-12 min-w-0 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 text-mist sm:min-w-32">
                <FiSliders size={15} />
                <select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter by level" className="theme-select w-full min-w-0 bg-transparent text-sm text-fog outline-none">
                  <option value="all">All levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </label>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Sort courses" className="theme-select h-12 min-w-0 rounded-xl border border-line bg-surface-2 px-3 text-sm text-fog outline-none transition focus:border-cyan/60 sm:min-w-36">
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
          {(query || category !== "all" || level !== "all" || sort !== "recommended") && (
            <button type="button" onClick={() => { setQuery(""); setCategory("all"); setLevel("all"); setSort("recommended"); }} className="mt-3 text-xs font-medium text-cyan hover:underline">
              Clear search and filters
            </button>
          )}
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{error}</p>}
        {loading ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />)}
          </div>
        ) : filteredCourses.length ? (
          <div className="mt-5 space-y-8">
            {categoryGroups.map(({ category: groupName, courses: groupCourses }) => (
              <section key={groupName} aria-label={groupName}>
                <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-display text-lg font-semibold text-fog">{groupName}</h3><span className="text-xs text-mist">{groupCourses.length} packages</span></div>
                {groupCourses.length ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {groupCourses.map((course, index) => (
                      <motion.div key={course.id} initial="hidden" animate="show" variants={fadeUp} transition={{ delay: Math.min(index * 0.04, 0.24) }}>
                        <CourseCard course={course} interactive />
                      </motion.div>
                    ))}
                  </div>
                ) : <p className="rounded-xl border border-dashed border-line bg-surface/40 px-4 py-3 text-xs text-mist">No packages published in this category yet.</p>}
              </section>
            ))}
          </div>
        ) : !error ? (
          <div className="mt-5 rounded-2xl border border-dashed border-line bg-surface/60 px-5 py-12 text-center">
            <FiSearch className="mx-auto text-cyan" size={24} />
            <h3 className="mt-3 font-display font-semibold text-fog">{courses.length ? "No courses match your search" : "No published courses yet"}</h3>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-mist">
              {courses.length
                ? "Try a different keyword or adjust the category and level filters."
                : "Instructor packages appear here after they are published. Draft packages remain private to their instructor."}
            </p>
            {courses.length > 0 && <button type="button" onClick={() => { setQuery(""); setCategory("all"); setLevel("all"); }} className="mt-4 text-sm font-semibold text-cyan hover:underline">Reset filters</button>}
          </div>
        ) : null}
      </section>
    </div>
  );
}
