import {
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Sheet,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { PERSON_FIELD_TYPE } from "../constants";
import { CancelIcon, DeleteIcon, EditIcon, SaveIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import { hasMatchingField, updatePersonsData } from "./PersonDiffUtils";
import { makeQuestionableWhitespaceVisible } from "../Utils";

export default function EditablePersonField({
  field,
  fieldIndex,
  person,
  personIndex,
}) {
  const theme = useTheme();
  const recordsData = React.useContext(RecordsDataContext);
  const persons = recordsData.gx.persons;
  const comparingTo = recordsData.comparingToGx.persons;

  const [isEditing, setIsEditing] = React.useState(false);
  const [editFieldType, setEditFieldType] = React.useState(
    field && field.type ? field.type : ""
  );
  const [editFieldValue, setEditFieldValue] = React.useState(
    field ? field.values[0].text : ""
  );
  const [hasMatch, setHasMatch] = React.useState(
    hasMatchingField(person, comparingTo)
  );

  const backgroundColor = hasMatch ? null : theme.palette.diff.background;
  const textColor = hasMatch ? null : theme.palette.diff.color;

  React.useEffect(() => {
    setHasMatch(hasMatchingField(person, comparingTo));
  }, [persons, comparingTo]);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleDelete() {
    const fields = person?.fields?.filter(Boolean);
    fields?.splice(fieldIndex, 1);
    person.fields = fields;
    if (!fields || fields.length === 0) {
      delete person.fields;
    }
    updatePersonsData(person, personIndex, recordsData);
  }

  function handleSave() {
    setIsEditing(false);
    field.values[0].text = editFieldValue;
    field.type = editFieldType;
    person.fields[fieldIndex] = field;
    person.fields.sort((a, b) => a.type.localeCompare(b.type));
    updatePersonsData(person, personIndex, recordsData);
  }

  return isEditing ? (
    <Sheet
      variant="soft"
      color="warning"
      sx={{ padding: 1, borderRadius: "sm", background: backgroundColor }}
    >
      <Grid container alignItems="center" justifyContent={"space-between"}>
        <Grid xs>
          <Stack direction="row" spacing={1} alignItems="center">
            <Select
              placeholder="Select field type..."
              value={editFieldType}
              onChange={(_event, newValue) => setEditFieldType(newValue)}
              size="sm"
              sx={{ margin: 1 }}
            >
              {Object.keys(PERSON_FIELD_TYPE).map((key) => (
                <Option key={`type-${key}`} value={PERSON_FIELD_TYPE[key]}>
                  {key}
                </Option>
              ))}
            </Select>
            <Input
              value={editFieldValue}
              size="sm"
              onChange={(e) => setEditFieldValue(e.target.value)}
            />
          </Stack>
        </Grid>
        <Grid>
          <Tooltip title="Cancel" arrow>
            <IconButton onClick={() => setIsEditing(false)}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save" arrow>
            <IconButton onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Sheet>
  ) : (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{ paddingX: 1, borderRadius: "sm", background: backgroundColor }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography
            variant="body1"
            sx={{ color: textColor, fontWeight: 600 }}
          >
            {makeQuestionableWhitespaceVisible(editFieldValue)}
          </Typography>
          <Typography level="body2" sx={{ color: textColor }}>
            {field?.type}
          </Typography>
        </Grid>
        <Grid alignItems="center" justifyContent="center">
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Sheet>
  );
}

EditablePersonField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
  person: PropTypes.object,
  personIndex: PropTypes.number,
};
