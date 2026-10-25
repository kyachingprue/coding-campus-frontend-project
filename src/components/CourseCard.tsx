import { motion } from 'motion/react'
import {
  FiUsers,
  FiBookOpen,
  FiCheck,
  FiPlus,
  FiClock,
  FiStar,
  FiTag
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import type { Course } from '../lib/types'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

interface CourseCardProps {
  course: Course;
  interactive?: boolean;
}

export default function CourseCard({ course, interactive = false }: CourseCardProps) {
  const coursesState = useAppSelector(state => state.courses)
  const enrolledIds = coursesState?.enrolledIds ?? []
  const enrolled = enrolledIds.includes(course.id)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden transition-all hover:border-mist/30">
        <CardContent className="flex h-full flex-col">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-cyan/10 text-sm font-bold text-cyan">
              {course.logoImage ? (
                <img src={course.logoImage} className="h-full w-full object-cover" alt="" />
              ) : (
                course.name.slice(0, 2).toUpperCase()
              )}
            </span>

            <Badge tone={course.level}>{course.level}</Badge>
          </div>

          {/* Course Name */}
          <h3 className="mt-4 font-display text-lg font-semibold text-fog">
            {interactive ? (
              <Link to={`/dashboard/courses/${course.id}`} className="hover:text-cyan">
                {course.name}
              </Link>
            ) : course.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-mist">
            {course.shortDesc || course.desc}
          </p>

          {/* Rating */}
          {course.rating > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm font-semibold text-fog">
                <FiStar size={14} className="fill-current" />
                {course.rating}
              </div>
              <span className="text-xs text-mist">({course.reviews?.toLocaleString()} reviews)</span>
            </div>
          )}

          {/* Course Stats */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-mist">
            <span className="flex items-center gap-1.5">
              <FiBookOpen size={13} />
              {course.lessons} lessons
            </span>

            <span className="flex items-center gap-1.5">
              <FiUsers size={13} />
              {course.students}
            </span>

            <span className="flex items-center gap-1.5">
              <FiClock size={13} />
              {course.duration}
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-fog">
                ${course.price}
              </span>

              {course.originalPrice && (
                <span className="text-sm text-mist line-through">
                  ${course.originalPrice}
                </span>
              )}
            </div>

            {course.discount && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                <FiTag size={12} />
                {course.discount}% OFF
              </span>
            )}
          </div>

          {/* Enroll Button */}
          {interactive && (
            <Button
              as={Link}
            to={enrolled ? `/dashboard/learning/${course.id}` : `/dashboard/courses/${course.id}`}
              size="sm"
              className="mt-5 w-full rounded-xl bg-linear-to-r from-cyan to-cyan-dim text-ink shadow-lg shadow-cyan/15 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl hover:shadow-cyan/25"
            >
              {enrolled ? (
                <>
                  <FiCheck size={15} />
                  Continue learning
                </>
              ) : (
                <>
                  <FiBookOpen size={15} />
                  View package
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
