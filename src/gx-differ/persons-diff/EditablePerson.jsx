import { Button, Grid, IconButton, Sheet, Stack, Tooltip } from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { AssertionsContext } from "../AssertionsContext";
import { FACT_TYPE, GENDER } from "../constants";
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FemaleIcon,
  MaleIcon,
  QuestionMarkIcon,
  StarIcon,
  StarOutlineIcon,
} from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import { generateLocalId } from "../Utils";
import AddFactOrFieldDialog from "./AddFactOrFieldDialog";
import EditableFact from "./EditableFact";
import EditablePersonField from "./EditablePersonField";
import EditablePersonName from "./EditablePersonName";
import { updatePersonsData, updateRecordsData } from "./PersonDiffUtils";
import PersonNameEditDialog from "./PersonNameEditDialog";

function getGenderIcon(person) {
  if (!person || !person.gender) {
    return <QuestionMarkIcon />;
  }
  if (person.gender.type === GENDER.Male) {
    return <MaleIcon />;
  } else if (person.gender.type === GENDER.Female) {
    return <FemaleIcon />;
  } else {
    return <QuestionMarkIcon />;
  }
}

function getGenderString(person) {
  if (!person || !person.gender) {
    return "Unknown";
  }
  if (person.gender.type === GENDER.Male) {
    return "Male";
  } else if (person.gender.type === GENDER.Female) {
    return "Female";
  } else {
    return "Unknown";
  }
}

function getPrincipalIcon(person) {
  if (!person || !person.principal) {
    return <StarOutlineIcon />;
  }
  return <StarIcon />;
}

function getPrincipalState(person) {
  if (!person || !person.principal) {
    return "is not principal";
  }
  return "is principal";
}

export default function EditablePerson({ person, personIndex }) {
  const recordsData = React.useContext(RecordsDataContext);
  const assertions = React.useContext(AssertionsContext).assertions;
  const persons = recordsData.gx.persons;

  const [open, setOpen] = React.useState(false);
  const [addFactOrField, setAddFactOrField] = React.useState(false);

  function handleAddFactOrField() {
    setAddFactOrField(true);
  }

  function handleMovePersonDown() {
    if (personIndex === persons.length - 1) {
      return;
    }
    const removed = persons.splice(personIndex, 1)[0];
    persons.splice(personIndex + 1, 0, removed);
    updateRecordsData(recordsData);
  }

  function handleMovePersonUp() {
    if (personIndex === 0) {
      return;
    }
    const removed = persons.splice(personIndex, 1)[0];
    persons.splice(personIndex - 1, 0, removed);
    updateRecordsData(recordsData);
  }

  const genderIcon = getGenderIcon(person);
  const principalIcon = getPrincipalIcon(person);

  function handleChangeGender() {
    if (!person.gender) {
      person.gender = { type: GENDER.Unknown };
    }

    if (person.gender.type === GENDER.Male) {
      person.gender.type = GENDER.Female;
    } else if (person.gender.type === GENDER.Female) {
      person.gender.type = GENDER.Unknown;
    } else if (person.gender.type === GENDER.Unknown) {
      person.gender.type = GENDER.Male;
    }
    updatePersonsData(person, personIndex, recordsData, assertions);
  }

  function handleSetPrincipal() {
    person.principal =
      person.principal === undefined || person.principal === false;
    updatePersonsData(person, personIndex, recordsData, assertions);
  }

  function handleAddName() {
    setOpen(true);
  }

  function handleDialogClose(parts, type) {
    setOpen(false);
    const newName = {
      id: generateLocalId(),
      type: !type ? null : type,
      nameForms: [
        {
          fullText: parts
            .map((part) => part.value)
            .join(" ")
            .trim(),
          parts: parts,
        },
      ],
    };
    if (recordsData.gx.persons[personIndex].names) {
      recordsData.gx.persons[personIndex].names.push(newName);
    } else {
      recordsData.gx.persons[personIndex].names = [];
      recordsData.gx.persons[personIndex].names.push(newName);
    }
    updateRecordsData(recordsData);
  }

  return (
    <>
      <Sheet sx={{ margin: 2, borderRadius: "sm" }} variant="outlined">
        <Grid container spacing={2} sx={{ padding: 2 }} alignItems="center">
          <Grid xs={1}>
            <Stack spacing={1}>
              <Tooltip title="Move person up" placement="left">
                <IconButton onClick={handleMovePersonUp} variant="plain">
                  <ArrowUpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Move person down" placement="left">
                <IconButton onClick={handleMovePersonDown} variant="plain">
                  <ArrowDownIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid xs>
            <Stack>
              {person?.names?.map((name, nameIndex) => (
                <EditablePersonName
                  person={person}
                  personIndex={personIndex}
                  name={name}
                  nameIndex={nameIndex}
                  key={`name-${nameIndex}`}
                />
              ))}
            </Stack>
          </Grid>
          <Grid>
            <Stack spacing={1} alignItems="center">
              <Tooltip
                title={`Gender (${getGenderString(person)})`}
                placement="left"
              >
                <IconButton onClick={handleChangeGender} variant="plain">
                  {genderIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title={getPrincipalState(person)} placement="left">
                <IconButton onClick={handleSetPrincipal} variant="plain">
                  {principalIcon}
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
        <Stack spacing={2} padding={1}>
          <Tooltip title="Add another name" placement="left">
            <Button
              onClick={handleAddName}
              variant="plain"
              startDecorator={<AddIcon />}
            >
              Add Another Name
            </Button>
          </Tooltip>
          {person?.facts?.map((fact, idx) => (
            <EditableFact
              key={`fact-${idx}`}
              fact={fact}
              factIndex={idx}
              parentObject={person}
              parentObjectIndex={personIndex}
              comparingTo={recordsData.comparingToGx.persons}
              updateData={updatePersonsData}
              factTypes={FACT_TYPE}
            />
          ))}
          {person?.fields?.map((field, idx) => (
            <EditablePersonField
              key={`field-${field.type}-${idx}`}
              field={field}
              fieldIndex={idx}
              person={person}
              personIndex={personIndex}
            />
          ))}
          <Button
            variant="plain"
            color="neutral"
            startDecorator={<AddIcon />}
            onClick={handleAddFactOrField}
          >
            Add Fact or Role
          </Button>
        </Stack>
      </Sheet>
      <AddFactOrFieldDialog
        open={addFactOrField}
        setOpen={setAddFactOrField}
        parentObject={person}
        parentObjectIndex={personIndex}
        factTypes={FACT_TYPE}
        updateData={updatePersonsData}
      />
      <PersonNameEditDialog
        open={open}
        setOpen={setOpen}
        onClose={handleDialogClose}
        person={person}
      />
    </>
  );
}

EditablePerson.propTypes = {
  person: PropTypes.object,
  personIndex: PropTypes.number,
};
