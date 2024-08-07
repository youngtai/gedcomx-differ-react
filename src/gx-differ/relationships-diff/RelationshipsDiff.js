import React from 'react'
import { Grid } from '@mui/material'
import { RecordsDataContext } from '../RecordsContext'
import { leftRecordsData, rightRecordsData } from '../VisualGedcomxDiffer'
import RelationshipsList from './RelationshipsList'
import { haveSameFacts, personsAreEqual } from '../persons-diff/PersonDiffUtils'

export function getPersonById(id, persons) {
  return persons?.find((person) => person.id === id)
}

export function relationshipPersonsAreEqual(
  sideARelPerson,
  sideBRelPerson,
  sideAPersons,
  sideBPersons,
  assertions
) {
  const personA = getPersonById(sideBRelPerson.resourceId, sideBPersons)
  const personB = getPersonById(sideARelPerson.resourceId, sideAPersons)
  return personsAreEqual(personA, personB, assertions)
}

function relationshipsAreEqual(
  sideARel,
  sideBRel,
  sideAPersons,
  sideBPersons,
  assertions
) {
  const typeIsEqual = sideBRel.type === sideARel.type
  const person1IsEqual = relationshipPersonsAreEqual(
    sideARel.person1,
    sideBRel.person1,
    sideAPersons,
    sideBPersons,
    assertions
  )
  const person2IsEqual = relationshipPersonsAreEqual(
    sideARel.person2,
    sideBRel.person2,
    sideAPersons,
    sideBPersons,
    assertions
  )
  const factsAreEqual = haveSameFacts(sideARel?.facts, sideBRel?.facts)
  return typeIsEqual && person1IsEqual && person2IsEqual && factsAreEqual
}

/**
 * Determine if a relationship is present in an array of relationships
 * @param sideARels the array of relationships to check against
 * @param sideBRel the relationship we check presence of
 * @param sideAPersons persons from the Gedcomx sourcing the array of relationships
 * @param sideBPersons persons from the Gedcomx sourcing the relationship we're checking presence of
 * @param assertions optionally turn on/off comparing certain elements (depending on the input Gx and needs)
 * @returns {boolean} whether a relationship is present in a relationship array
 */
export function sideIncludesRel(
  sideARels,
  sideBRel,
  sideAPersons,
  sideBPersons,
  assertions
) {
  return (
    sideARels?.find((sideARel) =>
      relationshipsAreEqual(
        sideARel,
        sideBRel,
        sideAPersons,
        sideBPersons,
        assertions
      )
    ) !== undefined
  )
}

// Return intersection of left and right relationships
export function getRelationshipsIntersection(
  leftRels,
  rightRels,
  leftPersons,
  rightPersons,
  assertions
) {
  return leftRels?.filter((rel) =>
    sideIncludesRel(rightRels, rel, leftPersons, rightPersons, assertions)
  )
}

// Return the complement of the intersection of {side} and center relationships (Ones without matches)
// function getRels(rels, center, leftPersons, rightPersons) {
//   return rels.filter(rel => !sideIncludesRel(center, rel, rels, leftPersons, rightPersons));
// }

export function fullTextName(person) {
  if (!person?.names) {
    return 'Nameless Person'
  }
  return person.names[0]?.nameForms[0]?.fullText
}

export function updateRelationshipsData(recordsData, assertions) {
  recordsData.finalGx.relationships = getRelationshipsIntersection(
    recordsData.gx.relationships,
    recordsData.comparingToGx.relationships,
    recordsData.gx.persons,
    recordsData.comparingToGx.persons,
    assertions
  )
  recordsData.setFinalGx(structuredClone(recordsData.finalGx))

  recordsData.setGx(structuredClone(recordsData.gx))
}

export default function RelationshipsDiff({
  leftGx,
  setLeftGx,
  rightGx,
  setRightGx,
  finalGx,
  setFinalGx,
}) {
  return (
    <Grid container alignItems="flex-start" justifyContent="center">
      <Grid item xs={6}>
        <RecordsDataContext.Provider
          value={leftRecordsData(
            leftGx,
            setLeftGx,
            rightGx,
            setRightGx,
            finalGx,
            setFinalGx
          )}
        >
          <RelationshipsList
            rels={leftGx.relationships}
            persons={leftGx.persons}
          />
        </RecordsDataContext.Provider>
      </Grid>
      <Grid item xs={6}>
        <RecordsDataContext.Provider
          value={rightRecordsData(
            leftGx,
            setLeftGx,
            rightGx,
            setRightGx,
            finalGx,
            setFinalGx
          )}
        >
          <RelationshipsList
            rels={rightGx.relationships}
            persons={rightGx.persons}
          />
        </RecordsDataContext.Provider>
      </Grid>
    </Grid>
  )
}
