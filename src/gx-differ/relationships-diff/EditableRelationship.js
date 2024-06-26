import React from 'react'
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  useTheme,
} from '@mui/material'
import {
  fullTextName,
  getPersonById,
  sideIncludesRel,
  updateRelationshipsData,
} from './RelationshipsDiff'
import { Autorenew, Delete } from '@mui/icons-material'
import { RecordsDataContext } from '../RecordsContext'
import EditableRelationshipAttribute from './EditableRelationshipAttribute'
import { RELATIONSHIP_FACT_TYPE } from '../constants'
import EditableFact from '../persons-diff/EditableFact'
import AddIcon from '@mui/icons-material/Add'
import AddFactOrFieldDialog from '../persons-diff/AddFactOrFieldDialog'
import { updateRecordsData } from '../persons-diff/EditablePerson'
import { AssertionsContext } from '../AssertionsContext'

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
  )
}

export function EditableRelationship({ rel, relIndex, persons }) {
  const theme = useTheme()
  const recordsData = React.useContext(RecordsDataContext)
  const assertions = React.useContext(AssertionsContext).assertions
  const rels = recordsData.gx.relationships
  const comparingToRels = recordsData.comparingToGx.relationships
  const comparingToPersons = recordsData.comparingToGx.persons

  const [isEditing, setIsEditing] = React.useState(false)
  const [addFactOrField, setAddFactOrField] = React.useState(false)
  const [hasMatch, setHasMatch] = React.useState(
    hasMatchingRelationship(
      comparingToRels,
      rel,
      comparingToPersons,
      persons,
      assertions
    )
  )

  const backgroundColor = hasMatch ? null : theme.palette.diff.background
  const textColor = hasMatch ? null : theme.palette.diff.color

  React.useEffect(() => {
    setHasMatch(
      hasMatchingRelationship(
        comparingToRels,
        rel,
        comparingToPersons,
        persons,
        assertions
      )
    )
  }, [comparingToRels, rel, comparingToPersons, persons, assertions])

  function handleSwitchPerson() {
    const person1Clone = structuredClone(rel.person1)
    rel.person1 = structuredClone(rel.person2)
    rel.person2 = person1Clone
    rels.splice(relIndex, 1, rel)
    updateRelationshipsData(recordsData, assertions)
  }

  function handleEdit() {
    setIsEditing(true)
  }

  function handleDelete() {
    rels.splice(relIndex, 1)
    updateRelationshipsData(recordsData, assertions)
  }

  function handleAddFactOrField() {
    setAddFactOrField(true)
  }

  function factUpdateHandler(rel, relIndex, recordsData) {
    recordsData.gx.relationships.splice(relIndex, 1, rel)
    updateRecordsData(recordsData)
    updateRelationshipsData(recordsData, assertions)
  }

  return (
    <>
      <Paper sx={{ margin: 2 }} square elevation={4}>
        <ListItem sx={{ background: backgroundColor, color: textColor }}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={10}>
              <Grid container direction="column">
                <Grid item>
                  <ListItemText
                    primary={fullTextName(
                      getPersonById(rel?.person1?.resourceId, persons)
                    )}
                    secondary={'Person 1'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </Grid>
                <Grid item>
                  <EditableRelationshipAttribute
                    rel={rel}
                    relIndex={relIndex}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                  />
                </Grid>
                <Grid item>
                  <ListItemText
                    primary={fullTextName(
                      getPersonById(rel?.person2?.resourceId, persons)
                    )}
                    secondary={'Person 2'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container direction="column" alignItems="flex-end">
                <Grid item>
                  <Tooltip title={'Switch Persons'} arrow placement="left">
                    <IconButton onClick={handleSwitchPerson}>
                      <Autorenew />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item hidden={isEditing}>
                  <Button onClick={handleEdit}>Edit</Button>
                </Grid>
                <Grid item>
                  <Tooltip title={'Delete Relationship'} arrow placement="left">
                    <IconButton onClick={handleDelete}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ListItem>
        <List disablePadding dense>
          {rel?.facts?.map((fact, idx) => {
            return (
              <EditableFact
                key={`fact-${idx}`}
                fact={fact}
                factIndex={idx}
                parentObject={rel}
                parentObjectIndex={relIndex}
                comparingTo={recordsData.comparingToGx.relationships}
                updateData={factUpdateHandler}
                factTypes={RELATIONSHIP_FACT_TYPE}
              />
            )
          })}
          <Button
            variant={'outlined'}
            sx={{ margin: 1 }}
            onClick={handleAddFactOrField}
            startIcon={<AddIcon />}
          >
            Add Fact or Role
          </Button>
          <AddFactOrFieldDialog
            open={addFactOrField}
            setOpen={setAddFactOrField}
            parentObject={rel}
            parentObjectIndex={relIndex}
            factTypes={RELATIONSHIP_FACT_TYPE}
            updateData={factUpdateHandler}
          />
        </List>
      </Paper>
    </>
  )
}
