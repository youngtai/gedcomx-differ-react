import {
  Grid,
  IconButton,
  Sheet,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { AssertionsContext } from "../AssertionsContext";
import { DeleteIcon, EditIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import ColoredNameParts from "./ColoredNameParts";
import {
  getFullTextName,
  getNamePartsObject,
  hasMatchingPerson,
  updatePersonsData,
  updateRecordsData,
} from "./PersonDiffUtils";
import PersonNameEditDialog from "./PersonNameEditDialog";

export default function EditablePersonName({
  person,
  personIndex,
  name,
  nameIndex,
}) {
  const theme = useTheme();
  const recordsData = React.useContext(RecordsDataContext);
  const assertions = React.useContext(AssertionsContext).assertions;
  const persons = recordsData.gx.persons;
  const comparingTo = recordsData.comparingToGx.persons;

  const parts = name?.nameForms[0]?.parts;
  const nameParts = getNamePartsObject(parts);
  const [isEditingPerson, setIsEditingPerson] = React.useState(false);
  const [hasMatch, setHasMatch] = React.useState(
    hasMatchingPerson(person, comparingTo, assertions)
  );

  const backgroundColor = hasMatch ? null : theme.palette.diff.background;

  React.useEffect(() => {
    setHasMatch(hasMatchingPerson(person, comparingTo, assertions));
  }, [person, comparingTo, assertions]);

  function handleDeletePerson() {
    person.names.splice(nameIndex, 1);
    if (!person.names || person.names.length === 0) {
      persons.splice(personIndex, 1);
    }
    updateRecordsData(recordsData);
  }

  function handleDialogClose(nameParts, type, person) {
    setIsEditingPerson(false);
    person.names[nameIndex].type = !type ? null : type;
    person.names[nameIndex].nameForms[0].parts = nameParts;
    person.names[nameIndex].nameForms[0].fullText = getFullTextName(
      getNamePartsObject(nameParts)
    );
    updatePersonsData(person, personIndex, recordsData);
  }

  function handleEdit() {
    setIsEditingPerson(true);
  }

  return (
    <>
      <Sheet
        sx={{
          backgroundColor: backgroundColor,
          padding: 1,
          borderRadius: "sm",
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid>
            <Grid container spacing={1} alignItems="center">
              <Grid>
                <ColoredNameParts
                  nameParts={nameParts}
                  hasMatch={hasMatch}
                  person={person}
                />
              </Grid>
              <Grid>
                {name.type && (
                  <Typography level="body2" sx={{ margin: 1 }}>
                    <strong>{name.type}</strong> - Type
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <Grid container direction="row" alignItems="center">
              <Grid>
                <Tooltip title={"Edit Person"} arrow>
                  <IconButton onClick={handleEdit}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid>
                <Tooltip title={"Delete Person"} arrow>
                  <IconButton onClick={handleDeletePerson}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Sheet>
      <PersonNameEditDialog
        open={isEditingPerson}
        setOpen={setIsEditingPerson}
        onClose={handleDialogClose}
        nameParts={nameParts}
        person={person}
      />
    </>
  );
}

EditablePersonName.propTypes = {
  person: PropTypes.object.isRequired,
  personIndex: PropTypes.number.isRequired,
  name: PropTypes.object.isRequired,
  nameIndex: PropTypes.number.isRequired,
};
