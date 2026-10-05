/** Siapkan baris terbit dari Supabase untuk kartu di portofolio. */
export function prepareProjects(rows) {
  return rows
    .filter((project) => project?.id && project.is_published === true)
    .map((project, index) => ({
      ...project,
      index: String(index + 1).padStart(2, '0'),
      impact: Array.isArray(project.impact)
        ? project.impact.filter((item) => item && typeof item.k === 'string' && typeof item.v === 'string')
        : [],
      stack: Array.isArray(project.stack)
        ? project.stack.filter((item) => typeof item === 'string')
        : [],
      links: Array.isArray(project.links)
        ? project.links.filter((item) => item && typeof item.label === 'string' && /^https?:\/\//i.test(item.href))
        : [],
      images: Array.isArray(project.images)
        ? project.images.filter((item) => item && typeof item.alt === 'string' && /^https?:\/\//i.test(item.url))
        : [],
    }))
}
