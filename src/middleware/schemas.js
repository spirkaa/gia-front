import { schema } from 'normalizr'

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[[]]/g, '\\$&')
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

const employeeSchema = new schema.Entity('employee', { idAttribute: 'id' })
const examSchema = new schema.Entity('exam', { idAttribute: 'id' })
const dateSchema = new schema.Entity('date', { idAttribute: 'id' })
const levelSchema = new schema.Entity('level', { idAttribute: 'id' })
const positionSchema = new schema.Entity('position', { idAttribute: 'id' })
const organisationSchema = new schema.Entity('organisation', { idAttribute: 'id' })
const placeSchema = new schema.Entity('place', { idAttribute: 'id' })
const territorySchema = new schema.Entity('territory', { idAttribute: 'id' })
const dataSourceSchema = new schema.Entity('datasource', { idAttribute: 'id' })
const subsSchema = new schema.Entity('subscription', { idAttribute: 'id'})

const datePageSchema = new schema.Entity('datePage', { results: new schema.Array(dateSchema) }, { idAttribute: generateSlug })
const levelPageSchema = new schema.Entity('levelPage', { results: new schema.Array(levelSchema) }, { idAttribute: generateSlug })
const empPageSchema = new schema.Entity('empPage', { results: new schema.Array(employeeSchema) }, { idAttribute: generateSlug })
const examPageSchema = new schema.Entity('examPage', { results: new schema.Array(examSchema) }, { idAttribute: generateSlug })
const orgPageSchema = new schema.Entity('orgPage', { results: new schema.Array(organisationSchema) }, { idAttribute: generateSlug })
const placesPageSchema = new schema.Entity('placesPage', { results: new schema.Array(placeSchema) }, { idAttribute: generateSlug })
const dataSourcePageSchema = new schema.Entity('dataSourcePage', { results: new schema.Array(dataSourceSchema) }, { idAttribute: generateSlug })
const subsPageSchema = new schema.Entity('subsPage', { results: new schema.Array(subsSchema) }, { idAttribute: generateSlug })

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
  exams: new schema.Array(examSchema)
})

organisationSchema.define({
  employees: new schema.Array(employeeSchema)
})

subsSchema.define({
  employee: employeeSchema
})

export const Schemas = {
  DATE_PAGE: datePageSchema,
  LEVEL_PAGE: levelPageSchema,
  EMP_PAGE: empPageSchema,
  EXAM_PAGE: examPageSchema,
  ORG_PAGE: orgPageSchema,
  PLACES_PAGE: placesPageSchema,
  EMP_DETAIL: employeeSchema,
  ORG_DETAIL: organisationSchema,
  DATASOURCE_PAGE: dataSourcePageSchema,
  SUBS_PAGE: subsPageSchema
}

export default Schemas