import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { motion } from "motion/react";
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiCode,
  FiRefreshCw,
  FiTarget,
  FiZap,
} from "react-icons/fi";
import { Button } from "../../components/ui/button";
import { saveQuizAttempt, setEnrolledIds, togglePracticeTask } from "../../features/courses/coursesSlice";
import { apiRequest } from "../../lib/api";
import type { CourseLevel } from "../../lib/types";

interface PracticeCourse {
  courseId: string;
  name: string;
  description?: string;
  category?: string;
  level?: CourseLevel;
  imageUrl?: string;
}

interface PracticeEnrollment {
  course: PracticeCourse | null;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const quizQuestions: Record<string, QuizQuestion[]> = {
  js: [
    { question: "Which keyword declares a block-scoped variable that can be reassigned?", options: ["const", "let", "static", "define"], answer: 1, explanation: "let declares a block-scoped binding that can be reassigned." },
    { question: "What does Promise.all() do when one promise rejects?", options: ["Waits for all promises then ignores it", "Resolves with null", "Rejects as soon as an input rejects", "Retries the rejected promise"], answer: 2, explanation: "Promise.all rejects when any input promise rejects." },
    { question: "Which array method returns a new array with transformed items?", options: ["forEach()", "map()", "find()", "some()"], answer: 1, explanation: "map() creates a new array from the return value for each item." },
    { question: "What is the result of typeof null in JavaScript?", options: ["null", "undefined", "object", "boolean"], answer: 2, explanation: "typeof null is a long-standing JavaScript quirk that returns 'object'." },
  ],
  py: [
    { question: "Which Python collection stores key-value pairs?", options: ["tuple", "set", "dictionary", "range"], answer: 2, explanation: "Dictionaries map unique keys to values." },
    { question: "What does list.append(value) do?", options: ["Adds value to the end of the list", "Sorts the list", "Returns a copy", "Removes the last item"], answer: 0, explanation: "append adds one item to the end of the existing list." },
    { question: "Which keyword defines a function?", options: ["func", "function", "def", "lambda"], answer: 2, explanation: "A named Python function is defined using def." },
    { question: "What does `with open(...)` help ensure?", options: ["The file is closed after use", "The file is encrypted", "The file is sorted", "The file is opened read-only"], answer: 0, explanation: "A with statement manages the file context and closes it when the block exits." },
  ],
  react: [
    { question: "Which React hook stores state in a function component?", options: ["useEffect", "useState", "useMemo", "useRef"], answer: 1, explanation: "useState adds local state to a function component." },
    { question: "Why should list items have a stable key?", options: ["To style the item", "To help React track items between renders", "To prevent events", "To create component state"], answer: 1, explanation: "Keys help React identify which list items were added, changed, or removed." },
    { question: "When should an effect cleanup function run?", options: ["Before the effect reruns and on unmount", "Only after a click", "Before initial render", "Only when state is empty"], answer: 0, explanation: "Cleanup runs before a changed effect runs again and when the component unmounts." },
    { question: "What is a controlled input?", options: ["An input whose value is driven by React state", "An input disabled by default", "An input with no label", "An input rendered outside a form"], answer: 0, explanation: "A controlled input receives its value from state and updates through an event handler." },
  ],
  ts: [
    { question: "What does a TypeScript interface primarily describe?", options: ["A runtime object", "The shape of a value", "A compiled module", "A browser event"], answer: 1, explanation: "An interface describes the expected structure of a value at compile time." },
    { question: "Which type is safer than `any` when a value is not yet known?", options: ["never", "unknown", "void", "object"], answer: 1, explanation: "unknown requires narrowing before the value can be used." },
    { question: "What does a generic allow you to do?", options: ["Reuse types across different value types", "Skip type checking", "Create runtime classes", "Rename variables"], answer: 0, explanation: "Generics let functions and types work with multiple types while preserving type information." },
    { question: "How do you narrow a union type?", options: ["Use runtime checks such as typeof", "Use a type assertion everywhere", "Disable strict mode", "Rename the union"], answer: 0, explanation: "Control-flow checks such as typeof and discriminant properties narrow unions." },
  ],
};

const fallbackQuestions: QuizQuestion[] = [
  { question: "What is the main benefit of breaking a program into small functions or components?", options: ["It removes the need for testing", "It improves reuse and makes code easier to maintain", "It always reduces runtime complexity", "It avoids naming variables"], answer: 1, explanation: "Small focused units are easier to reuse, test, and maintain." },
  { question: "What should a useful automated test verify?", options: ["Only that the app starts", "A specific behavior or expected result", "The number of files in a project", "That every variable has a short name"], answer: 1, explanation: "Tests provide confidence by checking defined behavior and expected outcomes." },
  { question: "Why use version control such as Git?", options: ["To track and review changes over time", "To host a database", "To replace code reviews", "To automatically fix all bugs"], answer: 0, explanation: "Version control records changes and supports collaboration and rollback." },
  { question: "What is a good first step when debugging an unexpected result?", options: ["Rewrite the whole app", "Reproduce the issue and inspect relevant inputs", "Remove all tests", "Change several things at once"], answer: 1, explanation: "A reliable reproduction and focused inspection help isolate the cause." },
  { question: "Which HTTP method is commonly used to retrieve a resource?", options: ["POST", "GET", "PATCH", "DELETE"], answer: 1, explanation: "GET requests a representation of a resource and should not change its state." },
  { question: "What does responsive design help a website do?", options: ["Adapt its layout to different screens", "Load without a network", "Store passwords", "Compile server code"], answer: 0, explanation: "Responsive layouts adapt content to different viewport sizes." },
  { question: "What is the purpose of semantic HTML?", options: ["Describe the meaning and structure of content", "Add database tables", "Minify CSS", "Replace JavaScript"], answer: 0, explanation: "Semantic elements communicate the role of content to browsers and assistive technology." },
  { question: "In Git, what does a commit represent?", options: ["A saved snapshot of project changes", "A hosted website", "A CSS selector", "A database query"], answer: 0, explanation: "A commit records a set of changes in the repository history." },
  { question: "Why validate data at an application boundary?", options: ["To catch invalid input before relying on it", "To make every input optional", "To hide all errors", "To remove type definitions"], answer: 0, explanation: "Validation protects application logic from malformed or unexpected data." },
  { question: "What is an API?", options: ["A defined way for software to communicate", "A type of image file", "A browser theme", "A programming font"], answer: 0, explanation: "An API defines how software components can interact." },
  { question: "Which CSS layout system is designed for one-dimensional rows or columns?", options: ["Flexbox", "Grid only", "Float", "Position fixed"], answer: 0, explanation: "Flexbox is designed to arrange items along one main axis." },
  { question: "What is the main purpose of a code review?", options: ["Improve correctness and share feedback", "Replace running the app", "Increase file size", "Remove documentation"], answer: 0, explanation: "Review helps catch issues and improve shared understanding of code." },
  { question: "What does a 404 HTTP status indicate?", options: ["The requested resource was not found", "The request succeeded", "The server is redirecting", "The client is authenticated"], answer: 0, explanation: "HTTP 404 indicates that the requested resource could not be found." },
  { question: "Why split a large feature into smaller tasks?", options: ["To make progress easier to plan and verify", "To avoid defining requirements", "To make bugs impossible", "To avoid using version control"], answer: 0, explanation: "Smaller tasks are easier to estimate, implement, and verify." },
  { question: "What should you do before changing code to fix a bug?", options: ["Understand and reproduce the failure", "Delete the test suite", "Change unrelated files", "Disable error messages"], answer: 0, explanation: "Reproducing the bug gives a reliable way to investigate and confirm the fix." },
];

function makeTasks(course: PracticeCourse) {
  const outcomes = [
    `${course.name} fundamentals`,
    `${course.name} problem solving`,
    `${course.name} practical patterns`,
    `${course.name} code quality`,
  ];
  return outcomes.map((outcome, index) => ({
    id: `${course.courseId}-task-${index}`,
    title: `Practice: ${outcome}`,
    description: [
      `Write a small example that demonstrates ${outcome}.`,
      `Build a tiny feature using ${outcome} and note one edge case.`,
      `Create a short code example for ${outcome}, then explain how it works.`,
      `Review your ${outcome} example and refactor it for clarity.`,
    ][index],
  }));
}

export default function Practice() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const progress = useAppSelector((state) => state.courses.practiceProgress ?? {});
  const [enrolledCourses, setEnrolledCourses] = useState<PracticeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [activeTab, setActiveTab] = useState("quiz");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    async function loadCourses() {
      setLoading(true);
      try {
        const { enrollments } = await apiRequest<{ enrollments: PracticeEnrollment[] }>("/enrollments/mine");
        if (!active) return;
        const courses = enrollments.flatMap(({ course }) => course ? [course] : []);
        setEnrolledCourses(courses);
        dispatch(setEnrolledIds(courses.map((course) => course.courseId)));
        setSelectedId((current) => courses.some((course) => course.courseId === current)
          ? current
          : courses[0]?.courseId ?? "");
        setLoadError("");
      } catch (requestError: unknown) {
        if (active) {
          setLoadError(requestError instanceof Error ? requestError.message : "Unable to load your enrolled courses.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadCourses();
    return () => { active = false; };
  }, [dispatch, retryCount, userId]);

  const course = enrolledCourses.find((item) => item.courseId === selectedId) ?? enrolledCourses[0];
  const courseProgress = course ? progress[course.courseId] ?? {} : {};
  const courseQuestions = course ? quizQuestions[course.courseId] ?? [] : [];
  const questions = course
    ? [...courseQuestions, ...fallbackQuestions].slice(0, 15)
    : [];
  const tasks = course ? makeTasks(course) : [];
  const completedTasks = courseProgress.completedTasks ?? [];
  const question = questions[questionIndex];

  function selectCourse(courseId: string) {
    setSelectedId(courseId);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizComplete(false);
  }

  function startQuiz() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizComplete(false);
  }

  function submitAnswer() {
    if (!course || selectedAnswer === null || !question) return;
    const nextScore = score + (selectedAnswer === question.answer ? 1 : 0);
    setScore(nextScore);

    if (questionIndex === questions.length - 1) {
      dispatch(saveQuizAttempt({
        courseId: course.courseId,
        score: nextScore,
        total: questions.length,
      }));
      setQuizComplete(true);
      return;
    }

    if (loading) {
      return <p className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-mist">Loading your practice courses…</p>;
    }

    if (loadError) {
      return <div className="rounded-2xl border border-coral/25 bg-coral/10 p-6 text-center"><p role="alert" className="text-sm text-coral">{loadError}</p><button type="button" onClick={() => { setLoading(true); setRetryCount((count) => count + 1); }} className="mt-4 rounded-lg border border-coral/30 px-4 py-2 text-sm font-medium text-fog hover:bg-coral/10">Try again</button></div>;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  if (!enrolledCourses.length) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 text-cyan"><FiCode size={25} /></span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-fog">Your Practice Lab is ready</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">Enroll in a course to unlock its knowledge checks, hands-on tasks, and saved learning progress.</p>
        <Link to="/dashboard/learning" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan-dim">View My Learning <FiArrowRight /></Link>
      </div>
    );
  }

  if (!course) return null;
  if (!question) return null;

  const taskPercent = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-cyan/20 bg-linear-to-br from-cyan/10 via-surface to-violet/10 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Coding Campus · Practice Lab</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl">Learn by doing.</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">Quick knowledge checks and hands-on coding challenges, tailored to your enrolled courses.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface/80 p-4">
            <FiZap className="text-amber" size={21} />
            <div><p className="font-display text-lg font-semibold text-fog">{courseProgress.attempts ?? 0}</p><p className="text-xs text-mist">quiz attempts</p></div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
          <label htmlFor="practice-course" className="text-sm font-semibold text-fog">Choose an enrolled course</label>
          <select id="practice-course" value={course.courseId} onChange={(event) => selectCourse(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-line bg-surface-2 px-3 text-sm text-fog outline-none focus:border-cyan">
            {enrolledCourses.map((item) => <option key={item.courseId} value={item.courseId}>{item.name}</option>)}
          </select>
          <div className="mt-5 flex items-center gap-3">
            {course.imageUrl
              ? <img src={course.imageUrl} alt="" className="h-11 w-11 rounded-xl border border-line bg-white p-1.5 object-contain" />
              : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-cyan/10 text-cyan"><FiCode /></span>}
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-fog">{course.name}</p><p className="truncate text-xs text-mist">{course.category || "Course practice"}</p></div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-xs"><span className="text-mist">Tasks completed</span><span className="font-medium text-fog">{completedTasks.length}/{tasks.length}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2"><motion.div initial={false} animate={{ width: `${taskPercent}%` }} className="h-full rounded-full bg-cyan" /></div>
            {(courseProgress.bestTotal ?? 0) > 0 && <div className="flex justify-between text-xs"><span className="text-mist">Best quiz score</span><span className="font-medium text-cyan">{courseProgress.bestScore}/{courseProgress.bestTotal}</span></div>}
          </div>
          <Link to={`/dashboard/learning/${course.courseId}`} className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-cyan hover:underline">Course details <FiArrowRight /></Link>
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="flex gap-2 rounded-xl border border-line bg-surface p-1.5">
            <button onClick={() => setActiveTab("quiz")} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeTab === "quiz" ? "bg-cyan text-ink" : "text-mist hover:bg-surface-2 hover:text-fog"}`}><FiTarget /> Quick quiz</button>
            <button onClick={() => setActiveTab("tasks")} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeTab === "tasks" ? "bg-cyan text-ink" : "text-mist hover:bg-surface-2 hover:text-fog"}`}><FiBookOpen /> Coding tasks</button>
          </div>

          {activeTab === "quiz" ? (
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
              {quizComplete ? (
                <div className="py-7 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 text-cyan"><FiAward size={26} /></span>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-fog">Checkpoint complete!</h2>
                  <p className="mt-2 text-mist">You scored <span className="font-semibold text-cyan">{score} of {questions.length}</span> on {course.name} concepts.</p>
                  <p className="mt-1 text-xs text-mist">Best score: {courseProgress.bestScore}/{courseProgress.bestTotal}</p>
                  <Button type="button" onClick={startQuiz} className="mt-6"><FiRefreshCw /> Try again</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="font-mono text-[11px] uppercase tracking-wider text-cyan">15-question knowledge checkpoint</p><h2 className="mt-1 font-display text-xl font-semibold text-fog">{course.name} fundamentals</h2></div>
                    <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs text-mist">{questionIndex + 1} / {questions.length}</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-cyan transition-all" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
                  <h3 className="mt-7 text-lg font-medium leading-relaxed text-fog">{question.question}</h3>
                  <div className="mt-5 space-y-3">
                    {question.options.map((option, index) => {
                      const selected = selectedAnswer === index;
                      return <button key={option} onClick={() => setSelectedAnswer(index)} className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition ${selected ? "border-cyan bg-cyan/10 text-fog" : "border-line bg-surface-2/40 text-mist hover:border-mist/40 hover:text-fog"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs ${selected ? "bg-cyan text-ink" : "bg-surface-2 text-mist"}`}>{String.fromCharCode(65 + index)}</span>{option}</button>;
                    })}
                  </div>
                  <div className="mt-6 flex justify-end"><Button type="button" disabled={selectedAnswer === null} onClick={submitAnswer}>{questionIndex === questions.length - 1 ? "Finish checkpoint" : "Submit & continue"} <FiArrowRight /></Button></div>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
              <div className="mb-5"><p className="font-mono text-[11px] uppercase tracking-wider text-cyan">Build your skills</p><h2 className="mt-1 font-display text-xl font-semibold text-fog">Hands-on coding tasks</h2><p className="mt-1 text-sm text-mist">Try these in your own editor, then mark each one complete.</p></div>
              <div className="space-y-3">
                {tasks.map((task, index) => {
                  const completed = completedTasks.includes(task.id);
                  return <motion.article layout key={task.id} className={`rounded-xl border p-4 transition-colors ${completed ? "border-cyan/30 bg-cyan/5" : "border-line bg-surface-2/30"}`}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${completed ? "bg-cyan text-ink" : "bg-surface-2 text-cyan"}`}>{completed ? <FiCheck size={16} /> : <FiCode size={16} />}</span>
                      <div className="min-w-0 flex-1"><p className={`text-sm font-semibold ${completed ? "text-cyan" : "text-fog"}`}>{task.title}</p><p className="mt-1 text-sm leading-relaxed text-mist">{task.description}</p><p className="mt-2 text-[11px] text-mist">Challenge {String(index + 1).padStart(2, "0")} · {course.level || "Beginner"}</p></div>
                      <button type="button" onClick={() => dispatch(togglePracticeTask({ courseId: course.courseId, taskId: task.id }))} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition ${completed ? "border-cyan/30 text-cyan hover:bg-cyan/10" : "border-line text-mist hover:border-cyan/40 hover:text-fog"}`} aria-label={`${completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`}>{completed ? <FiCheckCircle size={16} /> : "Done"}</button>
                    </div>
                  </motion.article>;
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
