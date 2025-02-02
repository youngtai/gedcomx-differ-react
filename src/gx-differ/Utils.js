import { EMPTY_GEDCOMX } from './constants'
import { getDocumentsIntersection } from "./documents-diff/DocumentsDiffUtils"
import { getFieldsIntersection } from "./fields-diff/FieldsDiffUtils"
import { getPersonsIntersection } from './persons-diff/PersonDiffUtils'
import { factIsEmpty, getPersonById, getRelationshipsIntersection } from './relationships-diff/RelationshipsDiffUtils'
import { getRecordDataIntersection } from "./sourceDescriptions-diff/SourceDescriptionsDiffUtils"

export function makeQuestionableWhitespaceVisible(input) {
  return input?.replace(/^\s+|\s{2,}|\s+$/g, "_");
}

export const generateLocalId = () => Math.random().toString(36).substring(2, 9)

export const relationshipCompareFunction = (rA, rB, persons) => {
  const rAType = rA.type
  const rBType = rB.type
  const typeComparisonResult = rAType.localeCompare(rBType)
  if (typeComparisonResult !== 0) {
    return typeComparisonResult
  }
  const rAp1Name = getPersonById(rA.person1.resourceId, persons)?.names[0]
    ?.nameForms[0]?.fullText
  const rBp1Name = getPersonById(rB.person1.resourceId, persons)?.names[0]
    ?.nameForms[0]?.fullText
  const person1NameComparisonResult = rAp1Name.localeCompare(rBp1Name)
  if (person1NameComparisonResult !== 0) {
    return person1NameComparisonResult
  }
  const rAp2Name = getPersonById(rA.person2.resourceId, persons)?.names[0]
    ?.nameForms[0]?.fullText
  const rBp2Name = getPersonById(rB.person2.resourceId, persons)?.names[0]
    ?.nameForms[0]?.fullText
  return rAp2Name.localeCompare(rBp2Name)
}

export function getGxIntersection(leftGx, rightGx, assertions) {
  const personsIntersection = getPersonsIntersection(
    leftGx.persons,
    rightGx.persons
  )
  const relationshipsIntersection = getRelationshipsIntersection(
    leftGx.relationships,
    rightGx.relationships,
    leftGx.persons,
    rightGx.persons,
    assertions
  )
  const recordDataIntersection = getRecordDataIntersection(
    leftGx.sourceDescriptions,
    rightGx.sourceDescriptions
  )
  const fieldsIntersection = getFieldsIntersection(
    leftGx.fields,
    rightGx.fields
  )
  const documentsIntersection = getDocumentsIntersection(
    leftGx.documents,
    rightGx.documents
  )
  return {
    id: leftGx.id,
    attribution: {
      contributor: { resource: 'fs:AutomatedContentExtraction' },
      created: new Date().toDateString(),
    },
    description: leftGx.description,
    persons: personsIntersection,
    relationships: relationshipsIntersection,
    sourceDescriptions: recordDataIntersection,
    fields: fieldsIntersection,
    documents: documentsIntersection,
  }
}

function removeEmptyFactKeysOrFacts(fact) {
  Object.keys(fact).forEach((key) => {
    if (
      fact[key] === null ||
      fact[key] === undefined ||
      fact[key].length === 0
    ) {
      delete fact[key]
    }
  })
}

export function normalizeGedcomx(gx) {
  try {
    if (gx?.records && gx.records instanceof Array) {
      gx = gx.records[0]
    }

    gx?.persons?.forEach((person, personIndex) => {
      person.facts?.forEach((fact, factIndex) => {
        removeEmptyFactKeysOrFacts(fact)
        if (factIsEmpty(fact)) {
          gx.persons[personIndex].facts.splice(factIndex, 1)
        } else {
          if (!fact.primary) {
            fact.primary = false
          }
        }
      })
      if (person.facts?.length === 0) {
        delete person.facts
      }
      if (person.fields?.length === 0) {
        delete person.fields
      }
    })
    gx?.relationships?.forEach((relationship, relationshipIndex) => {
      relationship.facts?.forEach((fact, factIndex) => {
        removeEmptyFactKeysOrFacts(fact, factIndex, relationshipIndex)
        if (factIsEmpty(fact)) {
          gx.relationships[relationshipIndex].facts.splice(factIndex, 1)
        } else {
          if (!fact.primary) {
            fact.primary = false
          }
        }
      })
      if (relationship.facts?.length === 0) {
        delete relationship.facts
      }
      if (relationship.fields?.length === 0) {
        delete relationship.fields
      }
    })
    gx?.relationships?.sort((a, b) =>
      relationshipCompareFunction(a, b, gx?.persons)
    )
  } catch (error) {
    console.error(
      'There was a problem normalizing the GedcomX during load.',
      error
    )
  }
  return gx
}

export function gxIsEmpty(gx) {
  if (gx === null || gx === undefined) {
    return true
  }
  return Object.keys(gx)
    .filter((key) => key !== 'id')
    .every(
      (key) => JSON.stringify(gx[key]) === JSON.stringify(EMPTY_GEDCOMX[key])
    )
}

const SIDES = {
  left: 'left',
  right: 'right',
}

export const leftRecordsData = (
  leftGx,
  setLeftGx,
  rightGx,
  setRightGx,
  finalGx,
  setFinalGx
) => {
  return {
    gx: leftGx,
    setGx: setLeftGx,
    comparingToGx: rightGx,
    setComparingToGx: setRightGx,
    finalGx: finalGx,
    setFinalGx: setFinalGx,
    side: SIDES.left,
  }
}

export const rightRecordsData = (
  leftGx,
  setLeftGx,
  rightGx,
  setRightGx,
  finalGx,
  setFinalGx
) => {
  return {
    gx: rightGx,
    setGx: setRightGx,
    comparingToGx: leftGx,
    setComparingToGx: setLeftGx,
    finalGx: finalGx,
    setFinalGx: setFinalGx,
    side: SIDES.right,
  }
}
