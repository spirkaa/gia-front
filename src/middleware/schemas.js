import { Schema, arrayOf } from 'normalizr'

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[ 2 ]) return ''
  return decodeURIComponent(results[ 2 ].replace(/\+/g, ' '))
}

function generateSlug (entity) {
  const { next, previous } = entity
  const pageNum = direction => getParameterByName('page', direction)
  if (!next && !previous) return 1
  if (!next && previous) {
    if (!pageNum(previous)) return 2
    return (+pageNum(previous) + 1)
  }
  return (+pageNum(next) - 1)
}

const datePageSchema = new Schema('datePage', { idAttribute: generateSlug })
const levelPageSchema = new Schema('levelPage', { idAttribute: generateSlug })
const empPageSchema = new Schema('empPage', { idAttribute: generateSlug })
const examPageSchema = new Schema('examPage', { idAttribute: generateSlug })
const orgPageSchema = new Schema('orgPage', { idAttribute: generateSlug })
const employeeSchema = new Schema('employee', { idAttribute: 'id' })
const examSchema = new Schema('exam', { idAttribute: 'id' })
const dateSchema = new Schema('date', { idAttribute: 'id' })
const levelSchema = new Schema('level', { idAttribute: 'id' })
const positionSchema = new Schema('position', { idAttribute: 'id' })
const organisationSchema = new Schema('organisation', { idAttribute: 'id' })
const placeSchema = new Schema('place', { idAttribute: 'id' })
const territorySchema = new Schema('territory', { idAttribute: 'id' })

placeSchema.define({
  ate: territorySchema
})

examSchema.define({
  date: dateSchema,
  employee: employeeSchema,
  level: levelSchema,
  position: positionSchema,
  place: placeSchema
})

employeeSchema.define({
  org: organisationSchema,
  exams: arrayOf(examSchema)
})

organisationSchema.define({
  employees: arrayOf(employeeSchema)
})

datePageSchema.define({
  results: arrayOf(dateSchema)
})

levelPageSchema.define({
  results: arrayOf(levelSchema)
})

empPageSchema.define({
  results: arrayOf(employeeSchema)
})

examPageSchema.define({
  results: arrayOf(examSchema)
})

orgPageSchema.define({
  results: arrayOf(organisationSchema)
})

export const Schemas = {
  DATE_PAGE: datePageSchema,
  LEVEL_PAGE: levelPageSchema,
  EMP_PAGE: empPageSchema,
  EXAM_PAGE: examPageSchema,
  ORG_PAGE: orgPageSchema,
  EMP_DETAIL: employeeSchema,
  ORG_DETAIL: organisationSchema
}

export default Schemas