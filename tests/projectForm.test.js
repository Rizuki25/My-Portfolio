import assert from 'node:assert/strict'
import test from 'node:test'
import { projectToForm, validateProject } from '../src/admin/projectForm.js'

test('draft dengan kolom opsional kosong dan foto bisa diterbitkan', () => {
  const project = {
    id: 'website-katalog',
    name: 'Website Katalog',
    kind: 'Web Development',
    year: 2026,
    featured: false,
    description: 'Katalog produk daring.',
    problem: null,
    solution: null,
    impact: [],
    stack: [],
    links: [],
    images: [{ url: 'https://example.com/project.jpg', alt: 'Halaman utama katalog' }],
    metrics: null,
    sort_order: 0,
    is_published: false,
  }

  const form = projectToForm(project)
  form.is_published = true
  const { payload, error } = validateProject(form)

  assert.equal(error, undefined)
  assert.equal(payload.is_published, true)
  assert.equal(payload.problem, null)
  assert.equal(payload.solution, null)
  assert.equal(payload.metrics, null)
  assert.deepEqual(payload.images, project.images)
})
