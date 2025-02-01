import { FACT_KEYS } from "../constants";
import {
  haveSameFacts, personsAreEqual, personsWithMatchingNames
} from "../persons-diff/PersonDiffUtils";

function getPersonById(id, persons) {
  return persons?.find((person) => person.id === id);
}

function relationshipPersonsAreEqual(
  sideARelPerson,
  sideBRelPerson,
  sideAPersons,
  sideBPersons,
  assertions
) {
  const personA = getPersonById(sideBRelPerson.resourceId, sideBPersons);
  const personB = getPersonById(sideARelPerson.resourceId, sideAPersons);
  return personsAreEqual(personA, personB, assertions);
}

function relationshipsAreEqual(
  sideARel,
  sideBRel,
  sideAPersons,
  sideBPersons,
  assertions
) {
  const typeIsEqual = sideBRel.type === sideARel.type;
  const person1IsEqual = relationshipPersonsAreEqual(
    sideARel.person1,
    sideBRel.person1,
    sideAPersons,
    sideBPersons,
    assertions
  );
  const person2IsEqual = relationshipPersonsAreEqual(
    sideARel.person2,
    sideBRel.person2,
    sideAPersons,
    sideBPersons,
    assertions
  );
  const factsAreEqual = haveSameFacts(sideARel?.facts, sideBRel?.facts);
  return typeIsEqual && person1IsEqual && person2IsEqual && factsAreEqual;
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
function sideIncludesRel(
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
  );
}

// Return intersection of left and right relationships
function getRelationshipsIntersection(
  leftRels,
  rightRels,
  leftPersons,
  rightPersons,
  assertions
) {
  return leftRels?.filter((rel) =>
    sideIncludesRel(rightRels, rel, leftPersons, rightPersons, assertions)
  );
}

// Return the complement of the intersection of {side} and center relationships (Ones without matches)
// function getRels(rels, center, leftPersons, rightPersons) {
//   return rels.filter(rel => !sideIncludesRel(center, rel, rels, leftPersons, rightPersons));
// }

function fullTextName(person) {
  if (!person.names[0]?.nameForms[0]?.fullText) {
    return `Nameless Person (${person.id})`;
  }
  return person.names[0]?.nameForms[0]?.fullText;
}

function updateRelationshipsData(recordsData, assertions) {
  recordsData.finalGx.relationships = getRelationshipsIntersection(
    recordsData.gx.relationships,
    recordsData.comparingToGx.relationships,
    recordsData.gx.persons,
    recordsData.comparingToGx.persons,
    assertions
  );
  recordsData.setFinalGx(structuredClone(recordsData.finalGx));

  recordsData.setGx(structuredClone(recordsData.gx));
}

function hasMatchingRelationship(
  comparingToRels,
  rel,
  comparingToPersons,
  persons,
  assertions
) {
  return sideIncludesRel(
    comparingToRels,
    rel,
    comparingToPersons,
    persons,
    assertions
  );
}

function relationshipsWithSamePersonsAndType(
  relationship,
  comparingToRels,
  persons,
  comparingToPersons
) {
  return comparingToRels.filter((r) => {
    const person1Same = relationshipPersonsAreEqual(
      relationship.person1,
      r.person1,
      persons,
      comparingToPersons
    )
    const person2Same = relationshipPersonsAreEqual(
      relationship.person2,
      r.person2,
      persons,
      comparingToPersons
    )
    const sameType = relationship.type === r.type
    return person1Same && person2Same && sameType
  })
}

function matchingAttributeExists(matchingParentObjects, attributeData, fact) {
  if (matchingParentObjects.length > 0) {
    for (const matchingParentObject of matchingParentObjects) {
      const factsWithMatchingKey = matchingParentObject.facts
        ?.filter((comparingFact) => fact.type === comparingFact.type)
        .filter((comparingFact) => comparingFact[attributeData.key])
      if (
        attributeData.key === FACT_KEYS.date ||
        attributeData.key === FACT_KEYS.place
      ) {
        if (
          factsWithMatchingKey?.find(
            (comparingFact) =>
              comparingFact[attributeData.key].original === attributeData.value
          ) !== undefined
        ) {
          return true
        }
      } else if (attributeData.key === FACT_KEYS.type) {
        if (
          factsWithMatchingKey?.find(
            (comparingFact) =>
              comparingFact[attributeData.key] === attributeData.value
          ) !== undefined
        ) {
          return true
        }
      } else {
        if (
          factsWithMatchingKey?.find(
            (comparingFact) =>
              comparingFact[attributeData.key].toLowerCase() ===
              attributeData.value.toLowerCase()
          ) !== undefined
        ) {
          return true
        }
      }
    }
  }
  return false
}

function hasMatchingAttribute(
  attributeData,
  fact,
  parentObject,
  persons,
  comparingToParentObjects,
  comparingToPersons,
  assertions
) {
  function parentObjectIsARelationship(parentObject) {
    return parentObject?.person1 && parentObject?.person2
  }

  if (parentObjectIsARelationship(parentObject)) {
    if (
      parentObject.type === 'http://gedcomx.org/Marriage' &&
      attributeData.key === 'place' &&
      attributeData.value === 'São Pedro, Funchal, Madeira, Portugal'
    ) {
      console.log(attributeData)
    }
  }
  // Get the matching parent objects (relationships or persons) from the compare side
  const matchingObjects = parentObjectIsARelationship(parentObject)
    ? relationshipsWithSamePersonsAndType(
      parentObject,
      comparingToParentObjects,
      persons,
      comparingToPersons
    )
    : personsWithMatchingNames(
      parentObject,
      comparingToParentObjects,
      assertions
    )
  return matchingAttributeExists(matchingObjects, attributeData, fact)
}

function factIsEmpty(fact) {
  const factKeys = Object.keys(fact).filter((key) => fact[key] !== null)
  const factHasNoKeys = factKeys.length === 0
  const keysToExclude = [FACT_KEYS.primary, FACT_KEYS.id]
  const factHasNoContent =
    factKeys.filter((k) => !keysToExclude.includes(k)).length === 0
  return factHasNoKeys || factHasNoContent
}

export {
  getPersonById,
  relationshipPersonsAreEqual,
  sideIncludesRel,
  getRelationshipsIntersection,
  fullTextName,
  updateRelationshipsData,
  hasMatchingRelationship,
  personsWithMatchingNames,
  relationshipsWithSamePersonsAndType,
  matchingAttributeExists,
  hasMatchingAttribute,
  factIsEmpty
};
