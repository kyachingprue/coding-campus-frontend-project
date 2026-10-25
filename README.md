# Code Campus frontend

The React application is written in TypeScript and built with Vite.

## Setup

```powershell
npm install
npm run dev
```

Set `VITE_API_URL` in `.env` to the backend API URL, for example
`http://localhost:5000/api`. Restart Vite after changing environment values.

## Validation

```powershell
npm run typecheck
npm run build
```

Application source is under `src/` and uses `.ts` and `.tsx` files. Vite
configuration and TypeScript compiler settings are maintained at the project
root.

Signed-in dashboards are role-based: students use `/dashboard`, instructors use
`/instructor/dashboard`, and admins use `/admin/dashboard`. Admin sections are
available at `/admin/students`, `/admin/instructors`, `/admin/courses`,
`/admin/analytics`, `/admin/payments`, and `/admin/settings`.

Instructor sections are available at `/instructor/courses`,
`/instructor/courses/create`, `/instructor/payments`, `/instructor/analytics`,
`/instructor/profile`, and `/instructor/settings`. Course video lessons are
uploaded to Cloudinary and are playable from an enrolled student's
`/dashboard/learning/:courseId` page.
